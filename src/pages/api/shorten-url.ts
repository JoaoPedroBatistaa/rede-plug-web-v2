// pages/api/shorten-url.js

export default async function handler(req: { method: string; body: { originalURL: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: any; shortUrl?: any; }): void; new(): any; }; }; }) {
   console.log('Recebendo solicitação para encurtar URL');
   if (req.method !== 'POST') {
      res.status(405).json({ message: 'Método não permitido' });
      return;
   }

   try {
      const { originalURL } = req.body;
      console.log('Dados recebidos:', originalURL);

      if (!originalURL) {
         console.error('URL original é obrigatória');
         res.status(400).json({ message: 'URL original é obrigatória' });
         return;
      }

      const payload = {
         originalURL,
         domain: "ewja.short.gy",
      };

      console.log('Enviando payload para short.io:', payload);

      const response = await fetch("https://api.short.io/links", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `sk_4rwgIKnBOzJxbwC7`,
         },
         body: JSON.stringify(payload),
      });

      console.log(`Resposta recebida de short.io: ${response.status} ${response.statusText}`);

      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (!response.ok) {
         console.error('Falha ao encurtar URL:', data);
         res.status(response.status).json({ message: data.message });
         return;
      }

      const shortUrl = data.secureShortURL || data.shortURL;
      console.log('URL encurtada:', shortUrl);

      res.status(200).json({ shortUrl });
   } catch (error) {
      console.error('Erro ao encurtar URL:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
   }
}
