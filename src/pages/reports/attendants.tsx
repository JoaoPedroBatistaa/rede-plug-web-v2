import HeaderHome from "@/components/HeaderReportsAttendantsDates";
import SideMenuHome from "@/components/SideMenuHome";
import { collection, getDocs, query, where } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const post = router.query.post;

  const [openMenu, setOpenMenu] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let isComponentMounted = true;

    const fetchTasks = async () => {
      if (post) {
        try {
          const q = query(
            collection(db, "ATTENDANTS"),
            where("postName", "==", post)
          );
          const querySnapshot = await getDocs(q);

          // @ts-ignore
          const tasksData = [];
          querySnapshot.forEach((doc) => {
            const taskData = doc.data();
            tasksData.push(taskData);
          });

          // @ts-ignore
          const uniqueDates = [...new Set(tasksData.map((task) => task.date))];
          const uniqueTasks = uniqueDates.map((date) => {
            // @ts-ignore
            const filteredTasks = tasksData.filter(
              (task) => task.date === date
            );
            return {
              date,
              tasks: filteredTasks,
            };
          });

          // @ts-ignore
          setTasks(uniqueTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    fetchTasks();

    return () => {
      isComponentMounted = false;
    };
  }, [post]);

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const day = date.getDate() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Adicionando zeros à esquerda para manter o formato dd/mm/aaaa
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

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
              {tasks
                // @ts-ignore
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Ordenando as datas
                .map((taskGroup, index) => (
                  <div key={index} className={styles.CardMenuDate}>
                    <p className={styles.CardMenuTextDate}>
                      <a
                        href={`/reports/attendants-tasks?post=${encodeURIComponent(
                          // @ts-ignore
                          post
                          // @ts-ignore
                        )}&date=${encodeURIComponent(taskGroup.date)}`}
                      >
                        {
                          // @ts-ignore
                          formatDate(taskGroup.date)
                        }
                      </a>
                    </p>
                  </div>
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
