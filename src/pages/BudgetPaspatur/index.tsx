import Head from "next/head";
import styles from "../../styles/BudgetPaspatur.module.scss";
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

export default function BudgetPaspatur() {
  const router = useRouter();
  const { openMenu, setOpenMenu } = useMenu();
  const [selectedOptionPaspatur, setSelectedOptionPaspatur] =
    useState("opcao1");
  const [selectedOptionCodigoPaspatur, setSelectedOptionCodigoPaspatur] =
    useState("opcao1");
  const [larguraSuperior, setLarguraSuperior] = useState("");
  const [larguraEsquerda, setLarguraEsquerda] = useState("");
  const [larguraInferior, setLarguraInferior] = useState("");
  const [larguraDireita, setLarguraDireita] = useState("");

  const [produtos, setProdutos] = useState<Foam[]>([]);
  const userId = localStorage.getItem('userId');

  // Fetch produtos do banco de dados
  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/${userId}/Paspatur`);
      console.log('Fetching from: ', dbCollection);
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
          fabricante: data.fabricante,
          largura: data.largura,
        };
        console.log('Fetched data:', budget);
        return budget;
      });
      setProdutos(budgetList);
      console.log('Set data: ', budgetList);
    };
    fetchData();
  }, []);

  //...

  const handleSelectChangeCodigoPaspatur = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionCodigoPaspatur(event.target.value);
    const selectedProduto = produtos.find(produto => produto.codigo === event.target.value);
    if (selectedProduto) {
      console.log(`Descrição: ${selectedProduto.descricao}`);
      console.log(`Margem de Lucro: ${selectedProduto.margemLucro}`);
      console.log(`Valor por Metro: ${selectedProduto.valorMetro}`);
      console.log(`Valor de Perda: ${selectedProduto.valorPerda}`);
      console.log(`Fabricante: ${selectedProduto.fabricante}`);
    }
  };



  useEffect(() => {
    localStorage.setItem("paspatur", selectedOptionPaspatur);
    localStorage.setItem("codigoPaspatur", selectedOptionCodigoPaspatur);
    localStorage.setItem(
      "dimensoesPaspatur",
      `${larguraSuperior}x${larguraEsquerda}x${larguraInferior}x${larguraDireita}`
    );
  }, [
    selectedOptionPaspatur,
    selectedOptionCodigoPaspatur,
    larguraSuperior,
    larguraEsquerda,
    larguraInferior,
    larguraDireita,
  ]);

  const handleSelectChangePaspatur = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionPaspatur(event.target.value);
  };

  // const handleSelectChangeCodigoPaspatur = (
  //   event: ChangeEvent<HTMLSelectElement>
  // ) => {
  //   setSelectedOptionCodigoPaspatur(event.target.value);
  // };

  const handleInputChangeSuperior = (event: ChangeEvent<HTMLInputElement>) => {
    setLarguraSuperior(event.target.value);
  };

  const handleInputChangeEsquerda = (event: ChangeEvent<HTMLInputElement>) => {
    setLarguraEsquerda(event.target.value);
  };

  const handleInputChangeInferior = (event: ChangeEvent<HTMLInputElement>) => {
    setLarguraInferior(event.target.value);
  };

  const handleInputChangeDireita = (event: ChangeEvent<HTMLInputElement>) => {
    setLarguraDireita(event.target.value);
  };
  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    toast.success("Finalizando Orçamento!");
    setTimeout(() => {
      window.location.href = "/BudgetSave";
    }, 500);
  }
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
            <p className={styles.BudgetTitle}>O pedido inclui paspatur?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R$996,00</p>
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
            Informe abaixo se paspatur será utilizado no pedido
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Paspatur</p>
              <select
                id="paspatur"
                className={styles.SelectField}
                value={selectedOptionPaspatur}
                onChange={handleSelectChangePaspatur}
              >
                <option value="SIM" selected={selectedOptionPaspatur === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionPaspatur === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <select
                id="codigoPaspatur"
                className={styles.SelectField}
                value={selectedOptionCodigoPaspatur}
                onChange={handleSelectChangeCodigoPaspatur}
              >
                {produtos.map((produto) => (
                  <option
                    key={produto.codigo}
                    value={produto.codigo}
                    selected={selectedOptionCodigoPaspatur === produto.codigo}
                  >
                    {produto.codigo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.PreviewContainer}>
            <div className={styles.InputFieldPreview}>
              <p className={styles.FieldLabel}>Espessura superior</p>
              <input
                id="larguraSuperior"
                type="text"
                className={styles.FieldPreview}
                placeholder=""
                value={larguraSuperior}
                onChange={handleInputChangeSuperior}
              />
            </div>

            <div className={styles.PreviewImgContainer}>
              <div className={styles.InputFieldPreview}>
                <p className={styles.FieldLabel}>Espessura esquerda</p>
                <input
                  id="larguraEsquerda"
                  type="text"
                  className={styles.FieldPreview}
                  placeholder=""
                  value={larguraEsquerda}
                  onChange={handleInputChangeEsquerda}
                />
              </div>

              <img src="./molduraSize.png" className={styles.PreviewImg} />

              <div className={styles.InputFieldPreview}>
                <p className={styles.FieldLabel}>Espessura direita</p>
                <input
                  id="larguraDireita"
                  type="text"
                  className={styles.FieldPreview}
                  placeholder=""
                  value={larguraDireita}
                  onChange={handleInputChangeDireita}
                />
              </div>
            </div>

            <div className={styles.InputFieldPreview}>
              <p className={styles.FieldLabel}>Espessura inferior</p>
              <input
                id="larguraInferior"
                type="text"
                className={styles.FieldPreview}
                placeholder=""
                value={larguraInferior}
                onChange={handleInputChangeInferior}
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
