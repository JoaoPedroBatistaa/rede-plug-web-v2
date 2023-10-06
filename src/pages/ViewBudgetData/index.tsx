import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ViewBudgetData.module.scss";

import HeaderViewBudget from "@/components/HeaderViewBudget";
import SideMenuHome from "@/components/SideMenuHome";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

import { db, doc, getDoc } from "../../../firebase";

type UserDataType = {
  nomeCompleto: string;
  Telefone: string;
  email: string;
  valorTotal: string;
};

export default function ViewBudgetData() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

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

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  useEffect(() => {
    async function fetchData() {
      if (selectedBudgetId) {
        try {
          const docRef = doc(db, `Login/${userId}/Budget`, selectedBudgetId);
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
                  <div>
                    <p className={`${styles.NavItem} ${styles.active}`}>
                      Dados do cliente
                    </p>
                    <div className={styles.NavItemBar}></div>
                  </div>
                </Link>

                <Link href="ViewBudgetBudget">
                  <p className={styles.NavItem}>Orçamento</p>
                </Link>
              </div>

              <div className={styles.BudgetHeadO}>
                <p className={styles.OrderTotalValue}>Valor total:</p>
                <p className={styles.OrderValue}>
                  R$ {parseFloat(userData?.valorTotal || "0").toFixed(2)}
                </p>
              </div>
            </div>

            <div className={styles.linhaOrder}></div>

            <div className={styles.BudgetData}>
              <div className={styles.PessoalData}>
                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Nome completo</p>
                    <p className={styles.FixedData}>{userData?.nomeCompleto}</p>
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Email</p>
                    <p className={styles.FixedData}>{userData?.email}</p>
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Telefone</p>
                    <p className={styles.FixedData}>{userData?.Telefone}</p>
                  </div>
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
