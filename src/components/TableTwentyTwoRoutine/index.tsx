import React, { useEffect, useState } from "react";
import styles from "../../styles/TableProducts.module.scss";

import { deleteDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { collection, db, doc } from "../../../firebase";
import { useMenu } from "../Context/context";
import { ITableBudgets } from "./type";

import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

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
  const [filteredData, setFilteredData] = useState<Post[]>([]);
  const [teste, setTeste] = useState<Post[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    const fetchTodayTasks = async () => {
      const today = new Date().toISOString().slice(0, 10);
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

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  useEffect(() => {
    let isComponentMounted = true;
    const fetchData = async () => {
      const path = "POSTS";

      const dbCollection = collection(db, path);
      const postsSnapshot = await getDocs(dbCollection);
      const postsList = postsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          owner: data.owner,
          contact: data.contact,
          location: data.location,
          email: data.email,
          tanks: data.tanks,
          nozzles: data.nozzles,
          managers: data.managers,
        };
      });

      if (isComponentMounted) {
        setTeste(postsList);
        setFilteredData(postsList);
        console.log("Set data: ", postsList);
      }
    };
    fetchData();

    return () => {
      isComponentMounted = false;
    };
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

  const handleDeleteItem = async (itemId: string) => {
    const isConfirmed = confirm(
      "Tem certeza que deseja excluir este posto e todos os seus gerentes associados?"
    );

    if (isConfirmed) {
      try {
        const postRef = doc(db, "POSTS", itemId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();

          if (postData.managers && postData.managers.length > 0) {
            for (const manager of postData.managers) {
              if (manager.password) {
                await deleteDoc(doc(db, "USERS", manager.password));
              }
            }
          }
        }

        await deleteDoc(postRef);

        const updatedData = filteredData.filter((item) => item.id !== itemId);
        setFilteredData(updatedData);

        toast.success("Posto e gerentes excluídos com sucesso!", {
          style: {
            fontSize: "12px",
            fontWeight: 600,
          },
        });
      } catch (error) {
        console.error(
          "Ocorreu um erro ao excluir o posto e seus gerentes:",
          error
        );
        toast.error("Ocorreu um erro ao excluir o posto e seus gerentes.");
      }
    } else {
      console.log("Exclusão cancelada pelo usuário.");
    }
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

  const [openFilter, setOpenFilter] = useState(false);

  const combinedData = [...filteredData, ...currentData];

  const typeUser =
    typeof window !== "undefined" ? localStorage.getItem("typeUser") : null;

  const router = useRouter();

  const navigateTo = (path: Url) => {
    router.push(path);
  };

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
              id: "medicao-tanques-22h",
              name: "Medição de Tanques",
              link: "/tank-measurement-twenty-two",
            },
            {
              id: "foto-maquininhas-22h",
              name: "Foto das Maquininhas",
              link: "/photo-machines-twenty-two",
            },
            {
              id: "encerrante-bico-22h",
              name: "Tirar o Encerrante de Cada Bico",
              link: "/nozzle-closure-twenty-two",
            },
            {
              id: "teste-game-proveta-22h",
              name: "Teste do Game na Proveta de 1L",
              link: "/game-test-twenty-two",
            },
            {
              id: "quarto-caixa-22h",
              name: "4° Caixa",
              link: "/fourth-cashier-twenty-two",
            },
            {
              id: "controle-tanque-22h",
              name: "Controle de Tanque",
              link: "/tank-control-twenty-two",
            },
            {
              id: "recolhe-22h",
              name: "Recolhe",
              link: "/collect-twenty-two",
            },
            {
              id: "quantidade-vendida-dia-anterior-22h",
              name: "Quantidade Vendida no Dia Anterior",
              link: "/yesterday-sales-volume-twenty-two",
            },
            {
              id: "verificacao-cavaletes-22h",
              name: "Verificação dos Cavaletes",
              link: "/easel-twenty-two",
            },
            {
              id: "preco-concorrentes-22h",
              name: "Preço dos Concorrentes",
              link: "/competitors-price-twenty-two",
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
                      // Suposição de implementação de handleClickImg
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
