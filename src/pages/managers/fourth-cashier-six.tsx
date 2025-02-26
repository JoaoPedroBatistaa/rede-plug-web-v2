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
import { createRef, useEffect, useState } from "react";
import { db, storage } from "../../../firebase";

import imageCompression from "browser-image-compression";
import dynamic from "next/dynamic";
const LoadingOverlay = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});

interface Nozzle {
  nozzleNumber: string;
  product: string;
}

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

  const [mediaFields, setMediaFields] = useState([
    { file: null, fileName: "", fileUrl: null, inputRef: createRef() },
  ]);

  async function compressImage(file: File) {
    const options = {
      maxSizeMB: 2, // Tamanho máximo do arquivo final em megabytes
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

  const handleFileChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setIsLoading(true);
      try {
        let processedFile = file;

        // Verifica se o arquivo é uma imagem antes de comprimir
        if (file.type.startsWith("image/")) {
          processedFile = await compressImage(file);
        }

        const imageUrl = await uploadFileAndGetUrl(
          processedFile,
          `fourthCashier/${getLocalISODate()}/etanol_${
            processedFile.name
          }_${Date.now()}`
        );

        const updatedFields = [...mediaFields];
        updatedFields[index] = {
          // @ts-ignore
          file: processedFile,
          fileName: processedFile.name,
          // @ts-ignore
          fileUrl: imageUrl,
          inputRef: mediaFields[index].inputRef,
        };

        setMediaFields(updatedFields);
      } catch (error) {
        console.error("Erro ao fazer upload do arquivo:", error);
        toast.error("Erro ao salvar o arquivo.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const createMediaField = () => ({
    file: null,
    fileName: "",
    fileUrl: null,
    inputRef: createRef(),
  });

  const addMediaField = () => {
    setMediaFields([...mediaFields, createMediaField()]);
  };

  const removeMediaField = (index: number) => {
    const updatedFields = mediaFields.filter((_, i) => i !== index);
    setMediaFields(updatedFields);
  };

  const getLocalISODate = () => {
    const date = new Date();
    // Ajustar para o fuso horário -03:00
    date.setHours(date.getHours() - 3);
    return date.toISOString().slice(0, 10);
  };

  const saveFourthCashier = async () => {
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
    else if (mediaFields.some((field) => !field.file))
      missingField = "Arquivos de mídia";

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

    const files = mediaFields.map((field) => ({
      type: "Media",
      fileUrl: field.fileUrl,
      fileName: field.fileName,
    }));

    const fourthCashierData = {
      date,
      time,
      managerName: userName,
      userName,
      postName,
      files,
      id: "quarto-caixa-6h",
    };

    try {
      // @ts-ignore
      await sendMessage(fourthCashierData);

      const docRef = await addDoc(
        collection(db, "MANAGERS"),
        fourthCashierData
      );
      console.log("Quarto caixa salvo com ID: ", docRef.id);

      toast.success("Quarto caixa salvo com sucesso!");
      router.push("/manager-six-routine");
    } catch (error) {
      console.error("Erro ao salvar o quarto caixa: ", error);
      toast.error("Erro ao salvar o quarto caixa.");
    } finally {
      setIsLoading(false);
    }
  };

  async function uploadFileAndGetUrl(file: File, path: string) {
    const storageRef = ref(storage, path);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
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
    date: string | number | Date;
    files: any[];
    time: any;
    collectValue: any;
    postName: any;
    managerName: any;
  }) {
    const formattedDate = formatDate(data.date);

    // Encurtar URLs dos arquivos para a mensagem de texto
    const filesDescription = await Promise.all(
      data.files.map(async (file, index) => {
        const shortUrl = await shortenUrl(file.fileUrl);
        return {
          originalUrl: file.fileUrl,
          shortUrl: shortUrl,
          description: `*Arquivo ${index + 1}:* ${shortUrl}\n`,
        };
      })
    );

    // Descrição formatada para a mensagem de texto
    const filesDescriptionText = filesDescription
      .map((file) => file.description)
      .join("\n");

    // Montar o corpo da mensagem
    const messageBody = `*Novo Quarto Caixa às 6h*\n\n*Data:* ${formattedDate}\n*Hora:* ${data.time}\n*Posto:* ${data.postName}\n*Gerente:* ${data.managerName}\n\n*Detalhes dos Arquivos*\n\n${filesDescriptionText}`;

    // Buscar número de contato do gerente
    const postsRef = collection(db, "POSTS");
    const q = query(postsRef, where("name", "==", data.postName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Nenhum posto encontrado com o nome especificado.");
      throw new Error("Posto não encontrado");
    }

    const postData = querySnapshot.docs[0].data();
    const managerContact = postData.managers[0].contact;

    console.log(`Enviando mensagem para o contato: ${managerContact}`);

    // Verificar se há imagem
    if (!data.files || data.files.length === 0) {
      console.error("Nenhuma imagem encontrada para enviar.");
      throw new Error("Nenhuma imagem encontrada.");
    }

    const image = data.files[0]; // Considera apenas a primeira imagem

    let authToken;
    try {
      const authResponse = await fetch("/api/auth-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admredeplug@gmail.com",
          password: "Sc125687!",
        }),
      });

      const authResponseBody = await authResponse.json();
      console.log(
        `Resposta completa do login de autenticação: ${authResponseBody}`
      );

      if (!authResponse.ok) {
        console.error(
          `Erro na resposta ao obter token de autenticação: ${authResponseBody}`
        );
        throw new Error("Falha ao obter token de autenticação");
      }

      authToken = authResponseBody.data.token;

      console.log(`Token de autenticação obtido: ${authToken}`);
    } catch (error) {
      console.error(`Erro ao obter token de autenticação: ${error}`);
      toast.error("Falha ao obter token de autenticação");
      return;
    }

    try {
      // Enviar a imagem usando o endpoint de send-image-message
      const response = await fetch("/api/send-image-message-full", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contacts: [managerContact],
          messageBody: {
            title: "*Novo Quarto Caixa às 6h*",
            body: messageBody,
            measurementSheetUrl: image.fileUrl,
          },
          authToken: authToken,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Erro ao enviar mensagem de imagem: ${errorMessage}`);
        throw new Error("Falha ao enviar mensagem de imagem via WhatsApp");
      }

      console.log(
        `Mensagem de imagem enviada com sucesso para ${managerContact}`
      );
    } catch (error) {
      console.error(
        `Erro ao enviar mensagem de imagem para ${managerContact}: ${error}`
      );
      throw error;
    }

    console.log("Mensagem de imagem enviada com sucesso!");
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
            <p className={styles.BudgetTitle}>Quarto caixa 6h</p>
            <div className={styles.FinishTask}>
              {!docId && (
                <button
                  className={styles.FinishButton}
                  onClick={saveFourthCashier}
                >
                  <img
                    src="/finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>Cadastrar caixa</span>
                </button>
              )}
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

              {docId &&
                // @ts-ignore
                data?.files.map((image, index) => (
                  <div key={index} className={styles.InputField}>
                    <p className={styles.titleTank}>Quarto caixa</p>
                    <p className={styles.FieldLabel}>Imagem do caixa</p>

                    {image && (
                      <div>
                        <img
                          src={image.fileUrl}
                          alt={`Preview do encerrante do bico ${index + 1}`}
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                          onLoad={() => URL.revokeObjectURL(image)}
                        />
                        <p className={styles.fileName}>{image.fileName}</p>
                        <a
                          href={image.fileUrl}
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

              {mediaFields.map((field, index) => (
                <div key={index} className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Arquivo do quarto caixa</p>
                    <input
                      type="file"
                      accept=".jpeg, .png, .jpg"
                      style={{ display: "none" }}
                      // @ts-ignore
                      ref={field.inputRef}
                      onChange={(e) => handleFileChange(index, e)}
                    />

                    <button
                      onClick={() =>
                        // @ts-ignore
                        field.inputRef.current && field.inputRef.current.click()
                      }
                      className={styles.MidiaField}
                    >
                      Carregue sua imagem
                    </button>
                    {field.file && (
                      <div>
                        <p className={styles.fileName}>{field.fileName}</p>
                        <img
                          src={URL.createObjectURL(field.file)}
                          alt={`Preview ${field.fileName}`}
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                          // @ts-ignore
                          onLoad={() => URL.revokeObjectURL(field.file)}
                        />
                      </div>
                    )}
                  </div>

                  {mediaFields.length > 1 && (
                    <button
                      onClick={() => removeMediaField(index)}
                      className={styles.DeleteButton}
                    >
                      <span className={styles.buttonText}>Excluir</span>
                    </button>
                  )}
                </div>
              ))}

              <button onClick={addMediaField} className={styles.NewButton}>
                <span className={styles.buttonText}>Adicionar novo campo</span>
              </button>
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
