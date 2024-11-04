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

import imageCompression from "browser-image-compression";

export default function NewPost() {
  const router = useRouter();

  const docId = router.query.docId;
  const [data, setData] = useState(null);

  // useEffect(() => {
  // //   const checkLoginDuration = () => {
  // //     console.log("Checking login duration...");
  // //     const storedDate = localStorage.getItem("loginDate");
  // //     const storedTime = localStorage.getItem("loginTime");

  // //     if (storedDate && storedTime) {
  // //       const storedDateTime = new Date(`${storedDate}T${storedTime}`);
  // //       console.log("Stored login date and time:", storedDateTime);

  // //       const now = new Date();
  // //       const maxLoginDuration = 6 * 60 * 60 * 1000;

  // //       if (now.getTime() - storedDateTime.getTime() > maxLoginDuration) {
  // //         console.log("Login duration exceeded 60 seconds. Logging out...");

  // //         localStorage.removeItem("userId");
  // //         localStorage.removeItem("userName");
  // //         localStorage.removeItem("userType");
  // //         localStorage.removeItem("userPost");
  // //         localStorage.removeItem("posts");
  // //         localStorage.removeItem("loginDate");
  // //         localStorage.removeItem("loginTime");

  // //         alert("Sua sessão expirou. Por favor, faça login novamente.");
  // //         window.location.href = "/";
  // //       } else {
  // //         console.log("Login duration within limits.");
  // //       }
  // //     } else {
  // //       console.log("No stored login date and time found.");
  // //     }
  // //   };

  // //   checkLoginDuration();
  // // }, []);

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
  const [maquininhasImageUrls, setMaquininhasImageUrls] = useState<string[]>(
    []
  );

  const maquininhasRefs = useRef([]);
  maquininhasRefs.current = Array(numMaquininhas)
    .fill(null)
    .map((_, i) => maquininhasRefs.current[i] || createRef());

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

  const handleNumMaquininhasChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = parseInt(event.target.value, 10);
    value = isNaN(value) ? 0 : value;
    value = value < 0 ? 0 : value;
    setNumMaquininhas(value);
  };

  const handleImageChange =
    (index: number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        setIsLoading(true);
        try {
          let processedFile = file;

          // Verifica se o arquivo é uma imagem antes de comprimir
          if (file.type.startsWith("image/")) {
            processedFile = await compressImage(file);
          }

          const imageUrl = await uploadImageAndGetUrl(
            processedFile,
            `verificationCavaletes/${getLocalISODate()}/cavalete_${
              processedFile.name
            }_${Date.now()}`
          );

          setMaquininhasImages((prev) => {
            const newImages = [...prev];
            newImages[index] = processedFile;
            return newImages;
          });
          setMaquininhasFileNames((prev) => {
            const newFileNames = [...prev];
            newFileNames[index] = processedFile.name;
            return newFileNames;
          });
          setMaquininhasImageUrls((prev) => {
            const newUrls = [...prev];
            newUrls[index] = imageUrl;
            return newUrls;
          });
        } catch (error) {
          console.error("Erro ao fazer upload da imagem:", error);
          toast.error("Erro ao salvar a imagem.");
        } finally {
          setIsLoading(false);
        }
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

  const getLocalISODate = () => {
    const date = new Date();
    // Ajustar para o fuso horário -03:00
    date.setHours(date.getHours() - 3);
    return date.toISOString().slice(0, 10);
  };

  const savePhotoMachines = async () => {
    setIsLoading(true);

    let missingField = "";
    const today = getLocalISODate();
    console.log(today);

    if (!date) missingField = "Data";
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);
      return;
    } else if (!time) missingField = "Hora";
    else if (maquininhasImageUrls.length === 0)
      missingField = "Verficação dos cavaletes";

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
      where("id", "==", "verificacao-cavaletes-14h"),
      where("userName", "==", userName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A verificação dos cavaletes das 14h já foi feita hoje!");
      setIsLoading(false);
      return;
    }

    const verificationCavaletesData = {
      date,
      time,
      managerName: userName,
      userName,
      postName,
      images: maquininhasImageUrls.map((url, index) => ({
        imageUrl: url,
        fileName: maquininhasFileNames[index],
      })),
      id: "verificacao-cavaletes-14h",
    };

    try {
      // await sendMessage(verificationCavaletesData);

      const docRef = await addDoc(
        collection(db, "MANAGERS"),
        verificationCavaletesData
      );
      console.log("Verificação dos cavaletes salva com ID: ", docRef.id);

      toast.success("Verificação dos cavaletes salva com sucesso!");
      router.push("/manager-six-routine");
    } catch (error) {
      console.error("Erro ao salvar a verificação dos cavaletes: ", error);
      toast.error("Erro ao salvar a verificação dos cavaletes.");
    } finally {
      setIsLoading(false);
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
    console.log(`Iniciando encurtamento da URL: ${originalUrl}`);

    try {
      const response = await fetch("/api/shorten-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalURL: originalUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Falha ao encurtar URL:", data);
        throw new Error(`Erro ao encurtar URL: ${data.message}`);
      }

      const data = await response.json();
      const shortUrl = data.shortUrl;
      console.log(`URL encurtada: ${shortUrl}`);

      return shortUrl;
    } catch (error) {
      console.error("Erro ao encurtar URL:", error);
      throw error;
    }
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
    const formattedDate = formatDate(data.date);

    const imagesDescription = await Promise.all(
      data.images.map(async (image: { imageUrl: string }, index: number) => {
        const shortUrl = await shortenUrl(image.imageUrl);
        return `*Cavalete ${index + 1}:* ${shortUrl}\n`;
      })
    ).then((descriptions) => descriptions.join("\n"));

    const messageBody = `*Novo Cavaletes às 14h*\n\n*Data:* ${formattedDate}\n*Hora:* ${data.time}\n*Posto:* ${data.postName}\n*Gerente:* ${data.managerName}\n\n*Imagens da tarefa*\n\n${imagesDescription}`;

    const postsRef = collection(db, "POSTS");
    const q = query(postsRef, where("name", "==", data.postName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Nenhum posto encontrado com o nome especificado.");
      throw new Error("Posto não encontrado");
    }

    const postData = querySnapshot.docs[0].data();
    const managerContact = postData.managers[0].contact;

    console.log(managerContact);

    const response = await fetch("/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        managerContact,
        messageBody,
      }),
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar mensagem via WhatsApp");
    }

    console.log("Mensagem da verificação dos cavaletes enviada com sucesso!");
  }

  return (
    <>
      <Head>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
`}</style>
      </Head>

      <HeaderNewProduct></HeaderNewProduct>
      <ToastContainer />
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Verificação dos cavaletes</p>
            <div className={styles.FinishTask}>
              {!docId && (
                <button
                  className={styles.FinishButton}
                  onClick={savePhotoMachines}
                >
                  <img
                    src="/finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>Cadastrar fotos</span>
                </button>
              )}
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações dos cavaletes
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
                    <p className={styles.titleTank}>Cavalete {index + 1}</p>
                    <p className={styles.FieldLabel}>Imagem do cavalete</p>

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
                        <a
                          href={image.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.openMediaLink}
                        >
                          Abrir mídia
                        </a>
                      </div>
                    )}
                  </div>
                ))}

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Número de cavaletes</p>
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
                    Foto do cavalete {index + 1}
                  </p>
                  <input
                    type="file"
                    capture="environment"
                    accept="image/*,video/*"
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
                    Tire sua foto/vídeo
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
              © Rede Postos 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
