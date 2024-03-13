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

interface Nozzle {
  nozzleNumber: string;
  product: string;
}

export default function NewPost() {
  const router = useRouter();

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

  const saveGameTest = async () => {
    let missingField = "";
    const today = new Date().toISOString().slice(0, 10);

    if (!date) missingField = "Data";
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      return;
    } else if (!time) missingField = "Hora";
    else if (!managerName) missingField = "Nome do Gerente";
    // @ts-ignore
    else if (encerranteImages.length === 0)
      missingField = "Fotos do teste do game";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      return;
    }

    const userName = localStorage.getItem("userName");
    const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "MANAGERS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("id", "==", "medicao-tanques-6h"),
      where("id", "==", "teste-game-proveta-6h")
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("O teste do game das 6h já foi cadastrado hoje!");
      return;
    }

    const nozzleClosureData = {
      date,
      time,
      managerName,
      userName,
      postName,
      images: [],
      id: "teste-game-proveta-6h",
    };

    // @ts-ignore
    const uploadPromises = encerranteImages.map(
      (imageFile: Blob | ArrayBuffer, index: string | number) =>
        uploadImageAndGetUrl(
          imageFile,
          // @ts-ignore
          `gameTest/${date}/${imageFile.name}_${Date.now()}`
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
      console.log("Teste do game salvo com ID: ", docRef.id);
      toast.success("Teste do game salvo com sucesso!");
      router.push("/manager-six-routine");
    } catch (error) {
      console.error("Erro ao salvar o teste do game: ", error);
      toast.error("Erro ao salvar o teste do game.");
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

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>
              Teste do game na proveta de 1L 6h
            </p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton}>
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText} onClick={saveGameTest}>
                  Cadastrar teste
                </span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>Informe abaixo as informações do teste</p>

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
                  <p className={styles.FieldLabel}>Imagem do teste</p>
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
