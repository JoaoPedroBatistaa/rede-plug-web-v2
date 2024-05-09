// pages/api/shorten.js
export default async function handler(req: { method: string; body: { url: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; shortUrl?: any; }): any; new(): any; }; end: { (arg0: string): void; new(): any; }; }; setHeader: (arg0: string, arg1: string[]) => void; }) {
   if (req.method === 'POST') {
      try {
         const { url } = req.body;
         const response = await fetch('https://api.encurtador.dev/encurtamentos', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
         });

         if (!response.ok) {
            const errorDetail = await response.text();
            console.error('API de encurtamento falhou:', errorDetail);
            return res.status(500).json({ error: 'Falha ao encurtar URL' });
         }

         const data = await response.json();
         return res.status(200).json({ shortUrl: data.urlEncurtada });
      } catch (error) {
         console.error('Erro ao processar a requisição:', error);
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
   }
}
