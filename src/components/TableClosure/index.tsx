import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styles from "../../styles/TableProducts.module.scss";

import { format } from "date-fns";
import { getDocs, query } from "firebase/firestore";
import { collection, db } from "../../../firebase";
import { useMenu } from "../Context/context";
import { ITableBudgets } from "./type";

interface Supervisor {
  id: string;
  type: string;
  date: string;
  value: string;
}

export default function TablePosts({
  searchValue,
  orderValue,
  filterValue,
}: ITableBudgets) {
  const [filteredData, setFilteredData] = useState<Supervisor[]>([]);
  const [teste, setTeste] = useState<Supervisor[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  useEffect(() => {
    let isComponentMounted = true;
    const fetchData = async () => {
      const path = "CLOSURES";

      const dbQuery = query(
        collection(db, path)
        // where("type", "==", "supervisor")
      );
      const querySnapshot = await getDocs(dbQuery);
      const postsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        type: doc.data().type,
        date: doc.data().date,
        value: doc.data().value,
      }));

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
        item.type.toLowerCase().includes(lowerCaseSearchValue)
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
            a.type.toUpperCase() < b.type.toUpperCase() ? -1 : 1
          );
          break;
        case "codigoDescrescente":
          sortedData.sort((a, b) =>
            a.type.toUpperCase() > b.type.toUpperCase() ? -1 : 1
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

  // const handleDeleteItem = async (itemId: string) => {
  //   const isConfirmed = confirm(
  //     "Tem certeza que deseja excluir este supervisor?"
  //   );

  //   if (isConfirmed) {
  //     try {
  //       const postRef = doc(db, "USERS", itemId);
  //       const postSnap = await getDoc(postRef);

  //       await deleteDoc(postRef);

  //       const updatedData = filteredData.filter((item) => item.id !== itemId);
  //       setFilteredData(updatedData);

  //       toast.success("Supervisor excluído com sucesso!", {
  //         style: {
  //           fontSize: "12px",
  //           fontWeight: 600,
  //         },
  //       });
  //     } catch (error) {
  //       console.error("Ocorreu um erro ao excluir o supervisor:", error);
  //       toast.error("Ocorreu um erro ao excluir o supervisor.");
  //     }
  //   } else {
  //     console.log("Exclusão cancelada pelo usuário.");
  //   }
  // };

  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenuDiv = () => {
    setOpenMenu(false);
    console.log(openMenu);
  };

  useEffect(() => {
    const filterData = () => {
      const filteredItems = teste.filter((item) =>
        item.type?.toLowerCase().includes(searchValue.toLowerCase())
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
            <th>Tipo</th>
            <th>Data</th>
            <th>Valor</th>
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
                      {/* <button
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
                <b>{item.type}</b>
              </td>
              <td className={styles.td}>
                {format(new Date(item.date), "dd/MM/yyyy")}
              </td>
              <td className={styles.td}>
                <b>{item.value}</b>
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
