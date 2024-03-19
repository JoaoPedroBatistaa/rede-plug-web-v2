import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Requests.module.scss";

import HeaderPosts from "@/components/HeaderTwentyOneRoutine";
import SideMenuHome from "@/components/SideMenuHome";
import TablePosts from "@/components/TableTwentyTwoRoutine";

import { ChangeEvent, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

type Budget = {
  id: string;
  [key: string]: any;
};

export default function Products() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/");
    }
  }, []);

  const [openMenu, setOpenMenu] = useState(false);

  const [filterStates, setFilterStates] = useState({
    foam: false,
    impressao: false,
    paspatur: false,
    perfil: false,
    vidro: false,
  });

  const toggleFilter = (key: keyof typeof filterStates) => {
    setFilterStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [selectedOption, setSelectedOption] = useState("opcao1");
  const [searchValue, setSearchValue] = useState("");
  const [searchValue1, setSearchValue1] = useState("");
  const [searchValue2, setSearchValue2] = useState("");
  const [searchValue3, setSearchValue3] = useState("");
  const [searchValue4, setSearchValue4] = useState("");
  const [data, setData] = useState<Budget[]>([]);

  const [valueRadio, setValueRadio] = useState("");

  const [orderValue, setOrderValue] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");

  const [increaseValue, setIncreaseValue] = useState<string>("");

  const handleOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleSearchChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue1(e.target.value);
  };
  const handleSearchChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue2(e.target.value);
  };
  const handleSearchChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue3(e.target.value);
  };
  const handleSearchChange4 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue4(e.target.value);
  };

  console.log(searchValue);

  const handleOrderValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOrderValue(event.target.value);
  };

  const handleFilterValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterValue(event.target.value);
  };

  const handleIncreaseChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIncreaseValue(e.target.value);
  };

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  const typeUser =
    typeof window !== "undefined" ? localStorage.getItem("typeUser") : null;

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
        <title>Rede Plug</title>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome
          activeRoute={router.pathname}
          openMenu={openMenu}
        ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderPosts></HeaderPosts>
          <div className={styles.MainContainer}>
            <div className={styles.ListContainer} id="postos">
              <div className={styles.topMenuMobile}>
                <p className={styles.ProductNameMobile}>Rotina das 22h</p>
              </div>
              <div className={styles.ListMenu}>
                <div className={styles.ListMenu}>
                  <p className={styles.ProductName}>Rotina das 22h</p>
                  <div
                    className={styles.ListMenuFilter}
                    onClick={() => toggleFilter("foam")}
                  >
                    <img src="./Filter.svg"></img>{" "}
                    <span className={styles.ListMenuFilterText}>Filtros</span>
                  </div>
                </div>
              </div>
              <div
                className={`${
                  filterStates.foam
                    ? styles.containerFilter
                    : styles.containerFilterClose
                }`}
              >
                <div className={styles.listFilter}>
                  <h2>ORDENAR POR:</h2>
                  <div className={styles.filterItem}>
                    <input
                      type="radio"
                      id="codigoCrescente"
                      name="ordenarPor"
                      value="codigoCrescente"
                      onChange={handleOrderValueChange}
                      className={styles.filterItem}
                    />
                    <label htmlFor="codigoCrescente">Codigo crescente</label>
                  </div>
                  <div className={styles.filterItem}>
                    <input
                      type="radio"
                      id="codigoDescrescente"
                      name="ordenarPor"
                      value="codigoDescrescente"
                      onChange={handleOrderValueChange}
                      className={styles.filterItem}
                    />
                    <label htmlFor="codigoDescrescente">
                      Codigo decrescente
                    </label>
                  </div>
                </div>
              </div>
              <div className={styles.MarginTop}></div>
              <TablePosts
                searchValue={searchValue}
                orderValue={orderValue}
                filterValue={filterValue}
              />
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
