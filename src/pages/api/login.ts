import { collection, getDocs, query, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebase';

// Definir a interface do documento do usuário com propriedades opcionais
interface User {
   id: string;
   email?: string;
   password?: string;
   type?: string;
   IpAddress?: string;
   editIp?: boolean;
}

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (req.method === 'POST') {
      try {
         const { email, password } = req.body;

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

         // Verificar se o tipo é supervisor e as condições do IP
         if (user.type === 'supervisor') {
            const userIpAddress = user.IpAddress;
            const userEditIp = user.editIp;

            // Obter o IP atual do dispositivo
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const currentIpAddress = data.ip;

            // Verificar as condições para o login
            if (userEditIp === false && userIpAddress && userIpAddress !== currentIpAddress) {
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
