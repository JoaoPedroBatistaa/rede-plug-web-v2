import React, { useEffect, useState } from "react";
import styles from "../../styles/TableProducts.module.scss";

import { useMenu } from "../Context/context";
import { ITableBudgets } from "./type";

import { collection, getDocs, query, where } from "firebase/firestore";
import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";
import { db } from "../../../firebase";

interface Tank {
  tankNumber: string;
  capacity: string;
  product: string;
  saleDefense: string;
  tableParam01: string;
  tableParam02: string;
}

interface Nozzle {
  nozzleNumber: string;
  product: string;
}

interface Manager {
  managerName: string;
  contact: string;
}

interface Post {
  id: string;
  name: string;
  owner: string;
  contact: string;
  location: string;
  email: string;
  tanks: Tank[];
  nozzles: Nozzle[];
  managers: Manager[];
}

export default function TablePosts({
  searchValue,
  orderValue,
  filterValue,
}: ITableBudgets) {
  const router = useRouter();

  const navigateTo = (path: Url) => {
    router.push(path);
  };

  const [filteredData, setFilteredData] = useState<Post[]>([]);
  const [teste, setTeste] = useState<Post[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [todayTasks, setTodayTasks] = useState([]);

  const getLocalISODate = () => {
    const date = new Date();
    // Ajustar para o fuso horário -03:00
    date.setHours(date.getHours() - 3);
    return date.toISOString().slice(0, 10);
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
        }));

        // @ts-ignore
        setTodayTasks(tasks);
      } catch (error) {
        console.error("Erro ao buscar as tarefas de hoje:", error);
      }
    };

    fetchTodayTasks();
  }, []);

  useEffect(() => {
    if (searchValue !== "") {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const newData = teste.filter((item) =>
        item.name.toLowerCase().includes(lowerCaseSearchValue)
      );
      setFilteredData(newData);
    } else {
      setFilteredData(teste);
    }
  }, [searchValue, teste]);

  useEffect(() => {
    let sortedData = [...teste];

    if (orderValue !== "") {
      switch (orderValue) {
        case "codigoCrescente":
          sortedData.sort((a, b) =>
            a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
          );
          break;
        case "codigoDescrescente":
          sortedData.sort((a, b) =>
            a.name.toUpperCase() > b.name.toUpperCase() ? -1 : 1
          );
          break;
      }
    }

    setFilteredData(sortedData);
  }, [orderValue, filterValue, teste]);

  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const dataToDisplay = filteredData.slice(startIndex, endIndex);
  const currentData = teste.slice(startIndex, endIndex);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };
  const handleClickImg = (event: any, itemId: any) => {
    event.stopPropagation();
    setOpenMenus((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenuDiv = () => {
    setOpenMenu(false);
    console.log(openMenu);
  };

  useEffect(() => {
    const filterData = () => {
      const filteredItems = teste.filter((item) =>
        item.name?.toLowerCase().includes(searchValue.toLowerCase())
      );

      setFilteredData(filteredItems);
    };
    filterData();
  }, [searchValue, teste]);

  return (
    <div className={styles.tableContianer} onClick={handleOpenMenuDiv}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.thNone}></th>
            <th>Tarefa</th>
            <th>Realizada por</th>
            <th>Horário</th>
          </tr>
        </thead>

        <tbody>
          {[
            {
              id: "medicao-tanques-6h",
              name: "Medição dos Tanques",
              link: "/managers/tank-measurement-six",
            },
            {
              id: "encerrante-bico-6h",
              name: "Encerrantes",
              link: "/managers/nozzle-closure-six",
            },
            {
              id: "teste-combustiveis-6h",
              name: "Teste dos Combustíveis",
              link: "/managers/fuel-test-six",
            },
            {
              id: "teste-game-proveta-6h",
              name: "Teste do Game",
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

            {
              id: "verificacao-cavaletes-14h",
              name: "Cavaletes",
              link: "/managers/easel-fourteen",
            },
          ].map((task) => {
            // @ts-ignore
            const taskRecord = todayTasks.find((t) => t.id === task.id);
            const isFinished = taskRecord !== undefined;
            // @ts-ignore
            const managerName = taskRecord ? taskRecord.managerName : "-";
            // @ts-ignore
            const time = taskRecord ? taskRecord.time : "-";

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
                <td className={styles.tdWithRelative}>
                  <img
                    src="./More.png"
                    width={5}
                    height={20}
                    className={styles.MarginRight}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClickImg(event, task.id);
                    }}
                  />
                </td>
                <td className={styles.td}>
                  <b>{task.name}</b>
                </td>
                <td className={styles.td}>
                  <b>{managerName}</b>
                </td>
                <td className={styles.td}>
                  <b>{time}</b>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.RodapeContainer}></div>
    </div>
  );
}
