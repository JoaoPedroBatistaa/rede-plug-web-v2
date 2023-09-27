import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/BudgetSize.module.scss";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { MouseEvent, SetStateAction, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMenu } from "../../components/Context/context";

export default function BudgetSize() {
  const [hasBudgets, setHasBudgets] = useState(false);
  const router = useRouter();

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

  const [altura, setAltura] = useState(() => {
    if (typeof window !== "undefined") {
      let tamanho;
      if (localStorage.getItem("novoTamanho")) {
        tamanho = localStorage.getItem("novoTamanho");
      } else {
        tamanho = localStorage.getItem("Tamanho");
      }
      if (tamanho) {
        const [altura] = tamanho.split("x").map(Number);
        return altura.toString();
      }
    }
    return "";
  });

  const [largura, setLargura] = useState(() => {
    if (typeof window !== "undefined") {
      let tamanho;
      if (localStorage.getItem("novoTamanho")) {
        tamanho = localStorage.getItem("novoTamanho");
      } else {
        tamanho = localStorage.getItem("Tamanho");
      }
      if (tamanho) {
        const [, largura] = tamanho.split("x").map(Number);
        return largura.toString();
      }
    }
    return "";
  });

  const updateLocalStorage = (
    novaAltura: SetStateAction<string>,
    novaLargura: SetStateAction<string>
  ) => {
    let alturaFormatada = "";
    let larguraFormatada = "";

    if (typeof novaAltura === "string") {
      alturaFormatada = novaAltura.replace(",", ".");
    }

    if (typeof novaLargura === "string") {
      larguraFormatada = novaLargura.replace(",", ".");
    }

    const value = `${alturaFormatada}x${larguraFormatada}`;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("Tamanho", value);
      if (localStorage.getItem("novoTamanho")) {
        localStorage.setItem("novoTamanho", value);
      }
    }
  };

  const handleAlturaChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    const novaAltura = event.target.value;
    setAltura(novaAltura);
    updateLocalStorage(novaAltura, largura);
  };

  const handleLarguraChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    const novaLargura = event.target.value;
    setLargura(novaLargura);
    updateLocalStorage(altura, novaLargura);
  };
  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    if (typeof window !== "undefined") {
      const valorPerfil = Number(localStorage.getItem("valorPerfil"));
      const valorFoam = Number(localStorage.getItem("valorFoam"));
      const valorMontagem = Number(localStorage.getItem("valorMontagem"));
      const valorVidro = Number(localStorage.getItem("valorVidro"));
      const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
      const tamanho = localStorage.getItem("Tamanho") || "0x0";
      const [altura, largura] = tamanho.split("x").map(Number);

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

  const { openMenu, setOpenMenu } = useMenu();

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
        const valorMontagem = Number(localStorage.getItem("valorMontagem"));
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

  if (typeof window !== "undefined") {
    const tamanho = localStorage.getItem("Tamanho") || "0x0";
    const [altura, largura] = tamanho.split("x").map(Number);
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
      <div className={styles.Container}>
        <SideMenuBudget activeRoute={router.pathname}></SideMenuBudget>

        <div className={styles.BudgetContainer} onClick={handleOpenMenuDiv}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>
              Qual o tamanho do que deseja emoldurar?
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
            Lembre-se de utilizar os tamanhos sempre em centímetros
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Altura *</p>
              <input
                id="altura"
                type="text"
                className={styles.Field}
                placeholder=""
                value={altura}
                onChange={handleAlturaChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Largura *</p>
              <input
                id="largura"
                type="text"
                className={styles.Field}
                placeholder=""
                value={largura}
                onChange={handleLarguraChange}
              />
            </div>
          </div>

          <p className={styles.Preview}>PREVIEW</p>

          <div className={styles.PreviewContainer}>
            <div className={styles.PreviewImgContainer}>
              <img src="./molduraSize.png" className={styles.PreviewImg} />
              <p className={styles.PreviewSize}>{altura} CM</p>
            </div>

            <p className={styles.PreviewSize}>{largura} CM</p>
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
