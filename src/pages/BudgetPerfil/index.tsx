import Head from "next/head";
import styles from "../../styles/BudgetPerfil.module.scss";
import { useRouter } from "next/router";
import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
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
  const [precoTotal, setPrecoTotal] = useState(0);

  let userId: string | null;
  if (typeof window !== 'undefined') {
    userId = window.localStorage.getItem('userId');
  }

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


  const [preco, setPreco] = useState(0);

  useEffect(() => {
    if (selectedOption) {
      const selectedProduto = produtos.find(produto => produto.codigo === selectedOption);
      if (selectedProduto) {
        const tamanho = localStorage.getItem("Tamanho") || "0x0";
        const [altura, largura] = tamanho.split('x').map(Number);

        const valor = (((((altura * 2) + (largura * 2)) + (selectedProduto.largura * 4))) / 100) * selectedProduto.valorMetro;
        const perda = (valor / 100) * selectedProduto.valorPerda;
        const lucro = ((valor + perda) * selectedProduto.margemLucro / 100)



        setPreco(prevPreco => {
          const novoPreco = valor + perda + lucro;
          localStorage.setItem("valorPerfil", novoPreco.toString());
          localStorage.setItem("metroPerfil", selectedProduto.valorMetro.toString())
          localStorage.setItem("perdaPerfil", selectedProduto.valorPerda.toString())
          localStorage.setItem("lucroPerfil", selectedProduto.margemLucro.toString())
          localStorage.setItem("larguraPerfil", selectedProduto.largura.toString())
          localStorage.setItem("perfil", espessura.toString())
          return novoPreco;
        });

        // setPrecoTotal(preco + valorFoam + valorVidro);

      }
    }
  }, [selectedOption, espessura, produtos]);

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

  useEffect(() => {
    if (selectedOption) {
      if (typeof window !== "undefined") {
        localStorage.setItem("codigoPerfil", selectedOption);
        localStorage.setItem("espessuraPerfil", espessura);
      }
    }
  }, [selectedOption, espessura]);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleEspessuraChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEspessura(event.target.value);
  };

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
          window.location.href = "/BudgetDecision";
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
                <p className={styles.ValueLabel}>Valor do perfil</p>
                <p className={styles.Value}>R${preco.toFixed(2)}</p>
              </div>
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

            {/* <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Largura do perfil</p>
              <input
                id="espessura"
                type="text"
                className={styles.Field}
                placeholder=""
                value={espessura}
                onChange={handleEspessuraChange}
              />
            </div> */}
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
