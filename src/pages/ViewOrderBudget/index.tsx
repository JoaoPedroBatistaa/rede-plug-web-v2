import Head from "next/head";
import styles from "../../styles/ViewOrderBudget.module.scss";
import { useRouter } from "next/router";

import HeaderOrder from "@/components/HeaderOrder";
import SideMenuHome from "@/components/SideMenuHome";
import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";

import { db, doc, getDoc } from "../../../firebase";

type BudgetType = {
  id: string;
  Tamanho: string;
  impressao: string;
  tipoImpressao: string;
  codigoPerfil: string;
  espessuraPerfil: string;
  vidro: string;
  espessuraVidro: string;
  foam: string;
  paspatur: string;
  codigoPaspatur: string;
  codigoImpressao: string;
  codigoFoam: string;
  codigoVidro: string;
  codigoColagem: string;
  dimensoesPaspatur: string;
  collage: string;
  instalacao: string;
  valorInstalacao: string;
  tipoEntrega: string;
  formaPagamento: string;
  observacao: string;
  dataCadastro: string;
  valorTotal: string;
  obs: string;
  valorImpressao: string;
  valorPerfil: string;
  valorPaspatur: string;
  valorVidro: string;
  dataVencimento: string;
  valorFoam: string;
  valorColagem: string;
  maoDeObraExtra: string;
  observacoes: string;
}[];

type UserDataType = {
  valorTotal: string;
  budgets: BudgetType;
};


export default function ViewOrderBudget() {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false); // Inicializa o estado openMenu

  const [selectedOption, setSelectedOption] = useState("opcao1");
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedId(localStorage.getItem("selectedId"));
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (selectedId) {
        try {
          const docRef = doc(db, "Orders", selectedId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserDataType);
          } else {
            console.log("Nenhum documento encontrado!");
          }
        } catch (error) {
          console.error("Erro ao buscar documento:", error);
        }
      } else {
        console.log("Nenhum ID selecionado!");
      }
    }

    fetchData();
  }, [selectedId]);

  useEffect(() => {
    async function fetchData() {
      if (selectedId) {
        try {
          const docRef = doc(db, "Orders", selectedId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserDataType);
          } else {
            console.log("Nenhum documento encontrado!");
          }
        } catch (error) {
          console.error("Erro ao buscar documento:", error);
        }
      } else {
        console.log("Nenhum ID selecionado!");
      }
    }

    fetchData();
  }, [selectedId]);

  const budgets = userData?.budgets || [];

  function formatDate(date: any) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Aqui nós adicionamos 1 ao dia atual.
    const dia = newDate.getDate().toString().padStart(2, '0');
    const mes = (newDate.getMonth() + 1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
    const ano = newDate.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // ENVIAR POR WHATSAPP

  function formatSingleBudget(budget: { Tamanho: any; codigoImpressao: any; valorImpressao: any; codigoPerfil: any; valorPerfil: any; codigoVidro: any; valorVidro: any; codigoFoam: any; valorFoam: any; codigoPaspatur: any; valorPaspatur: any; codigoColagem: any; valorColagem: any; instalacao: any; valorInstalacao: any; tipoEntrega: any; maoDeObraExtra: any; formaPagamento: any; dataVencimento: any; observacoes: any; valorTotal: any; }, index: number) {
    let message = `Olá Evandro, segue o Pedido que desejava enviar para o WhatsApp...\n\n`;

    message += `PEDIDO ${index + 1}\n`;
    message += `VALOR TOTAL: R$ ${parseFloat(budget.valorTotal || '0').toFixed(2)}\n\n`;
    message += `Tamanho: ${budget.Tamanho}\n`;
    message += budget.codigoImpressao ? `Impressão: ${budget.codigoImpressao} - R$ ${parseFloat(budget.valorImpressao || '0').toFixed(2)}\n` : "";
    message += budget.codigoPerfil ? `Perfil: ${budget.codigoPerfil} - R$ ${parseFloat(budget.valorPerfil || '0').toFixed(2)}\n` : "";
    message += budget.codigoVidro ? `Vidro: ${budget.codigoVidro} - R$ ${parseFloat(budget.valorVidro || '0').toFixed(2)}\n` : "";
    message += budget.codigoFoam ? `Foam: ${budget.codigoFoam} - R$ ${parseFloat(budget.valorFoam || '0').toFixed(2)}\n` : "";
    message += budget.codigoPaspatur ? `Paspatur: ${budget.codigoPaspatur} - R$ ${parseFloat(budget.valorPaspatur || '0').toFixed(2)}\n` : "";
    message += budget.codigoColagem ? `Colagem: ${budget.codigoColagem} - R$ ${parseFloat(budget.valorColagem || '0').toFixed(2)}\n` : "";
    message += budget.instalacao ? `Instalação: ${budget.instalacao} - ${budget.valorInstalacao}\n` : "";
    message += budget.tipoEntrega ? `Entrega: ${budget.tipoEntrega}\n\n` : "";

    message += "Pagamentos e prazos\n\n";
    message += budget.maoDeObraExtra ? `Mão de obra externa: ${budget.maoDeObraExtra}\n` : "";
    message += budget.formaPagamento ? `Forma de pagamento: ${budget.formaPagamento}\n` : "";
    message += budget.dataVencimento ? `Prazo para entrega: ${formatDate(budget.dataVencimento)}\n\n` : "";

    message += `Observação: ${budget.observacoes}\n\n`;
    message += `Valor total: R$ ${parseFloat(budget.valorTotal || '0').toFixed(2)}\n\n`;

    return message;
  }

  function formatBudgets(budgets: any[]) {
    let message = "";

    budgets.forEach((budget, index) => {
      message += formatSingleBudget(budget, index);
    });

    // Codificar a mensagem para uso em uma URL
    return encodeURIComponent(message);
  }

  const whatsappUrl = `https://api.whatsapp.com/send?phone=5511958284000&text=${formatBudgets(budgets)}`;
  console.log(whatsappUrl);



  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome
          activeRoute={router.pathname}
          openMenu={openMenu}
        ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderOrder></HeaderOrder>

          <div className={styles.OrderDataContainer}>
            <div className={styles.BudgetHead}>
              <div className={styles.Nav}>
                <Link href="ViewOrderData">
                  <p className={styles.NavItem}>Dados do cliente</p>
                </Link>

                <Link href="ViewOrderShip">
                  <p className={styles.NavItem}>Endereço</p>
                </Link>

                <Link href="ViewOrderBudget">
                  <div>
                    <p className={`${styles.NavItem} ${styles.active}`}>
                      Orçamento
                    </p>
                    <div className={styles.NavItemBar}></div>
                  </div>
                </Link>
              </div>

              <div className={styles.BudgetHeadO}>
                <p className={styles.OrderTotalValue}>Valor total:</p>
                <p className={styles.OrderValue}>R$ {parseFloat(userData?.valorTotal || '0').toFixed(2)}</p>
              </div>
            </div>

            <div className={styles.linhaOrder}></div>

            <div className={styles.OrderData}>
              <div className={styles.Budgets}>
                {budgets.map((budget, index) => (
                  <div key={index} className={styles.OrderAll}>
                    <div className={styles.OrderRes}>
                      <p className={styles.ResTitle}>ORÇAMENTO {index + 1}</p>

                      <div>
                        <p className={styles.ResName}>Tamanho</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.Tamanho}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Impressão</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoImpressao && <p className={styles.ResValue}>
                            {budget.codigoImpressao} - R$ {parseFloat(budget.valorImpressao || '0').toFixed(2)}
                          </p>}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Perfil</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoPerfil && <p className={styles.ResValue}>
                            {budget.codigoPerfil} - R$ {parseFloat(budget.valorPerfil || '0').toFixed(2)}
                          </p>}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Vidro</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoVidro && <p className={styles.ResValue}>
                            {budget.codigoVidro} - R$ {parseFloat(budget.valorVidro || '0').toFixed(2)}
                          </p>}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Foam</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoFoam && <p className={styles.ResValue}>
                            {budget.codigoFoam} - R$ {parseFloat(budget.valorFoam || '0').toFixed(2)}
                          </p>}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Paspatur</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoPaspatur && <p className={styles.ResValue}>
                            {budget.codigoPaspatur} - R$ {parseFloat(budget.valorPaspatur || '0').toFixed(2)}
                          </p>}
                        </div>
                        {/* {budget.dimensoesPaspatur && <p className={styles.ResValue}>
                          {budget.dimensoesPaspatur}
                        </p>} */}
                      </div>

                      <div>
                        <p className={styles.ResName}>Colagem</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoColagem && <p className={styles.ResValue}>
                            {budget.codigoColagem} - R$ {parseFloat(budget.valorColagem || '0').toFixed(2)}
                          </p>}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Instalação</p>
                        <div className={styles.OrderResValue}>
                          {budget.instalacao && <p className={styles.ResValue}>
                            {budget.instalacao} - {budget.valorInstalacao}
                          </p>}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Entrega</p>
                        <div className={styles.OrderResValue}>
                          {budget.tipoEntrega && <p className={styles.ResValue}>{budget.tipoEntrega}</p>}
                        </div>
                      </div>

                      <div className={styles.OrderRes}>
                        <p className={styles.ResTitle}>Pagamentos e prazos</p>

                        <div>
                          <p className={styles.ResName}>Mão de obra</p>
                          <div className={styles.OrderResValue}>
                            {budget.maoDeObraExtra && <p className={styles.ResValue}>{budget.maoDeObraExtra}</p>}
                          </div>
                        </div>

                        <div>
                          <p className={styles.ResName}>Forma de pagamento</p>
                          <div className={styles.OrderResValue}>
                            {budget.formaPagamento && <p className={styles.ResValue}>{budget.formaPagamento}</p>}
                          </div>
                        </div>

                        <div>
                          <p className={styles.ResName}>Prazo para entrega</p>
                          <div className={styles.OrderResValue}>
                            {budget.dataVencimento && <p className={styles.ResValue}>{formatDate(budget.dataVencimento)}</p>}
                          </div>
                        </div>
                      </div>


                      <div className={styles.OrderNotes}>
                        <p className={styles.ResName}>Observação</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>
                            {budget.observacoes}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.OrderRes}>
                      <p className={styles.ResTitle}>Valor total</p>
                      <div>
                        <p className={styles.ResTotal}>R$ {parseFloat(budget.valorTotal || '0').toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.Cta}>
                <div className={styles.WhatsButton} onClick={() => window.open(whatsappUrl, "_blank")}>
                  <img className={styles.WhatsImg} src="./Wpp.png" alt="" />
                  <p className={styles.WhatsText}>ENVIAR POR WHATSAPP</p>
                </div>

                <div className={styles.PdfButton}>
                  <img className={styles.WhatsImg} src="./PdfIcon.png" alt="" />
                  <p className={styles.PdfText}>GERAR PDF</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Total Maxx 2023, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
