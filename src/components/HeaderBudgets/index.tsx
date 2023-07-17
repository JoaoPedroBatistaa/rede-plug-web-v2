import Head from "next/head";
import styles from "../../styles/Header.Budgets.module.scss";
import SearchInput from "../InputSearch";
import { useMenu } from "../../components/Context/context";
export default function HeaderRequests() {
  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    console.log(openMenu);
  };
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
          <div className={styles.menuSamduba} onClick={handleOpenMenu}>
            {" "}
            <img src="./menuSamduba.svg" height={20} width={26} alt="" />
          </div>
          <div className={styles.HeaderTextTitle}>
            <b>Orçamentos</b>
          </div>
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
          <div className={styles.HeaderTextDescription}>
            <p>
              Aqui voce encontra todos os orçamentos ainda não efetivados em
              pedidos
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
