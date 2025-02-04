import HeaderHome from "@/components/HeaderSupervisors";
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
import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";
import styles from "../styles/Home.module.scss";

interface PostOption {
  label: string;
  value: string;
}

interface RoutineDay {
  date: string;
  firstShift: PostOption | null;
  secondShift: PostOption | null;
}

interface WeekRoutine {
  week: RoutineDay[];
  isFromDatabase: boolean;
}

interface Task {
  id: string;
  route: string;
}

export default function Home() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [routine, setRoutine] = useState<WeekRoutine[]>([]);
  const [currentDayRoutine, setCurrentDayRoutine] = useState<RoutineDay | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);

  const tasksOrder: Task[] = [
    { id: "digital_point", route: "/supervisors/point" },
    { id: "caixa-surpresa", route: "/supervisors/surprise-box" },
    { id: "uniformes", route: "/supervisors/uniforms" },
    { id: "atendimento", route: "/supervisors/service" },
    { id: "limpeza-pista", route: "/supervisors/track-cleaning" },
    { id: "limpeza-bombas", route: "/supervisors/bombs-cleaning" },
    { id: "limpeza-testeiras", route: "/supervisors/front-cleaning" },
    { id: "limpeza-banheiros", route: "/supervisors/bathroom-cleaning" },
    { id: "vestiario", route: "/supervisors/locker-room" },
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    if (!storedUserId) {
      router.push("/");
      return;
    }

    const fetchRoutine = async () => {
      try {
        const docRef = doc(db, "USERS", storedUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const routineData = userData.routine || [];
          setRoutine(routineData);

          const today = new Date().toISOString().split("T")[0];
          const todayRoutine = routineData
            .flatMap((week: WeekRoutine) => week.week)
            .find((day: RoutineDay) => day.date === today);

          setCurrentDayRoutine(todayRoutine || null);
        }
      } catch (error) {
        console.error("Erro ao buscar rotina:", error);
      }
    };

    fetchRoutine();
  }, [router]);

  const getCompletedTasks = useCallback(
    async (shift: "firstShift" | "secondShift", date: string) => {
      const userName = localStorage.getItem("userName");
      if (!userName) return [];

      const collectionRef = collection(db, "SUPERVISORS");
      const querySnapshot = await getDocs(
        query(
          collectionRef,
          where("date", "==", date),
          where("shift", "==", shift),
          where("supervisorName", "==", userName)
        )
      );

      return querySnapshot.docs.map((doc) => doc.data().id);
    },
    []
  );

  const getNextTask = useCallback(
    async (shift: "firstShift" | "secondShift", date: string) => {
      const completedTasks = await getCompletedTasks(shift, date);
      return (
        tasksOrder.find((task) => !completedTasks.includes(task.id))?.route ||
        null
      );
    },
    [getCompletedTasks, tasksOrder]
  );

  const handleCardClick = async (shift: "firstShift" | "secondShift") => {
    if (!currentDayRoutine || !currentDayRoutine[shift]) return;

    const now = new Date();
    const hour = now.getHours();
    if (
      (shift === "firstShift" && (hour < 8 || hour >= 14)) ||
      (shift === "secondShift" && (hour < 14 || hour >= 22))
    ) {
      alert("Fora do horário permitido para este turno.");
      return;
    }

    const nextTaskRoute = await getNextTask(shift, currentDayRoutine.date);
    if (nextTaskRoute) {
      router.push(
        `${nextTaskRoute}?post=${encodeURIComponent(
          currentDayRoutine[shift]?.label || ""
        )}&shift=${shift}`
      );
    } else {
      alert("Todas as tarefas já foram concluídas.");
    }
  };

  return (
    <>
      <Head>
        <title>Rede Postos</title>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome activeRoute={router.pathname} openMenu={openMenu} />
        <div className={styles.OrderContainer}>
          <HeaderHome />
          <div className={styles.CardsMenusContainer}>
            <div className={styles.CardsMenus}>
              {currentDayRoutine ? (
                ["firstShift", "secondShift"].map(
                  (shift) =>
                    // @ts-ignore
                    currentDayRoutine[shift] && (
                      <div
                        key={shift}
                        className={styles.CardMenu}
                        // @ts-ignore
                        onClick={() => handleCardClick(shift)}
                      >
                        <span className={styles.CardMenuText}>
                          {shift === "firstShift" ? "08-14h" : "14-22h"}:{" "}
                          {
                            // @ts-ignore
                            currentDayRoutine[shift]?.label
                          }
                        </span>
                      </div>
                    )
                )
              ) : (
                <div className={styles.CardMenu}>
                  <span className={styles.CardMenuText}>Sem postos hoje</span>
                </div>
              )}
            </div>
          </div>
          <p className={styles.Copy}>
            © Rede Postos 2024, todos os direitos reservados
          </p>
        </div>
      </div>
    </>
  );
}
