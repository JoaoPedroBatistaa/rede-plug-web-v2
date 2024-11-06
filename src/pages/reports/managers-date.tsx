import HeaderHome from "@/components/HeaderReportsManagersDates";
import SideMenuHome from "@/components/SideMenuHome";
import { collection, getDocs, query, where } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const { post, managerName } = router.query;

  const [openMenu, setOpenMenu] = useState(false);
  const [tasks, setTasks] = useState([]);

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

  useEffect(() => {
    let isComponentMounted = true;

    const fetchTasks = async () => {
      if (post && managerName) {
        try {
          const q = query(
            collection(db, "MANAGERS"),
            where("managerName", "==", managerName)
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
  }, [post, managerName]);

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
              {tasks
                // @ts-ignore
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Ordenando as datas
                .map((taskGroup, index) => (
                  <div key={index} className={styles.CardMenu}>
                    <p className={styles.CardMenuText}>
                      <a
                        href={`/reports/managers-tasks?post=${encodeURIComponent(
                          // @ts-ignore
                          post
                        )}&managerName=${encodeURIComponent(
                          // @ts-ignore
                          managerName
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
              © Rede Postos 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
