import Head from "next/head";
import styles from "../../styles/BudgetPerfil.module.scss";
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

export default function BudgetPerfil() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<Foam[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [espessura, setEspessura] = useState("");
  const { openMenu, setOpenMenu } = useMenu();
  const [preco, setPreco] = useState(0);

  localStorage.setItem("preco", JSON.stringify(0));


  const userId = localStorage.getItem('userId');


  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/${userId}/Perfil`);
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

    const precoAnterior = JSON.parse(localStorage.getItem("preco") || "0");
    setPreco(preco + precoAnterior);

  }, []);

  useEffect(() => {
    if (selectedOption) {
      localStorage.setItem("codigoPerfil", selectedOption);
      localStorage.setItem("espessuraPerfil", espessura);
    }
  }, [selectedOption, espessura]);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    const selectedProduto = produtos.find(produto => produto.codigo === event.target.value);
    if (selectedProduto) {
      console.log(`Margem de Lucro: ${selectedProduto.margemLucro}`);
      console.log(`Valor por Metro: ${selectedProduto.valorMetro}`);
      console.log(`Valor de Perda: ${selectedProduto.valorPerda}`);
      console.log(`Fabricante: ${selectedProduto.fabricante}`);

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

  const handleEspessuraChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEspessura(event.target.value);
  };

  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    toast.error("Informe se o pedido incluirá vidro");
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
            <p className={styles.BudgetTitle}>Qual perfil será utilizado?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R${preco.toFixed(2)}</p>
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
            Informe abaixo qual perfil será utilizado no pedido
          </p>

          <div className={styles.InputContainer}>
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

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Espessura do perfil</p>
              <input
                id="espessura"
                type="text"
                className={styles.Field}
                placeholder=""
                value={espessura}
                onChange={handleEspessuraChange}
              />
            </div>
          </div>

          <p className={styles.Preview}>PREVIEW</p>

          <div className={styles.PreviewContainer}>
            <div className={styles.PreviewImgContainer}>
              <img src="./molduraPerfil.png" className={styles.PreviewImg} />
            </div>

            <p className={styles.PreviewSize}>{espessura} CM</p>
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
