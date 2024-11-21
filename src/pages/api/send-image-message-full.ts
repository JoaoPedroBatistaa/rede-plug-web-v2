import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

type Data = {
   message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método não permitido' });
   }

   const { contacts, messageBody, authToken } = req.body;

   if (!contacts || !messageBody || !authToken) {
      console.error("Dados ausentes no corpo da requisição");
      return res.status(400).json({ message: 'Dados ausentes no corpo da requisição' });
   }

   try {
      const sendImageMessage = async (contact: any) => {
         const response = await fetch(
            'https://api.z-api.io/instances/3D170912279B00BE263572B70F2FFCF9/token/65C68F1C84BAE9915D898D2D/send-image',
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  "Client-Token": "F872abe6911454ce9a1b7461ac4873f92S"
               },
               body: new URLSearchParams({
                  phone: contact,
                  image: messageBody.measurementSheetUrl,
                  caption: `${messageBody.body}\n`,
               }),
            }
         );

         if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro na resposta ao enviar mensagem de imagem: ${errorMessage}`);
            throw new Error(`Falha ao enviar mensagem de imagem via WhatsApp para ${contact}`);
         }

         return response;
      };

      await Promise.all(contacts.map(sendImageMessage));
      res.status(200).json({ message: 'Mensagens de imagem enviadas com sucesso' });
   } catch (error) {
      console.error(`Erro ao enviar mensagens de imagem: ${error}`);
      res.status(500).json({ message: 'Erro interno do servidor' });
   }
}
