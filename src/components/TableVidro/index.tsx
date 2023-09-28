import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Table.module.scss";

import { deleteDoc, getDocs } from "firebase/firestore";
import { collection, db, doc } from "../../../firebase";
import { useMenu } from "../../components/Context/context";
import { ITableBudgets } from "./type";

import { toast } from "react-toastify";

interface Foam {
  id: string;

  codigo: string;
  descricao: string;
  margemLucro: number;
  valorMetro: number;
  valorPerda: number;
}

export default function TableVidro({
  searchValue,
  orderValue,
  filterValue,
}: ITableBudgets) {
  const [filteredData, setFilteredData] = useState<Foam[]>([]);
  const [teste, setTeste] = useState<Foam[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // I
  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/lB2pGqkarGyq98VhMGM6/Vidro`);
      console.log("Fetching from: ", dbCollection);
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        const budget: Foam = {
          id: doc.id,

          descricao: data.descricao,
          codigo: data.codigo,
          margemLucro: data.margemLucro,
          valorMetro: data.valorMetro,
          valorPerda: data.valorPerda,
        };
        console.log("Fetched data:", budget);
        return budget;
      });

      budgetList.sort((a, b) => {
        const aCodigo = a.codigo ? a.codigo.toUpperCase() : "";
        const bCodigo = b.codigo ? b.codigo.toUpperCase() : "";

        return aCodigo < bCodigo ? -1 : 1;
      });

      setTeste(budgetList);
      setFilteredData(budgetList);
      console.log("Set data: ", budgetList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchValue !== "") {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const newData = teste.filter((item) =>
        item.codigo.toLowerCase().includes(lowerCaseSearchValue)
      );
      setFilteredData(newData);
    } else {
      setFilteredData(teste);
    }
  }, [searchValue, teste]);

  useEffect(() => {
    let sortedData = [...teste];

    // Ordenação
    if (orderValue !== "") {
      switch (orderValue) {
        case "codigoCrescente":
          sortedData.sort((a, b) =>
            a.codigo.toUpperCase() < b.codigo.toUpperCase() ? -1 : 1
          );
          break;
        case "codigoDescrescente":
          sortedData.sort((a, b) =>
            a.codigo.toUpperCase() > b.codigo.toUpperCase() ? -1 : 1
          );
          break;
        case "maiorValorMetro":
          sortedData.sort((a, b) => b.valorMetro - a.valorMetro);
          break;
        case "maiorValorPerda":
          sortedData.sort((a, b) => b.valorPerda - a.valorPerda);
          break;
        case "maiorLucro":
          sortedData.sort((a, b) => b.margemLucro - a.margemLucro);
          break;
        default:
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
    console.log(itemId);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, `Login/lB2pGqkarGyq98VhMGM6/Vidro`, itemId));
      console.log("Deleting item: ", itemId);

      const updatedData = filteredData.filter((item) => item.id !== itemId);
      setFilteredData(updatedData);

      toast.success("Vidro excluído com sucesso!", {
        style: {
          fontSize: "12px",
          fontWeight: 600,
        },
      });
    } catch (error) {
      toast.error("Ocorreu um erro ao excluir o orçamento.");
    }
  };
  // Função para ordenar a lista pelo campo 'dataCadastro' em ordem decrescente

  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenuDiv = () => {
    setOpenMenu(false);
    console.log(openMenu);
  };

  useEffect(() => {
    const filterData = () => {
      const filteredItems = teste.filter(
        (item) =>
          item.descricao?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.codigo?.toLowerCase().includes(searchValue.toLowerCase())
      );

      setFilteredData(filteredItems);
    };
    filterData();
  }, [searchValue, teste]);

  const typeUser =
    typeof window !== "undefined" ? localStorage.getItem("typeUser") : null;

  return (
    <div className={styles.tableContianer} onClick={handleOpenMenuDiv}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.thNone}></th>
            <th>Nº Produto</th>
            {typeUser === "admin" ? (
              <>
                <th>Margem de Lucro</th>
                <th>Valor do Metro</th>
              </>
            ) : (
              <th>Valor</th>
            )}
            <th>Valor da Perda</th>
            <th>Descrição</th>
          </tr>
        </thead>

        <tbody>
          {dataToDisplay.map((item, index) => (
            <tr
              className={styles.budgetItem}
              key={item.id}
              onClick={() => {
                localStorage.setItem("selectedBudgetId", item.id);
              }}
            >
              <td className={styles.tdDisabled}>
                <div
                  className={`${
                    openMenus[item.id]
                      ? styles.containerMore
                      : styles.containerMoreClose
                  }`}
                >
                  <div
                    className={styles.containerX}
                    onClick={(event) => handleClickImg(event, item.id)}
                  >
                    X
                  </div>
                  <div className={styles.containerOptionsMore}>
                    {/* <button>Editar</button>
                    <button className={styles.buttonGren}>
                      Efetivar orçamento
                    </button> */}
                    {typeUser === "admin" && (
                      <>
                        <button className={styles.buttonBlack}>
                          <Link
                            href={{
                              pathname: `/ProductFoamEdit`,
                              query: { id: item.id },
                            }}
                          >
                            Editar
                          </Link>
                        </button>
                        <button
                          className={styles.buttonRed}
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Deletar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <img
                  src="./More.png"
                  width={5}
                  height={20}
                  className={styles.MarginRight}
                  onClick={(event) => handleClickImg(event, item.id)}
                />
              </td>

              <td className={styles.td}>
                <b>#{item.codigo}</b>
              </td>
              {typeUser === "admin" ? (
                <>
                  <td className={styles.td}>
                    <b>{item.margemLucro}%</b>
                  </td>
                  <td className={styles.td}>
                    <b>
                      {typeof item.valorMetro === "number"
                        ? item.valorMetro.toFixed(2)
                        : item.valorMetro}
                    </b>
                  </td>
                </>
              ) : (
                <td className={styles.td}>
                  <b>
                    {(
                      (item.margemLucro / 100) *
                      (typeof item.valorMetro === "number"
                        ? item.valorMetro
                        : parseFloat(item.valorMetro))
                    ).toFixed(2)}
                  </b>
                </td>
              )}
              <td className={styles.td}>
                <b>{item.valorPerda}%</b>
              </td>
              <td className={styles.td}>
                <b>{item.descricao}</b>
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
