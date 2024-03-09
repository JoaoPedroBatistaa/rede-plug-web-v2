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
              <Link href="/manager-six-routine">
                <div className={styles.CardMenu}>
                  <img src="./routine-6.svg"></img>
                  <span className={styles.CardMenuText}>ROTINA 6H</span>
                </div>
              </Link>

              <Link href="/manager-fourteen-routine">
                <div className={styles.CardMenu}>
                  <img src="./routine-14.svg"></img>
                  <span className={styles.CardMenuText}>ROTINA 14H</span>
                </div>
              </Link>

              <Link href="/manager-twenty-two-routine">
                <div className={styles.CardMenu}>
                  <img src="./routine-22.svg"></img>
                  <span className={styles.CardMenuText}>ROTINA 22H</span>
                </div>
              </Link>

              <Link href="/new-discharge">
                <div className={styles.CardMenu}>
                  <img src="./discharge.svg"></img>
                  <span className={styles.CardMenuText}>NOVA DESCARGA</span>
                </div>
              </Link>
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
