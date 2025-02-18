import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderSupervisorProd";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

import dynamic from "next/dynamic";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
const LoadingOverlay = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});

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

export default function SupervisorProductivity() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [routine, setRoutine] = useState<WeekRoutine[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [daysWithProgramming, setDaysWithProgramming] = useState<number>(0);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [tasksCompleted, setTasksCompleted] = useState<number>(0);
  const [tasksNotCompleted, setTasksNotCompleted] = useState<number>(0);
  const [incompleteDays, setIncompleteDays] = useState<
    { date: string; missingTasks: number }[]
  >([]);
  const [cxValue, setCxValue] = useState(9);

  const updateCxValue = () => {
    if (window.innerWidth < 768) {
      setCxValue(30); // Para mobile
    } else {
      setCxValue(9); // Para desktop
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const docId = Array.isArray(router.query.id)
        ? router.query.id[0]
        : (router.query.id as string);

      if (docId) {
        const docRef = doc(db, "USERS", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = docSnap.data();
          setName(postData.name);

          if (postData.routine) {
            const existingRoutines = postData.routine.map((routine: any) => ({
              week: routine.week,
              isFromDatabase: true,
            }));

            setRoutine(existingRoutines);
          }
        }
      }
    };

    fetchData();
    updateCxValue();
    window.addEventListener("resize", updateCxValue);

    return () => window.removeEventListener("resize", updateCxValue);
  }, [router.query.id]);

  const handleMonthChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setSelectedMonth(selectedDate);

    const [selectedYear, selectedMonth] = selectedDate.split("-");

    const routinesForMonth = routine
      .map((weekObj) =>
        weekObj.week.filter((dayObj) => {
          const dayDate = new Date(dayObj.date);
          return (
            dayDate.getFullYear().toString() === selectedYear &&
            (dayDate.getMonth() + 1).toString().padStart(2, "0") ===
              selectedMonth
          );
        })
      )
      .flat();

    const daysWithProgrammingCount = routinesForMonth.length;
    setDaysWithProgramming(daysWithProgrammingCount);

    const totalTasks = daysWithProgrammingCount * tasksOrder.length * 2;
    let completedTasks = 0;
    const incompleteTaskDays: { date: string; missingTasks: number }[] = [];

    for (const routineDay of routinesForMonth) {
      const { date } = routineDay;

      const firstShiftTasksCompleted = await checkCompletedTasks(
        name,
        date,
        "firstShift"
      );
      completedTasks += firstShiftTasksCompleted.length;

      const secondShiftTasksCompleted = await checkCompletedTasks(
        name,
        date,
        "secondShift"
      );
      completedTasks += secondShiftTasksCompleted.length;

      const missingFirstShiftTasks = tasksOrder.filter(
        (task) => !firstShiftTasksCompleted.includes(task.id)
      ).length;
      const missingSecondShiftTasks = tasksOrder.filter(
        (task) => !secondShiftTasksCompleted.includes(task.id)
      ).length;

      const totalMissingTasks =
        missingFirstShiftTasks + missingSecondShiftTasks;

      if (totalMissingTasks > 0) {
        incompleteTaskDays.push({
          date: new Date(date).toLocaleDateString("pt-BR"),
          missingTasks: totalMissingTasks,
        });
      }
    }

    setIncompleteDays(incompleteTaskDays);

    const completionPercent =
      totalTasks > 0 ? Math.floor((completedTasks / totalTasks) * 100) : 0;
    setCompletionPercentage(completionPercent);

    const incompleteTasks = totalTasks - completedTasks;
    setTasksCompleted(completedTasks);
    setTasksNotCompleted(incompleteTasks);
  };

  const checkCompletedTasks = async (
    supervisorName: string,
    date: string,
    shift: "firstShift" | "secondShift"
  ): Promise<string[]> => {
    const tasksCollection = collection(db, "SUPERVISORS");
    const q = query(
      tasksCollection,
      where("date", "==", date),
      where("supervisorName", "==", supervisorName),
      where("shift", "==", shift)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data().id);
  };

  const COLORS = ["#0bb07b", "#9b111e"];

  const data = [
    { name: "Tarefas Concluídas", value: tasksCompleted },
    { name: "Tarefas Não Concluídas", value: tasksNotCompleted },
  ];

  return (
    <>
      <Head>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
`}</style>
      </Head>

      <HeaderNewProduct />
      <ToastContainer />
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Produtividade do supervisor</p>
          </div>

          <p className={styles.Notes}>
            Veja abaixo as informações de produtividade do supervisor
          </p>

          <div className={styles.userContent}>
            <div className={styles.userData}>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome do supervisor</p>
                  <input
                    id="name"
                    type="text"
                    className={styles.Field}
                    value={name}
                    placeholder=""
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Gráfico percentual</p>
          </div>

          <p className={styles.Notes}>
            Abaixo você verá em percentual quanto o supervisor performou
            realizando as tarefas do mês desejado
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Selecione o mês</p>
              <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className={styles.Field}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            {selectedMonth && (
              <p className={styles.subNotes}>
                {daysWithProgramming === 0
                  ? "Não temos atividades programadas para este mês."
                  : `Para o mês selecionado, tivemos programação para o supervisor em ${daysWithProgramming} dias e o percentual de conclusão das atividades é: ${completionPercentage}%.`}
              </p>
            )}
          </div>

          {daysWithProgramming > 0 && (
            <div className={styles.graph}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    cx={`${cxValue}%`} // Valor dinâmico para cx
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Tarefas não concluídas</p>
          </div>

          <p className={styles.Notes}>
            Abaixo você verá quantas tarefas não foram concluídas em cada dia da
            programação prevista para o mês selecionado
          </p>

          {incompleteDays.length > 0 && (
            <ul className={styles.IncompleteTasksList}>
              {incompleteDays.map((day, index) => (
                <li key={index}>
                  Dia {day.date}: <strong>{day.missingTasks}</strong> tarefas
                  não concluídas
                </li>
              ))}
            </ul>
          )}

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
