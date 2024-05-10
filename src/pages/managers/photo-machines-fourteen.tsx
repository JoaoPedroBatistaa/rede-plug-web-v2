import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { createRef, useEffect, useRef, useState } from "react";
import { db, storage } from "../../../firebase";

import LoadingOverlay from "@/components/Loading";

export default function NewPost() {
  const router = useRouter();

  const docId = router.query.docId;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!docId) return;

      try {
        const docRef = doc(db, "MANAGERS", docId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedData = docSnap.data();

          // @ts-ignore
          setData(fetchedData);
          setDate(fetchedData.date);
          setTime(fetchedData.time);

          console.log(fetchedData); // Verifica se os dados foram corretamente buscados
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [docId]);

  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [managerName, setManagerName] = useState("");
  const [numMaquininhas, setNumMaquininhas] = useState(0);
  const [maquininhasImages, setMaquininhasImages] = useState<File[]>([]);
  const [maquininhasFileNames, setMaquininhasFileNames] = useState<string[]>(
    []
  );

  const maquininhasRefs = useRef([]);
  maquininhasRefs.current = Array(numMaquininhas)
    .fill(null)
    .map((_, i) => maquininhasRefs.current[i] || createRef());

  const handleNumMaquininhasChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    setNumMaquininhas(isNaN(value) ? 0 : value);
  };

  const handleImageChange =
    (index: string | number | undefined) =>
    (event: { target: { files: any[] } }) => {
      const file = event.target.files[0];
      if (file) {
        setMaquininhasImages((prev) => {
          const newImages = [...prev];
          // @ts-ignore
          newImages[index] = file;
          return newImages;
        });
        setMaquininhasFileNames((prev) => {
          const newFileNames = [...prev];
          // @ts-ignore
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
          });
        } catch (error) {
          console.error("Error fetching post details:", error);
        }
      };

      fetchPostDetails();
    }
  }, []);

  const savePhotoMachines = async () => {
    setIsLoading(true);

    let missingField = "";
    const today = new Date().toISOString().slice(0, 10);

    if (!date) missingField = "Data";
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);

      return;
    } else if (!time) missingField = "Hora";
    // else if (!managerName) missingField = "Nome do Gerente";
    else if (maquininhasImages.length === 0)
      missingField = "Fotos das Maquininhas";

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
      where("id", "==", "foto-maquininhas-14h"),
      where("userName", "==", userName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A foto das maquininhas das 14h já foi feita hoje!");
      setIsLoading(false);

      return;
    }

    const photoMachinesData = {
      date,
      time,
      managerName: userName,
      userName,
      postName,
      images: [],
      id: "foto-maquininhas-14h",
    };

    // Processamento paralelo dos uploads de imagens
    const uploadPromises = maquininhasImages.map((imageFile, index) =>
      uploadImageAndGetUrl(
        imageFile,
        `photoMachines/${date}/${imageFile.name}_${Date.now()}`
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
      console.log("Fotos das maquininhas salvas com ID: ", docRef.id);

      await sendMessage(photoMachinesData);

      toast.success("Fotos das maquininhas salvas com sucesso!");
      router.push("/manager-fourteen-routine");
    } catch (error) {
      console.error("Erro ao salvar as fotos das maquininhas: ", error);
      toast.error("Erro ao salvar as fotos das maquininhas.");
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

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adicionando um dia
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${day}/${month}/${year}`;
  }

  async function shortenUrl(originalUrl: string): Promise<string> {
    const payload = {
      originalURL: originalUrl,
      domain: "ewja.short.gy", // Substitua pelo seu domínio personalizado
    };

    const response = await fetch("https://api.short.io/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.URL_SHORTENER_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Falha ao encurtar URL:", data);
      throw new Error(`Erro ao encurtar URL: ${data.message}`);
    }

    return data.secureShortURL || data.shortURL; // Usa o campo correto conforme a resposta da API
  }

  async function sendMessage(data: {
    date: any;
    time: any;
    managerName: any;
    userName?: string | null;
    postName: any;
    images: any;
    id?: string;
  }) {
    const formattedDate = formatDate(data.date); // Suponha que você tenha uma função para formatar a data corretamente

    const imagesDescription = await Promise.all(
      data.images.map(async (image: { imageUrl: string }, index: number) => {
        const shortUrl = await shortenUrl(image.imageUrl);
        return `*Maquininha ${index + 1}:* ${shortUrl}\n`;
      })
    ).then((descriptions) => descriptions.join("\n"));

    // Montar o corpo da mensagem
    const messageBody = `*Nova Maquininhas às 14h*\n\nData: ${formattedDate}\nHora: ${data.time}\nPosto: ${data.postName}\nGerente: ${data.managerName}\n\n*Imagens da tarefa*\n\n${imagesDescription}`;

    // Enviar a mensagem via Twilio
    const response = await fetch(
      "https://api.twilio.com/2010-04-01/Accounts/ACb0e4bbdd08e851e23384532bdfab6020/Messages.json",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${process.env.WHATSAPP_API_KEY}`)}`,

          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: "whatsapp:+553899624092", // Substitua pelo número correto
          From: "whatsapp:+14155238886",
          Body: messageBody,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao enviar mensagem via WhatsApp");
    }

    console.log("Mensagem das fotos das maquininhas enviada com sucesso!");
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
            <p className={styles.BudgetTitle}>Foto das maquininhas 14h</p>
            <div className={styles.BudgetHeadS}>
              {!docId && (
                <button
                  className={styles.FinishButton}
                  onClick={savePhotoMachines}
                >
                  <img
                    src="./finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>Cadastrar fotos</span>
                </button>
              )}
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações das maquininhas
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

              {docId &&
                // @ts-ignore
                data?.images.map((image, index) => (
                  <div key={index} className={styles.InputField}>
                    <p className={styles.titleTank}>Maquininha {index + 1}</p>
                    <p className={styles.FieldLabel}>Imagem da maquininha</p>

                    {image && (
                      <div>
                        <img
                          src={image.imageUrl}
                          alt={`Preview do encerrante do bico ${index + 1}`}
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                          onLoad={() =>
                            // @ts-ignore
                            URL.revokeObjectURL(image)
                          }
                        />
                        <p className={styles.fileName}>{image.fileName}</p>
                      </div>
                    )}
                  </div>
                ))}

              <div className={styles.InputContainer}>
                {/* <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome do gerente</p>
                  <input
                    id="driverName"
                    type="text"
                    className={styles.Field}
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder=""
                  />
                </div> */}

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Número de maquininhas</p>
                  <input
                    type="number"
                    className={styles.Field}
                    value={numMaquininhas}
                    onChange={handleNumMaquininhasChange}
                    placeholder=""
                  />
                </div>
              </div>

              {Array.from({ length: numMaquininhas }, (_, index) => (
                <div key={index} className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Foto da maquininha {index + 1}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    // @ts-ignore
                    ref={(el) => (maquininhasRefs.current[index] = el)}
                    // @ts-ignore
                    onChange={handleImageChange(index)}
                  />
                  <button
                    // @ts-ignore
                    onClick={() => maquininhasRefs.current[index]?.click()}
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {maquininhasImages[index] && (
                    <div>
                      <img
                        src={URL.createObjectURL(maquininhasImages[index])}
                        alt={`Preview da maquininha ${index + 1}`}
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        onLoad={() =>
                          // @ts-ignore
                          URL.revokeObjectURL(maquininhasImages[index])
                        }
                      />
                      <p className={styles.fileName}>
                        {maquininhasFileNames[index]}
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
