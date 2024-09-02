import HeaderHome from "@/components/HeaderReportsAttendantsTasks";
import SideMenuHome from "@/components/SideMenuHome";
import { collection, getDocs, query, where } from "firebase/firestore";
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
    const checkLoginDuration = () => {
      console.log("Checking login duration...");
      const storedDate = localStorage.getItem("loginDate");
      const storedTime = localStorage.getItem("loginTime");

      if (storedDate && storedTime) {
        const storedDateTime = new Date(`${storedDate}T${storedTime}`);
        console.log("Stored login date and time:", storedDateTime);

        const now = new Date();
        const maxLoginDuration = 6 * 60 * 60 * 1000;

        if (now.getTime() - storedDateTime.getTime() > maxLoginDuration) {
          console.log("Login duration exceeded 60 seconds. Logging out...");

          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          localStorage.removeItem("userType");
          localStorage.removeItem("userPost");
          localStorage.removeItem("posts");
          localStorage.removeItem("loginDate");
          localStorage.removeItem("loginTime");

          alert("Sua sessão expirou. Por favor, faça login novamente.");
          window.location.href = "/";
        } else {
          console.log("Login duration within limits.");
        }
      } else {
        console.log("No stored login date and time found.");
      }
    };

    checkLoginDuration();
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
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
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
