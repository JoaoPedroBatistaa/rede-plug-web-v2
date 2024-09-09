import { collection, getDocs, query, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebase';

// Definir a interface do documento do usuário com propriedades opcionais
interface User {
   id: string;
   email?: string;
   password?: string;
   type?: string;
   IpAddress?: string; // Aqui será armazenado o fingerprintId
   editIp?: boolean;
}

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (req.method === 'POST') {
      try {
         const { email, password, fingerprintId } = req.body; // Recebe o fingerprintId do frontend

         // Log para verificar se o fingerprintId está sendo recebido corretamente
         console.log("Fingerprint recebido no backend:", fingerprintId);

         const usersCollection = collection(db, 'USERS');
         const q = query(usersCollection, where('email', '==', email), where('password', '==', password));
         const querySnapshot = await getDocs(q);

         if (querySnapshot.empty) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
         }

         const userDoc = querySnapshot.docs[0];
         const user: User = {
            id: userDoc.id,
            ...userDoc.data(), // Espalha os dados do Firestore no objeto user
         };

         // Verificar se o tipo é supervisor e as condições do fingerprintId
         if (user.type === 'supervisor') {
            const userFingerprintId = user.IpAddress; // No campo IpAddress estamos armazenando o fingerprintId
            const userEditIp = user.editIp;

            // Verificar as condições para o login
            if (userEditIp === false && userFingerprintId && userFingerprintId !== fingerprintId) {
               return res.status(403).json({
                  message: 'Acesso negado: você não está no dispositivo autorizado.',
               });
            }
         }

         return res.status(200).json({ user });
      } catch (error) {
         const typedError = error as Error;
         return res.status(500).json({ message: 'Erro no servidor', error: typedError.message });
      }
   } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
   }
}
