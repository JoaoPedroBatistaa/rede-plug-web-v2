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

  useEffect(() => {
    const fetchTodayTasks = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const managersRef = collection(db, "SUPERVISORS");
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
              id: "uniformes",
              name: "Uniformes",
              link: "/uniforms",
            },
            {
              id: "atendimento",
              name: "Atendimento",
              link: "/service",
            },
            {
              id: "extintores",
              name: "Extintores",
              link: "/extinguishers",
            },
            {
              id: "placas-sinalizacao",
              name: "Placas de sinalização",
              link: "/traffic-signs",
            },
            {
              id: "placas-faixa-preco",
              name: "Placas de faixa de preço",
              link: "/price-signs",
            },
            {
              id: "bicos",
              name: "Bicos",
              link: "/nozzles",
            },
            {
              id: "mangueiras",
              name: "Mangueiras",
              link: "/hoses",
            },
            {
              id: "limpeza-testeiras",
              name: "Limpeza testeira",
              link: "/front-cleaning",
            },
            {
              id: "canaletas",
              name: "Canaletas",
              link: "/channels",
            },
            {
              id: "pintura-posto",
              name: "Pintura do posto",
              link: "/post-painting",
            },
            {
              id: "canetas",
              name: "Canetas",
              link: "/pens",
            },
            {
              id: "bicos-parados",
              name: "Bicos parados",
              link: "/nozzles-stopped",
            },
            {
              id: "limpeza-pista",
              name: "Limpeza e organização da písta",
              link: "/track-cleaning",
            },
            {
              id: "aferidores",
              name: "Aferidores",
              link: "/gauges",
            },
            {
              id: "limpeza-banheiros",
              name: "Limpeza e organização dos banheiros",
              link: "/bathroom-cleaning",
            },
            {
              id: "iluminacao-pista",
              name: "Iluminação da pista",
              link: "/runway-lightning",
            },
            {
              id: "iluminacao-testeiras",
              name: "Iluminação das testeiras",
              link: "/front-lightning",
            },
            {
              id: "vestiario",
              name: "Vestiário",
              link: "/locker-room",
            },
            {
              id: "troca-oleo",
              name: "Troca de óleo",
              link: "/oil-change",
            },
            {
              id: "compressor",
              name: "Compressor",
              link: "/compressor",
            },
            {
              id: "calibrador",
              name: "Calibrador",
              link: "/calibrator",
            },
            {
              id: "notas-fiscais",
              name: "Notas fiscais",
              link: "/fiscal-notes",
            },
            {
              id: "maquininhas-uso",
              name: "Maquininhas em uso",
              link: "/use-machines",
            },
            {
              id: "maquininhas-reservas",
              name: "Maquininhas reservas",
              link: "/reserve-machines",
            },
            {
              id: "escala-trabalho",
              name: "Escala de trabalho",
              link: "/work-schedule",
            },
            {
              id: "vira",
              name: "Vira",
              link: "/turn",
            },
            {
              id: "teste-combustiveis-venda",
              name: "Teste dos combustíveis de venda",
              link: "/fuel-sell-test",
            },
            {
              id: "limpeza-bombas",
              name: "Limpeza das bombas",
              link: "/bombs-cleaning",
            },
            {
              id: "identificacao-fornecedor",
              name: "Identificação de fornecedor",
              link: "/supplier-identification",
            },
            {
              id: "lacre-bombas",
              name: "Lacre das bombas",
              link: "/bomb-seal",
            },
            {
              id: "passagem-bomba",
              name: "Passagem de bomba",
              link: "/bomb-passage",
            },
          ].map((task) => {
            // @ts-ignore
            const taskRecord = todayTasks.find((t) => t.id === task.id);
            const isFinished = taskRecord !== undefined;
            // @ts-ignore
            const managerName = taskRecord ? taskRecord.supervisorName : "-";
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
