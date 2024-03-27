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
  const [nozzles, setNozzles] = useState<Nozzle[]>([]);
  const [encerranteImages, setEncerranteImages] = useState<File[]>([]);
  const [encerranteFileNames, setEncerranteFileNames] = useState<string[]>([]);

  const encerranteRefs = useRef([]);

  const handleImageChange = (
    index: number,
    event: { target: { files: any } } | undefined
  ) => {
    // @ts-ignore
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setEncerranteImages((prev) => {
        const newImages = [...prev];
        newImages[index] = file;
        return newImages;
      });
      setEncerranteFileNames((prev) => {
        const newFileNames = [...prev];
        newFileNames[index] = file.name;
        return newFileNames;
      });
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
            setNozzles(postData.nozzles || []);
          });
        } catch (error) {
          console.error("Error fetching post details:", error);
        }
      };

      fetchPostDetails();
    }
  }, []);

  const saveNozzleClosure = async () => {
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
    // @ts-ignore
    else if (encerranteImages.length === 0)
      missingField = "Fotos dos Encerrantes dos Bicos";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);

      return;
    }

    const userName = localStorage.getItem("userName");
    const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "MANAGERS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("userName", "==", userName),
      where("id", "==", "encerrante-bico-14h")
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("O encerrante dos bicos das 14h já foi cadastrado hoje!");
      setIsLoading(false);

      return;
    }

    const nozzleClosureData = {
      date,
      time,
      managerName,
      userName,
      postName,
      images: [],
      id: "encerrante-bico-14h",
    };

    // @ts-ignore
    const uploadPromises = encerranteImages.map(
      (imageFile: Blob | ArrayBuffer, index: string | number) =>
        uploadImageAndGetUrl(
          imageFile,
          // @ts-ignore
          `nozzleClosures/${date}/${imageFile.name}_${Date.now()}`
        ).then((imageUrl) => {
          return {
            // @ts-ignore
            fileName: encerranteFileNames[index],
            imageUrl,
          };
        })
    );

    try {
      const images = await Promise.all(uploadPromises);
      // @ts-ignore
      nozzleClosureData.images = images;

      const docRef = await addDoc(
        collection(db, "MANAGERS"),
        nozzleClosureData
      );
      console.log("Encerrante dos bicos salvo com ID: ", docRef.id);
      toast.success("Encerrante dos bicos salvo com sucesso!");
      router.push("/manager-fourteen-routine");
    } catch (error) {
      console.error("Erro ao salvar os encerrantes dos bicos: ", error);
      toast.error("Erro ao salvar os encerrantes dos bicos.");
    }
  };

  async function uploadImageAndGetUrl(
    imageFile: Blob | ArrayBuffer,
    path: string | undefined
  ) {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, imageFile);
    const downloadUrl = await getDownloadURL(storageRef);
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
            <p className={styles.BudgetTitle}>Encerrante dos bicos 14h</p>
            <div className={styles.BudgetHeadS}>
              <button
                className={styles.FinishButton}
                onClick={saveNozzleClosure}
              >
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Cadastrar encerrantes</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações dos encerrantes
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

              {nozzles.map((nozzle, index) => (
                <div key={nozzle.nozzleNumber} className={styles.InputField}>
                  <p className={styles.titleTank}>
                    Bico {nozzle.nozzleNumber} - {nozzle.product}{" "}
                  </p>
                  <p className={styles.FieldLabel}>Imagem do encerrante</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    // @ts-ignore
                    ref={(el) => (encerranteRefs.current[index] = el)}
                    onChange={(event) => handleImageChange(index, event)}
                  />
                  <button
                    // @ts-ignore
                    onClick={() => encerranteRefs.current[index]?.click()}
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {encerranteImages[index] && (
                    <div>
                      <img
                        src={URL.createObjectURL(encerranteImages[index])}
                        alt={`Preview do encerrante do bico ${nozzle.nozzleNumber}`}
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        onLoad={() =>
                          // @ts-ignore
                          URL.revokeObjectURL(encerranteImages[index])
                        }
                      />
                      <p className={styles.fileName}>
                        {encerranteFileNames[index]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
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
