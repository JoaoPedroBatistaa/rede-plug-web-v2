import React, { useEffect, useState } from "react";
import styles from "../../styles/TableBudgets.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { collection, db, getDoc, doc } from "../../../firebase";
import { GetServerSidePropsContext } from "next";
import { getDocs } from "firebase/firestore";
import { ITableBudgets } from "./type";
import { deleteDoc } from "firebase/firestore";

interface Budget {
  id: string;
  NumeroPedido: string;
  Telefone: string;
  nomeCompleto: string;
  Ativo: boolean;
  Entrega: string;
  dataCadastro: string;
  formaPagamento: string;
  valorTotal: string;
}

export default function TableBudgets({ searchValue }: ITableBudgets) {
  const [filteredData, setFilteredData] = useState<Budget[]>([]);
  const [teste, setTeste] = useState<Budget[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Itens exibidos por página

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, "Budget");
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        const budget: Budget = {
          id: doc.id,
          NumeroPedido: data.NumeroPedido,
          Telefone: data.Telefone,
          nomeCompleto: data.nomeCompleto,
          Ativo: data.Ativo,
          Entrega: data.Entrega,
          dataCadastro: data.dataCadastro,
          formaPagamento: data.formaPagamento,
          valorTotal: data.valorTotal,
        };
        return budget;
      });
      setTeste(budgetList);
      setFilteredData(budgetList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      const filteredItems = teste.filter(
        (item) =>
          item.nomeCompleto
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          item.dataCadastro?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filteredItems);
    };
    filterData();
  }, [searchValue, teste]);

  const totalItems = filteredData.length; // Total de resultados
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const [openFilter, setOpenFilter] = useState(false);

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
    // Excluir item do banco de dados
    await deleteDoc(doc(db, "Budget", itemId));

    // Atualizar o estado com os dados filtrados atualizados
    const updatedData = filteredData.filter((item) => item.id !== itemId);
    setFilteredData(updatedData);
  };

  return (
    <div className={styles.tableContianer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.thNone}></th>
            <th>Nº Orçamento</th>
            <th>CLIENTE</th>
            <th>SITUAÇÃO</th>
            <th>PRAZO DE ENTREGA</th>
            <th>DATA DE CADASTRO</th>
            <th>VALOR TOTAL</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item, index) => (
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
                    <Link href="/ViewBudgetData">Vizualizar</Link>

                    <button>Editar</button>
                    <button className={styles.buttonGren}>
                      Efetivar orçamento
                    </button>
                    <button
                      className={styles.buttonRed}
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Deletar
                    </button>
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
                <b>#{item.NumeroPedido}</b>
              </td>
              <td className={styles.td}>
                <b>{item.nomeCompleto}</b>
                <br />
                <span className={styles.diasUteis}> {item.Telefone}</span>
              </td>
              <td className={styles.td}>
                <span
                  className={
                    item.Ativo == true ? styles.badge : styles.badgeInativo
                  }
                >
                  {item.Ativo ? (
                    <img
                      src="./circleBlue.png"
                      width={6}
                      height={6}
                      className={styles.marginRight8}
                    />
                  ) : (
                    <img
                      src="./circleRed.png"
                      width={6}
                      height={6}
                      className={styles.marginRight8}
                    />
                  )}
                  {item.Ativo ? "Ativo" : "Inativo"}
                </span>
                <br />
                <span className={styles.dataCadastro}>
                  <p> Data de cadastro:{item.dataCadastro}</p>
                </span>
              </td>
              <td className={styles.td}>
                {item.Entrega}
                <br />
                <span className={styles.diasUteis}>15 dias Utéis</span>
              </td>
              <td className={styles.td}>
                {item.dataCadastro}
                <br />
                <span className={styles.diasUteis}>{item.nomeCompleto}</span>
              </td>
              <td className={styles.td}>
                {item.valorTotal}
                <br />
                <span className={styles.diasUteis}>À Vista</span>
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <div
                key={pageNumber}
                className={`${
                  pageNumber === currentPage
                    ? styles.RodapePaginacaoContadorDestaque
                    : styles.RodapePaginacaoContadorSemBorda
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </div>
            )
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
