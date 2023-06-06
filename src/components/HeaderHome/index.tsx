import Head from "next/head";
import styles from "../../styles/Header.Home.module.scss";
import SearchInput from "../InputSearch";
import { useState } from "react";
import Link from "next/link";

export default function HeaderHome() {
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>
      <div className={styles.HeaderContainer}>
        <div className={styles.HeaderSearch}>
          <div className={styles.menuSamduba}>
            {" "}
            <img src="./menuSamduba.png" height={20} width={20} alt="" />
          </div>

          <Link href="/HomeResults">
            <SearchInput></SearchInput>
          </Link>
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
            />
          </div>
        </div>
        <div className={styles.HeaderTextContainer}>
          <div className={styles.HeaderTextTitle}>
            Bem vindo de volta, <b>Evandro</b>
          </div>
        </div>
        <div className={styles.HeaderTextContainer}>
          <div className={styles.HeaderTextDescription}>
            <p>
              Aqui você pode realizar ações de forma rápida e fácil ou buscar
              por outras funcionalidades que esteja precisando{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
