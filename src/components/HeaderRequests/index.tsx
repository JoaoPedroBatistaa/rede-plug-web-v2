import Head from "next/head";
import styles from "../../styles/Header.Request.module.scss";
import SearchInput from "../InputSearch";
import { useMenu } from "../../components/Context/context";
import classnames from "classnames";

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
          <div className={styles.menuSamduba}>
            {" "}
            <img
              src="./menuSamduba.svg"
              height={20}
              width={26}
              alt=""
              onClick={handleOpenMenu}
            />
          </div>
          <div className={styles.HeaderTextTitle}>
            <b>Pedidos</b>
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
            <p>Aqui voce encontra todos os pedidos efetuados</p>
          </div>
        </div>
      </div>
    </>
  );
}
