import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "POST") {
      return res.status(405).json({ status: -4, motivo: "Método não permitido." });
   }

   const order: Order = req.body;

   // console.log("Dados do order recebidos:", order);

   if (!order) {
      return res.status(400).json({ status: -4, motivo: "Dados inválidos. Informações da NFe não fornecidas." });
   }

   const date = new Date();
   date.setHours(date.getHours() - 3);
   const adjustedDate = date.toISOString().split('.')[0] + "-03:00";

   let cont = 0

   const formattedJSON = {
      NFe: {
         infNFe: {
            versao: "4.00",
            ide: {
               cUF: "35",  // State code for São Paulo
               cNF: "00462186",  // Hypothetical control code
               natOp: "VENDA A PRAZO - S",
               mod: "55",
               serie: "0",
               nNF: order.NumeroPedido.toString(),
               dhEmi: adjustedDate,
               tpNF: "1",
               idDest: "1",
               cMunFG: "3550308",  // Municipality code for São Paulo city
               tpImp: "1",
               tpEmis: "1",
               cDV: "9",  // Hypothetical control digit
               tpAmb: "2",
               finNFe: "1",
               indFinal: "0",
               indPres: "9",
               procEmi: "0",
               verProc: "3.0|NS_API",
               indIntermed: "0"

            },

            emit: {
               CNPJ: "37320367000100",
               xNome: "BANANA DECORACAO E ARTE LTDA",
               enderEmit: {
                  xLgr: "Rua Marques de Itu",
                  nro: "259",
                  xCpl: "Sem Complemento",
                  xBairro: "Vila Buarque",
                  cMun: "3550308",   // Código do município (se necessário, aplicar mapeamento)
                  xMun: "São Paulo",
                  UF: "SP",
                  CEP: "01223001",
                  cPais: "1058",
                  xPais: "BRASIL",
                  fone: "11958284000"
               },
               IE: "129027724114",
               CRT: "3"
            },


            dest: {
               CNPJ: "37320367000100",   // Destination entity's CNPJ
               xNome: "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
               enderDest: {
                  xLgr: order.endereco,
                  nro: order.NumeroPedido.toString(),
                  xCpl: order.complemento,
                  xBairro: order.bairro,
                  cMun: "3550308",
                  xMun: order.cidade,
                  UF: getUFfromCidade(order.cidade),  // Using the function to extract UF
                  CEP: order.cep,
                  cPais: "1058",
                  xPais: "BRASIL",
                  fone: order.Telefone
               },
               indIEDest: "1",
               IE: "129027724114",
               email: order.email
            },

            "det": order.budgets.flatMap((item, index) => {
               let details = [];

               if (item.codigoColagem) {
                  cont += 1
                  details.push({
                     nItem: details.length + 1,
                     prod: {
                        cProd: item.codigoColagem,
                        xProd: "Colagem",
                        NCM: "87089990",
                        vProd: parseFloat(item.valorColagem).toFixed(2),
                        "CFOP": "5101",
                        "uCom": "UN",
                        "cEAN": "SEM GTIN",
                        "CEST": "0107500",
                        "qCom": "1",
                        "vUnCom": parseFloat(item.valorColagem).toFixed(2),
                        "cEANTrib": "SEM GTIN",
                        "uTrib": "UN",
                        "qTrib": "1",
                        "vUnTrib": parseFloat(item.valorColagem).toFixed(2),
                        "indTot": "1",
                        "nItemPed": "0",
                     },
                     imposto: {
                        "vTotTrib": "10.00",
                        "ICMS": {
                           "ICMS00": {
                              "orig": "0",
                              "CST": "00",
                              "modBC": "0",
                              "vBC": "100.00",
                              "pICMS": "10.00",
                              "vICMS": "10.00",
                              "pFCP": "2.00",
                              "vFCP": "2.00"
                           }
                        },
                        "IPI": {
                           "cEnq": "999",
                           "IPINT": {
                              "CST": "53"
                           }
                        },
                        "PIS": {
                           "PISAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pPIS": "0.65",  // Valor comum de alíquota PIS
                              "vPIS": "0.65"
                           }
                        },
                        "COFINS": {
                           "COFINSAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pCOFINS": "3.00",  // Valor comum de alíquota COFINS
                              "vCOFINS": "3.00"
                           }
                        }
                     }

                  });
               }

               if (item.codigoFoam) {
                  cont += 1
                  details.push({
                     nItem: details.length + 1,
                     prod: {
                        cProd: item.codigoFoam,
                        xProd: "Foam",
                        NCM: "87089990",
                        vProd: parseFloat(item.valorFoam).toFixed(2),
                        "CFOP": "5101",
                        "uCom": "UN",
                        "cEAN": "SEM GTIN",


                        "CEST": "0107500",


                        "qCom": "1",
                        "vUnCom": parseFloat(item.valorFoam).toFixed(2),

                        "cEANTrib": "SEM GTIN",
                        "uTrib": "UN",
                        "qTrib": "1",
                        "vUnTrib": "12.99",
                        "indTot": "1",
                        "nItemPed": "0"
                     },
                     imposto: {
                        "vTotTrib": "10.00",
                        "ICMS": {
                           "ICMS00": {
                              "orig": "0",
                              "CST": "00",
                              "modBC": "0",
                              "vBC": "100.00",
                              "pICMS": "10.00",
                              "vICMS": "10.00",
                              "pFCP": "2.00",
                              "vFCP": "2.00"
                           }
                        },
                        "IPI": {
                           "cEnq": "999",
                           "IPINT": {
                              "CST": "53"
                           }
                        },
                        "PIS": {
                           "PISAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pPIS": "0.65",  // Valor comum de alíquota PIS
                              "vPIS": "0.65"
                           }
                        },
                        "COFINS": {
                           "COFINSAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pCOFINS": "3.00",  // Valor comum de alíquota COFINS
                              "vCOFINS": "3.00"
                           }
                        }
                     }

                  });
               }

               if (item.codigoImpressao) {
                  cont += 1
                  details.push({
                     nItem: details.length + 1,
                     prod: {
                        cProd: item.codigoImpressao,
                        xProd: "Impressao",
                        NCM: "87089990",
                        vProd: parseFloat(item.valorImpressao).toFixed(2),
                        "CFOP": "5101",
                        "uCom": "UN",
                        "cEAN": "SEM GTIN",
                        "CEST": "0107500",
                        "qCom": "1",
                        "vUnCom": parseFloat(item.valorImpressao).toFixed(2),
                        "cEANTrib": "SEM GTIN",
                        "uTrib": "UN",
                        "qTrib": "1",
                        "vUnTrib": parseFloat(item.valorImpressao).toFixed(2),
                        "indTot": "1",
                        "nItemPed": "0",
                     },
                     imposto: {
                        "vTotTrib": "10.00",
                        "ICMS": {
                           "ICMS00": {
                              "orig": "0",
                              "CST": "00",
                              "modBC": "0",
                              "vBC": "100.00",
                              "pICMS": "10.00",
                              "vICMS": "10.00",
                              "pFCP": "2.00",
                              "vFCP": "2.00"
                           }
                        },
                        "IPI": {
                           "cEnq": "999",
                           "IPINT": {
                              "CST": "53"
                           }
                        },
                        "PIS": {
                           "PISAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pPIS": "0.65",  // Valor comum de alíquota PIS
                              "vPIS": "0.65"
                           }
                        },
                        "COFINS": {
                           "COFINSAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pCOFINS": "3.00",  // Valor comum de alíquota COFINS
                              "vCOFINS": "3.00"
                           }
                        }
                     },
                  });
               }

               if (item.codigoMontagem) {
                  cont += 1
                  details.push({
                     nItem: details.length + 1,
                     prod: {
                        cProd: item.codigoMontagem,
                        xProd: "Montagem",
                        NCM: "87089990",
                        vProd: parseFloat(item.valorMontagem).toFixed(2),
                        "CFOP": "5101",
                        "uCom": "UN",
                        "cEAN": "SEM GTIN",
                        "CEST": "0107500",
                        "qCom": "1",
                        "vUnCom": parseFloat(item.valorMontagem).toFixed(2),
                        "cEANTrib": "SEM GTIN",
                        "uTrib": "UN",
                        "qTrib": "1",
                        "vUnTrib": parseFloat(item.valorMontagem).toFixed(2),
                        "indTot": "1",
                        "nItemPed": "0",
                     },
                     imposto: {
                        "vTotTrib": "10.00",
                        "ICMS": {
                           "ICMS00": {
                              "orig": "0",
                              "CST": "00",
                              "modBC": "0",
                              "vBC": "100.00",
                              "pICMS": "10.00",
                              "vICMS": "10.00",
                              "pFCP": "2.00",
                              "vFCP": "2.00"
                           }
                        },
                        "IPI": {
                           "cEnq": "999",
                           "IPINT": {
                              "CST": "53"
                           }
                        },
                        "PIS": {
                           "PISAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pPIS": "0.65",  // Valor comum de alíquota PIS
                              "vPIS": "0.65"
                           }
                        },
                        "COFINS": {
                           "COFINSAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pCOFINS": "3.00",  // Valor comum de alíquota COFINS
                              "vCOFINS": "3.00"
                           }
                        }
                     }

                  });
               }

               if (item.codigoPaspatur) {
                  cont += 1
                  details.push({
                     nItem: details.length + 1,
                     prod: {
                        cProd: item.codigoPaspatur,
                        xProd: "Paspatur",
                        NCM: "87089990",
                        vProd: parseFloat(item.valorPaspatur).toFixed(2),
                        "CFOP": "5101",
                        "uCom": "UN",
                        "cEAN": "SEM GTIN",


                        "CEST": "0107500",


                        "qCom": "1",
                        "vUnCom": parseFloat(item.valorPaspatur).toFixed(2),

                        "cEANTrib": "SEM GTIN",
                        "uTrib": "UN",
                        "qTrib": "1",
                        "vUnTrib": "12.99",
                        "indTot": "1",
                        "nItemPed": "0"
                     },
                     imposto: {
                        "vTotTrib": "10.00",
                        "ICMS": {
                           "ICMS00": {
                              "orig": "0",
                              "CST": "00",
                              "modBC": "0",
                              "vBC": "100.00",
                              "pICMS": "10.00",
                              "vICMS": "10.00",
                              "pFCP": "2.00",
                              "vFCP": "2.00"
                           }
                        },
                        "IPI": {
                           "cEnq": "999",
                           "IPINT": {
                              "CST": "53"
                           }
                        },
                        "PIS": {
                           "PISAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pPIS": "0.65",  // Valor comum de alíquota PIS
                              "vPIS": "0.65"
                           }
                        },
                        "COFINS": {
                           "COFINSAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pCOFINS": "3.00",  // Valor comum de alíquota COFINS
                              "vCOFINS": "3.00"
                           }
                        }
                     }

                  });
               }

               if (item.codigoPerfil) {
                  cont += 1
                  details.push({
                     nItem: details.length + 1,
                     prod: {
                        cProd: item.codigoPerfil,
                        xProd: "Perfil",
                        NCM: "87089990",
                        vProd: parseFloat(item.valorPerfil).toFixed(2),
                        "CFOP": "5101",
                        "uCom": "UN",
                        "cEAN": "SEM GTIN",
                        "CEST": "0107500",
                        "qCom": "1",
                        "vUnCom": parseFloat(item.valorPerfil).toFixed(2),
                        "cEANTrib": "SEM GTIN",
                        "uTrib": "UN",
                        "qTrib": "1",
                        "vUnTrib": parseFloat(item.valorPerfil).toFixed(2),
                        "indTot": "1",
                        "nItemPed": "0",
                     },
                     imposto: {
                        "vTotTrib": "10.00",
                        "ICMS": {
                           "ICMS00": {
                              "orig": "0",
                              "CST": "00",
                              "modBC": "0",
                              "vBC": "100.00",
                              "pICMS": "10.00",
                              "vICMS": "10.00",
                              "pFCP": "2.00",
                              "vFCP": "2.00"
                           }
                        },
                        "IPI": {
                           "cEnq": "999",
                           "IPINT": {
                              "CST": "53"
                           }
                        },
                        "PIS": {
                           "PISAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pPIS": "0.65",  // Valor comum de alíquota PIS
                              "vPIS": "0.65"
                           }
                        },
                        "COFINS": {
                           "COFINSAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pCOFINS": "3.00",  // Valor comum de alíquota COFINS
                              "vCOFINS": "3.00"
                           }
                        }
                     }

                  });
               }

               if (item.codigoVidro) {
                  cont += 1
                  details.push({
                     nItem: details.length + 1,
                     prod: {
                        cProd: item.codigoVidro,
                        xProd: "Vidro",
                        NCM: "87089990",
                        vProd: parseFloat(item.valorVidro).toFixed(2),
                        "CFOP": "5101",
                        "uCom": "UN",
                        "cEAN": "SEM GTIN",
                        "CEST": "0107500",
                        "qCom": "1",
                        "vUnCom": parseFloat(item.valorVidro).toFixed(2),
                        "cEANTrib": "SEM GTIN",
                        "uTrib": "UN",
                        "qTrib": "1",
                        "vUnTrib": parseFloat(item.valorVidro).toFixed(2),
                        "indTot": "1",
                        "nItemPed": "0",
                     },
                     imposto: {
                        "vTotTrib": "10.00",
                        "ICMS": {
                           "ICMS00": {
                              "orig": "0",
                              "CST": "00",
                              "modBC": "0",
                              "vBC": "100.00",
                              "pICMS": "10.00",
                              "vICMS": "10.00",
                              "pFCP": "2.00",
                              "vFCP": "2.00"
                           }
                        },
                        "IPI": {
                           "cEnq": "999",
                           "IPINT": {
                              "CST": "53"
                           }
                        },
                        "PIS": {
                           "PISAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pPIS": "0.65",  // Valor comum de alíquota PIS
                              "vPIS": "0.65"
                           }
                        },
                        "COFINS": {
                           "COFINSAliq": {
                              "CST": "01",
                              "vBC": "100.00",
                              "pCOFINS": "3.00",  // Valor comum de alíquota COFINS
                              "vCOFINS": "3.00"
                           }
                        }
                     }

                  });
               }

               return details;
            }),  // Concatenar os arrays gerados

            "total": {
               "ICMSTot": {
                  vBC: cont * 100.00,  // Total da base de cálculo
                  "vICMS": (cont * 100.00 * 0.10).toFixed(2),  // Total de ICMS = vBC * 10%
                  "vICMSDeson": "0.00",
                  "vFCP": (cont * 100.00 * 0.02).toFixed(2),
                  "vBCST": "0.00",
                  "vST": "0.00",
                  "vFCPST": "0.00",
                  "vFCPSTRet": "0.00",
                  "vProd": parseFloat(order.valorTotal).toFixed(2),
                  "vFrete": "0.00",
                  "vSeg": "0.00",
                  "vDesc": "0.00",
                  "vII": "0.00",
                  "vIPI": "0.00",
                  "vIPIDevol": "0.00",
                  "vPIS": (cont * 100.00 * 0.0065).toFixed(2),  // Total de PIS = vBC * 0.65%
                  "vCOFINS": (cont * 100.00 * 0.03).toFixed(2),
                  "vOutro": "0.00",
                  "vNF": parseFloat(order.valorTotal).toFixed(2),
                  "vTotTrib": (cont * 10.00).toFixed(2)
               },
               "retTrib": {
                  "vRetPIS": "0.06",
                  "vRetCOFINS": "0.06"
               }
            },
            "transp": {
               "modFrete": "1",
               "transporta": {
                  "CNPJ": "37320367000100",
                  "xNome": "EXEMPLO",
                  "IE": "129027724114",
                  "xEnder": "EXEMPLOEXEMPLO",
                  "xMun": "CAXIAS DO SUL",
                  "UF": "SP"
               },
               "vol": {
                  "qVol": "0",
                  "marca": "EXEMPLO",
                  "nVol": "0"
               }
            },
            "cobr": {
               "fat": {
                  "nFat": "48412",
                  "vOrig": parseFloat(order.valorTotal).toFixed(2),
                  "vDesc": "0.00",
                  "vLiq": parseFloat(order.valorTotal).toFixed(2)
               },
               "dup": {
                  "nDup": "001",
                  "dVenc": "2020-10-26",
                  "vDup": parseFloat(order.valorTotal).toFixed(2)
               }
            },
            "pag": {
               "detPag": {
                  "indPag": "1",
                  "tPag": "15",
                  "vPag": parseFloat(order.valorTotal).toFixed(2)
               },
               "vTroco": "0.00"
            },
            "infAdic": {
               "infCpl": order.nomeCompleto,
               "obsCont": [{
                  "xCampo": "enviaEmail",
                  "xTexto": order.email
               }]
            }
         }
      }
   }


   try {
      const response = await fetch("https://nfe.ns.eti.br/nfe/issue", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            "X-AUTH-TOKEN": "QkFOQU5BIERFQ09SQUNBVU5hYVk=",
            ...formattedJSON
         })
      });

      const rawResponse = await response.text();

      let data;
      try {
         data = JSON.parse(rawResponse);
      } catch (jsonError) {
         console.error("Falha ao parsear resposta como JSON:", jsonError);
         throw new Error(`Resposta não-JSON recebida: ${rawResponse}`);
      }

      console.log("Resposta da API:", data);

      await consultarStatusNFe(data.nsNRec, res);

      if (!response.ok) {
         throw new Error(`Erro do servidor: ${response.statusText}`);
      }

      if (!res.headersSent) {
         switch (data.status) {
            case 200:
               return res.status(200).json(data);
            case -2:
               console.error("Erro de informações:", data.motivo);
               return res.status(400).json(data);
            case -3:
               console.error("Schema de validação inexistente:", data.motivo);
               return res.status(400).json(data);
            case -4:
               console.error("Dados fora do padrão:", data.motivo);
               return res.status(400).json(data);
            case -5:
               console.error("Erro ao enviar NF-e para Sefaz:", data.erro);
               return res.status(500).json(data);
            case -6:
               console.warn("NF-e já enviada e com status não consultado");
               return res.status(409).json(data);
            case -7:
               console.warn("NF-e já enviada e autorizada");
               return res.status(409).json(data);
            default:
               console.error("Erro desconhecido:", data);
               return res.status(500).json(data);
         }
      }

   } catch (error: any) {
      if (!res.headersSent) {
         console.error("Erro ao fazer a chamada para a API da SEFAZ:", error);
         return res.status(500).json({
            status: -5,
            motivo: "Erro ao enviar NF-e para Sefaz.",
            erro: error.message
         });
      }
   }

}

interface Order {
   id: string;
   Entrega: string;
   NumeroPedido: number;
   Telefone: string;
   bairro: string;
   budgets: Array<{
      Tamanho: string;
      codigoColagem: string;
      codigoFoam: string;
      codigoImpressao: string;
      codigoMdf: string;
      codigoMontagem: string;
      codigoPaspatur: string;
      codigoPerfil: string;
      codigoVidro: string;
      collage: string;
      dataVencimento: string;
      descricaoColagem: string;
      descricaoFoam: string;
      descricaoImpressao: string;
      descricaoInstalacao: string;
      descricaoMontagem: string;
      descricaoPaspatur: string;
      descricaoPerfil: string;
      descricaoVidro: string;
      dimensoesPaspatur: string;
      espelho: string;
      espessuraEspelho: string;
      espessuraPerfil: string;
      espessuraVidro: string;
      fileInput: string;
      foam: string;
      impressao: string;
      instalacao: string;
      mdf: string;
      observacoes: string;
      paspatur: string;
      tipoEntrega: string;
      tipoImpressao: string;
      valorColagem: string;
      valorEntrega: string;
      valorFoam: string;
      valorImpressao: string;
      valorInstalacao: string;
      valorMontagem: string;
      valorPaspatur: string;
      valorPerfil: string;
      valorTotal: string;
      valorVidro: string;
      vidro: string;
   }>;
   cep: string;
   cidade: string;
   complemento: string;
   cpf: string;
   dataCadastro: string;
   email: string;
   endereco: string;
   formaPagamento: string;
   nomeCompleto: string;
   tipoPessoa: string;
   valorTotal: string;
   Ativo: boolean;
}

async function downloadNFePDF(chNFe: string, res: any) {
   try {
      const downloadResponse = await fetch("https://nfe.ns.eti.br/nfe/get", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            "X-AUTH-TOKEN": "QkFOQU5BIERFQ09SQUNBVU5hYVk=",  // Use o seu token aqui
            "chNFe": chNFe,
            "tpDown": "P"  // PDF
         })
      });

      if (!downloadResponse.ok) {
         throw new Error(`Erro do servidor ao baixar PDF: ${downloadResponse.statusText}`);
      }

      const downloadData = await downloadResponse.json();
      console.log(downloadData);

      if (downloadData.status === 200) {
         console.log("Download da NF-e realizado com sucesso.");
         return res.json({ status: 200, pdf: downloadData.pdf });
      } else {
         console.error("Erro ao baixar PDF da NF-e:", downloadData.motivo);
         return res.status(400).json(downloadData);
      }

   } catch (error: any) {
      if (!res.headersSent) {
         console.error("Erro ao fazer a chamada para download da NF-e:", error);
         return res.status(500).json({
            status: -1,
            motivo: "Erro ao baixar PDF da NF-e.",
            erro: error.message
         });
      }
   }
}

async function consultarStatusNFe(nsNRec: any, res: any) {
   try {
      const statusResponse = await fetch("https://nfe.ns.eti.br/nfe/issue/status", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            "X-AUTH-TOKEN": "QkFOQU5BIERFQ09SQUNBVU5hYVk=",
            "CNPJ": "37320367000100",
            "nsNRec": nsNRec
         })
      });

      const rawStatusResponse = await statusResponse.text();

      let statusData;
      try {
         statusData = JSON.parse(rawStatusResponse);
      } catch (jsonError) {
         console.error("Falha ao parsear resposta como JSON:", jsonError);
         throw new Error(`Resposta não-JSON recebida: ${rawStatusResponse}`);
      }

      console.log("Resposta do status da NF-e:", statusData);

      if (!statusResponse.ok) {
         throw new Error(`Erro do servidor: ${statusResponse.statusText}`);
      }

      if (!res.headersSent) {
         switch (statusData.status) {
            case 200:
               await downloadNFePDF(statusData.chNFe, res);
               break
            case -2:
               console.error("Erro ao carregar o status da NF-e:", statusData.motivo);
               return res.status(400).json(statusData);
            case -6:
               console.warn("NF-e já recebida, mas sem status de processamento");
               return res.status(409).json(statusData);
            case -7:
               console.warn("NF-e já processada anteriormente e autorizada");
               return res.status(409).json(statusData);
            default:
               console.error("Erro desconhecido ao consultar status:", statusData);
               return res.status(500).json(statusData);
         }
      }
   } catch (error: any) {
      if (!res.headersSent) {
         console.error("Erro ao fazer a chamada para consultar status da NF-e:", error);
         return res.status(500).json({
            status: -2,
            motivo: "Não foi possível carregar o status da NF-e",
            erro: error.message
         });
      }
   }
}



function getUFfromCidade(cidade: any) {
   switch (cidade) {
      case 'São Paulo': return 'SP';
      case 'Belo Horizonte': return 'MG';
      default: return 'UNKNOWN';
   }
}
