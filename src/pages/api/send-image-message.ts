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
            'https://api.getsendbit.com/api/account/664e607c4c76fd3392e1d006/instance/664f81f7028bc8c1dec6e205/mediaurl',
            {
               method: 'POST',
               headers: {
                  'Authorization': `Bearer ${authToken}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
               },
               body: new URLSearchParams({
                  id: contact,
                  url: messageBody.measurementSheetUrl,
                  type: 'image',
                  mimetype: 'image/jpeg',
                  caption: `${messageBody.title}\n\n*Posto:* ${messageBody.postName}\n*Data:* ${messageBody.formattedDate}\n`,
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
