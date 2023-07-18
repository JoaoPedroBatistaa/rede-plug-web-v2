import Head from "next/head";
import styles from "../../styles/BudgetGlass.module.scss";
import { useRouter } from "next/router";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MouseEvent } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useMenu } from "../../components/Context/context";
import classnames from "classnames";

import { getDocs } from "firebase/firestore";
import { collection, db, getDoc, doc } from "../../../firebase";
import { deleteDoc } from "firebase/firestore";

interface Foam {
  id: string;

  codigo: string;
  descricao: string;
  margemLucro: number;
  valorMetro: number;
  valorPerda: number;
  fabricante: string;
  largura: number;

}

export default function BudgetGlass() {
  const router = useRouter();

  const { openMenu, setOpenMenu } = useMenu();
  const [selectedOptionVidro, setSelectedOptionVidro] = useState("");
  // const [selectedOptionEspessuraVidro, setSelectedOptionEspessuraVidro] =
  //   useState("opcao1");
  // const [selectedOptionEspelho, setSelectedOptionEspelho] = useState("opcao1");
  // const [selectedOptionEspessuraEspelho, setSelectedOptionEspessuraEspelho] =
  //   useState("opcao1");

  useEffect(() => {
    localStorage.setItem("vidro", selectedOptionVidro);
    // localStorage.setItem("espessuraVidro", selectedOptionEspessuraVidro);
    // localStorage.setItem("espelho", selectedOptionEspelho);
    // localStorage.setItem("espessuraEspelho", selectedOptionEspessuraEspelho);
  }, [
    selectedOptionVidro
    // selectedOptionEspessuraVidro,
    // selectedOptionEspelho,
    // selectedOptionEspessuraEspelho,
  ]);

  const [vidro, setVidro] = useState("");

  const handleSelectChangeVidro = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionVidro(event.target.value);
    setVidro(event.target.value);

    console.log(selectedOptionVidro);
  };

  // const handleSelectChangeEspessuraVidro = (
  //   event: ChangeEvent<HTMLSelectElement>
  // ) => {
  //   setSelectedOptionEspessuraVidro(event.target.value);
  // };

  // const handleSelectChangeEspelho = (event: ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedOptionEspelho(event.target.value);
  // };

  // const handleSelectChangeEspessuraEspelho = (
  //   event: ChangeEvent<HTMLSelectElement>
  // ) => {
  //   setSelectedOptionEspessuraEspelho(event.target.value);
  // };

  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {

    if (typeof window !== 'undefined') {
      const valorPerfil = Number(localStorage.getItem("valorPerfil"));
      const valorFoam = Number(localStorage.getItem("valorFoam"));
      const valorVidro = Number(localStorage.getItem("valorVidro"));
      const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
      const tamanho = localStorage.getItem("Tamanho") || "0x0";

      if (valorPerfil || valorFoam || valorVidro || valorPaspatur && tamanho !== "0x0" || tamanho !== "x") {

        window.localStorage.setItem("preco", JSON.stringify(precoTotal));

        toast.success("Finalizando Orçamento!");
        setTimeout(() => {
          window.location.href = "/BudgetSave";
        }, 500);
      } else {
        toast.error("Informe os dados necessarios");
      }
    }
  }


  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 100);
  };

  const [produtos, setProdutos] = useState<Foam[]>([]);
  const [preco, setPreco] = useState(0);
  const [precoTotal, setPrecoTotal] = useState(0);

  let userId: string | null;
  if (typeof window !== 'undefined') {
    userId = window.localStorage.getItem('userId');
  }

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/${userId}/Vidro`);
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          descricao: data.descricao,
          codigo: data.codigo,
          margemLucro: data.margemLucro,
          valorMetro: data.valorMetro,
          valorPerda: data.valorPerda,
          fabricante: data.fabricante,
          largura: data.largura,
        };
      });
      setProdutos(budgetList);
    };
    fetchData();
  }, []);

  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  // const [valorFoam, setValorFoam] = useState(0);
  // const [valorPerfil, setValorPerfil] = useState(0);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const valorPerfil = Number(localStorage.getItem("valorPerfil"));
  //     const valorFoam = Number(localStorage.getItem("valorFoam"));
  //     const valorVidro = Number(localStorage.getItem("valorVidro"));
  //     const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));

  //     setValorFoam(valorFoam);
  //     setValorPerfil(valorPerfil);

  //     setPrecoTotal(valorPerfil + valorFoam + valorVidro)
  //   }
  // }, []);




  useEffect(() => {
    if (selectedOption && selectedOptionVidro === "SIM") {
      const selectedProduto = produtos.find(produto => produto.codigo === selectedOption);
      if (selectedProduto) {
        const tamanho = localStorage.getItem("Tamanho") || "0x0";
        const [altura, largura] = tamanho.split('x').map(Number);

        const valor = ((altura / 100) * (largura / 100)) * selectedProduto.valorMetro;
        const perda = (valor / 100) * selectedProduto.valorPerda;
        const lucro = ((valor + perda) * selectedProduto.margemLucro / 100)




        setPreco(prevPreco => {
          const novoPreco = valor + perda + lucro;
          localStorage.setItem("valorVidro", novoPreco.toString());
          localStorage.setItem("metroVidro", selectedProduto.valorMetro.toString())
          localStorage.setItem("perdaVidro", selectedProduto.valorPerda.toString())
          localStorage.setItem("lucroVidro", selectedProduto.margemLucro.toString())
          return novoPreco;
        });

      }
    }
  }, [selectedOption, vidro, produtos]);

  useEffect(() => {
    const intervalId = setInterval(() => { // Salve o ID do intervalo para limpar mais tarde
      if (typeof window !== "undefined") {
        const valorPerfil = Number(localStorage.getItem("valorPerfil"));
        const valorFoam = Number(localStorage.getItem("valorFoam"));
        const valorVidro = Number(localStorage.getItem("valorVidro"));
        const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
        const valorImpressao = Number(localStorage.getItem("valorImpressao"));
        const valorColagem = Number(localStorage.getItem("valorColagem"));

        setPrecoTotal(valorPaspatur + valorPerfil + valorFoam + valorVidro + valorImpressao)
      }
    }, 200); // Tempo do intervalo em milissegundos

    return () => clearInterval(intervalId); // Limpe o intervalo quando o componente for desmontado
  }, []);

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <HeaderBudget></HeaderBudget>
      <ToastContainer />
      <div className={styles.Container} onClick={handleOpenMenuDiv}>
        <SideMenuBudget activeRoute={router.pathname}></SideMenuBudget>

        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>
              O pedido inclui vidro / espelho?
            </p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R${precoTotal.toFixed(2)}</p>
              </div>

              <button
                className={styles.FinishButton}
                onClick={handleButtonFinish}
              >
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Finalizar Orçamento</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo se o pedido incluirá vidro
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Vidro</p>
              <select
                id="vidro"
                className={styles.SelectField}
                value={selectedOptionVidro}
                onChange={handleSelectChangeVidro}
              >
                <option value="" disabled selected>
                  Inclui vidro?
                </option>
                <option value="SIM" selected={selectedOptionVidro === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionVidro === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div>

            {selectedOptionVidro === "SIM" && (
              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Espessura do Vidro</p>
                <select
                  id="codigo"
                  className={styles.SelectField}
                  value={selectedOption}
                  onChange={handleSelectChange}
                >
                  <option value="" disabled selected>
                    Selecione um código
                  </option>
                  {produtos.map(produto => (
                    <option key={produto.codigo} value={produto.codigo}>
                      {produto.codigo}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Espelho</p>
              <select
                id="espelho"
                className={styles.SelectField}
                value={selectedOptionEspelho}
                onChange={handleSelectChangeEspelho}
              >
                <option value="SIM" selected={selectedOptionEspelho === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionEspelho === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div>

            {selectedOptionEspelho === "SIM" && (
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Espessura do Espelho</p>
              <select
                id="espessuraEspelho"
                className={styles.SelectField}
                value={selectedOptionEspessuraEspelho}
                onChange={handleSelectChangeEspessuraEspelho}
              >
                <option
                  value="2MM"
                  selected={selectedOptionEspessuraEspelho === "2MM"}
                >
                  2MM
                </option>
                <option
                  value="4MM"
                  selected={selectedOptionEspessuraEspelho === "4MM"}
                >
                  4MM
                </option>
                <option
                  value="6MM"
                  selected={selectedOptionEspessuraEspelho === "6MM"}
                >
                  6MM
                </option>
              </select>
            </div>
            )}
          </div> */}

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
