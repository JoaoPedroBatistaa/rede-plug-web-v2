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

export default function BudgetShip() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

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

  const [produtos, setProdutos] = useState<Foam[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/${userId}/Instalacao`);
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
      console.log(budgetList);
    };
    fetchData();
  }, []);

  const [preco, setPreco] = useState(() => {
    if (typeof window !== "undefined") {
      const valorInstalacao = localStorage.getItem("valorInstalacao");
      return valorInstalacao ? Number(valorInstalacao) : 0;
    }
  });

  const [selectedOption, setSelectedOption] = useState(() => {
    if (typeof window !== "undefined") {
      const codigoInstalacao = localStorage.getItem("codigoInstalacao");
      return codigoInstalacao ? codigoInstalacao : "";
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
          localStorage.setItem("valorInstalacao", novoPreco.toString());
          localStorage.setItem(
            "descricaoInstalacao",
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
    const valorInstalacaoElement = document.getElementById(
      "valorInstalacao"
    ) as HTMLInputElement;
    const valorEntregaElement = document.getElementById(
      "valorEntrega"
    ) as HTMLInputElement;

    if (valorInstalacaoElement) {
      valorInstalacaoElement.addEventListener("input", handleInputValueChange);
    }

    if (valorEntregaElement) {
      valorEntregaElement.addEventListener("input", handleInputValueChange);
    }

    // Removendo os event listeners na desmontagem do componente
    return () => {
      if (valorInstalacaoElement) {
        valorInstalacaoElement.removeEventListener(
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
        const valorMontagem = Number(localStorage.getItem("valorMontagem"));
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

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("codigoInstalacao", event.target.value);
  };

  function handleRemoveProduct() {
    // Limpa os valores do localStorage
    localStorage.removeItem("valorInstalacao");
    localStorage.removeItem("descricaoInstalacao");
    localStorage.removeItem("codigoInstalacao");

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
              O pedido necessita de Diversos ou frete?
            </p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor da Diversos</p>
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
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo se o pedido necessita de Diversos ou frete
          </p>

          {/* <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Necessita de Diversos? *</p>
              <select
                id="instalacao"
                className={styles.SelectField}
                value={selectedOptionInstall}
                onChange={handleSelectChangeInstall}
              >
                <option value="SIM" selected={selectedOptionInstall === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionInstall === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor da Diversos</p>
              <p id="valorInstalacao" className={styles.FixedValue}>
                R$245,30
              </p>
            </div>
          </div> */}

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
            {/*
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor da entrega</p>
              <p id="valorEntrega" className={styles.FixedValue}>
                R$245,30
              </p>
            </div> */}
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
