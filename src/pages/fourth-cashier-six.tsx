import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { db, storage } from "../../firebase";

import LoadingOverlay from "@/components/Loading";

interface Nozzle {
  nozzleNumber: string;
  product: string;
}

export default function NewPost() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [managerName, setManagerName] = useState("");

  const etanolRef = useRef(null);
  const gcRef = useRef(null);

  const [etanolImage, setEtanolImage] = useState<File | null>(null);
  const [etanolFileName, setEtanolFileName] = useState("");

  const [gcImage, setGcImage] = useState<File | null>(null);
  const [gcFileName, setGcFileName] = useState("");

  const handleEtanolFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setEtanolImage(file); // Consider renaming this state to setEtanolFile
      setEtanolFileName(file.name);
    }
  };

  useEffect(() => {
    const postName = localStorage.getItem("userPost");

    if (postName) {
      const fetchPostDetails = async () => {
        try {
          const postsRef = collection(db, "POSTS");
          const q = query(postsRef, where("name", "==", postName));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const postData = doc.data();
          });
        } catch (error) {
          console.error("Error fetching post details:", error);
        }
      };

      fetchPostDetails();
    }
  }, []);

  const saveFourthCashier = async () => {
    setIsLoading(true);
    let missingField = "";
    const today = new Date().toISOString().slice(0, 10);

    if (!date) missingField = "Data";
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);

      return;
    } else if (!time) missingField = "Hora";
    else if (!managerName) missingField = "Nome do Gerente";
    else if (!etanolImage) missingField = "Arquivo do quarto caixa"; // Consider changing the name to etanolFile for clarity

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);

      return;
    }

    const userName = localStorage.getItem("userName");
    const postName = localStorage.getItem("userPost");

    const fourthCashierRef = collection(db, "MANAGERS");
    const q = query(
      fourthCashierRef,
      where("date", "==", date),
      where("userName", "==", userName),
      where("id", "==", "quarto-caixa-6h")
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("O quarto caixa das 6h já foi cadastrado hoje!");
      setIsLoading(false);

      return;
    }

    const fourthCashierData = {
      date,
      time,
      managerName,
      userName,
      postName,
      files: [], // Changed from images to files
      id: "quarto-caixa-6h",
    };

    // Preparar os uploads dos arquivos
    const uploadPromises = [];
    if (etanolImage) {
      // Consider changing the name to etanolFile for clarity
      const etanolPromise = uploadFileAndGetUrl(
        etanolImage, // Consider changing the name to etanolFile
        `fourthCashier/${date}/etanol_${etanolFileName}_${Date.now()}`
      ).then((fileUrl) => ({
        type: "Etanol",
        fileUrl,
        fileName: etanolFileName,
      }));
      uploadPromises.push(etanolPromise);
    }

    if (gcImage) {
      // This section can be adjusted or removed depending on the requirement
      const gcPromise = uploadFileAndGetUrl(
        gcImage,
        `fourthCashier/${date}/gc_${gcFileName}_${Date.now()}`
      ).then((fileUrl) => ({ type: "GC", fileUrl, fileName: gcFileName }));
      uploadPromises.push(gcPromise);
    }

    try {
      const files = await Promise.all(uploadPromises);
      // @ts-ignore
      fourthCashierData.files = files;

      const docRef = await addDoc(
        collection(db, "MANAGERS"),
        fourthCashierData
      );
      console.log("Quarto caixa salvo com ID: ", docRef.id);
      toast.success("Quarto caixa salvo com sucesso!");
      router.push("/manager-twenty-two-routine");
    } catch (error) {
      console.error("Erro ao salvar o quarto caixa: ", error);
      toast.error("Erro ao salvar o quarto caixa.");
    }
  };

  async function uploadFileAndGetUrl(file: File, path: string) {
    const storageRef = ref(storage, path);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    return downloadUrl;
  }

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <HeaderNewProduct></HeaderNewProduct>
      <ToastContainer />
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Quarto caixa 6h</p>
            <div className={styles.BudgetHeadS}>
              <button
                className={styles.FinishButton}
                onClick={saveFourthCashier}
              >
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Cadastrar caixa</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações do quarto caixa
          </p>

          <div className={styles.userContent}>
            <div className={styles.userData}>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Data</p>
                  <input
                    id="date"
                    type="date"
                    className={styles.Field}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Hora</p>
                  <input
                    id="time"
                    type="time"
                    className={styles.Field}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome do gerente</p>
                  <input
                    id="driverName"
                    type="text"
                    className={styles.Field}
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Arquivo do quarto caixa</p>
                <input
                  type="file"
                  accept=".pdf,.xlsx"
                  style={{ display: "none" }}
                  ref={etanolRef}
                  onChange={handleEtanolFileChange}
                />

                <button
                  // @ts-ignore
                  onClick={() => etanolRef.current && etanolRef.current.click()}
                  className={styles.MidiaField}
                >
                  Carregue seu arquivo
                </button>
                {etanolImage && (
                  <div>
                    <p className={styles.fileName}>{etanolFileName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
