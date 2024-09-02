import HeaderHome from "@/components/HeaderReportsFunctions";
import SideMenuHome from "@/components/SideMenuHome";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { db } from "../../../firebase";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkForUpdates = async () => {
      console.log("Checking for updates...");
      const updateDoc = doc(db, "UPDATE", "Lp8egidKNeHs9jQ8ozvs");
      try {
        const updateSnapshot = await getDoc(updateDoc);
        const updateData = updateSnapshot.data();

        if (updateData) {
          console.log("Update data retrieved:", updateData);
          const { date: updateDate, time: updateTime } = updateData;
          const storedDate = localStorage.getItem("loginDate");
          const storedTime = localStorage.getItem("loginTime");

          if (storedDate && storedTime) {
            console.log("Stored date and time:", storedDate, storedTime);
            const updateDateTime = new Date(
              `${updateDate.replace(/\//g, "-")}T${updateTime}`
            );
            const storedDateTime = new Date(`${storedDate}T${storedTime}`);

            console.log("Update date and time:", updateDateTime);
            console.log("Stored date and time:", storedDateTime);

            const now = new Date();
            const date = now
              .toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })
              .split("/")
              .reverse()
              .join("-");
            const time = now.toLocaleTimeString("pt-BR", {
              hour12: false,
              timeZone: "America/Sao_Paulo",
            });

            if (
              !isNaN(updateDateTime.getTime()) &&
              !isNaN(storedDateTime.getTime())
            ) {
              if (storedDateTime < updateDateTime) {
                console.log(
                  "Stored data is outdated. Clearing cache and reloading..."
                );
                // Clear cache and reload
                caches
                  .keys()
                  .then((names) => {
                    for (let name of names) caches.delete(name);
                  })
                  .then(() => {
                    localStorage.setItem("loginDate", date);
                    localStorage.setItem("loginTime", time);
                    alert("O sistema agora está na versão mais recente");
                    window.location.reload();
                  });
              } else {
                console.log("Stored data is up to date.");
              }
            } else {
              console.log("Invalid date/time format detected.");
            }
          } else {
            console.log("No stored date and time found.");
          }
        } else {
          console.log("No update data found in the database.");
        }
      } catch (error) {
        console.error("Error fetching update document:", error);
      }
    };

    checkForUpdates();
  }, []);

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
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
