import Head from "next/head";
import styles from "../../styles/BudgetPrint.module.scss";
import { useRouter } from "next/router";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MouseEvent } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function BudgetPrint() {
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState("opcao1");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedOptionPrint, setSelectedOptionPrint] = useState("opcao1");
  const [selectedOptionPrintType, setSelectedOptionPrintType] =
    useState("opcao1");

  useEffect(() => {
    localStorage.setItem("impressao", selectedOptionPrint);
  }, [selectedOptionPrint]);

  const handleSelectChangePrint = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionPrint(event.target.value);
  };

  useEffect(() => {
    localStorage.setItem("tipoImpressao", selectedOptionPrintType);
  }, [selectedOptionPrintType]);

  const handleSelectChangePrintType = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionPrintType(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      setIsFileSelected(true);
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);

    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    setIsFileSelected(false);
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
            <p className={styles.BudgetTitle}>
              O pedido necessita de impressão?
            </p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R$996,00</p>
              </div>


              <button className={styles.FinishButton} onClick={handleButtonFinish}>
                <img src="./finishBudget.png" alt="Finalizar" className={styles.buttonImage} />
                <span className={styles.buttonText}>Finalizar Orçamento</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo se este pedido utilizará impressão
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Impressão</p>
              <select
                id="impressao"
                className={styles.SelectField}
                value={selectedOptionPrint}
                onChange={handleSelectChangePrint}
              >
                <option value="SIM" selected={selectedOptionPrint === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionPrint === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Tipo de impressão</p>
              <select
                id="tipoImpressao"
                className={styles.SelectField}
                value={selectedOptionPrintType}
                onChange={handleSelectChangePrintType}
              >
                <option
                  value="PAPEL"
                  selected={selectedOptionPrintType === "PAPEL"}
                >
                  PAPEL
                </option>
                <option
                  value="TELA"
                  selected={selectedOptionPrintType === "TELA"}
                >
                  TELA
                </option>
                <option
                  value="BANNER"
                  selected={selectedOptionPrintType === "BANNER"}
                >
                  BANNER
                </option>
              </select>
            </div>
          </div>

          <p className={styles.Preview}>Envio do arquivo de impressão</p>

          <div className={styles.PrintContainer}>
            <img src="/upload.png" className={styles.Upload} />

            <label htmlFor="fileInput" className={styles.LabelUpload}>
              Arraste e jogue seu anexo aqui ou se preferir{" "}
            </label>
            <input
              type="file"
              accept=".pdf, .jpeg, .jpg, .png"
              onChange={handleFileChange}
              id="fileInput"
              style={{ display: "none" }}
            />
            <button className={styles.UploadButton} onClick={handleClick}>
              Escolher arquivo
            </button>

            <p className={styles.UploadInfo}>
              Formatos aceitos PDF, JPEG e PNG
            </p>
          </div>

          <div
            className={styles.FileSelected}
            style={{ display: isFileSelected ? "flex" : "none" }}
          >
            <img src="./file.png" className={styles.FileImg} />

            <div className={styles.FileSelectedStats}>
              <div className={styles.FileSelectedName}>
                {selectedFile && (
                  <p className={styles.FileInfo}>{selectedFile.name}</p>
                )}
                <p className={styles.FileInfo}>100%</p>
              </div>

              <div className={styles.FileSelectedBar}></div>
            </div>

            <img
              src="./trash.png"
              className={styles.FileDelete}
              onClick={handleClearFile}
            />
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
