import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styles from "../../styles/TableProducts.module.scss";

import { deleteDoc, getDoc, getDocs } from "firebase/firestore";
import { collection, db, doc } from "../../../firebase";
import { useMenu } from "../Context/context";
import { ITableBudgets } from "./type";

import Link from "next/link";
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
  location: any;
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
  const [itemsPerPage, setItemsPerPage] = useState(60);
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

      // Ordenar a lista de postos em ordem alfabética pelo campo 'name'
      const sortedPostsList = postsList.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      if (isComponentMounted) {
        setTeste(sortedPostsList);
        setFilteredData(sortedPostsList);
        console.log("Set data: ", sortedPostsList);
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
            <th>Nome</th>
            <th>E-mail</th>
            <th>Gerente</th>
          </tr>
        </thead>

        <tbody>
          {dataToDisplay.map((item, index) => (
            <tr
              className={styles.budgetItem}
              key={item.id}
              // onClick={() => {
              //   localStorage.setItem("selectedBudgetId", item.id);
              // }}
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
                      <button className={styles.buttonBlack}>
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
                      </button>
                    </div>
                  </div>
                )}
              </td>

              <td className={styles.td}>
                <b>{item.name}</b>
              </td>

              <td className={styles.td}>
                <b>{item.email}</b>
              </td>

              <td className={styles.td}>
                <b>{item.managers[0].managerName}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.RodapeContainer}>
        <div className={styles.RodapeContinaerLeft}>
          <div className="pagination-info">
            Exibindo {startIndex + 1} - {Math.min(endIndex, totalItems)} de{" "}
            {totalItems} resultados
          </div>
          <div>
            <select
              className={styles.SelectMax}
              value={itemsPerPage.toString()}
              onChange={handleItemsPerPageChange}
            >
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>40</option>
              <option>50</option>
              <option>60</option>
              <option>70</option>
              <option>80</option>
              <option>90</option>
              <option>100</option>
            </select>
          </div>
          <div>
            <b>de {totalItems}</b> resultados
          </div>
        </div>
        <div className={styles.RodapeContinaerRight}>
          <div
            className={styles.RodapePaginacaoContador}
            onClick={() => {
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
          >
            <FontAwesomeIcon
              icon={faAngleLeft}
              className={styles.RodapePaginacaoIcone}
            />
          </div>
          {currentPage && (
            <div
              key={currentPage}
              className={styles.RodapePaginacaoContadorDestaque}
              onClick={() => handlePageChange(currentPage)}
            >
              {currentPage}
            </div>
          )}
          <div
            className={styles.RodapePaginacaoContador}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FontAwesomeIcon
              icon={faAngleRight}
              className={styles.RodapePaginacaoIcone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
