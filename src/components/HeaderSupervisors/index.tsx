import Head from "next/head";
import { useState } from "react";
import styles from "../../styles/Header.Home.module.scss";
import { useMenu } from "../Context/context";

export default function HeaderHome() {
  const [searchText, setSearchText] = useState("");

  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    console.log(openMenu);
  };

  const nome =
    typeof window !== "undefined" ? localStorage.getItem("userName") : null;

  return (
    <>
      <Head>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
`}</style>
      </Head>
      <div className={styles.HeaderContainer}>
        <div className={styles.HeaderSearch}>
          <div className={styles.menuSamduba} onClick={handleOpenMenu}>
            {" "}
            <img src="./menuSamduba.svg" height={20} width={26} alt="" />
          </div>

          {/* <Link href="/HomeResults">
            <SearchInput></SearchInput>
          </Link> */}
          <div className={styles.HeaderContainerIcons}>
            <img
              src="./iconSino.png"
              className={styles.HeaderIcon}
              height={20}
              width={20}
            />
            <img
              src="./iconProfile.png"
              className={styles.HeaderIcon}
              height={20}
              width={20}
            />
            <img
              src="./iconInterro.png"
              className={styles.HeaderIcon}
              height={20}
              width={20}
              id={styles.HeaderIcon}
            />
          </div>
        </div>
        <div className={styles.HeaderTextContainer}>
          <img src="/supervisor.png" alt="" />
          <div className={styles.HeaderTextTitle}>
            Bem vindo de volta, <b>{nome}</b>
          </div>
        </div>
        <div className={styles.HeaderTextContainer}>
          <div className={styles.HeaderTextDescription}>
            <p>
              Aqui você pode acessar sua programação diária de forma rápida e
              eficiente, além de visualizar e realizar todas as tarefas do dia.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
