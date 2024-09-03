import HeaderHome from "@/components/HeaderSupervisors";
import SideMenuHome from "@/components/SideMenuHome";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../firebase"; // Certifique-se de que o caminho para o seu firebase.js esteja correto
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

export default function Home() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [routine, setRoutine] = useState<WeekRoutine[]>([]);
  const [currentDayRoutine, setCurrentDayRoutine] = useState<RoutineDay | null>(
    null
  );

  useEffect(() => {
    const checkLoginDuration = () => {
      const storedDate = localStorage.getItem("loginDate");
      const storedTime = localStorage.getItem("loginTime");

      if (storedDate && storedTime) {
        const storedDateTime = new Date(`${storedDate}T${storedTime}`);
        const now = new Date();
        const maxLoginDuration = 6 * 60 * 60 * 1000;

        if (now.getTime() - storedDateTime.getTime() > maxLoginDuration) {
          localStorage.clear();
          alert("Sua sessão expirou. Por favor, faça login novamente.");
          window.location.href = "/";
        }
      }
    };

    checkLoginDuration();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
    } else {
      const fetchRoutine = async () => {
        try {
          const docRef = doc(db, "USERS", userId);
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
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        }
      };

      fetchRoutine();
    }
  }, [router]);

  const handleCardClick = (shift: "firstShift" | "secondShift") => {
    const now = new Date();
    const hour = now.getHours();

    if (shift === "firstShift" && (hour < 8 || hour >= 14)) {
      alert("Você só pode acessar o primeiro turno entre 8h e 14h.");
    } else if (shift === "secondShift" && (hour < 14 || hour >= 22)) {
      alert("Você só pode acessar o segundo turno entre 14h e 22h.");
    } else if (currentDayRoutine && currentDayRoutine[shift]) {
      router.push(
        `/supervisors-routine?post=${encodeURIComponent(
          currentDayRoutine[shift]?.label || ""
        )}`
      );
    }
  };

  const renderRoutine = () => {
    const daysOfWeek = [
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    // Pegue as últimas três semanas de rotinas
    const recentRoutines = routine.slice(-3);

    return recentRoutines.map((weekObj, weekIndex) => (
      <div key={weekIndex} className={styles.week}>
        {weekObj.week.map((day, dayIndex) => {
          const dayDate = new Date(day.date + "T00:00:00-03:00");
          const formattedDate = dayDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          const dayName = daysOfWeek[dayDate.getDay() - 1];

          return (
            <div key={dayIndex} className={styles.day}>
              <p className={styles.dayTitle}>
                {`${dayName} - ${formattedDate}`}
              </p>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Primeiro turno (8h-14h)</p>
                  <span className={styles.post}>
                    {day.firstShift
                      ? day.firstShift.label
                      : "Nenhum posto atribuído"}
                  </span>
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Segundo turno (14h-22h)</p>
                  <span className={styles.post}>
                    {day.secondShift
                      ? day.secondShift.label
                      : "Nenhum posto atribuído"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

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
              {currentDayRoutine ? (
                <>
                  {currentDayRoutine.firstShift && (
                    <div
                      className={styles.CardMenu}
                      onClick={() => handleCardClick("firstShift")}
                    >
                      <span className={styles.CardMenuText}>
                        08-14h:{" "}
                        <span>{currentDayRoutine.firstShift.label}</span>
                      </span>
                    </div>
                  )}
                  {currentDayRoutine.secondShift && (
                    <div
                      className={styles.CardMenu}
                      onClick={() => handleCardClick("secondShift")}
                    >
                      <span className={styles.CardMenuText}>
                        14-22h:{" "}
                        <span>{currentDayRoutine.secondShift.label}</span>
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.CardMenu}>
                  <span className={styles.CardMenuText}>Sem postos hoje</span>
                </div>
              )}
            </div>
          </div>

          <p className={styles.title}>Programações</p>
          {renderRoutine()}

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
