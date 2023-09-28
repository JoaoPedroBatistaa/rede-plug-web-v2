import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Requests.module.scss";

import HeaderProducts from "@/components/HeaderClients";
import SearchInputListProducts from "@/components/InputSearchListClients";
import SideMenuHome from "@/components/SideMenuHome";
import TableClients from "@/components/TableClients";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  writeBatch,
} from "firebase/firestore";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../../firebase";

type Budget = {
  id: string;
  [key: string]: any;
};

export default function Products() {
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

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/${userId}/Perfil`);
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setData(budgetList);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const hash = window.location.hash;
      const elementId = hash.replace("#", "");

      if (
        elementId === "perfil" ||
        elementId === "paspatur" ||
        elementId === "colagem" ||
        elementId === "impressao" ||
        elementId === "foam" ||
        elementId === "vidro" ||
        elementId === "diversos"
      ) {
        const element = document.getElementById(elementId);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [data]);

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

  const handleIncrease = async (product: any) => {
    const increasePercentage = parseFloat(increaseValue) / 100;
    const db = getFirestore();
    const userId = window.localStorage.getItem("userId");

    const collectionPath = `Login/${userId}/${product}`;

    try {
      const q = query(collection(db, collectionPath));
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db); // Correção: usar db.batch() em vez de getFirestore().batch()

      querySnapshot.forEach((doc) => {
        const docRef = doc.ref;
        const oldData = doc.data();
        if (oldData.valorMetro) {
          const newValue =
            parseFloat(oldData.valorMetro) +
            parseFloat(oldData.valorMetro) * increasePercentage;
          batch.update(docRef, { valorMetro: newValue });
        }
      });

      await batch.commit();
      console.log(`Preços do produto ${product} atualizados`);
      toast.success(`Preços do produto ${product} atualizados com sucesso!`);

      window.location.reload();
    } catch (error) {
      console.error(
        `Erro ao atualizar os preços do produto ${product}: `,
        error
      );
      toast.error(`Erro ao atualizar os preços do produto ${product}.`);
    }
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
                <p className={styles.ProductNameMobile}>Clientes</p>

                <div className={styles.porcentContainerMobile}>
                  <div>
                    <input
                      type="text"
                      className={styles.InputEdit}
                      placeholder="Aumento em %"
                      onChange={handleIncreaseChange}
                    />
                  </div>
                  <button
                    className={styles.AumentoPorcent}
                    onClick={() => handleIncrease("Foam")}
                  >
                    <span className={styles.maisNoneMobile}> +</span>
                    <span className={styles.maisNone}> +</span>
                  </button>
                </div>
              </div>
              <div className={styles.ListMenu}>
                <div className={styles.ListMenu}>
                  <p className={styles.ProductName}>Clientes</p>
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
                  <Link href="/AddClient">
                    <button className={styles.ListMenuButton}>
                      <span className={styles.maisNoneMobile}>
                        {" "}
                        Novo Cliente
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
              <TableClients
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
