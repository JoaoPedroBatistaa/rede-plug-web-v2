import React, { useEffect, useState } from "react";
import styles from "../../styles/TableProducts.module.scss";

import { useMenu } from "../Context/context";
import { ITableBudgets } from "./type";

import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";

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
  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

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
              id: "medicao-tanques-6h",
              name: "Medição de Tanques",
              manager: "-",
              time: "-",
              finished: false,
              link: "/tank-measurement-six",
            },
            {
              id: "foto-maquininhas-6h",
              name: "Foto das Maquininhas",
              manager: "-",
              time: "-",
              finished: true,
              link: "/manager-six-routine",
            },
            {
              id: "encerrante-bico-6h",
              name: "Tirar o Encerrante de Cada Bico",
              manager: "-",
              time: "-",
              finished: false,
              link: "/manager-six-routine",
            },
            {
              id: "teste-combustiveis-6h",
              name: "Teste dos Combustíveis",
              manager: "-",
              time: "-",
              finished: false,
              link: "/manager-six-routine",
            },
            {
              id: "teste-game-proveta-6h",
              name: "Teste do Game na Proveta de 1L",
              manager: "-",
              time: "-",
              finished: false,
              link: "/manager-six-routine",
            },
          ].map((item) => (
            <tr
              className={`${styles.budgetItem} ${
                item.finished ? styles.finished : styles.notFinished
              }`}
              key={item.id}
              onClick={() => navigateTo(item.link)} // Use a função navigateTo para redirecionar
              style={{ cursor: "pointer" }} // Opcional: Altera o cursor para indicar que é clicável
            >
              <td className={styles.tdWithRelative}>
                <img
                  src="./More.png"
                  width={5}
                  height={20}
                  className={styles.MarginRight}
                  onClick={(event) => {
                    event.stopPropagation(); // Previne que o evento de clique da linha seja disparado
                    handleClickImg(event, item.id);
                  }}
                />
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
