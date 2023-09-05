import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.scss";

import HeaderHome from "@/components/HeaderHome";
import SideMenuHome from "@/components/SideMenuHome";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const [openMenu, setOpenMenu] = useState(false); // Inicializa o estado openMenu

  const [selectedOption, setSelectedOption] = useState("opcao1");
  const [searchText, setSearchText] = useState("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  let userId;
  if (typeof window !== "undefined") {
    userId = localStorage.getItem("userId");
  }
  console.log("ID do usuário:", userId);

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
          <HeaderHome></HeaderHome>
          <div className={styles.CardsMenusContainer}>
            <div className={styles.CardsMenus}>
              <Link href="/Budgets">
                <div className={styles.CardMenu}>
                  <img src="./homeMenuCardOrc.png"></img>
                  <span className={styles.CardMenuText}>Orçamento</span>
                </div>
              </Link>
              <div className={styles.CardMenu}>
                <img src="./homeMenuCardNegocios.png"></img>
                <span className={styles.CardMenuText}>Negócios</span>
              </div>
              <div className={styles.CardMenu}>
                <img src="./HomeMenuCardNotaFiscal.png"></img>
                <span className={styles.CardMenuText}>Notas Ficais</span>
              </div>
              <div className={styles.CardMenu}>
                <img src="./HomeMenuCardVendas.png"></img>
                <span className={styles.CardMenuText}>Vendas</span>
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
