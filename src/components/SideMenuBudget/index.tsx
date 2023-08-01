import Head from "next/head";
import styles from "../../styles/SideMenuBudget.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMenu } from "../../components/Context/context";
import classnames from "classnames";

interface SideMenuBudgetProps {
  activeRoute: string;
}

export default function SideMenuBudget({ activeRoute }: SideMenuBudgetProps) {
  const router = useRouter();
  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    console.log(openMenu);
  };
  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 600);
  };
  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div
        className={classnames(styles.sideMenu, {
          [styles.sideMenuClose]: !openMenu,
        })}
      >
        <img
          src="./closeMenu.png"
          alt=""
          className={styles.closeMenu}
          onClick={handleOpenMenuDiv}
        />

        <p className={styles.Steps}>Etapas do orçamento</p>
        <p className={styles.Click}>Clique para navegar</p>

        <Link href="/BudgetSize">
          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetSize" ? styles.active : ""
              }`}
            onClick={handleOpenMenuDiv}
          >
            <img src="./check.png" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Tamanho</p>
          </div>
        </Link>

        <Link href="/BudgetPerfil">
          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetPerfil" ? styles.active : ""
              }`}
            onClick={handleOpenMenuDiv}
          >
            <img src="./check.png" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Perfil</p>
          </div>
        </Link>

        <Link href="/BudgetGlass">
          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetGlass" ? styles.active : ""
              }`}
            onClick={handleOpenMenuDiv}
          >
            <img src="./check.png" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Vidro / Espelho</p>
          </div>
        </Link>

        <Link href="/BudgetFoam">
          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetFoam" ? styles.active : ""
              }`}
            onClick={handleOpenMenuDiv}
          >
            <img src="./check.png" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Foam / MDF</p>
          </div>
        </Link>



        <Link href="BudgetCollage">
          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetCollage" ? styles.active : ""
              }`}
            onClick={handleOpenMenuDiv}
          >
            <img src="./check.png" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Colagem</p>
          </div>
        </Link>

        <Link href="BudgetPrint">
          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetPrint" ? styles.active : ""
              }`}
            onClick={handleOpenMenuDiv}
          >
            <img src="./check.png" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Impressão</p>
          </div>
        </Link>

        <Link href="/BudgetPaspatur">
          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetPaspatur" ? styles.active : ""
              }`}
            onClick={handleOpenMenuDiv}
          >
            <img src="./check.png" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Paspatur</p>
          </div>
        </Link>

        <Link href="BudgetShip">
          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetShip" ? styles.active : ""
              }`}
            onClick={handleOpenMenuDiv}
          >
            <img src="./check.png" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Instalação / Frete</p>
          </div>
        </Link>

        <Link href="BudgetDecision">
          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetSave" ? styles.active : ""
              }`}
            onClick={handleOpenMenuDiv}
          >
            <img src="./check.png" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Finalização</p>
          </div>
        </Link>
      </div>
    </>
  );
}
