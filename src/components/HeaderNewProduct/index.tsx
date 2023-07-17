import Head from "next/head";
import styles from "../../styles/HeaderBudget.module.scss";
import Link from "next/link";
import { useMenu } from "../../components/Context/context";
import classnames from "classnames";

export default function HeaderBudget() {
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
        <div className={styles.menuSamduba}>
          {" "}
          <img
            src="./menuSamduba.svg"
            height={20}
            width={20}
            alt=""
            onClick={handleOpenMenu}
          />
        </div>
        <p className={styles.NewBudget}>NOVO PASPATUR</p>
        <Link href="/Products">
          <img src="./close.png" className={styles.Close} />
        </Link>
      </div>
    </>
  );
}
