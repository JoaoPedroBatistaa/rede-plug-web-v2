import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/HeaderBudget.module.scss";
import { useMenu } from "../Context/context";

export default function HeaderBudget() {
  const { openMenu, setOpenMenu } = useMenu();
  const router = useRouter();

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    console.log(openMenu);
  };

  return (
    <>
      <Head>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
`}</style>
      </Head>

      <div className={styles.HeaderContainer}>
        <div className={styles.menuSamduba}>
          <img
            src="/menuSamduba.svg"
            height={20}
            width={20}
            alt=""
            onClick={handleOpenMenu}
          />
        </div>
        <p className={styles.NewBudget}>PRODUTIVIDADE DO SUPERVISOR</p>
        <Link href={`/edit-supervisor?id=${router.query.id}`}>
          <img src="/close.png" className={styles.Close} alt="Fechar" />
        </Link>
      </div>
    </>
  );
}
