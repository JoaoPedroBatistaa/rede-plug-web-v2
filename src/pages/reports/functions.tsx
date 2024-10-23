import HeaderHome from "@/components/HeaderReportsFunctions";
import SideMenuHome from "@/components/SideMenuHome";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  // //   const checkLoginDuration = () => {
  // //     console.log("Checking login duration...");
  // //     const storedDate = localStorage.getItem("loginDate");
  // //     const storedTime = localStorage.getItem("loginTime");

  // //     if (storedDate && storedTime) {
  // //       const storedDateTime = new Date(`${storedDate}T${storedTime}`);
  // //       console.log("Stored login date and time:", storedDateTime);

  // //       const now = new Date();
  // //       const maxLoginDuration = 6 * 60 * 60 * 1000;

  // //       if (now.getTime() - storedDateTime.getTime() > maxLoginDuration) {
  // //         console.log("Login duration exceeded 60 seconds. Logging out...");

  // //         localStorage.removeItem("userId");
  // //         localStorage.removeItem("userName");
  // //         localStorage.removeItem("userType");
  // //         localStorage.removeItem("userPost");
  // //         localStorage.removeItem("posts");
  // //         localStorage.removeItem("loginDate");
  // //         localStorage.removeItem("loginTime");

  // //         alert("Sua sessão expirou. Por favor, faça login novamente.");
  // //         window.location.href = "/";
  // //       } else {
  // //         console.log("Login duration within limits.");
  // //       }
  // //     } else {
  // //       console.log("No stored login date and time found.");
  // //     }
  // //   };

  // //   checkLoginDuration();
  // // }, []);

  return (
    <>
      <Head>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
`}</style>

        <title>Rede Postos</title>
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
                  pathname: "/discharges", // @ts-ignore
                  query: { post: router.query.post },
                }}
              >
                <div className={styles.CardMenu}>
                  <img src="/supervisoresHome.svg" alt="Gerentes" />
                  <span className={styles.CardMenuText}>Descargas</span>
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
              © Rede Postos 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
