import HeaderHome from "@/components/HeaderReportsManagers";
import SideMenuHome from "@/components/SideMenuHome";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const post = router.query.post;

  const [openMenu, setOpenMenu] = useState(false);
  const [managers, setManagers] = useState([]);

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

  useEffect(() => {
    let isComponentMounted = true;

    const fetchManagers = async () => {
      if (post) {
        try {
          const q = query(collection(db, "POSTS"), where("name", "==", post));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const postData = querySnapshot.docs[0].data();

            if (postData && postData.managers) {
              // Extrair os gerentes do campo 'managers'
              const managersData = postData.managers;
              setManagers(managersData);
            }
          }
        } catch (error) {
          console.error("Error fetching managers:", error);
        }
      }
    };

    fetchManagers();

    return () => {
      isComponentMounted = false;
    };
  }, [post]);

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
          openMenu={openMenu}
        ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderHome></HeaderHome>
          <div className={styles.CardsMenusContainer}>
            <div className={styles.CardsMenus}>
              {managers.map((manager, index) => (
                <Link
                  key={index}
                  href={{
                    pathname: "/reports/managers-date",
                    query: {
                      post: router.query.post,
                      // @ts-ignore
                      managerName: manager.managerName,
                    },
                  }}
                >
                  <div className={styles.CardMenu}>
                    <img src="/supervisoresHome.svg" alt="Gerente" />
                    <span className={styles.CardMenuText}>
                      {
                        // @ts-ignore
                        manager.managerName
                      }
                    </span>
                  </div>
                </Link>
              ))}
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
