import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/BudgetShip.module.scss";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMenu } from "../../components/Context/context";

import { getDocs } from "firebase/firestore";
import { collection, db } from "../../../firebase";

interface Montagem {
  id: string;

  codigo: string;
  descricao: string;
  valorMetro: number;
}

export default function BudgetMontagem() {
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
  // UseStates para Diversos
  const [selectedOptionInstall, setSelectedOptionInstall] = useState("opcao1");
  const [selectedOptionDelivery, setSelectedOptionDelivery] =
    useState("opcao1");

  const handleSelectChangeInstall = (event: ChangeEvent<HTMLSelectElement>) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("instalacao", event.target.value);
    }
  };

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  const [produtos, setProdutos] = useState<Montagem[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(
        db,
        `Login/lB2pGqkarGyq98VhMGM6/Montagem`
      );
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          descricao: data.descricao,
          codigo: data.codigo,
          valorMetro: data.valor,
        };
      });
      setProdutos(budgetList);
      console.log(budgetList);
    };
    fetchData();
  }, []);

  const [preco, setPreco] = useState(() => {
    if (typeof window !== "undefined") {
      const valorInstalacao = localStorage.getItem("valorMontagem");
      return valorInstalacao ? Number(valorInstalacao) : 0;
    }
  });

  const [selectedOption, setSelectedOption] = useState(() => {
    if (typeof window !== "undefined") {
      const codigoMontagem = localStorage.getItem("codigoMontagem");
      return codigoMontagem ? codigoMontagem : "";
    }
  });

  useEffect(() => {
    if (selectedOption) {
      const selectedProduto = produtos.find(
        (produto) => produto.codigo === selectedOption
      );
      if (selectedProduto) {
        setPreco((prevPreco) => {
          const novoPreco = selectedProduto.valorMetro;
          localStorage.setItem("valorMontagem", novoPreco.toString());
          localStorage.setItem(
            "descricaoMontagem",
            selectedProduto.descricao.toString()
          );
          return novoPreco;
        });

        // setPrecoTotal(preco + valorFoam + valorVidro);
      }
    }
  }, [selectedOption, produtos]);

  const handleSelectChangeDelivery = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tipoEntrega", event.target.value);
    }
  };

  const handleInputValueChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (typeof window !== "undefined") {
      localStorage.setItem(target.id, target.value);
    }
  };

  useEffect(() => {
    const valorMontagemElement = document.getElementById(
      "valorMontagem"
    ) as HTMLInputElement;
    const valorEntregaElement = document.getElementById(
      "valorEntrega"
    ) as HTMLInputElement;

    if (valorMontagemElement) {
      valorMontagemElement.addEventListener("input", handleInputValueChange);
    }

    if (valorEntregaElement) {
      valorEntregaElement.addEventListener("input", handleInputValueChange);
    }

    // Removendo os event listeners na desmontagem do componente
    return () => {
      if (valorMontagemElement) {
        valorMontagemElement.removeEventListener(
          "input",
          handleInputValueChange
        );
      }

      if (valorEntregaElement) {
        valorEntregaElement.removeEventListener(
          "input",
          handleInputValueChange
        );
      }
    };
  }, []);

  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    if (typeof window !== "undefined") {
      const valorPerfil = Number(localStorage.getItem("valorPerfil"));
      const valorFoam = Number(localStorage.getItem("valorFoam"));
      const valorVidro = Number(localStorage.getItem("valorVidro"));
      const valorInstalacao = Number(localStorage.getItem("valorInstalacao"));
      const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
      const tamanho = localStorage.getItem("Tamanho") || "0x0";

      if (
        valorPerfil ||
        valorFoam ||
        valorVidro ||
        valorInstalacao ||
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

  const [precoTotal, setPrecoTotal] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Salve o ID do intervalo para limpar mais tarde
      if (typeof window !== "undefined") {
        const valorPerfil = Number(localStorage.getItem("valorPerfil"));
        const valorFoam = Number(localStorage.getItem("valorFoam"));
        const valorVidro = Number(localStorage.getItem("valorVidro"));
        const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
        const valorImpressao = Number(localStorage.getItem("valorImpressao"));
        const valorColagem = Number(localStorage.getItem("valorColagem"));
        const valorInstalacao = Number(localStorage.getItem("valorInstalacao"));
        const valorMontagem = Number(localStorage.getItem("valorMontagem"));

        setPrecoTotal(
          valorPaspatur +
            valorPerfil +
            valorFoam +
            valorVidro +
            valorImpressao +
            valorColagem +
            valorInstalacao +
            valorMontagem
        );
      }
    }, 200); // Tempo do intervalo em milissegundos

    return () => clearInterval(intervalId); // Limpe o intervalo quando o componente for desmontado
  }, []);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("codigoMontagem", event.target.value);
  };

  function handleRemoveProduct() {
    // Limpa os valores do localStorage
    localStorage.removeItem("valorMontagem");
    localStorage.removeItem("descricaoMontagem");
    localStorage.removeItem("codigoMontagem");

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
            <p className={styles.BudgetTitle}>
              O pedido necessita de Montagem ou frete?
            </p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor da Montagem</p>
                <p className={styles.Value}>R${preco}</p>
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
            Informe abaixo se o pedido necessita de Montagem ou frete
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Tipo de entrega</p>
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
