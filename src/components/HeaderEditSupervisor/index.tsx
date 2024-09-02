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

  const handleClose = (e: { preventDefault: () => void }) => {
    const userConfirmed = confirm(
      "Você tem certeza de que deseja fechar? As informações cadastradas não salvas serão perdidas."
    );
    if (!userConfirmed) {
      e.preventDefault(); // Impede o redirecionamento caso o usuário cancele
    }
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
        <p className={styles.NewBudget}>EDITAR SUPERVISOR</p>
        <Link href="/supervisors">
          <img
            src="/close.png"
            className={styles.Close}
            onClick={handleClose}
          />
        </Link>
      </div>
    </>
  );
}
