import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

type Data = {
   message?: string;
   data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método não permitido' });
   }

   const { email, password } = req.body;

   try {
      const authResponse = await fetch("https://api.getsendbit.com/api/auth/login", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ email, password }),
      });

      const authResponseBody = await authResponse.json();
      console.log(`Resposta completa do login de autenticação: ${authResponseBody}`);

      if (!authResponse.ok) {
         console.error(`Erro na resposta ao obter token de autenticação: ${authResponseBody}`);
         return res.status(500).json({ message: 'Falha ao obter token de autenticação' });
      }

      res.status(200).json(authResponseBody);
   } catch (error) {
      console.error(`Erro ao obter token de autenticação: ${error}`);
      res.status(500).json({ message: 'Erro interno do servidor' });
   }
}
