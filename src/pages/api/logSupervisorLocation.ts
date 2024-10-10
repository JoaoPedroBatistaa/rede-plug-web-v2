// pages/api/logSupervisorLocation.ts
import { addDoc, collection } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase";

// Função para logar localização do supervisor
export default async function logSupervisorLocation(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (req.method === "POST") {
      try {
         const { supervisorName, coordinates, postName, shift } = req.body;

         // Cria um novo documento na coleção "SUPERVISOR_LOCATIONS"
         const docRef = await addDoc(collection(db, "SUPERVISOR_LOCATIONS"), {
            supervisorName,
            coordinates,
            postName,
            shift,
            loggedAt: new Date().toISOString(), // Data e hora do log
         });

         res.status(200).json({
            message: "Localização do supervisor registrada com sucesso.",
            docId: docRef.id,
         });
      } catch (error) {
         console.error("Erro ao salvar localização do supervisor:", error);
         res.status(500).json({ message: "Erro ao salvar localização." });
      }
   } else {
      res.status(405).json({ message: "Método não permitido." });
   }
}
