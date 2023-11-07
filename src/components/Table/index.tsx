import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Table.module.scss";

import { deleteDoc, getDocs } from "firebase/firestore";
import { collection, db, doc } from "../../../firebase";
import { useMenu } from "../../components/Context/context";
import { ITableBudgets } from "./type";

import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface Order {
  id: string;
  Entrega: string;
  NumeroPedido: number;
  Telefone: string;
  bairro: string;
  budgets: Array<{
    Tamanho: string;
    codigoColagem: string;
    codigoFoam: string;
    codigoImpressao: string;
    codigoMdf: string;
    codigoMontagem: string;
    codigoPaspatur: string;
    codigoPerfil: string;
    codigoVidro: string;
    collage: string;
    dataVencimento: string;
    descricaoColagem: string;
    descricaoFoam: string;
    descricaoImpressao: string;
    descricaoInstalacao: string;
    descricaoMontagem: string;
    descricaoPaspatur: string;
    descricaoPerfil: string;
    descricaoVidro: string;
    dimensoesPaspatur: string;
    espelho: string;
    espessuraEspelho: string;
    espessuraPerfil: string;
    espessuraVidro: string;
    fileInput: string;
    foam: string;
    impressao: string;
    instalacao: string;
    mdf: string;
    observacoes: string;
    paspatur: string;
    tipoEntrega: string;
    tipoImpressao: string;
    valorColagem: string;
    valorEntrega: string;
    valorFoam: string;
    valorImpressao: string;
    valorInstalacao: string;
    valorMontagem: string;
    valorPaspatur: string;
    valorPerfil: string;
    valorTotal: string;
    valorVidro: string;
    vidro: string;
  }>;
  cep: string;
  cidade: string;
  complemento: string;
  cpf: string;
  dataCadastro: string;
  email: string;
  endereco: string;
  estado: string;
  formaPagamento: string;
  nomeCompleto: string;
  tipoPessoa: string;
  valorTotal: string;
  Ativo: boolean;

  // ICMS
  orig: string | null;
  CSTICMS: string | null;
  modBC: string | null;
  vBC: string | null;
  pICMS: string | null;
  vICMS: string | null;
  pFCP: string | null;
  vFCP: string | null;

  // IPI
  cEnq: string | null;
  CSTIPI: string | null;

  // PIS
  CSTPIS: string | null;
  vBCPIS: string | null;
  pPIS: string | null;
  vPIS: string | null;

  // COFINS
  CSTCOFINS: string | null;
  vBCCOFINS: string | null;
  pCOFINS: string | null;

  vCOFINS: string | null;
  [key: string]: any;
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

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/${userId}/Orders`);
      const orderSnapshot = await getDocs(dbCollection);
      const orderList: Order[] = orderSnapshot.docs
        .filter((doc) => doc.id !== "NumeroDoPedido")
        .map((doc) => {
          const data = doc.data();

          const order: Order = {
            id: doc.id,
            Entrega: data.Entrega,
            NumeroPedido: data.NumeroPedido,
            Telefone: data.Telefone,
            bairro: data.bairro,
            budgets: data.budgets,
            cep: data.cep,
            cidade: data.cidade,
            complemento: data.complemento,
            cpf: data.cpf,
            dataCadastro: data.dataCadastro,
            email: data.email,
            endereco: data.endereco,
            estado: data.estado,
            formaPagamento: data.formaPagamento,
            nomeCompleto: data.nomeCompleto,
            tipoPessoa: data.tipoPessoa,
            valorTotal: data.valorTotal,
            Ativo: data.Ativo,
            orig: data.orig,
            CSTICMS: data.CSTICMS,
            modBC: data.modBC,
            vBC: data.vBC,
            pICMS: data.pICMS,
            vICMS: data.vICMS,
            pFCP: data.pFCP,
            vFCP: data.vFCP,
            cEnq: data.cEnq,
            CSTIPI: data.CSTIPI,
            CSTPIS: data.CSTPIS,
            vBCPIS: data.vBCPIS,
            pPIS: data.pPIS,
            vPIS: data.vPIS,
            CSTCOFINS: data.CSTCOFINS,
            vBCCOFINS: data.vBCCOFINS,
            pCOFINS: data.pCOFINS,
            vCOFINS: data.vCOFINS,
          };

          return order;
        });

      orderList.sort((a, b) => b.NumeroPedido - a.NumeroPedido);

      setTeste(orderList);
      console.log(orderList);
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

  const handleDeleteItem = async (
    itemId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    try {
      await deleteDoc(doc(db, `Login/${userId}/Orders`, itemId));

      const updatedData = filteredData.filter((item) => item.id !== itemId);
      setFilteredData(updatedData);

      toast.success("Pedido excluído com sucesso!", {
        autoClose: 2000,
        style: {
          fontSize: "12px",
          fontWeight: 600,
        },
      });
      router.push("/Requests");
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

  // NOTA FISCAL

  const handleClickNote = async (event: any, orderId: string) => {
    event.stopPropagation();
    const order = teste.find((o) => o.id === orderId);
    if (!order) {
      toast.error("Pedido não encontrado!");
      return;
    }

    const requiredFields = [
      "orig",
      "CSTICMS",
      "modBC",
      "vBC",
      "pICMS",
      "vICMS",
      "pFCP",
      "vFCP",
      "cEnq",
      "CSTIPI",
      "CSTPIS",
      "vBCPIS",
      "pPIS",
      "vPIS",
      "CSTCOFINS",
      "vBCCOFINS",
      "pCOFINS",
      "vCOFINS",
    ];

    let missingFields = requiredFields.filter(
      (field) =>
        order[field] === undefined ||
        order[field] === null ||
        order[field] === ""
    );

    console.log("Order", order);
    console.log("Campos ausentes:", missingFields);

    if (missingFields.length > 0) {
      toast.error(
        `Os seguintes campos estão faltando no cadastro do cliente: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    try {
      const response = await fetch("/api/emissao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        toast.success("Nota fiscal emitida com sucesso!");

        // Converte o PDF em base64 para Blob
        const pdfBlob = new Blob(
          [Uint8Array.from(atob(data.pdf), (c) => c.charCodeAt(0))],
          {
            type: "application/pdf",
          }
        );

        // Converte o Blob para uma URL de objeto
        const objectURL = URL.createObjectURL(pdfBlob);

        // Cria um link temporário para download
        const tempLink = document.createElement("a");
        tempLink.href = objectURL;
        tempLink.download = "nfe.pdf"; // você pode nomear o arquivo conforme desejar
        tempLink.click(); // inicia o download
      } else {
        toast.error(data.motivo || "Erro ao emitir a nota fiscal.");
      }
    } catch (error) {
      console.error("Erro ao fazer a chamada da API:", error);
      toast.error("Erro ao emitir a nota fiscal.");
    }
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
                router.push("/ViewOrderData");
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
                    <Link href="/ViewOrderData">Vizualizar</Link>

                    {/* <button>Editar</button>
                    <button className={styles.buttonGren}>
                      Efetivar orçamento
                    </button> */}
                    <button
                      className={styles.buttonRed}
                      onClick={(event) => handleDeleteItem(item.id, event)}
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
                Confira no pedido
                <br />
                <span className={styles.diasUteis}></span>
              </td>
              <td className={styles.td} id={styles.tdNone}>
                {item.dataCadastro}
                <br />
                <span className={styles.diasUteis}>{item.nomeCompleto}</span>
              </td>
              <td className={styles.td} id={styles.tdNone}>
                R$ {parseFloat(item.valorTotal || "0").toFixed(2)}
                <br />
                <span className={styles.diasUteis}></span>
              </td>

              <td>
                {userId === "lB2pGqkarGyq98VhMGM6" && (
                  <img
                    src="./nota.png"
                    className={styles.iconNota}
                    onClick={(event) => handleClickNote(event, item.id)}
                  />
                )}
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
