import { collection, getDocs, query, where } from "firebase/firestore";
import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import styles from "../../styles/TableRoutines.module.scss";
import { ITableBudgets } from "./type";

// Interface para as tarefas
interface Task {
  id: string;
  name: string;
  link: string;
}

// Interface para as tarefas de hoje vindas do Firestore
interface TodayTask {
  id: string;
  managerName?: string;
  time?: string;
}

export default function TablePosts({ searchValue, orderValue }: ITableBudgets) {
  const router = useRouter();

  const navigateTo = (path: Url) => {
    router.push(path);
  };

  const [todayTasks, setTodayTasks] = useState<TodayTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isSunday, setIsSunday] = useState(false);

  const getLocalISODate = () => {
    const date = new Date();
    // Ajustar para o fuso horário -03:00
    date.setHours(date.getHours() - 3);
    return date.toISOString().slice(0, 10);
  };

  // Determinar o dia da semana
  const getDayOfWeek = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDay(); // 0 = Domingo, 1 = Segunda-feira, etc.
  };

  useEffect(() => {
    const fetchTodayTasks = async () => {
      const today = getLocalISODate();
      const managersRef = collection(db, "MANAGERS");
      const userName = localStorage.getItem("userName");

      const q = query(
        managersRef,
        where("date", "==", today),
        where("userName", "==", userName)
      );

      try {
        const querySnapshot = await getDocs(q);
        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TodayTask[];

        setTodayTasks(tasks);
      } catch (error) {
        console.error("Erro ao buscar as tarefas de hoje:", error);
      }
    };

    fetchTodayTasks();

    // Verificar se é domingo
    const loginDate = localStorage.getItem("loginDate");
    if (loginDate) {
      const dayOfWeek = getDayOfWeek(loginDate);
      console.log(dayOfWeek);
      setIsSunday(dayOfWeek === 0); // Domingo é representado por 0
    }
  }, []);

  useEffect(() => {
    // Tarefas gerais
    const allTasks: Task[] = [
      {
        id: "medicao-tanques-6h",
        name: "Medição dos Tanques",
        link: "/managers/tank-measurement-six",
      },
      {
        id: "teste-combustiveis-6h",
        name: "Teste dos Combustíveis",
        link: "/managers/fuel-test-six",
      },
      {
        id: "teste-game-proveta-desligado-6h",
        name: "Teste do Game Desligado",
        link: "/managers/game-test-six-off",
      },
      {
        id: "teste-game-proveta-6h",
        name: "Teste do Game Ligado",
        link: "/managers/game-test-six",
      },
      {
        id: "foto-maquininhas-6h",
        name: "Maquininhas",
        link: "/managers/photo-machines-six",
      },
      {
        id: "quarto-caixa-6h",
        name: "4° Caixa",
        link: "/managers/fourth-cashier-six",
      },
      {
        id: "controle-tanque-6h",
        name: "Controle de Tanque",
        link: "/managers/tank-control-six",
      },
      {
        id: "recolhe-6h",
        name: "Recolhe",
        link: "/managers/collect-six",
      },
      {
        id: "quantidade-vendida-dia-anterior-6h",
        name: "Vendas do Dia Anterior",
        link: "/managers/yesterday-sales-volume-six",
      },
      {
        id: "preco-concorrentes-6h",
        name: "Preço dos Concorrentes",
        link: "/managers/competitors-price-six",
      },
    ];

    // Se for domingo, filtrar apenas as tarefas permitidas
    if (isSunday) {
      setFilteredTasks(
        allTasks.filter((task) =>
          [
            "medicao-tanques-6h",
            "foto-maquininhas-6h",
            "quantidade-vendida-dia-anterior-6h",
          ].includes(task.id)
        )
      );
    } else {
      setFilteredTasks(allTasks);
    }
  }, [isSunday]);

  return (
    <div className={styles.tableContianer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}></tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => {
            const taskRecord = todayTasks.find((t) => t.id === task.id);
            const isFinished = taskRecord !== undefined;

            const handleTaskClick = () => {
              if (!isFinished) {
                navigateTo(task.link);
              }
            };

            return (
              <tr
                className={`${styles.budgetItem} ${
                  isFinished ? styles.finished : styles.notFinished
                }`}
                key={task.id}
                onClick={handleTaskClick}
                style={{ cursor: isFinished ? "default" : "pointer" }}
              >
                <td className={styles.td}>
                  <b>{task.name}</b>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
