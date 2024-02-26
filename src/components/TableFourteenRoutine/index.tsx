import React, { useEffect, useState } from "react";
import styles from "../../styles/TableProducts.module.scss";

import { deleteDoc, getDoc, getDocs } from "firebase/firestore";
import { collection, db, doc } from "../../../firebase";
import { useMenu } from "../Context/context";
import { ITableBudgets } from "./type";

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
              id: "revisao-tanques-14h",
              name: "Revisão de Tanques",
              manager: "-",
              time: "-",
              finished: false,
            },
            {
              id: "checagem-maquininhas-14h",
              name: "Checagem das Maquininhas",
              manager: "-",
              time: "-",
              finished: false,
            },
            {
              id: "encerrante-bico-14h",
              name: "Tirar o Encerrante de Cada Bico",
              manager: "-",
              time: "-",
              finished: true,
            },
            {
              id: "analise-combustiveis-14h",
              name: "Análise dos Combustíveis",
              manager: "-",
              time: "-",
              finished: false,
            },
            {
              id: "verificacao-cavaletes-14h",
              name: "Verificação dos Cavaletes",
              manager: "-",
              time: "-",
              finished: true,
            },
          ].map((item, index) => (
            <tr
              className={`${styles.budgetItem} ${
                item.finished ? styles.finished : styles.notFinished
              }`}
              key={item.id}
            >
              <td className={styles.tdWithRelative}>
                <img
                  src="./More.png"
                  width={5}
                  height={20}
                  className={styles.MarginRight}
                  onClick={(event) => handleClickImg(event, item.id)}
                />
                {openMenus[item.id] && (
                  <div className={styles.containerMore}>
                    <div
                      className={styles.containerX}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClickImg(event, item.id);
                      }}
                    >
                      X
                    </div>
                    <div className={styles.containerOptionsMore}>
                      {/* <button className={styles.buttonBlack}>
                        <Link
                          href={{
                            pathname: `/edit-post`,
                            query: { id: item.id },
                          }}
                        >
                          Editar
                        </Link>
                      </button>
                      <button
                        className={styles.buttonRed}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                      >
                        Deletar
                      </button> */}
                    </div>
                  </div>
                )}
              </td>
              <td className={styles.td}>
                <b>{item.name}</b>
              </td>

              <td className={styles.td}>
                <b>{item.manager}</b>
              </td>
              <td className={styles.td}>
                <b>{item.time}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.RodapeContainer}></div>
    </div>
  );
}
