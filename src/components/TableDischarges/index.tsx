import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styles from "../../styles/TableProducts.module.scss";

import { getDocs, query, where } from "firebase/firestore";
import { collection, db } from "../../../firebase";
import { useMenu } from "../Context/context";
import { ITableBudgets } from "./type";

import Link from "next/link";

import { addDays, format } from "date-fns";
import { useRouter } from "next/router";

interface Measurement {
  cm: string;
  fileUrl: string;
}

interface SelectionWithFile {
  selection: string;
  fileUrl: string;
  image: null;
}

interface Discharge {
  id: string;
  date: string;
  time: string;
  driverName: string;
  truckPlate: string;
  tankNumber: string;
  product: string;
  initialMeasurement: Measurement;
  finalMeasurement: Measurement;
  seal: SelectionWithFile;
  arrow: SelectionWithFile;
  observations: string;
  makerName: string;
  postName: string;
}

export default function TablePosts({
  searchValue,
  orderValue,
  filterValue,
}: ITableBudgets) {
  const [filteredData, setFilteredData] = useState<Discharge[]>([]);
  const [teste, setTeste] = useState<Discharge[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  const router = useRouter();
  const { post } = router.query;

  useEffect(() => {
    let isComponentMounted = true;

    const fetchData = async () => {
      const path = "DISCHARGES"; // Caminho da coleção de descargas
      const userType = localStorage.getItem("userType");
      const userPost = localStorage.getItem("userPost");

      let dbCollection = collection(db, path);
      let q;

      if (userType === "manager" && post) {
        q = query(dbCollection, where("postName", "==", post));
      } else if (userType === "manager") {
        q = query(dbCollection, where("postName", "==", userPost));
      } else if (post) {
        q = query(dbCollection, where("postName", "==", post));
      } else {
        q = query(dbCollection); // Sem filtros adicionais
      }

      const dischargesSnapshot = await getDocs(q);
      let dischargesList = dischargesSnapshot.docs.map((doc) => {
        const data = doc.data() as Discharge; // Garante a tipagem correta dos dados
        return {
          id: doc.id,
          date: data.date,
          time: data.time,
          driverName: data.driverName,
          truckPlate: data.truckPlate,
          tankNumber: data.tankNumber,
          product: data.product,
          initialMeasurement: {
            cm: data.initialMeasurement?.cm ?? "",
            fileUrl: data.initialMeasurement?.fileUrl ?? "",
          },
          finalMeasurement: {
            cm: data.finalMeasurement?.cm ?? "",
            fileUrl: data.finalMeasurement?.fileUrl ?? "",
          },
          seal: {
            selection: data.seal?.selection ?? "",
            fileUrl: data.seal?.fileUrl ?? "",
            image: null,
          },
          arrow: {
            selection: data.arrow?.selection ?? "",
            fileUrl: data.arrow?.fileUrl ?? "",
            image: null,
          },
          observations: data.observations ?? "",
          makerName: data.makerName ?? "",
          postName: data.postName ?? "",
        };
      });

      // Ordenar dischargesList primeiro por date e time em ordem decrescente e depois por postName em ordem alfabética
      dischargesList = dischargesList.sort((a, b) => {
        const dateComparison = b.date.localeCompare(a.date);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        const timeComparison = b.time.localeCompare(a.time);
        if (timeComparison !== 0) {
          return timeComparison;
        }
        return a.postName.localeCompare(b.postName);
      });

      if (isComponentMounted) {
        setTeste(dischargesList);
        setFilteredData(dischargesList); // Aqui você pode aplicar filtros ou ordenações adicionais
        console.log(teste);
        console.log("Set data: ", dischargesList);
      }
    };

    fetchData();

    return () => {
      isComponentMounted = false; // Limpeza ao desmontar o componente
    };
  }, [post]);

  useEffect(() => {
    if (searchValue !== "") {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const newData = teste.filter((item) =>
        item.postName.toLowerCase().includes(lowerCaseSearchValue)
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
            a.postName.toUpperCase() < b.postName.toUpperCase() ? -1 : 1
          );
          break;
        case "codigoDescrescente":
          sortedData.sort((a, b) =>
            a.postName.toUpperCase() > b.postName.toUpperCase() ? -1 : 1
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
        item.postName?.toLowerCase().includes(searchValue.toLowerCase())
      );

      setFilteredData(filteredItems);
    };
    filterData();
  }, [searchValue, teste]);

  const [openFilter, setOpenFilter] = useState(false);

  const combinedData = [...filteredData, ...currentData];

  const typeUser =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;

  return (
    <div className={styles.tableContianer} onClick={handleOpenMenuDiv}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.thNone}></th>
            <th>Nome do posto</th>
            <th>Data / Hora</th>
            <th>Tanque</th>
            <th>Produto</th>
            <th>Placa do caminhão</th>
          </tr>
        </thead>

        <tbody>
          {dataToDisplay.map((item) => (
            <tr className={styles.budgetItem} key={item.id}>
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
                            pathname: `/view-discharge`,
                            query: { id: item.id },
                          }}
                        >
                          Visualizar
                        </Link>
                      </button>
                    </div>
                  </div>
                )}
              </td>

              <td className={styles.td}>
                <b>{item.postName || "Não especificado"}</b>
              </td>

              <td className={styles.td}>
                <b>
                  {item.date
                    ? format(addDays(new Date(item.date), 1), "dd/MM/yyyy")
                    : "Sem data"}{" "}
                  - {item.time || "Sem hora"}
                </b>
              </td>
              <td className={styles.td}>
                <b>Tanque {item.tankNumber || "N/A"}</b>
              </td>
              <td className={styles.td}>
                <b>{item.product || "N/A"}</b>
              </td>
              <td className={styles.td}>
                <b>
                  {item.truckPlate
                    ? item.truckPlate.toString().toUpperCase()
                    : "N/A"}
                </b>
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
