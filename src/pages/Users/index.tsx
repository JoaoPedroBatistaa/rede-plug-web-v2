import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Requests.module.scss";

import HeaderProducts from "@/components/HeaderUsers";
import SearchInputListProducts from "@/components/InputSearchListUsers";
import SideMenuHome from "@/components/SideMenuHome";
import TableSupplier from "@/components/TableUsers";
import Link from "next/link";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Users() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const [openMenu, setOpenMenu] = useState(false); // Inicializa o estado openMenu

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

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome
          activeRoute={router.pathname}
          openMenu={openMenu}
        ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderProducts></HeaderProducts>
          <div className={styles.MainContainer}>
            <div className={styles.ListContainer} id="foam">
              <div className={styles.topMenuMobile}>
                <p className={styles.ProductNameMobile}>Usuários</p>

                <div className={styles.porcentContainerMobile}>
                  <div>
                    <input
                      type="text"
                      className={styles.InputEdit}
                      placeholder="Aumento em %"
                    />
                  </div>
                  <button className={styles.AumentoPorcent}>
                    <span className={styles.maisNoneMobile}> +</span>
                    <span className={styles.maisNone}> +</span>
                  </button>
                </div>
              </div>
              <div className={styles.ListMenu}>
                <div className={styles.ListMenu}>
                  <p className={styles.ProductName}>Usuários</p>
                  <div
                    className={styles.ListMenuFilter}
                    onClick={() => toggleFilter("foam")}
                  >
                    <img src="./Filter.svg"></img>{" "}
                    <span className={styles.ListMenuFilterText}>Filtros</span>
                  </div>
                  <SearchInputListProducts
                    handleSearchChange={(e) => handleSearchChange(e)}
                  ></SearchInputListProducts>
                </div>

                <div className={styles.ListMenuRight}>
                  <Link href="/AddUser">
                    <button className={styles.ListMenuButton}>
                      <span className={styles.maisNoneMobile}>
                        {" "}
                        Novo Usuário
                      </span>
                      <span className={styles.maisNone}> +</span>
                    </button>
                  </Link>
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
                  {/* <div className={styles.filterItem}>
                    <input
                      type="radio"
                      id="maiorLucro"
                      name="ordenarPor"
                      value="maiorLucro"
                      onChange={handleOrderValueChange}
                      className={styles.filterItem}
                    />
                    <label htmlFor="maiorLucro">Maior % Lucro</label>
                  </div>
                  <div className={styles.filterItem}>
                    <input
                      type="radio"
                      id="maiorValorMetro"
                      name="ordenarPor"
                      value="maiorValorMetro"
                      onChange={handleOrderValueChange}
                      className={styles.filterItem}
                    />
                    <label htmlFor="maiorValorMetro">
                      Maior Valor por Metro
                    </label>
                  </div>
                  <div className={styles.filterItem}>
                    <input
                      type="radio"
                      id="maiorValorPerda"
                      name="ordenarPor"
                      value="maiorValorPerda"
                      onChange={handleOrderValueChange}
                      className={styles.filterItem}
                    />
                    <label htmlFor="maiorValorPerda">
                      Maior Valor da Perda
                    </label>
                  </div> */}
                </div>
              </div>
              <div className={styles.MarginTop}></div>
              {/* <GridComponent/> */}
              <TableSupplier
                searchValue={searchValue}
                orderValue={orderValue}
                filterValue={filterValue}
              />
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Total Maxx 2023, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
