import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";

export default function NewPost() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [managerName, setManagerName] = useState("");
  const [numMaquininhas, setNumMaquininhas] = useState("");
  const [maquininhasImages, setMaquininhasImages] = useState<File[]>([]);
  const [maquininhasFileNames, setMaquininhasFileNames] = useState<string[]>(
    []
  );

  const handleNumMaquininhasChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    // Permite apenas números, pontos e vírgulas
    if (/^[0-9.,]*$/.test(value)) {
      // @ts-ignore
      setNumMaquininhas(value); // Atualiza o estado com o valor permitido
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

  const savePhotoMachines = async () => {
    let missingField = "";
    const today = new Date().toISOString().slice(0, 10);

    if (!date) missingField = "Data";
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      return;
    } else if (!time) missingField = "Hora";
    else if (!managerName) missingField = "Nome do Gerente";
    else if (!numMaquininhas) missingField = "Quantidade vendida";

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
      where("id", "==", "quantidade-vendida-dia-anterior-22h"),
      where("userName", "==", userName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error(
        "A quantidade vendida do dia anterior das 22h já foi feita hoje!"
      );
      return;
    }

    const photoMachinesData = {
      date,
      time,
      managerName,
      userName,
      postName,
      qtd: numMaquininhas,
      id: "quantidade-vendida-dia-anterior-22h",
    };

    // Processamento paralelo dos uploads de imagens
    const uploadPromises = maquininhasImages.map((imageFile, index) =>
      uploadImageAndGetUrl(
        imageFile,
        `competitorsPrice/${date}/${imageFile.name}_${Date.now()}`
      ).then((imageUrl) => {
        return {
          fileName: maquininhasFileNames[index],
          imageUrl,
        };
      })
    );

    try {
      const images = await Promise.all(uploadPromises);
      // @ts-ignore
      photoMachinesData.images = images;

      const docRef = await addDoc(
        collection(db, "MANAGERS"),
        photoMachinesData
      );
      console.log("Preço dos concorrentes salvo com ID: ", docRef.id);
      toast.success("Preço dos concorrentes salvo com sucesso!");
      router.push("/manager-twenty-two-routine");
    } catch (error) {
      console.error("Erro ao salvar o preço dos concorrentes: ", error);
      toast.error("Erro ao salvar o preço dos concorrentes.");
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
              Quantidade vendida no dia anterior 22h
            </p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton}>
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText} onClick={savePhotoMachines}>
                  Cadastrar quantidade
                </span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações da quantidade vendida no dia anterior
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

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Quantidade vendida</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={numMaquininhas}
                    onChange={handleNumMaquininhasChange}
                    placeholder=""
                  />
                </div>
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
