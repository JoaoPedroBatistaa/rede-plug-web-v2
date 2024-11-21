import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { RequestInit } from "node-fetch";

type Data = {
   message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   if (req.method !== "POST") {
      return res.status(405).json({ message: "Método não permitido" });
   }

   const { contacts, messageBody, authToken } = req.body;

   if (!contacts || !messageBody || !authToken) {
      console.error("Dados ausentes no corpo da requisição");
      return res.status(400).json({ message: "Dados ausentes no corpo da requisição" });
   }

   try {
      // Função para enviar mensagem de vídeo
      const sendImageMessage = async (contact: any) => {
         const controller = new AbortController();
         const timeout = setTimeout(() => controller.abort(), 120000); // Timeout de 60 segundos

         try {
            const response = await fetch(
               "https://api.z-api.io/instances/3D170912279B00BE263572B70F2FFCF9/token/65C68F1C84BAE9915D898D2D/send-video",
               {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/x-www-form-urlencoded",
                     "Client-Token": "F872abe6911454ce9a1b7461ac4873f92S",
                  },
                  body: new URLSearchParams({
                     phone: contact,
                     video: messageBody.measurementSheetUrl,
                     caption: `${messageBody.body}\n`,
                  }),
                  signal: controller.signal as any, // Forçando o tipo correto
               } as RequestInit
            );

            if (!response.ok) {
               const errorMessage = await response.text();
               console.error(`Erro na resposta ao enviar mensagem de imagem: ${errorMessage}`);
               throw new Error(`Falha ao enviar mensagem de imagem via WhatsApp para ${contact}`);
            }

            return response;
         } catch (error: any) {
            if (error.name === "AbortError") {
               console.error("Requisição abortada por timeout");
               throw new Error("Timeout ao enviar mensagem de imagem");
            }
            throw error;
         } finally {
            clearTimeout(timeout);
         }
      };

      await Promise.all(contacts.map(sendImageMessage));
      res.status(200).json({ message: "Mensagens de imagem enviadas com sucesso" });
   } catch (error) {
      console.error(`Erro ao enviar mensagens de imagem: ${error}`);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
}
