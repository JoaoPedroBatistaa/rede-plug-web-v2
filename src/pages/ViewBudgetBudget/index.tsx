import Head from "next/head";
import styles from "../../styles/ViewOrderBudget.module.scss";
import { useRouter } from "next/router";

import HeaderViewBudget from "@/components/HeaderViewBudget";
import SideMenuHome from "@/components/SideMenuHome";
import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";

import { db, doc, getDoc } from "../../../firebase";

type UserDataType = {
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
};

export default function ViewBudgetBudget() {
  const router = useRouter();

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

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome activeRoute={router.pathname}></SideMenuHome>

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
                <p className={styles.OrderValue}>R$1350,00</p>
              </div>
            </div>

            <div className={styles.linhaOrder}></div>

            <div className={styles.OrderData}>
              <div className={styles.OrderAll}>
                <div className={styles.OrderRes}>
                  <p className={styles.ResTitle}>Resumo do orçamento</p>

                  <div>
                    <p className={styles.ResName}>Tamanho</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>{userData?.Tamanho}</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Impressão</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>
                        {userData?.impressao} - {userData?.tipoImpressao}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Perfil</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>
                        {userData?.codigoPerfil} - {userData?.espessuraPerfil}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Vidro</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>
                        {userData?.vidro} - {userData?.espessuraVidro}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Foam</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>{userData?.foam}</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Paspatur</p>
                    <div>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>
                          {userData?.paspatur} - {userData?.codigoPaspatur}
                        </p>
                      </div>

                      <p className={styles.ResValue}>
                        {userData?.dimensoesPaspatur}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Colagem</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>{userData?.collage}</p>
                    </div>
                  </div>
                  {/* 
                  <div>
                    <p className={styles.ResName}>Impressão</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>SIM</p>
                    </div>
                  </div> */}

                  <div>
                    <p className={styles.ResName}>Instalação</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>
                        {userData?.instalacao} - {userData?.valorInstalacao}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Entrega</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>{userData?.tipoEntrega}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.OrderRes}>
                  <p className={styles.ResTitle}>Pagamentos e prazos</p>

                  <div>
                    <p className={styles.ResName}>Mão de obra externa</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>R$100,00</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Forma de pagamento</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>À vista</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Prazo para entrega</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>27/05/2023</p>
                    </div>
                  </div>

                  <div className={styles.OrderNotes}>
                    <p className={styles.ResName}>Observação</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>
                        There are many variations of passages of Lorem Ipsum
                        available, but the majority have suffered alteration in
                        some form, by injected humour
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.OrderRes}>
                  <p className={styles.ResTitle}>Valor total</p>
                  <div>
                    <p className={styles.ResTotal}>R$1.350,00</p>
                  </div>
                </div>
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
