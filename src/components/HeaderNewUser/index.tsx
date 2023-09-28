import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/HeaderBudget.module.scss";
import { useMenu } from "../Context/context";

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
        <p className={styles.NewBudget}>NOVO USUÁRIO</p>
        <Link href="/Users">
          <img src="./close.png" className={styles.Close} />
        </Link>
      </div>
    </>
  );
}
