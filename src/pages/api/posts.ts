import { collection, getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebase';

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (req.method === 'GET') {
      try {
         const postsCollection = collection(db, 'POSTS');
         const querySnapshot = await getDocs(postsCollection);

         const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
         }));

         return res.status(200).json(posts);
      } catch (error) {
         console.error('Erro ao buscar postos:', error);
         return res.status(500).json({ message: 'Erro interno do servidor' });
      }
   } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Método ${req.method} não permitido`);
   }
}
