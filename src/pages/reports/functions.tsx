import HeaderHome from "@/components/HeaderReportsFunctions";
import SideMenuHome from "@/components/SideMenuHome";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
        <title>Rede Plug</title>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome
          activeRoute={router.pathname}
          openMenu={false} // Não há necessidade de usar useState para openMenu
        ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderHome></HeaderHome>
          <div className={styles.CardsMenusContainer}>
            <div className={styles.CardsMenus}>
              <Link
                href={{
                  pathname: "/reports/managers", // @ts-ignore
                  query: { post: router.query.post },
                }}
              >
                <div className={styles.CardMenu}>
                  <img src="/supervisoresHome.svg" alt="Gerentes" />
                  <span className={styles.CardMenuText}>Gerentes</span>
                </div>
              </Link>
              <Link
                href={{
                  pathname: "/reports/attendants", // @ts-ignore
                  query: { post: router.query.post },
                }}
              >
                <div className={styles.CardMenu}>
                  <img src="/supervisoresHome.svg" alt="Frentistas" />
                  <span className={styles.CardMenuText}>Frentistas</span>
                </div>
              </Link>
              <Link
                href={{
                  pathname: "/reports/supervisors",
                  // @ts-ignore
                  query: { post: router.query.post },
                }}
              >
                <div className={styles.CardMenu}>
                  <img src="/supervisoresHome.svg" alt="Supervisores" />
                  <span className={styles.CardMenuText}>Supervisores</span>
                </div>
              </Link>
            </div>
          </div>

          <div className={styles.Copyrigt}>
            <p className={styles.Copy}>
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
