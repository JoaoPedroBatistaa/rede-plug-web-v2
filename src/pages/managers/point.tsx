import HeaderNewProduct from "@/components/HeaderNewTask";
import LoadingOverlay from "@/components/Loading";
import imageCompression from "browser-image-compression";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { uploadBytes } from "firebase/storage";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, getDownloadURL, ref, storage } from "../../../firebase";
import styles from "../../styles/ProductFoam.module.scss";

export default function DigitalPointTask() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isInspection, setIsInspection] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  const [date, setDate] = useState("");

  const etanolRef = useRef(null);

  const [etanolImage, setEtanolImage] = useState<File | null>(null);
  const [etanolFileName, setEtanolFileName] = useState("");
  const [etanolImageUrl, setEtanolImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedInspection = localStorage.getItem("isInspection");
    const storedEtanolImageUrl = localStorage.getItem("etanolImageUrl");
    const storedEtanolFileName = localStorage.getItem("etanolFileName");

    if (storedEtanolImageUrl) setEtanolImageUrl(storedEtanolImageUrl);
    if (storedEtanolFileName) setEtanolFileName(storedEtanolFileName);
    if (storedInspection) {
      setIsInspection(storedInspection); // Recupera o valor do localStorage
    }
  }, []);

  async function compressImage(file: File) {
    const options = {
      maxSizeMB: 1, // Tamanho máximo do arquivo final em megabytes
      maxWidthOrHeight: 1920, // Dimensão máxima (largura ou altura) da imagem após a compressão
      useWebWorker: true, // Utiliza Web Workers para melhorar o desempenho
    };

    try {
      console.log(
        `Tamanho original da imagem: ${(file.size / 1024 / 1024).toFixed(2)} MB`
      );
      const compressedFile = await imageCompression(file, options);
      console.log(
        `Tamanho da imagem comprimida: ${(
          compressedFile.size /
          1024 /
          1024
        ).toFixed(2)} MB`
      );
      return compressedFile;
    } catch (error) {
      console.error("Erro ao comprimir imagem:", error);
      throw error;
    }
  }

  const handleEtanolImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        let compressedFile = file;
        if (file.type.startsWith("image/")) {
          compressedFile = await compressImage(file);
        }
        const imageUrl = await uploadImageAndGetUrl(
          compressedFile,
          `supervisors/${getLocalISODateTime()}/${file.name}_${Date.now()}`
        );
        setEtanolImage(compressedFile);
        setEtanolFileName(file.name);
        setEtanolImageUrl(imageUrl);

        // Armazena no localStorage
        localStorage.setItem("etanolImageUrl", imageUrl);
        localStorage.setItem("etanolFileName", file.name);
      } catch (error) {
        console.error("Erro ao fazer upload do arquivo:", error);
        toast.error("Erro ao fazer upload do arquivo.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getLocalISODateTime = () => {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    return {
      date: date.toISOString().slice(0, 10),
      time: date.toISOString().slice(11, 19),
    };
  };

  const saveMeasurement = async () => {
    setIsLoading(true);

    const today = getLocalISODateTime();

    const userName = localStorage.getItem("userName");
    const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "MANAGERS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("userName", "==", userName),
      where("id", "==", "digital_point")
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("O ponto já foi cadastrado hoje!");
      setIsLoading(false);
      return;
    }

    if (!isInspection) {
      toast.error("Por favor, selecione se há fiscalização.");
      setIsLoading(false);
      return;
    }

    const taskData = {
      date: today.date,
      time: today.time,
      managerName: userName,
      postName,
      isInspection,
      images: [
        {
          type: "Imagem da tarefa",
          imageUrl: etanolImageUrl,
          fileName: etanolFileName,
        },
      ],
      id: "digital_point",
    };

    try {
      // Verifica se a tarefa já foi realizada hoje
      const managersRef = collection(db, "SUPERVISORS");
      const q = query(
        managersRef,
        where("date", "==", today.date),
        where("id", "==", "digital_point"),
        where("supervisorName", "==", userName),
        where("postName", "==", postName)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        toast.error(
          "A tarefa de ponto digital já foi feita para esse turno hoje!"
        );
        setIsLoading(false);
        return;
      }

      await addDoc(collection(db, "MANAGERS"), taskData);

      toast.success("Tarefa de ponto digital salva com sucesso!");
      localStorage.removeItem("isInspection");

      router.push(`/managers`);
    } catch (error) {
      console.error("Erro ao salvar a tarefa de ponto digital: ", error);
      toast.error(
        "Erro inesperado ao salvar a tarefa. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  async function uploadImageAndGetUrl(imageFile: File, path: string) {
    const storageRef = ref(storage, path);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    return downloadUrl;
  }

  return (
    <>
      <Head>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');`}</style>
      </Head>

      <HeaderNewProduct />
      <ToastContainer />
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Ponto Digital</p>
            <div className={styles.FinishTask}>
              <button className={styles.FinishButton} onClick={saveMeasurement}>
                <span className={styles.buttonTask}>Finalizar tarefa</span>
                <img
                  src="/finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Faça o registro da sua entrada no posto e informe se há fiscalização
            ocorrendo em seu turno.
          </p>

          <div className={styles.userContent}>
            <div className={styles.userData}>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Havendo fiscalização?</p>
                  <select
                    id="isInspection"
                    className={styles.SelectField}
                    value={isInspection}
                    onChange={(e) => {
                      setIsInspection(e.target.value);
                      localStorage.setItem("isInspection", e.target.value); // Salva no localStorage
                    }}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem da tarefa</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment" // para capturar da câmera traseira, ou use "user" para a câmera frontal
                    style={{ display: "none" }}
                    ref={etanolRef}
                    onChange={handleEtanolImageChange}
                  />

                  <button
                    onClick={() =>
                      // @ts-ignore
                      etanolRef.current && etanolRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Tire sua foto/vídeo
                  </button>
                  {isLoading && <p>Carregando imagem...</p>}
                  {etanolImageUrl && (
                    <div>
                      <img
                        src={etanolImageUrl}
                        alt="Preview do teste de Etanol"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                      />
                      <p className={styles.fileName}>{etanolFileName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Rede Postos 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
