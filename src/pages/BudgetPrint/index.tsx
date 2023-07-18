import Head from "next/head";
import styles from "../../styles/BudgetPrint.module.scss";
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
export default function BudgetPrint() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedOptionPrint, setSelectedOptionPrint] = useState("");
  const [selectedOptionPrintType, setSelectedOptionPrintType] =
    useState("");

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
          window.location.href = "/BudgetSave";
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
  const [preco, setPreco] = useState(0);
  const [produtos, setProdutos] = useState<Foam[]>([]);

  let userId: string | null;
  if (typeof window !== 'undefined') {
    userId = window.localStorage.getItem('userId');
  }

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/${userId}/Impressao`);
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

  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (selectedOptionPrintType && selectedOptionPrint === "SIM") {
      const selectedProduto = produtos.find(produto => produto.codigo === selectedOptionPrintType);
      if (selectedProduto) {
        const tamanho = localStorage.getItem("Tamanho") || "0x0";
        const [altura, largura] = tamanho.split('x').map(Number);

        const valor = ((altura / 100) * (largura / 100)) * selectedProduto.valorMetro;
        const perda = (valor / 100) * selectedProduto.valorPerda;
        const lucro = ((valor + perda) * selectedProduto.margemLucro / 100)

        setPreco(prevPreco => {
          const novoPreco = valor + perda + lucro;
          localStorage.setItem("valorImpressao", novoPreco.toString());
          localStorage.setItem("metroImpressao", selectedProduto.valorMetro.toString())
          localStorage.setItem("perdaImpressao", selectedProduto.valorPerda.toString())
          localStorage.setItem("lucroImpressao", selectedProduto.margemLucro.toString())
          return novoPreco;
        });

      }
    }
  }, [selectedOptionPrintType, produtos]);



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
              O pedido necessita de impressão?
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
                <option value="" disabled selected>
                  Inclui impressão?
                </option>
                <option value="SIM" selected={selectedOptionPrint === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionPrint === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div>

            {selectedOptionPrint === "SIM" && (
              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Tipo de impressão</p>
                <select
                  id="tipoImpressao"
                  className={styles.SelectField}
                  value={selectedOptionPrintType}
                  onChange={handleSelectChangePrintType}
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
            )}
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
