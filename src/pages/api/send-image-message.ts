import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

type Data = {
   message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método não permitido' });
   }

   const { measurementSheetUrl, postName, formattedDate, authToken } = req.body;

   try {
      const response = await fetch(
         'https://api.getsendbit.com/api/account/664e607c4c76fd3392e1d006/instance/664f81f7028bc8c1dec6e205/mediaurl',
         {
            method: 'POST',
            headers: {
               'authorization': `Bearer ${authToken}`,
               'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
               id: '5511911534298',
               url: measurementSheetUrl,
               type: 'image',
               mimetype: 'image/jpeg',
               caption: `*Medição 06h*\n\n*Posto:* ${postName}\n*Data:* ${formattedDate}\n`,
            }),
         }
      );

      if (!response.ok) {
         const errorMessage = await response.text();
         console.error(`Erro na resposta ao enviar mensagem de imagem: ${errorMessage}`);
         return res.status(500).json({ message: 'Falha ao enviar mensagem de imagem via WhatsApp' });
      }

      res.status(200).json({ message: 'Mensagem de imagem enviada com sucesso' });
   } catch (error) {
      console.error(`Erro ao enviar mensagem de imagem: ${error}`);
      res.status(500).json({ message: 'Erro interno do servidor' });
   }
}
