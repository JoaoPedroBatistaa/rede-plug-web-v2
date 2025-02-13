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
import React, { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";

import imageCompression from "browser-image-compression";

import LoadingOverlay from "@/components/Loading";

interface Tank {
  tankNumber: string;
  capacity: string;
  product: string;
  saleDefense: string;
  tableParam01: string;
  tableParam02: string;
}

interface TankMeasurement {
  tankNumber: string;
  measurement: string;
  imageUrl: string;
}

interface MeasurementData {
  date: string;
  time: string;
  managerName: string;
  userName: string | null;
  postName: string | null;
  measurements: TankMeasurement[];
  id: string;
}

interface TankMeasurements {
  [key: string]: string;
}

interface TankImages {
  [key: string]: File;
}

export default function NewPost() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

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
    setDate(localStorage.getItem("date") || "");
    setTime(localStorage.getItem("time") || "");
    setTankMeasurements(
      JSON.parse(localStorage.getItem("tankMeasurements") || "{}")
    );
    setTankImages(JSON.parse(localStorage.getItem("tankImages") || "{}"));
    setMeasurementSheetUrl(localStorage.getItem("measurementSheetUrl") || "");
    setTankImageUrls(JSON.parse(localStorage.getItem("tankImageUrls") || "{}"));
    setMeasurementSheetUrl(localStorage.getItem("measurementSheetUrl") || "");
    setMeasurementSheetFileName(
      localStorage.getItem("measurementSheetFileName") || ""
    );
  }, []);

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

          if (fetchedData.measurementSheet) {
            setMeasurementSheetUrl(fetchedData.measurementSheet);
          }

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

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [managerName, setManagerName] = useState("");
  const [postName, setPostName] = useState("");
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [tankMeasurements, setTankMeasurements] = useState<TankMeasurements>(
    {}
  );
  const [tankImages, setTankImages] = useState<TankImages>({});
  const [tankFileNames, setTankFileNames] = useState({});
  const [fileInputRefs, setFileInputRefs] = useState({});
  const [tankImageUrls, setTankImageUrls] = useState<{ [key: string]: string }>(
    {}
  );

  const [conversionData, setConversionData] = useState([]);
  const [tankLiters, setTankLiters] = useState({});

  const [measurementSheet, setMeasurementSheet] = useState<File | null>(null);
  const [measurementSheetFileName, setMeasurementSheetFileName] = useState<
    string | null
  >(null);
  const measurementSheetInputRef = React.createRef<HTMLInputElement>();
  const [measurementSheetUrl, setMeasurementSheetUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    localStorage.setItem("date", date);
  }, [date]);

  useEffect(() => {
    localStorage.setItem("time", time);
  }, [time]);

  useEffect(() => {
    localStorage.setItem("tankMeasurements", JSON.stringify(tankMeasurements));
  }, [tankMeasurements]);

  useEffect(() => {
    localStorage.setItem("tankImages", JSON.stringify(tankImages));
  }, [tankImages]);

  useEffect(() => {
    localStorage.setItem("measurementSheetUrl", measurementSheetUrl || "");
  }, [measurementSheetUrl]);

  async function compressImage(file: File) {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
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

  const handleMeasurementSheetChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setIsLoading(true);
      try {
        let processedFile = file;

        // Verifica se o arquivo é uma imagem antes de comprimir
        if (file.type.startsWith("image/")) {
          processedFile = await compressImage(file);
        }

        // Faz o upload da planilha para o Firebase Storage
        const storagePath = `measurementSheets/${
          processedFile.name
        }_${Date.now()}`;
        const imageUrl = await uploadImageAndGetUrl(processedFile, storagePath);

        // Atualiza o estado com a URL do Storage
        setMeasurementSheet(processedFile);
        setMeasurementSheetFileName(processedFile.name);
        setMeasurementSheetUrl(imageUrl);

        // Salva no localStorage
        localStorage.setItem("measurementSheetUrl", imageUrl);
        localStorage.setItem("measurementSheetFileName", processedFile.name);

        toast.success("Planilha de medição enviada com sucesso!");
      } catch (error) {
        console.error("Erro ao fazer upload da planilha de medição:", error);
        toast.error("Erro ao fazer upload da planilha de medição.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const loadConversionData = async () => {
      const filePath = `/data/conversion.json`;
      const response = await fetch(filePath);
      if (!response.ok) {
        console.error(
          "Falha ao carregar o arquivo de conversão",
          response.statusText
        );
        return;
      }
      const data = await response.json();

      setConversionData(data);
      console.log(conversionData);
    };

    loadConversionData();
  }, []);

  // @ts-ignore
  const findLitersForMeasurement = (tankOption, measurementCm) => {
    const measurementCmNumber = Number(measurementCm);

    const tankConversionData = conversionData.filter(
      // @ts-ignore
      (data) => data.Tanque.toString() === tankOption.toString()
    );

    console.log(
      `Dados de conversão filtrados para Tanque ${tankOption}:`,
      tankConversionData
    );

    const conversionRecord = tankConversionData.find(
      (data) => Number(data["Regua (cm)"]) === measurementCmNumber
    );

    if (conversionRecord) {
      console.log(`Registro de conversão encontrado:`, conversionRecord);
    } else {
      console.log(
        `Nenhum registro de conversão encontrado para Tanque ${tankOption} e Medição ${measurementCmNumber}`
      );
    }

    // @ts-ignore
    return conversionRecord ? conversionRecord.Litros : null;
  };

  // @ts-ignore
  const handleMeasurementChange = (tankNumber, measurementCm) => {
    const selectedTankObject = tanks.find(
      (tank) => tank.tankNumber === tankNumber
    );
    if (!selectedTankObject) {
      console.error("Tanque não selecionado ou não encontrado.");
      return;
    }

    const liters = findLitersForMeasurement(
      // @ts-ignore
      selectedTankObject.tankOption,
      measurementCm
    );

    setTankMeasurements((prev) => ({
      ...prev,
      [tankNumber]: {
        cm: measurementCm,
        liters: liters ?? null,
      },
    }));
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    tankNumber: string
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setIsLoading(true);
      try {
        let processedFile = file;

        // Se for uma imagem, comprimimos antes de enviar
        if (file.type.startsWith("image/")) {
          processedFile = await compressImage(file);
        }

        // Criar nome do arquivo no Storage
        const storagePath = `tankMeasurements/${tankNumber}/${
          processedFile.name
        }_${Date.now()}`;

        // Upload do arquivo ao Firebase Storage
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, processedFile);
        const downloadUrl = await getDownloadURL(storageRef);

        // Atualizar estado com a URL do Storage
        setTankImageUrls((prev) => ({
          ...prev,
          [tankNumber]: downloadUrl,
        }));

        // Salvar no localStorage para persistência
        localStorage.setItem(
          "tankImageUrls",
          JSON.stringify({ ...tankImageUrls, [tankNumber]: downloadUrl })
        );

        toast.success(`Mídia do tanque ${tankNumber} enviada com sucesso!`);
      } catch (error) {
        console.error(`Erro ao enviar imagem do tanque ${tankNumber}:`, error);
        toast.error(`Erro ao enviar imagem do tanque ${tankNumber}.`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const refs = tanks.reduce((acc, tank) => {
      // @ts-ignore
      acc[tank.tankNumber] = React.createRef();
      return acc;
    }, {});
    setFileInputRefs(refs);
  }, [tanks]);

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
            setTanks(postData.tanks || []);
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

  const saveMeasurement = async () => {
    setIsLoading(true);

    let missingField = "";
    const today = getLocalISODate();
    console.log(today);

    if (!date) missingField = "Data";
    if (!measurementSheetUrl) missingField = "Planilha de medição";
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);
      return;
    } else if (!time) missingField = "Hora";

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
      where("id", "==", "medicao-tanques-6h"),
      where("userName", "==", userName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A medição dos tanques das 6h já foi feita hoje!");
      setIsLoading(false);
      return;
    }

    const measurementData = {
      date,
      time,
      managerName: userName,
      userName,
      postName,
      measurements: [],
      measurementSheet: measurementSheetUrl || "",
      id: "medicao-tanques-6h",
    };

    for (const tank of tanks) {
      const tankData = {
        tankNumber: tank.tankNumber,
        measurement: tankMeasurements[tank.tankNumber] || "",
        imageUrl: tankImageUrls[tank.tankNumber] || "",
      };
      // @ts-ignore
      measurementData.measurements.push(tankData);
    }

    try {
      await sendMainMessage(measurementData);
      const allowedPostNames = [
        "Orense",
        "Oratório",
        "Vena",
        "Golf",
        "Cantareira",
        "Maricar",
        "Conselheiro",
        "Mandaqui",
      ];
      // @ts-ignore
      if (allowedPostNames.includes(postName)) {
        await sendAdditionalMessages(measurementData);
      } else {
        console.log("Não é um posto da rede plug");
      }

      const docRef = await addDoc(collection(db, "MANAGERS"), measurementData);
      console.log("Medição salva com ID: ", docRef.id);

      localStorage.removeItem("date");
      localStorage.removeItem("time");
      localStorage.removeItem("tankMeasurements");
      localStorage.removeItem("tankImages");
      localStorage.removeItem("measurementSheetUrl");
      localStorage.removeItem("tankImages");
      localStorage.removeItem("tankImagesUrls");
      localStorage.removeItem("measurementSheetUrl");
      localStorage.removeItem("measurementSheetFileName");

      toast.success("Medição salva com sucesso!");
      router.push("/managers");
    } catch (error) {
      console.error("Erro ao salvar os dados da medição:", error);
      toast.error("Erro ao salvar a medição.");
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
    date.setDate(date.getDate() + 1);
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

  async function sendMainMessage(data: {
    date: string | number | Date;
    time: any;
    postName: any;
    managerName: any;
    measurements: any;
    measurementSheet: any;
    id?: string;
  }) {
    const formattedDate = formatDate(data.date);

    const shortUrls = await Promise.all(
      data.measurements.map((measurement: { imageUrl: string }) =>
        shortenUrl(measurement.imageUrl)
      )
    );
    const measurements = data.measurements
      .map(
        (
          measurement: {
            tankNumber: string;
            measurement: { cm: any; liters: any };
          },
          index: string | number
        ) => {
          const tank = tanks.find(
            (tank) => tank.tankNumber === measurement.tankNumber
          );
          // @ts-ignore
          const tankTitle = `Tanque ${tank.tankNumber} - (${tank.product}) ${tank.saleDefense}`;
          // @ts-ignore
          return `*${tankTitle}:*\n*Régua:* ${measurement.measurement.cm} cm\n*Conversão:* ${measurement.measurement.liters} litros\n*Imagem:* ${shortUrls[index]}\n\n`;
        }
      )
      .join("\n");
    const measurementSheetUrl = data.measurementSheet
      ? await shortenUrl(data.measurementSheet)
      : "";

    const messageBody = `*Nova Medição dos Tanques às 6h*\n\n*Data:* ${formattedDate}\n*Hora:* ${
      data.time
    }\n*Posto:* ${data.postName}\n*Gerente:* ${
      data.managerName
    }\n\n*Detalhes das Medições*\n\n${measurements}${
      measurementSheetUrl
        ? `\n*Planilha de Medição:* ${measurementSheetUrl}\n`
        : ""
    }`;

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
            title: "*Nova Medição de Tanques às 6h*",
            body: messageBody,
            measurementSheetUrl: data.measurementSheet,
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

  async function sendAdditionalMessages(data: {
    date: any;
    time: any;
    managerName: any;
    userName?: string | null;
    postName: any;
    measurements: any;
    measurementSheet: any;
    id?: string;
  }) {
    const formattedDate = formatDate(data.date);

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

    let contactNumber;
    try {
      // Busca o número de telefone no Firestore
      const phoneDocRef = doc(db, "PHONES", "O7Ej9i0aaVeo0zTrn4UI");
      const phoneDoc = await getDoc(phoneDocRef);

      if (phoneDoc.exists()) {
        contactNumber = phoneDoc.data().leoNumber;
        console.log(`Número de contato obtido: ${contactNumber}`);
      } else {
        console.error("Documento PHONES não encontrado.");
        toast.error("Falha ao obter o número de contato.");
        return;
      }
    } catch (error) {
      console.error(`Erro ao buscar o número de contato: ${error}`);
      toast.error("Erro ao buscar o número de contato.");
      return;
    }

    const contacts = [contactNumber]; // Use o número buscado dinamicamente
    for (const contact of contacts) {
      try {
        const imageResponse = await fetch("/api/send-image-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contacts: [contact],
            messageBody: {
              title: "*Nova Medição às 6h*",
              measurementSheetUrl: data.measurementSheet,
              postName: data.postName,
              formattedDate: formattedDate,
            },
            authToken: authToken,
          }),
        });

        if (!imageResponse.ok) {
          const errorMessage = await imageResponse.text();
          console.error(
            `Erro na resposta ao enviar mensagem de imagem: ${errorMessage}`
          );
          throw new Error(`Falha ao enviar mensagem de imagem via WhatsApp`);
        }

        console.log(`Mensagem de imagem enviada com sucesso para ${contact}`);
        toast.success(`Mensagem de imagem enviada com sucesso para o Gestor`);
      } catch (error) {
        console.error(
          `Erro ao enviar mensagem de imagem para ${contact}: ${error}`
        );
        toast.error(`Falha ao enviar mensagem de imagem para ${contact}`);
      }

      // Adiciona um intervalo de 2 segundos entre cada mensagem
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
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
            <p className={styles.BudgetTitle}>Medição de tanques 6h</p>
            <div className={styles.FinishTask}>
              {!docId && (
                <button
                  className={styles.FinishButton}
                  onClick={saveMeasurement}
                >
                  <img
                    src="/finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>Cadastrar medição</span>
                </button>
              )}
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações da medição
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
                  <p className={styles.FieldLabel}>Planilha de Medição</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    ref={measurementSheetInputRef}
                    onChange={handleMeasurementSheetChange}
                  />
                  <button
                    onClick={() =>
                      measurementSheetInputRef.current &&
                      measurementSheetInputRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua planilha de medição
                  </button>
                  {measurementSheetUrl && (
                    <div>
                      {measurementSheetUrl.includes(".mp4") ||
                      measurementSheetUrl.includes(".avi") ||
                      measurementSheetUrl.includes(".mov") ? (
                        <video
                          controls
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        >
                          <source src={measurementSheetUrl} type="video/mp4" />
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      ) : (
                        <img
                          src={measurementSheetUrl}
                          alt="Visualização da planilha de medição"
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {docId && (
                <>
                  {measurementSheetUrl && (
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Planilha de Medição</p>
                      {measurementSheetUrl.includes(".mp4") ||
                      measurementSheetUrl.includes(".avi") ||
                      measurementSheetUrl.includes(".mov") ? (
                        <video
                          controls
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        >
                          <source src={measurementSheetUrl} type="video/mp4" />
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      ) : (
                        <img
                          src={measurementSheetUrl}
                          alt="Visualização da planilha de medição"
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                      <a
                        href={measurementSheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.openMediaLink}
                      >
                        Abrir mídia
                      </a>
                    </div>
                  )}

                  {
                    // @ts-ignore
                    data?.measurements.map(
                      (
                        measurement: {
                          tankNumber: any;
                          measurement: {
                            cm: any;
                            liters: any;
                          };
                          imageUrl: any;
                        },
                        index: React.Key | null | undefined
                      ) => (
                        <div key={index}>
                          <p className={styles.titleTank}>
                            Tanque {measurement.tankNumber}
                          </p>

                          <div className={styles.InputContainer}>
                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>Medição em cm</p>
                              <input
                                type="number"
                                value={measurement.measurement.cm}
                                className={styles.Field}
                                disabled
                              />
                            </div>

                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>Litros</p>
                              <input
                                type="text"
                                value={measurement.measurement.liters}
                                className={styles.Field}
                                disabled
                              />
                            </div>

                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Foto da medição
                              </p>
                              {
                                // @ts-ignore
                                measurement.imageUrl.includes(".mp4") ||
                                // @ts-ignore
                                measurement.imageUrl.includes(".avi") ||
                                // @ts-ignore
                                measurement.imageUrl.includes(".mov") ? (
                                  <video
                                    controls
                                    style={{
                                      maxWidth: "17.5rem",
                                      height: "auto",
                                      border: "1px solid #939393",
                                      borderRadius: "20px",
                                    }}
                                  >
                                    <source
                                      // @ts-ignore
                                      src={measurement.imageUrl}
                                      type="video/mp4"
                                    />
                                    Seu navegador não suporta o elemento de
                                    vídeo.
                                  </video>
                                ) : (
                                  <img
                                    src={measurement.imageUrl}
                                    alt="Visualização da imagem"
                                    style={{
                                      maxWidth: "17.5rem",
                                      height: "auto",
                                      border: "1px solid #939393",
                                      borderRadius: "20px",
                                    }}
                                  />
                                )
                              }
                              <a
                                href={measurement.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.openMediaLink}
                              >
                                Abrir mídia
                              </a>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  }
                </>
              )}

              {tanks.map((tank) => (
                <>
                  <p className={styles.titleTank}>
                    Tanque {tank.tankNumber} - {tank.capacity}L ({tank.product})
                    - {tank.saleDefense}
                  </p>

                  <div key={tank.tankNumber} className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Medição em cm</p>
                      <input
                        type="number"
                        // @ts-ignore
                        value={tankMeasurements[tank.tankNumber]?.cm || ""}
                        onChange={(e) =>
                          handleMeasurementChange(
                            tank.tankNumber,
                            e.target.value
                          )
                        }
                        className={styles.Field}
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Foto da medição</p>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                        // @ts-ignore
                        ref={fileInputRefs[tank.tankNumber]}
                        onChange={(event) =>
                          handleImageChange(event, tank.tankNumber)
                        }
                      />
                      <button
                        onClick={() =>
                          // @ts-ignore

                          fileInputRefs[tank.tankNumber].current &&
                          // @ts-ignore

                          fileInputRefs[tank.tankNumber].current.click()
                        }
                        className={styles.MidiaField}
                      >
                        Tire sua foto/vídeo
                      </button>
                    </div>
                  </div>

                  {
                    // @ts-ignore
                    tankMeasurements[tank.tankNumber]?.liters !== undefined && (
                      <div className={styles.InputField}>
                        <p className={styles.totalDischarge}>
                          {
                            // @ts-ignore
                            tankMeasurements[tank.tankNumber]?.liters !==
                              undefined &&
                            // @ts-ignore
                            tankMeasurements[tank.tankNumber].liters !== null
                              ? `Medição atual em litros: ${
                                  // @ts-ignore
                                  tankMeasurements[tank.tankNumber].liters
                                }`
                              : "A régua deste tanque não contém este valor"
                          }
                        </p>
                      </div>
                    )
                  }

                  {tankImageUrls[tank.tankNumber] && (
                    <div>
                      {tankImageUrls[tank.tankNumber].includes(".mp4") ||
                      tankImageUrls[tank.tankNumber].includes(".avi") ||
                      tankImageUrls[tank.tankNumber].includes(".mov") ? (
                        <video
                          controls
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        >
                          <source
                            src={tankImageUrls[tank.tankNumber]}
                            type="video/mp4"
                          />
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      ) : (
                        <img
                          src={tankImageUrls[tank.tankNumber]}
                          alt="Imagem do tanque"
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                    </div>
                  )}
                </>
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
