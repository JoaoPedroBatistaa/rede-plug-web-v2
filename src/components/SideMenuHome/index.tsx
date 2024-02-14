import classnames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMenu } from "../../components/Context/context";
import styles from "../../styles/SideMenuHome.module.scss";

interface SideMenuBudgetProps {
  activeRoute: string;
}
interface SideMenuBudgetProps {
  activeRoute: string;
  openMenu: boolean;
}

export default function SideMenuBudget({ activeRoute }: SideMenuBudgetProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    console.log(openMenu);
  };

  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 200);
  };

  const typeUser =
    typeof window !== "undefined" ? localStorage.getItem("typeUser") : null;

  const logo =
    typeof window !== "undefined" ? localStorage.getItem("logo") : null;

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>
      <div className={styles.divFlex}>
        <div
          className={classnames(styles.sideMenu, {
            [styles.sideMenuClose]: !openMenu,
          })}
        >
          <div className={styles.MenuContainer}>
            <div className={styles.topMenu}>
              <img
                src="./closeMenu.png"
                alt=""
                className={styles.closeMenu}
                onClick={handleOpenMenuDiv}
              />

              <img src={"./LogoMenu.png"} className={styles.Logo} />
            </div>

            <p className={styles.Steps}>Menu Principal</p>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/home" ? styles.active : ""
              }`}
              onClick={handleOpenMenuDiv}
            >
              <svg
                className={styles.Pointer}
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1809_1480)">
                  <path
                    d="M15.414 7.03334L10.3573 1.976C9.7315 1.352 8.88378 1.00159 8.00001 1.00159C7.11623 1.00159 6.26851 1.352 5.64267 1.976L0.586008 7.03334C0.399625 7.21853 0.251855 7.43887 0.151263 7.6816C0.0506715 7.92432 -0.000740267 8.1846 8.05299e-06 8.44734V14.992C8.05299e-06 15.5224 0.210722 16.0311 0.585795 16.4062C0.960867 16.7813 1.46958 16.992 2.00001 16.992H14C14.5304 16.992 15.0391 16.7813 15.4142 16.4062C15.7893 16.0311 16 15.5224 16 14.992V8.44734C16.0008 8.1846 15.9493 7.92432 15.8488 7.6816C15.7482 7.43887 15.6004 7.21853 15.414 7.03334ZM10 15.6587H6.00001V13.036C6.00001 12.5056 6.21072 11.9969 6.58579 11.6218C6.96087 11.2467 7.46958 11.036 8.00001 11.036C8.53044 11.036 9.03915 11.2467 9.41422 11.6218C9.7893 11.9969 10 12.5056 10 13.036V15.6587ZM14.6667 14.992C14.6667 15.1688 14.5964 15.3384 14.4714 15.4634C14.3464 15.5884 14.1768 15.6587 14 15.6587H11.3333V13.036C11.3333 12.1519 10.9822 11.3041 10.357 10.679C9.73191 10.0539 8.88406 9.70267 8.00001 9.70267C7.11595 9.70267 6.26811 10.0539 5.64299 10.679C5.01786 11.3041 4.66667 12.1519 4.66667 13.036V15.6587H2.00001C1.8232 15.6587 1.65363 15.5884 1.5286 15.4634C1.40358 15.3384 1.33334 15.1688 1.33334 14.992V8.44734C1.33396 8.27066 1.40413 8.10133 1.52867 7.976L6.58534 2.92067C6.96114 2.54662 7.46978 2.33663 8.00001 2.33663C8.53023 2.33663 9.03888 2.54662 9.41468 2.92067L14.4713 7.978C14.5954 8.10284 14.6655 8.27135 14.6667 8.44734V14.992Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1809_1480">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0 0.987305)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <Link className={styles.NavigateItem} href="/home">
                Home
              </Link>
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Budgets" ? styles.active : ""
              }`}
              onClick={handleOpenMenuDiv}
            >
              <img src="/postos.svg" className={styles.Pointer} alt="" />

              <Link className={styles.NavigateItem} href="/Budgets">
                Postos
              </Link>
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Requests" ? styles.active : ""
              }`}
              onClick={handleOpenMenuDiv}
            >
              <img src="/supervisores.svg" className={styles.Pointer} alt="" />

              <Link className={styles.NavigateItem} href="/Requests">
                Supervisores
              </Link>
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Users" ? styles.active : ""
              }`}
              onClick={handleOpenMenuDiv}
            >
              <img src="/gerentes.svg" className={styles.Pointer} alt="" />

              <Link className={styles.NavigateItem} href="/Users">
                Gerentes
              </Link>
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Supplier" ? styles.active : ""
              }`}
              onClick={handleOpenMenuDiv}
            >
              <img src="/relatorios.svg" className={styles.Pointer} alt="" />

              <Link className={styles.NavigateItem} href="/Supplier">
                Relatórios
              </Link>
            </div>
          </div>

          <div className={styles.MenuContainer}>
            <p className={styles.Steps}>Parâmetros</p>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Products" ? styles.active : ""
              }`}
            >
              <svg
                className={styles.Pointer}
                width="16"
                height="17"
                viewBox="0 0 16 17"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1809_1500)">
                  <path
                    d="M13 11.654C13 12.0226 12.702 12.3206 12.3333 12.3206H11C10.6313 12.3206 10.3333 12.0226 10.3333 11.654C10.3333 11.2853 10.6313 10.9873 11 10.9873H12.3333C12.702 10.9873 13 11.2853 13 11.654ZM16 10.9873V14.3206C16 15.7913 14.804 16.9873 13.3333 16.9873H2.66667C1.196 16.9873 0 15.7913 0 14.3206V10.9873C0 9.51664 1.196 8.32064 2.66667 8.32064H3.33333V3.65397C3.33333 2.1833 4.52933 0.987305 6 0.987305H10C11.4707 0.987305 12.6667 2.1833 12.6667 3.65397V8.32064H13.3333C14.804 8.32064 16 9.51664 16 10.9873ZM4.66667 8.32064H11.3333V3.65397C11.3333 2.91864 10.7353 2.32064 10 2.32064H6C5.26467 2.32064 4.66667 2.91864 4.66667 3.65397V8.32064ZM2.66667 15.654H7.33333V9.65397H2.66667C1.93133 9.65397 1.33333 10.252 1.33333 10.9873V14.3206C1.33333 15.056 1.93133 15.654 2.66667 15.654ZM14.6667 10.9873C14.6667 10.252 14.0687 9.65397 13.3333 9.65397H8.66667V15.654H13.3333C14.0687 15.654 14.6667 15.056 14.6667 14.3206V10.9873ZM5 10.9873H3.66667C3.298 10.9873 3 11.2853 3 11.654C3 12.0226 3.298 12.3206 3.66667 12.3206H5C5.36867 12.3206 5.66667 12.0226 5.66667 11.654C5.66667 11.2853 5.36867 10.9873 5 10.9873ZM9.33333 4.32064C9.33333 3.95197 9.03533 3.65397 8.66667 3.65397H7.33333C6.96467 3.65397 6.66667 3.95197 6.66667 4.32064C6.66667 4.6893 6.96467 4.9873 7.33333 4.9873H8.66667C9.03533 4.9873 9.33333 4.6893 9.33333 4.32064Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1809_1500">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0 0.987305)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <Link className={styles.NavigateItem} href="/Products">
                Descargas
              </Link>
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/BudgetPerfil" ? styles.active : ""
              }`}
            >
              <img src="./configIcon.svg" className={styles.Pointer}></img>
              <p className={styles.NavigateItem}>Configurações</p>
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/BudgetGlass" ? styles.active : ""
              }`}
            >
              <img src="./contaIcon.svg" className={styles.Pointer}></img>
              <p className={styles.NavigateItem}>Conta</p>
            </div>
          </div>

          <div className={styles.MenuContainer}>
            <p className={styles.Steps}>Ajuda</p>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/BudgetSize" ? styles.active : ""
              }`}
            >
              <img
                src="./centralAjudaIcon.svg"
                className={styles.Pointer}
              ></img>
              <p className={styles.NavigateItem}>Central de Ajuda</p>
            </div>
          </div>

          <div onClick={handleLogout}>
            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/" ? styles.active : ""
              }`}
            >
              <p className={styles.NavigateItemEnd}>Encerrar sessão</p>
              <img src="./Logout.svg" className={styles.PointerEnd}></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
