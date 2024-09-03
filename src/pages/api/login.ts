import { collection, getDocs, query, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebase';

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
         const user = {
            id: userDoc.id,
            ...userDoc.data(),
         };

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
