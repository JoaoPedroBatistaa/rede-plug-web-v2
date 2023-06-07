import Head from "next/head";
import styles from "../../styles/SideMenuHome.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMenu } from "../../components/Context/context";
import classnames from "classnames";

interface SideMenuBudgetProps {
  activeRoute: string;
}
interface SideMenuBudgetProps {
  activeRoute: string;
  openMenu: boolean;
}

export default function SideMenuBudget({ activeRoute }: SideMenuBudgetProps) {
  const router = useRouter();

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



      <div
        className={classnames(styles.sideMenu, {
          [styles.sideMenuClose]: !openMenu,
        })}
      >
        <div className={styles.MenuContainer}>
          <div className={styles.topMenu}>
            <img src="./closeMenu.png" alt="" className={styles.closeMenu} onClick={handleOpenMenu} />
            <img src="./LogoMenu.png" className={styles.Logo} />
          </div>

          <p className={styles.Steps}>Menu Principal</p>

          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/ViewOrderData" ? styles.active : ""
              }`}
          >
            <img src="./homeIconMenu.svg" className={styles.Pointer}></img>
            {/* <p className={styles.NavigateItem}>Home</p> */}
            <Link className={styles.NavigateItem} href="/Home">
              Home
            </Link>
          </div>

          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/Budgets" ? styles.active : ""
              }`}
          >
            <img src="./orcamentoIcon.svg" className={styles.Pointer}></img>
            {/* <p className={styles.NavigateItem}>Orçamentos</p> */}
            <Link className={styles.NavigateItem} href="/Budgets">
              Orçamentos
            </Link>
          </div>

          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/Requests" ? styles.active : ""
              }`}
          >
            <img src="./pedidosIcon.svg" className={styles.Pointer}></img>
            <Link className={styles.NavigateItem} href="/Requests">
              Pedidos
            </Link>
            {/* <p className={styles.NavigateItem}>Pedidos</p> */}
          </div>

          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetFoam" ? styles.active : ""
              }`}
          >
            <img src="./relIcon.svg" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Relatórios</p>
          </div>

          <div className={styles.linha}></div>
        </div>

        <div className={styles.MenuContainer}>
          <p className={styles.Steps}>Parâmetros</p>

          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetSize" ? styles.active : ""
              }`}
          >
            <img src="./produtosIcon.svg" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Produtos</p>
          </div>

          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetPerfil" ? styles.active : ""
              }`}
          >
            <img src="./configIcon.svg" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Configurações</p>
          </div>

          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetGlass" ? styles.active : ""
              }`}
          >
            <img src="./contaIcon.svg" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Conta</p>
          </div>

          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetFoam" ? styles.active : ""
              }`}
          >
            <img src="./relIcon.svg" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Relatórios</p>
          </div>

          <div className={styles.linha}></div>
        </div>

        <div className={styles.MenuContainer}>
          <p className={styles.Steps}>Ajuda</p>

          <div
            className={`${styles.MenuNavigate} ${activeRoute === "/BudgetSize" ? styles.active : ""
              }`}
          >
            <img src="./centralAjudaIcon.svg" className={styles.Pointer}></img>
            <p className={styles.NavigateItem}>Central de Ajuda</p>
          </div>

          <div className={styles.linha}></div>
        </div>

        <div>
          <Link href="/Login">
            <div
              className={`${styles.MenuNavigate} ${activeRoute === "/BudgetSize" ? styles.active : ""
                }`}
            >
              <p className={styles.NavigateItemEnd}>Encerrar sessão</p>
              <img src="./Logout.svg" className={styles.PointerEnd}></img>
            </div>
          </Link>
        </div>
      </div>



    </>
  );
}