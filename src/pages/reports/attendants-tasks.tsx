import HeaderHome from "@/components/HeaderReportsAttendantsTasks";
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const { post, date } = router.query;

  const [openMenu, setOpenMenu] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskLinks, setTaskLinks] = useState({});

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

    const fetchTasks = async () => {
      if (post && date) {
        try {
          const q = query(
            collection(db, "ATTENDANTS"),
            where("postName", "==", post),
            where("date", "==", date)
          );
          const querySnapshot = await getDocs(q);

          // @ts-ignore
          const tasksData = [];
          querySnapshot.forEach((doc) => {
            const taskData = doc.data();
            const taskWithDocId = { ...taskData, docId: doc.id }; // Adiciona o docId à tarefa
            tasksData.push(taskWithDocId);
          });

          // @ts-ignore
          setTasks(tasksData);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    const taskLinksData = {
      "turno-1": {
        id: "turno-1",
        name: "Relatório Turno 1",
        link: "/attendants/shift-1",
      },
      "turno-2": {
        id: "turno-2",
        name: "Relatório Turno 2",
        link: "/attendants/shift-2",
      },
      "turno-3": {
        id: "turno-3",
        name: "Relatório Turno 3",
        link: "/attendants/shift-3",
      },
      "turno-4": {
        id: "turno-4",
        name: "Relatório Turno 4",
        link: "/attendants/shift-4",
      },
      "turno-5": {
        id: "turno-5",
        name: "Relatório Turno 5",
        link: "/attendants/shift-5",
      },
      "turno-6": {
        id: "turno-6",
        name: "Relatório Turno 6",
        link: "/attendants/shift-6",
      },
    };

    setTaskLinks(taskLinksData);

    fetchTasks();

    return () => {
      isComponentMounted = false;
    };
  }, [post, date]);

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
          openMenu={openMenu}
        ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderHome></HeaderHome>
          <div className={styles.CardsMenusContainer}>
            <div className={styles.CardsMenus}>
              {Object.values(taskLinks).map((taskLink) => {
                const taskIndex = tasks.findIndex(
                  // @ts-ignore
                  (task) => task.id === taskLink.id
                );
                const isTaskExist = taskIndex !== -1;
                const task = isTaskExist ? tasks[taskIndex] : null;
                return (
                  <div
                    key={
                      // @ts-ignore
                      taskLink.id
                    }
                    className={`${styles.CardMenuDate} ${
                      isTaskExist ? styles.GreenText : styles.RedText
                    }`}
                  >
                    {isTaskExist ? (
                      <a
                        // @ts-ignore
                        href={`${taskLink.link}?docId=${task.docId}`} // Passa o docId como query
                        className={`${styles.CardMenuTextDate} ${
                          isTaskExist ? styles.GreenText : styles.RedText
                        }`}
                      >
                        {
                          // @ts-ignore
                          taskLink.name
                        }
                      </a>
                    ) : (
                      <span
                        className={`${styles.CardMenuTextDate} ${
                          isTaskExist ? styles.GreenText : styles.RedText
                        }`}
                      >
                        {
                          // @ts-ignore
                          taskLink.name
                        }
                      </span>
                    )}
                  </div>
                );
              })}
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
