import Head from "next/head";
import { useRouter } from "next/router"; // Importando useRouter
import styles from "../../styles/HeaderBudget.module.scss";
import { useMenu } from "../Context/context";

export default function HeaderBudget() {
  const { openMenu, setOpenMenu } = useMenu();
  const router = useRouter(); // Usando o hook useRouter

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    console.log(openMenu);
  };

  const handleBack = () => {
    const userType = localStorage.getItem("userType"); // Obtendo userType do localStorage
    if (userType === "manager") {
      router.push("/managers"); // Redireciona para /managers se for manager
    } else {
      router.push("/supervisors-home"); // Redireciona para /supervisors-home caso contrário
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
        {/* <div className={styles.menuSamduba}>
          <img
            src="/menuSamduba.svg"
            height={20}
            width={20}
            alt="Menu"
            onClick={handleOpenMenu}
          />
        </div> */}
        <p className={styles.NewBudget}>NOVA TAREFA</p>
        <img src="/close.png" className={styles.Close} onClick={handleBack} />
      </div>
    </>
  );
}
