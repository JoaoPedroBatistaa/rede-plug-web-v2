import Head from "next/head";
import { useState } from "react";
import { useMenu } from "../../components/Context/context";
import styles from "../../styles/Header.Home.module.scss";

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
            <img src="/menuSamduba.svg" height={20} width={26} alt="" />
          </div>

          {/* <Link href="/HomeResults">
            <SearchInput></SearchInput>
          </Link> */}
          <div className={styles.HeaderContainerIcons}>
            <img
              src="/iconSino.png"
              className={styles.HeaderIcon}
              height={20}
              width={20}
            />
            <img
              src="/iconProfile.png"
              className={styles.HeaderIcon}
              height={20}
              width={20}
            />
            <img
              src="/iconInterro.png"
              className={styles.HeaderIcon}
              height={20}
              width={20}
              id={styles.HeaderIcon}
            />
          </div>
        </div>
        <div className={styles.HeaderTextContainer}>
          <img src="/home.svg" alt="" />
          <div className={styles.HeaderTextTitle}>
            Bem vindo de volta, <b>{nome}</b>
          </div>
        </div>
        <div className={styles.HeaderTextContainer}>
          <div className={styles.HeaderTextDescription}>
            <p>
              Aqui você pode realizar suas tarefas de forma rápida e eficiente,
              com acesso direto às funcionalidades mais utilizadas. Estamos aqui
              para facilitar sua rotina, oferecendo atalhos para as principais
              atividades e um ambiente intuitivo para que você encontre
              exatamente o que precisa. Explore os recursos disponíveis e
              descubra como podemos ajudar a tornar seu dia mais produtivo.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
