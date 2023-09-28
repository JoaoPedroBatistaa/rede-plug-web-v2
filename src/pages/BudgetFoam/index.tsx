import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/BudgetFoam.module.scss";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

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

  const [produtos, setProdutos] = useState<Foam[]>([]);

  const [selectedOption, setSelectedOption] = useState(() => {
    if (typeof window !== "undefined") {
      const codigoFoam = localStorage.getItem("codigoFoam");
      return codigoFoam ? codigoFoam : "";
    }
  });

  const [selectedOptionFoam, setSelectedOptionFoam] = useState("");
  const [selectedOptionCodigoFoam, setSelectedOptionCodigoFoam] = useState("");
  const [selectedOptionMdf, setSelectedOptionMdf] = useState("");
  const [selectedOptionCodigoMdf, setSelectedOptionCodigoMdf] = useState("");

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/lB2pGqkarGyq98VhMGM6/Foam`);
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
    localStorage.setItem("mdf", selectedOptionMdf);
    localStorage.setItem("codigoMdf", selectedOptionCodigoMdf);
  }, [
    selectedOptionFoam,
    selectedOptionCodigoFoam,
    selectedOptionMdf,
    selectedOptionCodigoMdf,
  ]);

  const [preco, setPreco] = useState(() => {
    if (typeof window !== "undefined") {
      const valorFoam = localStorage.getItem("valorFoam");
      return valorFoam ? Number(valorFoam) : 0;
    }
  });

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("codigoFoam", event.target.value);
  };

  useEffect(() => {
    // if (selectedOption && selectedOptionFoam === "SIM") {
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
        localStorage.setItem("valorFoam", novoPreco.toString());
        if (!localStorage.getItem("novoTamanho")) {
          localStorage.setItem("valorFoamAntigo", novoPreco.toString());
        }
        localStorage.setItem(
          "metroFoam",
          selectedProduto.valorMetro.toString()
        );
        localStorage.setItem(
          "perdaFoam",
          selectedProduto.valorPerda.toString()
        );
        localStorage.setItem(
          "lucroFoam",
          selectedProduto.margemLucro.toString()
        );
        localStorage.setItem(
          "descricaoFoam",
          selectedProduto.descricao.toString()
        );

        return novoPreco;
      });
    }
    // }
  }, [selectedOption, produtos]);

  const [precoTotal, setPrecoTotal] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Salve o ID do intervalo para limpar mais tarde
      if (typeof window !== "undefined") {
        const valorPerfil = Number(localStorage.getItem("valorPerfil"));
        const valorFoam = Number(localStorage.getItem("valorFoam"));
        const valorMontagem = Number(localStorage.getItem("valorMontagem"));
        const valorVidro = Number(localStorage.getItem("valorVidro"));
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
    }, 200); // Tempo do intervalo em milissegundos

    return () => clearInterval(intervalId); // Limpe o intervalo quando o componente for desmontado
  }, []);

  const handleSelectChangeFoam = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionFoam(event.target.value);
  };

  const handleSelectChangeCodigoFoam = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionCodigoFoam(event.target.value);
  };

  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    if (typeof window !== "undefined") {
      const valorPerfil = Number(localStorage.getItem("valorPerfil"));
      const valorFoam = Number(localStorage.getItem("valorFoam"));
      const valorVidro = Number(localStorage.getItem("valorVidro"));
      const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
      const tamanho = localStorage.getItem("Tamanho") || "0x0";

      if (
        valorPerfil ||
        valorFoam ||
        valorVidro ||
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

  const { openMenu, setOpenMenu } = useMenu();
  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 100);
  };

  function handleRemoveProduct() {
    // Limpa os valores do localStorage
    localStorage.removeItem("valorFoam");
    localStorage.removeItem("metroFoam");
    localStorage.removeItem("perdaFoam");
    localStorage.removeItem("lucroFoam");
    localStorage.removeItem("descricaoFoam");
    localStorage.removeItem("codigoFoam");

    // Chama setPreco(0)
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
            <p className={styles.BudgetTitle}>O pedido inclui foam / MDF?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor do Foam</p>
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
            Informe abaixo qual foam será utilizado no pedido
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
