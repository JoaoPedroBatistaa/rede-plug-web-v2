import Head from "next/head";
import styles from "../../styles/BudgetFoam.module.scss";
import { useRouter } from "next/router";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MouseEvent } from "react";
import "react-toastify/dist/ReactToastify.css";

import { useMenu } from "../../components/Context/context";
import classnames from "classnames";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

interface Foam {
  id: string;

  codigo: string;
  descricao: string;
  margemLucro: number;
  valorMetro: number;
  valorPerda: number;

}

export default function BudgetFoam() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<Foam[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionFoam, setSelectedOptionFoam] = useState("opcao1");
  const [selectedOptionCodigoFoam, setSelectedOptionCodigoFoam] =
    useState("opcao1");
  const [selectedOptionMdf, setSelectedOptionMdf] = useState("opcao1");
  const [selectedOptionCodigoMdf, setSelectedOptionCodigoMdf] =
    useState("opcao1");

    const userId = localStorage.getItem('userId');

    useEffect(() => {
      const fetchData = async () => {
        const dbCollection = collection(db, `Login/${userId}/Foam`);
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
  

  useEffect(() => {
    localStorage.setItem("foam", selectedOptionFoam);
    localStorage.setItem("codigoFoam", selectedOptionCodigoFoam);
    localStorage.setItem("mdf", selectedOptionMdf);
    localStorage.setItem("codigoMdf", selectedOptionCodigoMdf);
  }, [
    selectedOptionFoam,
    selectedOptionCodigoFoam,
    selectedOptionMdf,
    selectedOptionCodigoMdf,
  ]);

  const [preco, setPreco] = useState(0);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    const selectedProduto = produtos.find(produto => produto.codigo === event.target.value);
    if (selectedProduto) {
      console.log(`Margem de Lucro: ${selectedProduto.margemLucro}`);
      console.log(`Valor por Metro: ${selectedProduto.valorMetro}`);
      console.log(`Valor de Perda: ${selectedProduto.valorPerda}`);


      const tamanho = localStorage.getItem("Tamanho") || "0x0";
      const [altura, largura] = tamanho.split('x').map(Number);

      const valorMetro = ((altura * largura) / 100) * selectedProduto.valorMetro;
      const perda = (valorMetro / 100) * selectedProduto.valorPerda;
      const lucro = valorMetro + perda * (selectedProduto.margemLucro / 100)

      const precoAnterior = JSON.parse(localStorage.getItem("preco") || "0");
      setPreco(valorMetro + perda + lucro);

      const novo = precoAnterior + valorMetro + perda + lucro

      localStorage.setItem("preco", JSON.stringify(novo));
    }
  };

  const precoAnterior = JSON.parse(localStorage.getItem("preco") || "0");

  const handleSelectChangeFoam = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionFoam(event.target.value);
  };

  const handleSelectChangeCodigoFoam = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionCodigoFoam(event.target.value);
  };

  const handleSelectChangeMdf = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionMdf(event.target.value);
  };

  const handleSelectChangeCodigoMdf = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionCodigoMdf(event.target.value);
  };
  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    toast.error("Informe se paspatur será utilizado no pedido");
  }
  const { openMenu, setOpenMenu } = useMenu();
  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 100);
  };

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
            <p className={styles.BudgetTitle}>O pedido inclui foam / MDF?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R${precoAnterior.toFixed(2)}</p>
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
            Informe abaixo qual foam será utilizado no pedido
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Foam</p>
              <select
                id="Foam"
                className={styles.SelectField}
                value={selectedOptionFoam}
                onChange={handleSelectChangeFoam}
              >
                <option value="SIM" selected={selectedOptionFoam === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionFoam === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <select
                id="codigo"
                className={styles.SelectField}
                value={selectedOption}
                onChange={handleSelectChange}
              >
                {produtos.map(produto => (
                  <option key={produto.codigo} value={produto.codigo}>
                    {produto.codigo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>MDF</p>
              <select
                id="mdf"
                className={styles.SelectField}
                value={selectedOptionMdf}
                onChange={handleSelectChangeMdf}
              >
                <option value="SIM" selected={selectedOptionMdf === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionMdf === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Espessura do MDF</p>
              <select
                id="codigoMdf"
                className={styles.SelectField}
                value={selectedOptionCodigoMdf}
                onChange={handleSelectChangeCodigoMdf}
              >
                <option
                  value="55020"
                  selected={selectedOptionCodigoMdf === "55020"}
                >
                  55020
                </option>
                <option
                  value="55021"
                  selected={selectedOptionCodigoMdf === "55021"}
                >
                  55021
                </option>
                <option
                  value="55025"
                  selected={selectedOptionCodigoMdf === "55025"}
                >
                  55025
                </option>
              </select>
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
