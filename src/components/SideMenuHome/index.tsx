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
              <img src="./LogoMenu.png" className={styles.Logo} />
            </div>

            <p className={styles.Steps}>Menu Principal</p>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Home" ? styles.active : ""
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
              {/* <img src="./homeIconMenu.svg" className={styles.Pointer}></img> */}
              {/* <p className={styles.NavigateItem}>Home</p> */}
              <Link className={styles.NavigateItem} href="/Home">
                Home
              </Link>
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Budgets" ? styles.active : ""
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
                <g clip-path="url(#clip0_1809_1484)">
                  <path
                    d="M16 5.65401V6.32068C16 6.68868 15.702 6.98735 15.3333 6.98735C14.9647 6.98735 14.6667 6.68868 14.6667 6.32068V5.65401C14.6667 4.55135 13.7693 3.65401 12.6667 3.65401H3.33333C2.23067 3.65401 1.33333 4.55135 1.33333 5.65401V12.3207C1.33333 13.4233 2.23067 14.3207 3.33333 14.3207H5.33333C5.702 14.3207 6 14.6193 6 14.9873C6 15.3553 5.702 15.654 5.33333 15.654H3.33333C1.49533 15.654 0 14.1587 0 12.3207V5.65401C0 3.81601 1.49533 2.32068 3.33333 2.32068H12.6667C14.5047 2.32068 16 3.81601 16 5.65401ZM10 6.98735H12.6667C13.0353 6.98735 13.3333 6.68868 13.3333 6.32068C13.3333 5.95268 13.0353 5.65401 12.6667 5.65401H10C9.63133 5.65401 9.33333 5.95268 9.33333 6.32068C9.33333 6.68868 9.63133 6.98735 10 6.98735ZM15.414 8.90668C15.7913 9.28401 16 9.78668 16 10.3207C16 10.8547 15.7913 11.3573 15.414 11.7353L10.9427 16.2067C10.4393 16.71 9.76933 16.988 9.05733 16.988H8C7.63133 16.988 7.33333 16.6893 7.33333 16.3213V15.264C7.33333 14.552 7.61067 13.882 8.11467 13.3787L12.586 8.90735C13.366 8.12735 14.634 8.12735 15.414 8.90735V8.90668ZM14.6667 10.3207C14.6667 10.1427 14.5973 9.97535 14.4713 9.84935C14.2107 9.58868 13.7893 9.58935 13.5287 9.84935L9.05733 14.3207C8.80933 14.5693 8.66667 14.9127 8.66667 15.2633V15.654H9.05733C9.41333 15.654 9.748 15.5153 10 15.2633L14.4713 10.792C14.5973 10.666 14.6667 10.4987 14.6667 10.3207ZM6 10.9873H4.488C4.25067 10.9873 4.02933 10.8593 3.91 10.654C3.72667 10.3347 3.31933 10.2247 2.99933 10.4107C2.68067 10.5953 2.57133 11.0027 2.75667 11.3213C3.11267 11.938 3.77667 12.3207 4.48867 12.3207H4.66733C4.66733 12.6887 4.96533 12.9873 5.334 12.9873C5.70267 12.9873 6.00067 12.6887 6.00067 12.3207C7.10333 12.3207 8.00067 11.4233 8.00067 10.3207C8.00067 9.41401 7.35133 8.64735 6.45733 8.49868L4.43 8.16068C4.18133 8.11935 4.00067 7.90601 4.00067 7.65401C4.00067 7.28668 4.29933 6.98735 4.66733 6.98735H6.17933C6.41667 6.98735 6.638 7.11535 6.75733 7.32068C6.94067 7.63935 7.34733 7.74868 7.668 7.56401C7.98667 7.37935 8.096 6.97201 7.91067 6.65335C7.55467 6.03668 6.89067 5.65335 6.17867 5.65335H6C6 5.28535 5.702 4.98668 5.33333 4.98668C4.96467 4.98668 4.66667 5.28535 4.66667 5.65335C3.564 5.65335 2.66667 6.55068 2.66667 7.65335C2.66667 8.56001 3.316 9.32668 4.21 9.47535L6.23733 9.81335C6.486 9.85468 6.66667 10.068 6.66667 10.32C6.66667 10.6873 6.368 10.9867 6 10.9867V10.9873ZM9.33333 8.98735C9.33333 9.35535 9.632 9.65401 10 9.65401C10.368 9.65401 10.6667 9.35535 10.6667 8.98735C10.6667 8.61935 10.368 8.32068 10 8.32068C9.632 8.32068 9.33333 8.61935 9.33333 8.98735Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1809_1484">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0 0.987305)"
                    />
                  </clipPath>
                </defs>
              </svg>

              {/* <img src="./orcamentoIcon.svg" className={styles.Pointer}></img> */}
              {/* <
              p className={styles.NavigateItem}>Orçamentos</p> */}
              <Link className={styles.NavigateItem} href="/Budgets">
                Orçamentos
              </Link>
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Requests" ? styles.active : ""
              }`}
              onClick={handleOpenMenuDiv}
            >
              <svg
                className={styles.Pointer}
                width="16"
                height="17"
                viewBox="0 0 16 17"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1809_1488)">
                  <path
                    d="M10.6667 0.987305H5.33333C4.4496 0.988363 3.60237 1.33989 2.97748 1.96478C2.35259 2.58968 2.00106 3.43691 2 4.32064V16.3206C2.00009 16.4419 2.03326 16.5608 2.09592 16.6646C2.15858 16.7685 2.24837 16.8532 2.35563 16.9098C2.46288 16.9664 2.58353 16.9926 2.70459 16.9857C2.82565 16.9788 2.94254 16.939 3.04267 16.8706L4.44667 15.9113L5.85067 16.8706C5.96159 16.9466 6.09289 16.9872 6.22733 16.9872C6.36177 16.9872 6.49307 16.9466 6.604 16.8706L8.004 15.9113L9.404 16.8706C9.51499 16.9467 9.64642 16.9875 9.781 16.9875C9.91558 16.9875 10.047 16.9467 10.158 16.8706L11.558 15.912L12.958 16.87C13.0581 16.9381 13.1748 16.9778 13.2957 16.9846C13.4166 16.9914 13.5371 16.9652 13.6442 16.9087C13.7514 16.8523 13.8411 16.7677 13.9038 16.6641C13.9664 16.5605 13.9997 16.4417 14 16.3206V4.32064C13.9989 3.43691 13.6474 2.58968 13.0225 1.96478C12.3976 1.33989 11.5504 0.988363 10.6667 0.987305ZM12.6667 15.054L11.9333 14.5526C11.8223 14.4764 11.6907 14.4356 11.556 14.4356C11.4213 14.4356 11.2897 14.4764 11.1787 14.5526L9.77867 15.512L8.37867 14.5526C8.26767 14.4765 8.13625 14.4358 8.00167 14.4358C7.86709 14.4358 7.73566 14.4765 7.62467 14.5526L6.22467 15.512L4.82467 14.5526C4.71381 14.4768 4.58264 14.4363 4.44833 14.4363C4.31403 14.4363 4.18286 14.4768 4.072 14.5526L3.33333 15.054V4.32064C3.33333 3.79021 3.54405 3.2815 3.91912 2.90642C4.29419 2.53135 4.8029 2.32064 5.33333 2.32064H10.6667C11.1971 2.32064 11.7058 2.53135 12.0809 2.90642C12.456 3.2815 12.6667 3.79021 12.6667 4.32064V15.054Z"
                    fill=""
                  />
                  <path
                    d="M10.666 6.32068H5.33268C4.96449 6.32068 4.66602 6.61916 4.66602 6.98735C4.66602 7.35554 4.96449 7.65401 5.33268 7.65401H10.666C11.0342 7.65401 11.3327 7.35554 11.3327 6.98735C11.3327 6.61916 11.0342 6.32068 10.666 6.32068Z"
                    fill="#7C0000"
                  />
                  <path
                    d="M9.33268 8.9873H5.33268C4.96449 8.9873 4.66602 9.28578 4.66602 9.65397C4.66602 10.0222 4.96449 10.3206 5.33268 10.3206H9.33268C9.70087 10.3206 9.99935 10.0222 9.99935 9.65397C9.99935 9.28578 9.70087 8.9873 9.33268 8.9873Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1809_1488">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0 0.987305)"
                    />
                  </clipPath>
                </defs>
              </svg>

              {/* <img src="./pedidosIcon.svg" className={styles.Pointer}></img> */}
              <Link className={styles.NavigateItem} href="/Requests">
                Pedidos
              </Link>
              {/* <p className={styles.NavigateItem}>Pedidos</p> */}
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Supplier" ? styles.active : ""
              }`}
              onClick={handleOpenMenuDiv}
            >
              <svg
                className={styles.Pointer}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2V3.828L0.5 5.828V6C0.5 6.8225 1.1775 7.5 2 7.5V14H14V7.5C14.8225 7.5 15.5 6.8225 15.5 6V5.828L14 3.828V2H2ZM3 3H13V3.5H3V3ZM2.75 4.5H13.25L14.453 6.1095C14.3985 6.326 14.2345 6.5 14 6.5C13.7225 6.5 13.5 6.2775 13.5 6H12.5C12.5 6.2775 12.2775 6.5 12 6.5C11.7225 6.5 11.5 6.2775 11.5 6H10.5C10.5 6.2775 10.2775 6.5 10 6.5C9.7225 6.5 9.5 6.2775 9.5 6H8.5C8.5 6.2775 8.2775 6.5 8 6.5C7.7225 6.5 7.5 6.2775 7.5 6H6.5C6.5 6.2775 6.2775 6.5 6 6.5C5.7225 6.5 5.5 6.2775 5.5 6H4.5C4.5 6.2775 4.2775 6.5 4 6.5C3.7225 6.5 3.5 6.2775 3.5 6H2.5C2.5 6.2775 2.2775 6.5 2 6.5C1.7655 6.5 1.6015 6.326 1.547 6.1095L2.75 4.5ZM3 7.1095C3.2655 7.3495 3.617 7.5 4 7.5C4.383 7.5 4.7345 7.3495 5 7.1095C5.2655 7.3495 5.617 7.5 6 7.5C6.383 7.5 6.7345 7.3495 7 7.1095C7.2655 7.3495 7.617 7.5 8 7.5C8.383 7.5 8.7345 7.3495 9 7.1095C9.2655 7.3495 9.617 7.5 10 7.5C10.383 7.5 10.7345 7.3495 11 7.1095C11.2655 7.3495 11.617 7.5 12 7.5C12.383 7.5 12.7345 7.3495 13 7.1095V10.5H3V7.1095ZM3 11.5H13V13H3V11.5Z"
                  fill=""
                />
              </svg>

              {/* <img src="./pedidosIcon.svg" className={styles.Pointer}></img> */}
              <Link className={styles.NavigateItem} href="/Supplier">
                Fornecedor
              </Link>
              {/* <p className={styles.NavigateItem}>Pedidos</p> */}
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/Cliente" ? styles.active : ""
              }`}
              onClick={handleOpenMenuDiv}
            >
              <svg
                className={styles.Pointer}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_45_10)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.99993 1.33325C11.6819 1.33325 14.6666 4.31792 14.6666 7.99992C14.6689 9.53852 14.1369 11.0302 13.1613 12.2199L13.1746 12.2346L13.0866 12.3093C12.4614 13.0487 11.6823 13.6428 10.8037 14.05C9.92515 14.4571 8.96827 14.6676 7.99993 14.6666C6.03326 14.6666 4.26659 13.8153 3.04659 12.4619L2.91326 12.3086L2.82526 12.2353L2.83859 12.2193C1.8631 11.0297 1.33101 9.5383 1.33326 7.99992C1.33326 4.31792 4.31793 1.33325 7.99993 1.33325ZM7.99993 11.3333C6.75993 11.3333 5.63926 11.7279 4.80459 12.2699C5.72612 12.9617 6.84766 13.3349 7.99993 13.3333C9.1522 13.3349 10.2737 12.9617 11.1953 12.2699C10.2414 11.659 9.13262 11.334 7.99993 11.3333ZM7.99993 2.66659C6.99627 2.66656 6.01298 2.94973 5.16307 3.48355C4.31316 4.01738 3.63113 4.78018 3.19537 5.6843C2.7596 6.58842 2.5878 7.59714 2.69969 8.59454C2.81159 9.59193 3.20265 10.5375 3.82793 11.3226C4.90859 10.5473 6.38326 9.99992 7.99993 9.99992C9.61659 9.99992 11.0913 10.5473 12.1719 11.3226C12.7972 10.5375 13.1883 9.59193 13.3002 8.59454C13.4121 7.59714 13.2403 6.58842 12.8045 5.6843C12.3687 4.78018 11.6867 4.01738 10.8368 3.48355C9.98687 2.94973 9.00358 2.66656 7.99993 2.66659ZM7.99993 3.99992C8.70717 3.99992 9.38545 4.28087 9.88554 4.78097C10.3856 5.28106 10.6666 5.95934 10.6666 6.66659C10.6666 7.37383 10.3856 8.05211 9.88554 8.5522C9.38545 9.0523 8.70717 9.33325 7.99993 9.33325C7.29268 9.33325 6.6144 9.0523 6.11431 8.5522C5.61421 8.05211 5.33326 7.37383 5.33326 6.66659C5.33326 5.95934 5.61421 5.28106 6.11431 4.78097C6.6144 4.28087 7.29268 3.99992 7.99993 3.99992ZM7.99993 5.33325C7.6463 5.33325 7.30717 5.47373 7.05712 5.72378C6.80707 5.97383 6.66659 6.31296 6.66659 6.66659C6.66659 7.02021 6.80707 7.35935 7.05712 7.60939C7.30717 7.85944 7.6463 7.99992 7.99993 7.99992C8.35355 7.99992 8.69269 7.85944 8.94273 7.60939C9.19278 7.35935 9.33326 7.02021 9.33326 6.66659C9.33326 6.31296 9.19278 5.97383 8.94273 5.72378C8.69269 5.47373 8.35355 5.33325 7.99993 5.33325Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_45_10">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              {/* <img src="./pedidosIcon.svg" className={styles.Pointer}></img> */}
              <Link className={styles.NavigateItem} href="/Cliente">
                Clientes
              </Link>
              {/* <p className={styles.NavigateItem}>Pedidos</p> */}
            </div>

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/BudgetFoam" ? styles.active : ""
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

              {/* <img src="./produtosIcon.svg" className={styles.Pointer}></img> */}
              <Link className={styles.NavigateItem} href="/Products">
                Produtos
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

            <div
              className={`${styles.MenuNavigate} ${
                activeRoute === "/BudgetFoam" ? styles.active : ""
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

            <div className={styles.linha}></div>
          </div>

          <div>
            <Link href="/Login">
              <div
                className={`${styles.MenuNavigate} ${
                  activeRoute === "/BudgetSize" ? styles.active : ""
                }`}
              >
                <p className={styles.NavigateItemEnd}>Encerrar sessão</p>
                <img src="./Logout.svg" className={styles.PointerEnd}></img>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
