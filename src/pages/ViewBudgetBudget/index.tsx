import Head from "next/head";
import styles from "../../styles/ViewOrderBudget.module.scss";
import { useRouter } from "next/router";

import HeaderViewBudget from "@/components/HeaderViewBudget";
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

export default function ViewBudgetBudget() {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false); // Inicializa o estado openMenu

  const [selectedOption, setSelectedOption] = useState("opcao1");
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedBudgetId(localStorage.getItem("selectedBudgetId"));
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (selectedBudgetId) {
        try {
          const docRef = doc(db, "Budget", selectedBudgetId);
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
  }, [selectedBudgetId]);

  const budgets = userData?.budgets || [];

  function formatDate(date: any) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Aqui nós adicionamos 1 ao dia atual.
    const dia = newDate.getDate().toString().padStart(2, '0');
    const mes = (newDate.getMonth() + 1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
    const ano = newDate.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

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
          <HeaderViewBudget></HeaderViewBudget>

          <div className={styles.OrderDataContainer}>
            <div className={styles.BudgetHead}>
              <div className={styles.Nav}>
                <Link href="ViewBudgetData">
                  <p className={styles.NavItem}>Dados do cliente</p>
                </Link>

                <Link href="ViewBudgetBudget">
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
                          <p className={styles.ResValue}>
                            {budget.impressao} - R$ {parseFloat(budget.valorImpressao || '0').toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Perfil</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>
                            {budget.codigoPerfil} - R$ {parseFloat(budget.valorPerfil || '0').toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Vidro</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>
                            {budget.vidro} - R$ {parseFloat(budget.valorVidro || '0').toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Foam</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.foam} - R$ {parseFloat(budget.valorFoam || '0').toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Paspatur</p>
                        <div>
                          <div className={styles.OrderResValue}>
                            <p className={styles.ResValue}>
                              {budget.paspatur} - R$ {parseFloat(budget.valorPaspatur || '0').toFixed(2)}
                            </p>
                          </div>
                          <p className={styles.ResValue}>
                            {budget.dimensoesPaspatur}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Colagem</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>R$ {parseFloat(budget.valorColagem || '0').toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Instalação</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>
                            {budget.instalacao} - {budget.valorInstalacao}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Entrega</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.tipoEntrega}</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.OrderRes}>
                      <p className={styles.ResTitle}>Pagamentos e prazos</p>

                      <div>
                        <p className={styles.ResName}>Mão de obra externa</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.maoDeObraExtra}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Forma de pagamento</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.formaPagamento}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Prazo para entrega</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{formatDate(budget.dataVencimento)}</p>
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
                <div className={styles.WhatsButton}>
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
