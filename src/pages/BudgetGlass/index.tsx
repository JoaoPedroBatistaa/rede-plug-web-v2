import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/BudgetGlass.module.scss";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMenu } from "../../components/Context/context";

import { getDocs } from "firebase/firestore";
import { collection, db } from "../../../firebase";

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
  const [hasBudgets, setHasBudgets] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const budgets = localStorage.getItem("budgets");

    if (budgets) {
      setHasBudgets(true);
    }

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const { openMenu, setOpenMenu } = useMenu();
  const [selectedOptionVidro, setSelectedOptionVidro] = useState("");

  useEffect(() => {
    localStorage.setItem("vidro", selectedOptionVidro);
  }, [selectedOptionVidro]);

  const [vidro, setVidro] = useState("");

  const handleSelectChangeVidro = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionVidro(event.target.value);
    setVidro(event.target.value);

    console.log(selectedOptionVidro);
  };

  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    if (typeof window !== "undefined") {
      const valorPerfil = Number(localStorage.getItem("valorPerfil"));
      const valorFoam = Number(localStorage.getItem("valorFoam"));
      const valorMontagem = Number(localStorage.getItem("valorMontagem"));
      const valorVidro = Number(localStorage.getItem("valorVidro"));
      const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
      const tamanho = localStorage.getItem("Tamanho") || "0x0";

      if (
        valorPerfil ||
        valorFoam ||
        valorVidro ||
        valorMontagem ||
        (valorPaspatur && tamanho !== "0x0") ||
        tamanho !== "x"
      ) {
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

  const [produtos, setProdutos] = useState<Foam[]>([]);
  const [precoTotal, setPrecoTotal] = useState(0);

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  const [preco, setPreco] = useState(() => {
    if (typeof window !== "undefined") {
      const valorVidro = localStorage.getItem("valorVidro");
      return valorVidro ? Number(valorVidro) : 0;
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/lB2pGqkarGyq98VhMGM6/Vidro`);
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

  const [selectedOption, setSelectedOption] = useState(() => {
    if (typeof window !== "undefined") {
      const codigoVidro = localStorage.getItem("codigoVidro");
      return codigoVidro ? codigoVidro : "";
    }
  });

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("codigoVidro", event.target.value);
  };

  useEffect(() => {
    const selectedProduto = produtos.find(
      (produto) => produto.codigo === selectedOption
    );
    if (selectedProduto) {
      const tamanho =
        localStorage.getItem("novoTamanho") ||
        localStorage.getItem("Tamanho") ||
        "0x0";
      const [altura, largura] = tamanho.split("x").map(Number);

      const valor =
        (altura / 100) * (largura / 100) * selectedProduto.valorMetro;
      const perda = (valor / 100) * selectedProduto.valorPerda;
      const lucro = ((valor + perda) * selectedProduto.margemLucro) / 100;

      setPreco((prevPreco) => {
        const novoPreco = valor + perda + lucro;
        localStorage.setItem("valorVidro", novoPreco.toString());
        if (!localStorage.getItem("novoTamanho")) {
          localStorage.setItem("valorVidroAntigo", novoPreco.toString());
        }
        localStorage.setItem(
          "metroVidro",
          selectedProduto.valorMetro.toString()
        );
        localStorage.setItem(
          "perdaVidro",
          selectedProduto.valorPerda.toString()
        );
        localStorage.setItem(
          "lucroVidro",
          selectedProduto.margemLucro.toString()
        );
        localStorage.setItem(
          "descricaoVidro",
          selectedProduto.descricao.toString()
        );
        return novoPreco;
      });

      // }
    }
  }, [selectedOption, vidro, produtos]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (typeof window !== "undefined") {
        const valorPerfil = Number(localStorage.getItem("valorPerfil"));
        const valorFoam = Number(localStorage.getItem("valorFoam"));
        const valorVidro = Number(localStorage.getItem("valorVidro"));
        const valorMontagem = Number(localStorage.getItem("valorMontagem"));
        const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
        const valorImpressao = Number(localStorage.getItem("valorImpressao"));
        const valorColagem = Number(localStorage.getItem("valorColagem"));
        const valorInstalacao = Number(localStorage.getItem("valorInstalacao"));

        setPrecoTotal(
          valorPaspatur +
            valorPerfil +
            valorFoam +
            valorVidro +
            valorImpressao +
            valorInstalacao +
            valorColagem +
            valorMontagem
        );
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  function handleRemoveProduct() {
    localStorage.removeItem("valorVidro");
    localStorage.removeItem("metroVidro");
    localStorage.removeItem("perdaVidro");
    localStorage.removeItem("lucroVidro");
    localStorage.removeItem("descricaoVidro");
    localStorage.removeItem("codigoVidro");

    setPreco(0);
    setSelectedOption("");
  }

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
                <p className={styles.ValueLabel}>Valor do Vidro</p>
                <p className={styles.Value}>R${preco ? preco.toFixed(2) : 0}</p>
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

              {hasBudgets && (
                <button
                  className={styles.DesistirOrcamento}
                  onClick={handleButtonFinish}
                >
                  <img
                    src="./finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>
                    Desistir Do Orçamento
                  </span>
                </button>
              )}
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo se o pedido incluirá vidro
          </p>

          <div className={styles.InputContainer}>
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
                {produtos.map((produto) => (
                  <option key={produto.codigo} value={produto.codigo}>
                    {produto.codigo} - {produto.descricao}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>.</p>

              <button
                className={styles.removeProduct}
                onClick={handleRemoveProduct}
              >
                Remover
              </button>
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
