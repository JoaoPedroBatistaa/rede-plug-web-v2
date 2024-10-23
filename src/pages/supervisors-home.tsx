import HeaderHome from "@/components/HeaderSupervisors";
import SideMenuHome from "@/components/SideMenuHome";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
  const [fingerprintId, setFingerprintId] = useState<string | null>(null);
  const [editIp, setEditIp] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [ipStored, setIpStored] = useState<string | null>(null); // Novo estado para armazenar o valor de IpAddress vindo do Firestore

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
    { id: "troca-oleo", route: "/supervisors/oil-change" },
    { id: "pintura-posto", route: "/supervisors/post-painting" },
    { id: "canaletas", route: "/supervisors/channels" },
    { id: "iluminacao-pista", route: "/supervisors/runway-lightning" },
    { id: "iluminacao-testeiras", route: "/supervisors/front-lightning" },
    { id: "forro", route: "/supervisors/lining" },
    { id: "placas-sinalizacao", route: "/supervisors/traffic-signs" },
    {
      id: "identificacao-fornecedor",
      route: "/supervisors/supplier-identification",
    },
    { id: "placas-faixa-preco", route: "/supervisors/price-signs" },
    { id: "extintores", route: "/supervisors/extinguishers" },
    { id: "aferidores", route: "/supervisors/gauges" },
    { id: "regua", route: "/supervisors/ruler" },
    { id: "compressor", route: "/supervisors/compressor" },
    { id: "calibrador", route: "/supervisors/calibrator" },
    { id: "bocas-visita", route: "/supervisors/manholes" },
    {
      id: "bocas-descarga-e-cadeados",
      route: "/supervisors/discharge-nozzles-and-padlocks",
    },
    { id: "canetas", route: "/supervisors/pens" },
    { id: "bicos", route: "/supervisors/nozzles" },
    { id: "bicos-parados", route: "/supervisors/nozzles-stopped" },
    { id: "mangueiras", route: "/supervisors/hoses" },
    { id: "lacre-bombas", route: "/supervisors/bomb-seal" },
    { id: "passagem-bomba", route: "/supervisors/bomb-passage" },
    { id: "calibragem-bombas", route: "/supervisors/pump-calibration" },
    { id: "game", route: "/supervisors/game" },
    { id: "teste-combustiveis-venda", route: "/supervisors/fuel-sell-test" },
    { id: "combustiveis-defesa", route: "/supervisors/turn" },
    { id: "maquininhas-uso", route: "/supervisors/use-machines" },
    { id: "maquininhas-quebradas", route: "/supervisors/broken-machines" },
    { id: "escala-trabalho", route: "/supervisors/work-schedule" },
    { id: "notas-fiscais", route: "/supervisors/fiscal-notes" },
    { id: "documentos", route: "/supervisors/documents" },
  ];

  useEffect(() => {
    const fetchFingerprintId = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const fingerprintId = result.visitorId;
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

            if (userData.IpAddress) {
              setIpStored(userData.IpAddress);
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
    if (!userId || !fingerprintId) {
      console.log("Erro: userId ou fingerprintId ausentes.");
      return;
    }

    try {
      const docRef = doc(db, "USERS", userId);
      await updateDoc(docRef, {
        IpAddress: fingerprintId,
        editIp: false,
      });
      alert("Dispositivo validado com sucesso!");
      setEditIp(false);
    } catch (error) {
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

  // Busca as tarefas já concluídas na collection SUPERVISORS com base em supervisorName, shift e date
  const getCompletedTasks = async (
    shift: "firstShift" | "secondShift",
    date: string
  ) => {
    const userName = localStorage.getItem("userName"); // Obtenha o userName do localStorage
    if (!userName) {
      console.error("Erro: Nome de usuário não encontrado no localStorage.");
      return [];
    }

    const collectionRef = collection(db, "SUPERVISORS");
    const querySnapshot = await getDocs(
      query(
        collectionRef,
        where("date", "==", date),
        where("shift", "==", shift),
        where("supervisorName", "==", userName)
      )
    );

    const completedTasks = querySnapshot.docs.map((doc) => doc.data().id);
    console.log("Tarefas concluídas:", completedTasks); // Log das tarefas concluídas
    return completedTasks;
  };

  const getNextTask = async (
    shift: "firstShift" | "secondShift",
    date: string
  ) => {
    const completedTasks = await getCompletedTasks(shift, date);

    for (const task of tasksOrder) {
      if (!completedTasks.includes(task.id)) {
        return task.route; // Retorna a rota da próxima tarefa
      }
    }

    return null; // Se todas as tarefas foram concluídas
  };

  const handleCardClick = async (shift: "firstShift" | "secondShift") => {
    const now = new Date();
    const hour = now.getHours();

    if (shift === "firstShift" && (hour < 8 || hour >= 14)) {
      alert("Você só pode acessar o primeiro turno entre 8h e 14h.");
    } else if (shift === "secondShift" && (hour < 14 || hour >= 22)) {
      alert("Você só pode acessar o segundo turno entre 14h e 22h.");
    } else if (currentDayRoutine && currentDayRoutine[shift]) {
      const completedTasks = await getCompletedTasks(
        shift,
        currentDayRoutine.date
      );

      // Verifica se o loginRequiredTime foi feito nos últimos 30 minutos
      const loginRequiredTime = localStorage.getItem("loginRequiredTime");
      if (completedTasks.length === 0) {
        if (loginRequiredTime) {
          const lastLoginRequired = new Date(loginRequiredTime);
          const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

          if (lastLoginRequired > thirtyMinutesAgo) {
            // O loginRequiredTime foi feito nos últimos 30 minutos, então permitir prosseguir
            const nextTaskRoute = await getNextTask(
              shift,
              currentDayRoutine.date
            );

            if (nextTaskRoute) {
              router.push(
                `${nextTaskRoute}?post=${encodeURIComponent(
                  currentDayRoutine[shift]?.label || ""
                )}&shift=${shift}`
              );
            } else {
              alert("Todas as tarefas para este turno já foram concluídas.");
            }
            return;
          }
        }

        // Caso contrário, exibir o alerta e redirecionar para a página de login
        alert("Para começar as tarefas do turno, você deve refazer o login.");
        router.push("/");

        // Salva a data e horário no localStorage
        const nowString = now.toISOString();
        localStorage.setItem("loginRequiredTime", nowString);
      } else {
        const nextTaskRoute = await getNextTask(shift, currentDayRoutine.date);

        if (nextTaskRoute) {
          router.push(
            `${nextTaskRoute}?post=${encodeURIComponent(
              currentDayRoutine[shift]?.label || ""
            )}&shift=${shift}`
          );

          // Apaga o campo no localStorage para evitar alertas repetidos
        } else {
          alert("Todas as tarefas para este turno já foram concluídas.");
        }
      }
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

  const handleRefresh = () => {
    // Limpa o cache e recarrega a página
    caches
      .keys()
      .then((names) => {
        for (let name of names) caches.delete(name);
      })
      .then(() => {
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

        alert("O sistema agora está na versão mais recente");
        window.location.reload();
      });
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

          <p className={styles.title}>Atualizar aplicação</p>

          <div className={styles.ipCardMenu} onClick={handleRefresh}>
            <span className={styles.CardMenuText}>Atualizar</span>
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
