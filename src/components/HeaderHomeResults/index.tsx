import Head from "next/head";
import styles from "../../styles/Header.Home.Result.module.scss";
import SearchInput from "../InputSearch";
import { useState } from "react";
import { useMenu } from "../../components/Context/context";
import classnames from "classnames";

export default function HeaderHomeResult() {
  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    console.log(openMenu);
  };
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
            <img
              src="./menuSamduba.png"
              height={20}
              width={20}
              alt=""
              onClick={handleOpenMenu}
            />
          </div>
          <SearchInput></SearchInput>
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
          <div className={styles.HeaderTextTitle}>Resultado da busca:</div>
        </div>
      </div>
    </>
  );
}
