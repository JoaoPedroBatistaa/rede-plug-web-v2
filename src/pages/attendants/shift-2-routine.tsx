import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.scss";

import HeaderHome from "@/components/HeaderAttendantsShift02";
import SideMenuHome from "@/components/SideMenuHome";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";

export default function Shift1() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    turno1: false,
    encerrantes: false,
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    console.log("Verificando userId e userName...");
    console.log("userId:", userId);
    console.log("userName:", userName);

    if (!userId) {
      console.warn("userId não encontrado no localStorage, redirecionando...");
      router.push("/");
      return;
    }

    const checkTasksCompletion = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        console.log("Data de hoje (ISO):", today);

        // Consulta para o relatório do turno
        console.log("Iniciando consulta para relatório do turno...");
        const turno1Query = query(
          collection(db, "ATTENDANTS"),
          where("date", "==", today),
          where("id", "==", "turno-2"),
          where("postName", "==", userName),
          where("shift", "==", "02")
        );

        // Consulta para encerrantes
        console.log("Iniciando consulta para encerrantes...");
        const encerrantesQuery = query(
          collection(db, "ATTENDANTS"),
          where("date", "==", today),
          where("id", "==", "encerrantes-turno-2"),
          where("postName", "==", userName),
          where("shift", "==", "02")
        );

        const [turno1Snapshot, encerrantesSnapshot] = await Promise.all([
          getDocs(turno1Query),
          getDocs(encerrantesQuery),
        ]);

        console.log(
          "Consulta para turno-1:",
          turno1Snapshot.docs.map((doc) => doc.data())
        );
        console.log(
          "Consulta para encerrantes:",
          encerrantesSnapshot.docs.map((doc) => doc.data())
        );

        setCompletedTasks({
          turno1: !turno1Snapshot.empty,
          encerrantes: !encerrantesSnapshot.empty,
        });
        console.log("Estado atualizado de completedTasks:", {
          turno1: !turno1Snapshot.empty,
          encerrantes: !encerrantesSnapshot.empty,
        });
      } catch (error) {
        console.error("Erro ao verificar tarefas concluídas:", error);
      }
    };

    checkTasksCompletion();
  }, [router]);

  // Função para navegação ao clicar nos cards
  const handleNavigation = (path: string, isCompleted: boolean) => {
    console.log(`Tentativa de navegação para: ${path}`);
    if (isCompleted) {
      alert("Tarefa já concluída.");
      return;
    }
    console.log("Navegação permitida, redirecionando...");
    router.push(path);
  };

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        `}</style>

        <title>Turno 2 - Rede Postos</title>
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
              {/* Relatório do Turno */}
              <div
                onClick={() =>
                  handleNavigation("/attendants/shift-2", completedTasks.turno1)
                }
                className={`${styles.CardMenu} ${
                  completedTasks.turno1 ? styles.finished : ""
                }`}
              >
                <span
                  className={`${styles.CardMenuText} ${
                    completedTasks.encerrantes ? styles.finished : ""
                  }`}
                >
                  RELATÓRIO DO TURNO
                </span>
              </div>

              {/* Encerrantes */}
              <div
                onClick={() =>
                  handleNavigation(
                    "/attendants/nozzle-closure-2",
                    completedTasks.encerrantes
                  )
                }
                className={`${styles.CardMenu} ${
                  completedTasks.encerrantes ? styles.finished : ""
                }`}
              >
                <span
                  className={`${styles.CardMenuText} ${
                    completedTasks.encerrantes ? styles.finished : ""
                  }`}
                >
                  ENCERRANTES
                </span>
              </div>
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Rede Postos 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
