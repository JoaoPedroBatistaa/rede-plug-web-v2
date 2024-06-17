import HeaderHome from "@/components/HeaderReportsManagersTasks";
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
  const { post, managerName, date } = router.query;

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
      if (managerName && date) {
        try {
          const q = query(
            collection(db, "MANAGERS"),
            where("managerName", "==", managerName),
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
      "medicao-tanques-6h": {
        id: "medicao-tanques-6h",
        name: "Medição dos Tanques 6h",
        link: "/managers/tank-measurement-six",
      },
      "encerrante-bico-6h": {
        id: "encerrante-bico-6h",
        name: "Encerrantes 6h",
        link: "/managers/nozzle-closure-six",
      },
      "teste-combustiveis-6h": {
        id: "teste-combustiveis-6h",
        name: "Teste dos Combustíveis 6h",
        link: "/managers/fuel-test-six",
      },
      "teste-game-proveta-6h": {
        id: "teste-game-proveta-6h",
        name: "Teste do Game 6h",
        link: "/managers/game-test-six",
      },
      "foto-maquininhas-6h": {
        id: "foto-maquininhas-6h",
        name: "Maquininhas 6h",
        link: "/managers/photo-machines-six",
      },
      "quarto-caixa-6h": {
        id: "quarto-caixa-6h",
        name: "4° Caixa 6h",
        link: "/managers/fourth-cashier-six",
      },
      "controle-tanque-6h": {
        id: "controle-tanque-6h",
        name: "Controle de Tanque 6h",
        link: "/managers/tank-control-six",
      },
      "recolhe-6h": {
        id: "recolhe-6h",
        name: "Recolhe 6h",
        link: "/managers/collect-six",
      },
      "quantidade-vendida-dia-anterior-6h": {
        id: "quantidade-vendida-dia-anterior-6h",
        name: "Vendas do Dia Anterior",
        link: "/managers/yesterday-sales-volume-six",
      },
      "preco-concorrentes-6h": {
        id: "preco-concorrentes-6h",
        name: "Preço dos Concorrentes",
        link: "/managers/competitors-price-six",
      },
      "medicao-tanques-14h": {
        id: "medicao-tanques-14h",
        name: "Medição dos Tanques 14h",
        link: "/managers/tank-measurement-fourteen",
      },
      "encerrante-bico-14h": {
        id: "encerrante-bico-14h",
        name: "Encerrantes 14h",
        link: "/managers/nozzle-closure-fourteen",
      },
      "teste-game-proveta-14h": {
        id: "teste-game-proveta-14h",
        name: "Teste do game 14h",
        link: "/managers/game-test-fourteen",
      },
      "teste-combustiveis-14h": {
        id: "teste-combustiveis-14h",
        name: "Teste dos combustíveis 14h",
        link: "/managers/fuel-test-fourteen",
      },
      "foto-maquininhas-14h": {
        id: "foto-maquininhas-14h",
        name: "Maquininhas 14h",
        link: "/managers/photo-machines-fourteen",
      },
      "verificacao-cavaletes-14h": {
        id: "verificacao-cavaletes-14h",
        name: "Cavaletes",
        link: "/managers/easel-fourteen",
      },
      "medicao-tanques-22h": {
        id: "medicao-tanques-22h",
        name: "Medição dos Tanques 22h",
        link: "/managers/tank-measurement-twenty-two",
      },
      "encerrante-bico-22h": {
        id: "encerrante-bico-22h",
        name: "Encerrantes 22h",
        link: "/managers/nozzle-closure-twenty-two",
      },
      "foto-maquininhas-22h": {
        id: "foto-maquininhas-22h",
        name: "Maquininhas 22h",
        link: "/managers/photo-machines-twenty-two",
      },
    };

    setTaskLinks(taskLinksData);

    fetchTasks();

    return () => {
      isComponentMounted = false;
    };
  }, [managerName, date]);

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
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
