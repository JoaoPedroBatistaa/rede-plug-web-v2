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

export default function BudgetGlass() {
  const router = useRouter();

  const { openMenu, setOpenMenu } = useMenu();
  const [selectedOptionVidro, setSelectedOptionVidro] = useState("opcao1");
  const [selectedOptionEspessuraVidro, setSelectedOptionEspessuraVidro] =
    useState("opcao1");
  const [selectedOptionEspelho, setSelectedOptionEspelho] = useState("opcao1");
  const [selectedOptionEspessuraEspelho, setSelectedOptionEspessuraEspelho] =
    useState("opcao1");

  useEffect(() => {
    localStorage.setItem("vidro", selectedOptionVidro);
    localStorage.setItem("espessuraVidro", selectedOptionEspessuraVidro);
    localStorage.setItem("espelho", selectedOptionEspelho);
    localStorage.setItem("espessuraEspelho", selectedOptionEspessuraEspelho);
  }, [
    selectedOptionVidro,
    selectedOptionEspessuraVidro,
    selectedOptionEspelho,
    selectedOptionEspessuraEspelho,
  ]);

  const handleSelectChangeVidro = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionVidro(event.target.value);
  };

  const handleSelectChangeEspessuraVidro = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionEspessuraVidro(event.target.value);
  };

  const handleSelectChangeEspelho = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionEspelho(event.target.value);
  };

  const handleSelectChangeEspessuraEspelho = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionEspessuraEspelho(event.target.value);
  };

  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    toast.error("Informe qual foam será utilizado no pedido");
  }
  const handleOpenMenuDiv = () => {
    setOpenMenu(false);
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
            <p className={styles.BudgetTitle}>
              O pedido inclui vidro / espelho?
            </p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R$950,00</p>
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
                <option value="SIM" selected={selectedOptionVidro === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionVidro === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Espessura do Vidro</p>
              <select
                id="espessuraVidro"
                className={styles.SelectField}
                value={selectedOptionEspessuraVidro}
                onChange={handleSelectChangeEspessuraVidro}
              >
                <option
                  value="2MM"
                  selected={selectedOptionEspessuraVidro === "2MM"}
                >
                  2MM
                </option>
                <option
                  value="4MM"
                  selected={selectedOptionEspessuraVidro === "4MM"}
                >
                  4MM
                </option>
                <option
                  value="6MM"
                  selected={selectedOptionEspessuraVidro === "6MM"}
                >
                  6MM
                </option>
              </select>
            </div>
          </div>

          <div className={styles.InputContainer}>
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
