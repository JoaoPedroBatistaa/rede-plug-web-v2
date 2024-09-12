import HeaderHome from "@/components/HeaderSupervisors";
import SideMenuHome from "@/components/SideMenuHome";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

export default function Home() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [routine, setRoutine] = useState<WeekRoutine[]>([]);
  const [currentDayRoutine, setCurrentDayRoutine] = useState<RoutineDay | null>(
    null
  );
  const [fingerprintId, setFingerprintId] = useState<string | null>(null);
  const [editIp, setEditIp] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [ipStored, setIpStored] = useState<string | null>(null); // Novo estado para armazenar o valor de IpAddress vindo do Firestore

  useEffect(() => {
    const fetchFingerprintId = async () => {
      try {
        // Inicialize o FingerprintJS
        const fp = await FingerprintJS.load();
        const result = await fp.get();

        // Log de todas as informações retornadas pelo FingerprintJS
        console.log("FingerprintJS result:", result);

        // Obtenha o fingerprintId
        const fingerprintId = result.visitorId;

        // Log do fingerprintId específico
        console.log("Fingerprint ID:", fingerprintId);

        // Salve o FingerprintID no estado
        setFingerprintId(fingerprintId);
      } catch (error) {
        console.error("Erro ao capturar o fingerprintId:", error);
      }
    };

    fetchFingerprintId();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    if (!storedUserId) {
      router.push("/");
    } else {
      const fetchRoutineAndIp = async () => {
        try {
          const docRef = doc(db, "USERS", storedUserId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            const routineData = userData.routine || [];
            setRoutine(routineData);

            // Aqui, estamos salvando o valor de IpAddress do Firestore, mas não sobrescrevendo o fingerprintId
            if (userData.IpAddress) {
              setIpStored(userData.IpAddress); // Usamos este novo estado apenas para armazenar o IpAddress do Firestore
            }

            if (userData.editIp) {
              setEditIp(userData.editIp);
            }

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

      fetchRoutineAndIp();
    }
  }, [router]);

  const handleDeviceValidation = async () => {
    // Log dos valores iniciais de userId, fingerprintId, e ipStored
    console.log("Iniciando validação do dispositivo...");
    console.log("userId:", userId);
    console.log("fingerprintId:", fingerprintId);
    console.log("ipStored (salvo no Firestore):", ipStored);

    // Verificação de userId e fingerprintId
    if (!userId || !fingerprintId) {
      console.log("Erro: userId ou fingerprintId ausentes.");
      return;
    }

    try {
      // Referência do documento no Firestore
      const docRef = doc(db, "USERS", userId);

      // Log da referência do documento
      console.log("Referência do documento Firestore:", docRef);

      // Atualização no Firestore
      await updateDoc(docRef, {
        IpAddress: fingerprintId, // Aqui garantimos que estamos usando o fingerprintId corretamente
        editIp: false,
      });

      // Log de sucesso após a atualização no Firestore
      console.log(
        "Dispositivo validado com sucesso! IpAddress atualizado para:",
        fingerprintId
      );

      alert("Dispositivo validado com sucesso!");

      // Reseta o estado para evitar múltiplas habilitações
      setEditIp(false);
    } catch (error) {
      // Log detalhado do erro
      console.error("Erro ao validar o dispositivo no Firestore:", error);
      alert("Erro ao validar o dispositivo.");
    }
  };

  const renderValidationCard = () => {
    if (!fingerprintId || editIp) {
      return (
        <div className={styles.ipCardMenu} onClick={handleDeviceValidation}>
          <span className={styles.CardMenuText}>Cadastrar dispositivo</span>
        </div>
      );
    } else {
      return (
        <div className={styles.ipCardMenu}>
          <span className={styles.CardMenuText}>Dispositivo validado</span>
        </div>
      );
    }
  };

  const handleCardClick = (shift: "firstShift" | "secondShift") => {
    const now = new Date();
    const hour = now.getHours();

    if (shift === "firstShift" && (hour < 8 || hour >= 14)) {
      alert("Você só pode acessar o primeiro turno entre 8h e 14h.");
    } else if (shift === "secondShift" && (hour < 14 || hour >= 22)) {
      alert("Você só pode acessar o segundo turno entre 14h e 22h.");
    } else if (currentDayRoutine && currentDayRoutine[shift]) {
      // Adiciona tanto o posto quanto o turno à query string
      router.push(
        `/supervisors/point?post=${encodeURIComponent(
          currentDayRoutine[shift]?.label || ""
        )}&shift=${shift}`
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

          <p className={styles.title}>Validação do dispositivo</p>

          {renderValidationCard()}

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
