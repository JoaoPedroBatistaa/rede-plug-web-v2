import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";

import HeaderHome from "@/components/HeaderHome";
import SideMenuHome from "@/components/SideMenuHome";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/");
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
        <title>Rede Plug</title>
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
              <Link href="/posts">
                <div className={styles.CardMenu}>
                  <img src="./postosHome.svg"></img>
                  <span className={styles.CardMenuText}>POSTOS</span>
                </div>
              </Link>

              <Link href="/Requests">
                <div className={styles.CardMenu}>
                  <img src="./supervisoresHome.svg"></img>
                  <span className={styles.CardMenuText}>SUPERVISORES</span>
                </div>
              </Link>

              <Link href="/Products">
                <div className={styles.CardMenu}>
                  <img src="./gerentesHome.svg"></img>
                  <span className={styles.CardMenuText}>GERENTES</span>
                </div>
              </Link>

              <div className={styles.CardMenu}>
                <img src="./relatoriosHome.svg"></img>
                <span className={styles.CardMenuText}>RELATÓRIOS</span>
              </div>
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
