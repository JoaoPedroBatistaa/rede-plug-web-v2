export default async function handler(req: { method: string; body: { managerContact: any; messageBody: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) {
   console.log('Recebendo solicitação para enviar mensagem');
   if (req.method !== 'POST') {
      res.status(405).json({ message: 'Método não permitido' });
      return;
   }

   try {
      const { managerContact, messageBody } = req.body;
      console.log('Dados recebidos:', { managerContact, messageBody });

      if (!managerContact || !messageBody) {
         console.error('Contato do gerente e corpo da mensagem são obrigatórios');
         res.status(400).json({ message: 'Contato do gerente e corpo da mensagem são obrigatórios' });
         return;
      }

      console.log('Enviando mensagem via API Sendbit');

      const maxAttempts = 5;
      let attempts = 0;
      let success = false;
      let response;

      while (attempts < maxAttempts && !success) {
         try {
            response = await fetch(
               `https://api.getsendbit.com/api/account/664e607c4c76fd3392e1d006/instance/664f81f7028bc8c1dec6e205/text`,
               {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                     id: `${managerContact}`,
                     message: `${messageBody}`,
                  }),
               }
            );

            console.log(`Resposta recebida de Sendbit: ${response.status} ${response.statusText}`);

            if (response.ok) {
               success = true;
            } else {
               const errorMessage = await response.text();
               console.error('Falha ao enviar mensagem via WhatsApp:', errorMessage);
            }
         } catch (error) {
            console.error(`Tentativa ${attempts + 1} falhou:`, error);
         }

         attempts++;
         if (!success && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Atraso de 2 segundos entre tentativas
         }
      }

      if (success) {
         console.log('Mensagem enviada com sucesso!');
         res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
      } else {
         res.status(500).json({ message: 'Erro ao enviar mensagem após várias tentativas' });
      }
   } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
   }
}
