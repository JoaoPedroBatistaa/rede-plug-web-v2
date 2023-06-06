import Head from "next/head";
import styles from "../../styles/BudgetCollage.module.scss";
import { useRouter } from "next/router";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MouseEvent } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function BudgetCollage() {
  const router = useRouter();

  const [selectedOptionCollage, setSelectedOptionCollage] = useState("opcao1");

  useEffect(() => {
    localStorage.setItem("collage", selectedOptionCollage);
  }, [selectedOptionCollage]);

  const handleSelectChangeCollage = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionCollage(event.target.value);
  };

  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    toast.success("Finalizando Orçamento!");
    setTimeout(() => {
      window.location.href = "/BudgetSave";
    }, 500);
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

        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Necessita de colagem?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R$106,00</p>
              </div>

              <button className={styles.FinishButton} onClick={handleButtonFinish}>
                <img src="./finishBudget.png" alt="Finalizar" className={styles.buttonImage} />
                <span className={styles.buttonText}>Finalizar Orçamento</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo se será utilizada colagem no pedido
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Colagem</p>
              <select
                id="collage"
                className={styles.SelectField}
                value={selectedOptionCollage}
                onChange={handleSelectChangeCollage}
              >
                <option value="SIM" selected={selectedOptionCollage === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionCollage === "NÃO"}>
                  NÃO
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
