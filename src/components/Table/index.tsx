import React, { useEffect, useState } from "react";
import styles from "../../styles/Table.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { collection, db, getDoc, doc } from "../../../firebase";
import { GetServerSidePropsContext } from "next";
import { getDocs } from "firebase/firestore";
import { ITableBudgets } from "./type";
import { deleteDoc } from "firebase/firestore";
import { useMenu } from "../../components/Context/context";
import classnames from "classnames";

import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface Order {
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

export default function Table({
  searchValue,
  orderValue,
  filterValue,
}: ITableBudgets) {
  const [filteredData, setFilteredData] = useState<Order[]>([]);
  const [teste, setTeste] = useState<Order[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // I

  const router = useRouter();


  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, "Orders");
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        const budget: Order = {
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
      console.log(budgetList);
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
      console.log(filteredItems);
    };
    filterData();
  }, [searchValue, teste]);

  useEffect(() => {
    let sortedData = [...teste];

    // Filtragem
    if (filterValue !== "") {
      if (filterValue === "ativos") {
        sortedData = sortedData.filter((item) => item.Ativo === true);
      } else if (filterValue === "inativos") {
        sortedData = sortedData.filter(
          (item) => item.Ativo === undefined || item.Ativo === false
        );
      }
    }

    // Ordenação
    if (orderValue !== "") {
      switch (orderValue) {
        case "nomeCrescente":
          sortedData.sort((a, b) => {
            const nomeA = a.nomeCompleto.toUpperCase();
            const nomeB = b.nomeCompleto.toUpperCase();
            if (nomeA < nomeB) {
              return -1;
            }
            if (nomeA > nomeB) {
              return 1;
            }
            return 0;
          });
          break;
        case "nomeDecrescente":
          sortedData.sort((a, b) => {
            const nomeA = a.nomeCompleto.toUpperCase();
            const nomeB = b.nomeCompleto.toUpperCase();
            if (nomeA > nomeB) {
              return -1;
            }
            if (nomeA < nomeB) {
              return 1;
            }
            return 0;
          });
          break;
        case "maiorValor":
          sortedData = [...sortedData]; // Cria uma cópia da array original
          sortedData.sort(
            (a, b) => parseFloat(b.valorTotal) - parseFloat(a.valorTotal)
          );
          break;
        case "dataCadastro":
          sortedData.sort((a, b) => {
            const dataA = new Date(a.dataCadastro);
            const dataB = new Date(b.dataCadastro);
            if (dataA < dataB) {
              return -1;
            }
            if (dataA > dataB) {
              return 1;
            }
            return 0;
          });
          break;
        case "dataVencimento":
          sortedData.sort((a, b) => {
            const dataA = new Date(a.Entrega);
            const dataB = new Date(b.Entrega);
            if (dataA < dataB) {
              return -1;
            }
            if (dataA > dataB) {
              return 1;
            }
            return 0;
          });
          break;
        // Adicione mais casos para outras opções de ordenação
      }
    }

    setFilteredData(sortedData);
  }, [orderValue, filterValue, teste]);

  const totalItems = filteredData.length; // Total de resultados
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
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
      await deleteDoc(doc(db, "Orders", itemId));

      const updatedData = filteredData.filter((item) => item.id !== itemId);
      setFilteredData(updatedData);

      toast.success("Pedido excluído com sucesso!", {
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
  const sortDataByDate = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      return (
        new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime()
      );
    });
    setFilteredData(sortedData);
  };

  useEffect(() => {
    sortDataByDate();
  }, []);

  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenuDiv = () => {
    setOpenMenu(false);
    console.log(openMenu);
  };

  return (
    <div className={styles.tableContianer} onClick={handleOpenMenuDiv}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.thNone}></th>
            <th>Nº Orçamento</th>
            <th>CLIENTE</th>
            <th>SITUAÇÃO</th>
            <th id={styles.tdNone}>PRAZO DE ENTREGA </th>
            <th id={styles.tdNone}>DATA DE CADASTRO</th>
            <th id={styles.tdNone}>VALOR TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr
              className={styles.budgetItem}
              key={item.id}
              onClick={() => {
                localStorage.setItem("selectedId", item.id);
                router.push('/ViewOrderData');

              }}
            >
              <td className={styles.tdDisabled}>
                <div
                  className={`${openMenus[item.id]
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
                    <Link href="/ViewOrderData">Vizualizar</Link>

                    {/* <button>Editar</button>
                    <button className={styles.buttonGren}>
                      Efetivar orçamento
                    </button> */}
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
                  <p id={styles.tdNone}>
                    {" "}
                    Data de cadastro:{item.dataCadastro}
                  </p>
                </span>
              </td>
              <td className={styles.td} id={styles.tdNone}>
                {item.Entrega}
                <br />
                <span className={styles.diasUteis}>15 dias Utéis</span>
              </td>
              <td className={styles.td} id={styles.tdNone}>
                {item.dataCadastro}
                <br />
                <span className={styles.diasUteis}>{item.nomeCompleto}</span>
              </td>
              <td className={styles.td} id={styles.tdNone}>
                R$ {parseFloat(item.valorTotal || '0').toFixed(2)}
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
                className={`${pageNumber === currentPage
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
