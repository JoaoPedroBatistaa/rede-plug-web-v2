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
import { useEffect, useRef, useState } from "react";
import { db, storage } from "../../../firebase";

import LoadingOverlay from "@/components/Loading";

import imageCompression from "browser-image-compression";

interface Tank {
  product: string;
  saleDefense: string;
}

export default function NewPost() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const docId = router.query.docId as string;
  const [fetchedData, setFetchedData] = useState<any>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [postName, setPostName] = useState<string>("");

  const [ethanolData, setEthanolData] = useState<any[]>([]);
  const [gasolineData, setGasolineData] = useState<any[]>([]);

  const [etanolImages, setEtanolImages] = useState<(File | null)[]>([]);
  const [etanolFileNames, setEtanolFileNames] = useState<string[]>([]);
  const [gcImages, setGcImages] = useState<(File | null)[]>([]);
  const [gcFileNames, setGcFileNames] = useState<string[]>([]);

  const etanolRefs = useRef<(HTMLInputElement | null)[]>([]);
  const gcRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const checkForUpdates = async () => {
      console.log("Checking for updates...");
      const updateDoc = doc(db, "UPDATE", "Lp8egidKNeHs9jQ8ozvs");
      try {
        const updateSnapshot = await getDoc(updateDoc);
        const updateData = updateSnapshot.data();

        if (updateData) {
          console.log("Update data retrieved:", updateData);
          const { date: updateDate, time: updateTime } = updateData;
          const storedDate = localStorage.getItem("loginDate");
          const storedTime = localStorage.getItem("loginTime");

          if (storedDate && storedTime) {
            console.log("Stored date and time:", storedDate, storedTime);
            const updateDateTime = new Date(
              `${updateDate.replace(/\//g, "-")}T${updateTime}`
            );
            const storedDateTime = new Date(`${storedDate}T${storedTime}`);

            console.log("Update date and time:", updateDateTime);
            console.log("Stored date and time:", storedDateTime);

            const now = new Date();
            const date = now
              .toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })
              .split("/")
              .reverse()
              .join("-");
            const time = now.toLocaleTimeString("pt-BR", {
              hour12: false,
              timeZone: "America/Sao_Paulo",
            });

            if (
              !isNaN(updateDateTime.getTime()) &&
              !isNaN(storedDateTime.getTime())
            ) {
              if (storedDateTime < updateDateTime) {
                console.log(
                  "Stored data is outdated. Clearing cache and reloading..."
                );
                // Clear cache and reload
                caches
                  .keys()
                  .then((names) => {
                    for (let name of names) caches.delete(name);
                  })
                  .then(() => {
                    localStorage.setItem("loginDate", date);
                    localStorage.setItem("loginTime", time);
                    alert("O sistema agora está na versão mais recente");
                    window.location.reload();
                  });
              } else {
                console.log("Stored data is up to date.");
              }
            } else {
              console.log("Invalid date/time format detected.");
            }
          } else {
            console.log("No stored date and time found.");
          }
        } else {
          console.log("No update data found in the database.");
        }
      } catch (error) {
        console.error("Error fetching update document:", error);
      }
    };

    checkForUpdates();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!docId) {
        const postNameFromLocalStorage = localStorage.getItem("userPost");
        if (postNameFromLocalStorage) {
          setPostName(postNameFromLocalStorage);
        }
        return;
      }

      try {
        const docRef = doc(db, "MANAGERS", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched Data:", data); // Log dos dados obtidos
          setFetchedData(data);
          setPostName(data.postName || "");
          setDate(data.date || "");
          setTime(data.time || "");
          setEthanolData(data.ethanolData || []);
          setGasolineData(data.gasolineData || []);
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

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!postName) return;

      try {
        const postsRef = collection(db, "POSTS");
        const q = query(postsRef, where("name", "==", postName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const postData = querySnapshot.docs[0].data();
          console.log("Post Data:", postData); // Log dos detalhes do post
          setFetchedData((prevData: any) => ({
            ...prevData,
            tanks: postData.tanks,
          }));
          setEtanolImages(Array(postData.tanks.length).fill(null));
          setEtanolFileNames(Array(postData.tanks.length).fill(""));
          setGcImages(Array(postData.tanks.length).fill(null));
          setGcFileNames(Array(postData.tanks.length).fill(""));
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [postName]);

  const handleEthanolFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setEthanolData((prev) => {
      const updatedData = [...prev];
      if (!updatedData[index]) updatedData[index] = {};
      updatedData[index][field] = value;
      console.log("Updated Ethanol Data:", updatedData); // Log dos dados de etanol atualizados
      return updatedData;
    });
  };

  const handleGasolineFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setGasolineData((prev) => {
      const updatedData = [...prev];
      if (!updatedData[index]) updatedData[index] = {};
      updatedData[index][field] = value;
      console.log("Updated Gasoline Data:", updatedData); // Log dos dados de gasolina atualizados
      return updatedData;
    });
  };

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

  const getUserPost = () => {
    return localStorage.getItem("userPost");
  };

  const handleEtanolImageChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    const userPost = getUserPost();

    if (files && files.length > 0) {
      const file = files[0];
      setIsLoading(true);
      try {
        let processedFile = file;

        if (file.type.startsWith("image/")) {
          processedFile = await compressImage(file);
        }

        const imageUrl = await uploadImageAndGetUrl(
          processedFile,
          `fuelTests/${getLocalISODate()}/etanol_${
            processedFile.name
          }_${Date.now()}`
        );

        setFetchedData((prev: any) => {
          const updatedImages = [...(prev.images || [])];
          const imageIndex = userPost === "Vena" ? index : index + 1;
          updatedImages[index] = {
            ...updatedImages[index],
            imageUrl,
            fileName: processedFile.name,
            type: `Etanol ${imageIndex}`,
          };
          return { ...prev, images: updatedImages };
        });

        setEtanolImages((prev) => {
          const updated = [...prev];
          updated[index] = processedFile;
          return updated;
        });

        setEtanolFileNames((prev) => {
          const updated = [...prev];
          updated[index] = processedFile.name;
          return updated;
        });
      } catch (error) {
        console.error("Erro ao fazer upload da imagem de etanol:", error);
        toast.error("Erro ao fazer upload da imagem de etanol.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGcImageChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    const userPost = getUserPost();

    if (files && files.length > 0) {
      const file = files[0];
      setIsLoading(true);
      try {
        let processedFile = file;

        if (file.type.startsWith("image/")) {
          processedFile = await compressImage(file);
        }

        const imageUrl = await uploadImageAndGetUrl(
          processedFile,
          `fuelTests/${getLocalISODate()}/gc_${
            processedFile.name
          }_${Date.now()}`
        );

        setFetchedData((prev: any) => {
          const updatedImages = [...(prev.images || [])];
          const imageIndex = userPost === "Vena" ? index + 1 : index;
          updatedImages[index] = {
            ...updatedImages[index],
            imageUrl,
            fileName: processedFile.name,
            type: `GC ${imageIndex}`,
          };
          return { ...prev, images: updatedImages };
        });

        setGcImages((prev) => {
          const updated = [...prev];
          updated[index] = processedFile;
          return updated;
        });

        setGcFileNames((prev) => {
          const updated = [...prev];
          updated[index] = processedFile.name;
          return updated;
        });
      } catch (error) {
        console.error(
          "Erro ao fazer upload da imagem de gasolina comum:",
          error
        );
        toast.error("Erro ao fazer upload da imagem de gasolina comum.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getLocalISODate = () => {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    return date.toISOString().slice(0, 10);
  };

  const saveFuelTest = async () => {
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

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);
      return;
    }

    const userName = localStorage.getItem("userName");
    const userPost = postName || localStorage.getItem("userPost");

    const managersRef = collection(db, "MANAGERS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("userName", "==", userName),
      where("id", "==", "teste-combustiveis-14h")
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("O teste dos combustíveis das 14h já foi cadastrado hoje!");
      setIsLoading(false);
      return;
    }

    const images: { type: string; imageUrl: string; fileName: string }[] = [];

    (fetchedData?.images || []).forEach((image: any) => {
      images.push({
        type: image.type,
        imageUrl: image.imageUrl,
        fileName: image.fileName,
      });
    });

    const ethanolDataFiltered = ethanolData.filter((data: any) => data);
    const gasolineDataFiltered = gasolineData.filter((data: any) => data);

    const fuelTestData = {
      date,
      time,
      managerName: userName,
      userName,
      postName: userPost,
      ethanolData: ethanolDataFiltered,
      gasolineData: gasolineDataFiltered,
      images,
      tanks: fetchedData?.tanks || [],
      id: "teste-combustiveis-14h",
    };

    try {
      await sendMessage(fuelTestData);

      const docRef = await addDoc(collection(db, "MANAGERS"), fuelTestData);
      console.log("Teste dos combustíveis salvo com ID: ", docRef.id);

      toast.success("Teste dos combustíveis salvo com sucesso!");
      router.push("/manager-fourteen-routine");
    } catch (error) {
      console.error("Erro ao salvar o teste dos combustíveis: ", error);
      toast.error("Erro ao salvar o teste dos combustíveis.");
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

  async function sendMessage(data: {
    date: any;
    time: any;
    managerName: any;
    userName?: string | null;
    postName: any;
    ethanolData: any;
    gasolineData: any;
    images: any;
    tanks: any;
    id?: string;
  }) {
    const formattedDate = formatDate(data.date);

    // Processar as URLs das imagens
    console.log("Iniciando processamento das URLs das imagens.");
    const imagesDescription = await Promise.all(
      data.images.map(async (image: { imageUrl: string; type: any }) => {
        console.log(`Encurtando URL da imagem: ${image.imageUrl}`);
        const shortUrl = await shortenUrl(image.imageUrl);
        console.log(`URL encurtada: ${shortUrl}`);
        return { type: image.type, url: shortUrl };
      })
    );

    console.log("Descrições das imagens processadas:", imagesDescription);

    let messageBody =
      `*Novo Teste de Combustíveis às 14h*\n\n` +
      `*Data:* ${formattedDate}\n` +
      `*Hora:* ${data.time}\n` +
      `*Posto:* ${data.postName}\n` +
      `*Gerente:* ${data.managerName}\n\n`;

    if (data.ethanolData.length > 0) {
      console.log("Processando dados de etanol.");
      data.ethanolData.forEach(
        (
          ethanol: { ethanolTemperature: any; ethanolWeight: any },
          index: number
        ) => {
          const tank = data.tanks.find(
            (tank: { product: string; saleDefense: string }) =>
              tank.product === "ET" && tank.saleDefense === "Venda"
          );
          const tankNumber = tank ? tank.tankNumber : index + 1;
          const tankTitle = `Tanque ${tankNumber} - ET Venda`;
          messageBody +=
            `*${tankTitle}*\n` +
            `*Temperatura:* ${ethanol.ethanolTemperature}\n` +
            `*Peso:* ${ethanol.ethanolWeight}\n`;
          const ethanolImage = imagesDescription.find(
            (image) => image.type === `Etanol ${index + 1}`
          );
          if (ethanolImage) {
            messageBody += `*Imagem:* ${ethanolImage.url}\n\n`;
            console.log(
              `Imagem de Etanol ${index + 1} adicionada: ${ethanolImage.url}`
            );
          } else {
            messageBody += `\n`;
            console.log(`Nenhuma imagem encontrada para Etanol ${index + 1}`);
          }
        }
      );
    }

    if (data.gasolineData.length > 0) {
      console.log("Processando dados de gasolina.");
      data.gasolineData.forEach(
        (gasoline: { gasolineQuality: any }, index: number) => {
          const tank = data.tanks.find(
            (tank: { product: string; saleDefense: string }) =>
              tank.product === "GC" && tank.saleDefense === "Venda"
          );
          const tankNumber = tank ? tank.tankNumber : index + 1;
          const tankTitle = `Tanque ${tankNumber} - GC Venda`;
          messageBody +=
            `*${tankTitle}*\n` + `*Qualidade:* ${gasoline.gasolineQuality}\n`;
          const gcImage = imagesDescription.find(
            (image) => image.type === `GC ${index + 1}`
          );
          if (gcImage) {
            messageBody += `*Imagem:* ${gcImage.url}\n\n`;
            console.log(
              `Imagem de Gasolina ${index + 1} adicionada: ${gcImage.url}`
            );
          } else {
            messageBody += `\n`;
            console.log(`Nenhuma imagem encontrada para Gasolina ${index + 1}`);
          }
        }
      );
    }

    console.log("Mensagem final gerada:", messageBody);

    const postsRef = collection(db, "POSTS");
    const q = query(postsRef, where("name", "==", data.postName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Nenhum posto encontrado com o nome especificado.");
      throw new Error("Posto não encontrado");
    }

    const postData = querySnapshot.docs[0].data();
    const managerContact = postData.managers[0].contact;

    console.log("Contato do gerente:", managerContact);

    const contacts = [managerContact];

    for (const contact of contacts) {
      await sendIndividualMessage(contact, messageBody);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Intervalo de 2 segundos
    }
  }

  async function sendIndividualMessage(contact: string, messageBody: string) {
    console.log(`Enviando mensagem para ${contact}`);

    const response = await fetch("/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        managerContact: contact,
        messageBody,
      }),
    });

    if (!response.ok) {
      throw new Error(`Falha ao enviar mensagem via WhatsApp para ${contact}`);
    }

    console.log(`Mensagem enviada com sucesso para ${contact}!`);
  }

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <HeaderNewProduct />
      <ToastContainer />
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Teste dos combustíveis 14h</p>
            <div className={styles.BudgetHeadS}>
              {!docId && (
                <button className={styles.FinishButton} onClick={saveFuelTest}>
                  <img
                    src="/finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>Cadastrar teste</span>
                </button>
              )}
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações dos testes dos combustíveis
          </p>

          {docId ? (
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
                      disabled
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
                      disabled
                    />
                  </div>
                </div>
                {fetchedData?.tanks?.length > 0 &&
                  fetchedData.tanks
                    .filter((tank: any) => tank.saleDefense === "Venda")
                    .map((tank: any, index: number) => {
                      const tankTitle = `Tanque ${tank.tankNumber} - ${tank.product} ${tank.saleDefense}`;
                      if (tank.product === "ET" && postName === "Vena") {
                        return (
                          <div key={index} className={styles.InputContainer}>
                            <p className={styles.TankTitle}>{tankTitle}</p>
                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Temperatura do Etanol
                              </p>
                              <input
                                id="ethanolTemperature"
                                type="text"
                                className={styles.Field}
                                value={
                                  ethanolData[index - 1]?.ethanolTemperature ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleEthanolFieldChange(
                                    index,
                                    "ethanolTemperature",
                                    e.target.value
                                  )
                                }
                                placeholder=""
                                disabled
                              />
                            </div>

                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Peso do Etanol
                              </p>
                              <input
                                id="ethanolWeight"
                                type="text"
                                className={styles.Field}
                                value={
                                  ethanolData[index - 1]?.ethanolWeight || ""
                                }
                                onChange={(e) =>
                                  handleEthanolFieldChange(
                                    index,
                                    "ethanolWeight",
                                    e.target.value
                                  )
                                }
                                placeholder=""
                                disabled
                              />
                            </div>

                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Imagem do teste de Etanol
                              </p>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                style={{ display: "none" }}
                                ref={(el) => (etanolRefs.current[index] = el)}
                                onChange={(e) =>
                                  handleEtanolImageChange(index, e)
                                }
                                disabled
                              />
                              <button
                                onClick={() =>
                                  etanolRefs.current[index] &&
                                  // @ts-ignore
                                  etanolRefs.current[index].click()
                                }
                                className={styles.MidiaField}
                                disabled
                              >
                                Carregue sua foto
                              </button>
                              {fetchedData.images?.find(
                                (img: any) => img.type === `Etanol ${index + 1}`
                              ) && (
                                <div>
                                  {[
                                    ".mp4",
                                    ".mov",
                                    ".avi",
                                    ".MOV",
                                    ".MP4",
                                    ".AVI",
                                  ].some((ext) =>
                                    fetchedData.images
                                      .find(
                                        (img: any) =>
                                          img.type === `Etanol ${index + 1}`
                                      )
                                      .imageUrl.includes(ext)
                                  ) ? (
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
                                        src={
                                          fetchedData.images.find(
                                            (img: any) =>
                                              img.type === `Etanol ${index + 1}`
                                          ).imageUrl
                                        }
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  ) : (
                                    <img
                                      src={
                                        fetchedData.images.find(
                                          (img: any) =>
                                            img.type === `Etanol ${index + 1}`
                                        ).imageUrl
                                      }
                                      alt="Preview do teste de Etanol"
                                      style={{
                                        maxWidth: "17.5rem",
                                        height: "auto",
                                        border: "1px solid #939393",
                                        borderRadius: "20px",
                                      }}
                                    />
                                  )}
                                  <p className={styles.fileName}>
                                    {
                                      fetchedData.images.find(
                                        (img: any) =>
                                          img.type === `Etanol ${index + 1}`
                                      ).fileName
                                    }
                                  </p>
                                  <a
                                    href={
                                      fetchedData.images.find(
                                        (img: any) =>
                                          img.type === `Etanol ${index + 1}`
                                      ).imageUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.openMediaLink}
                                  >
                                    Abrir mídia
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      } else if (tank.product === "ET" && postName !== "Vena") {
                        return (
                          <div key={index} className={styles.InputContainer}>
                            <p className={styles.TankTitle}>{tankTitle}</p>
                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Temperatura do Etanol
                              </p>
                              <input
                                id="ethanolTemperature"
                                type="text"
                                className={styles.Field}
                                value={
                                  ethanolData[index]?.ethanolTemperature || ""
                                }
                                onChange={(e) =>
                                  handleEthanolFieldChange(
                                    index,
                                    "ethanolTemperature",
                                    e.target.value
                                  )
                                }
                                placeholder=""
                                disabled
                              />
                            </div>

                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Peso do Etanol
                              </p>
                              <input
                                id="ethanolWeight"
                                type="text"
                                className={styles.Field}
                                value={ethanolData[index]?.ethanolWeight || ""}
                                onChange={(e) =>
                                  handleEthanolFieldChange(
                                    index,
                                    "ethanolWeight",
                                    e.target.value
                                  )
                                }
                                placeholder=""
                                disabled
                              />
                            </div>

                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Imagem do teste de Etanol
                              </p>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                style={{ display: "none" }}
                                ref={(el) => (etanolRefs.current[index] = el)}
                                onChange={(e) =>
                                  handleEtanolImageChange(index, e)
                                }
                                disabled
                              />
                              <button
                                onClick={() =>
                                  etanolRefs.current[index] &&
                                  // @ts-ignore
                                  etanolRefs.current[index].click()
                                }
                                className={styles.MidiaField}
                                disabled
                              >
                                Carregue sua foto
                              </button>
                              {fetchedData.images?.find(
                                (img: any) => img.type === `Etanol ${index + 1}`
                              ) && (
                                <div>
                                  {[
                                    ".mp4",
                                    ".mov",
                                    ".avi",
                                    ".MOV",
                                    ".MP4",
                                    ".AVI",
                                    ".MOV",
                                  ].some((ext) =>
                                    fetchedData.images
                                      .find(
                                        (img: any) =>
                                          img.type === `Etanol ${index + 1}`
                                      )
                                      .imageUrl.includes(ext)
                                  ) ? (
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
                                        src={
                                          fetchedData.images.find(
                                            (img: any) =>
                                              img.type === `Etanol ${index + 1}`
                                          ).imageUrl
                                        }
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  ) : (
                                    <img
                                      src={
                                        fetchedData.images.find(
                                          (img: any) =>
                                            img.type === `Etanol ${index + 1}`
                                        ).imageUrl
                                      }
                                      alt="Preview do teste de Etanol"
                                      style={{
                                        maxWidth: "17.5rem",
                                        height: "auto",
                                        border: "1px solid #939393",
                                        borderRadius: "20px",
                                      }}
                                    />
                                  )}
                                  <p className={styles.fileName}>
                                    {
                                      fetchedData.images.find(
                                        (img: any) =>
                                          img.type === `Etanol ${index + 1}`
                                      ).fileName
                                    }
                                  </p>
                                  <a
                                    href={
                                      fetchedData.images.find(
                                        (img: any) =>
                                          img.type === `Etanol ${index + 1}`
                                      ).imageUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.openMediaLink}
                                  >
                                    Abrir mídia
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      } else if (tank.product === "GC") {
                        return (
                          <div key={index} className={styles.InputContainer}>
                            <p className={styles.TankTitle}>{tankTitle}</p>
                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Qualidade da Gasolina
                              </p>
                              <input
                                id="gasolineQuality"
                                type="text"
                                className={styles.Field}
                                value={
                                  gasolineData[index]?.gasolineQuality || ""
                                }
                                onChange={(e) =>
                                  handleGasolineFieldChange(
                                    index,
                                    "gasolineQuality",
                                    e.target.value
                                  )
                                }
                                placeholder=""
                              />
                            </div>

                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Imagem do teste de Gasolina Comum (GC)
                              </p>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                style={{ display: "none" }}
                                ref={(el) => (gcRefs.current[index] = el)}
                                onChange={(e) => handleGcImageChange(index, e)}
                                disabled
                              />
                              <button
                                onClick={() =>
                                  gcRefs.current[index] &&
                                  // @ts-ignore
                                  gcRefs.current[index].click()
                                }
                                className={styles.MidiaField}
                                disabled
                              >
                                Carregue sua foto
                              </button>
                              {fetchedData.images?.find(
                                (img: any) => img.type === `GC ${index}`
                              ) && (
                                <div>
                                  {[".mp4", ".mov", ".avi"].some((ext) =>
                                    fetchedData.images
                                      .find(
                                        (img: any) => img.type === `GC ${index}`
                                      )
                                      .imageUrl.includes(ext)
                                  ) ? (
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
                                        src={
                                          fetchedData.images.find(
                                            (img: any) =>
                                              img.type === `GC ${index}`
                                          ).imageUrl
                                        }
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  ) : (
                                    <img
                                      src={
                                        fetchedData.images.find(
                                          (img: any) =>
                                            img.type === `GC ${index}`
                                        ).imageUrl
                                      }
                                      alt="Preview do teste de Gasolina Comum"
                                      style={{
                                        maxWidth: "17.5rem",
                                        height: "auto",
                                        border: "1px solid #939393",
                                        borderRadius: "20px",
                                      }}
                                    />
                                  )}
                                  <p className={styles.fileName}>
                                    {
                                      fetchedData.images.find(
                                        (img: any) => img.type === `GC ${index}`
                                      ).fileName
                                    }
                                  </p>
                                  <a
                                    href={
                                      fetchedData.images.find(
                                        (img: any) => img.type === `GC ${index}`
                                      ).imageUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.openMediaLink}
                                  >
                                    Abrir mídia
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    })}
              </div>
            </div>
          ) : (
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
                {fetchedData?.tanks
                  .filter((tank: any) => tank.saleDefense === "Venda")
                  .map((tank: any, index: number) => {
                    const tankTitle = `Tanque ${tank.tankNumber} - ${tank.product} ${tank.saleDefense}`;
                    if (tank.product === "ET") {
                      return (
                        <div key={index} className={styles.InputContainer}>
                          <p className={styles.TankTitle}>{tankTitle}</p>
                          <div className={styles.InputField}>
                            <p className={styles.FieldLabel}>
                              Temperatura do Etanol
                            </p>
                            <input
                              id="ethanolTemperature"
                              type="text"
                              className={styles.Field}
                              value={
                                ethanolData[index]?.ethanolTemperature || ""
                              }
                              onChange={(e) =>
                                handleEthanolFieldChange(
                                  index,
                                  "ethanolTemperature",
                                  e.target.value
                                )
                              }
                              placeholder=""
                            />
                          </div>
                          <div className={styles.InputField}>
                            <p className={styles.FieldLabel}>Peso do Etanol</p>
                            <input
                              id="ethanolWeight"
                              type="text"
                              className={styles.Field}
                              value={ethanolData[index]?.ethanolWeight || ""}
                              onChange={(e) =>
                                handleEthanolFieldChange(
                                  index,
                                  "ethanolWeight",
                                  e.target.value
                                )
                              }
                              placeholder=""
                            />
                          </div>
                          <div className={styles.InputField}>
                            <p className={styles.FieldLabel}>
                              Imagem do teste de Etanol
                            </p>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              style={{ display: "none" }}
                              ref={(el) => (etanolRefs.current[index] = el)}
                              onChange={(e) =>
                                handleEtanolImageChange(index, e)
                              }
                            />
                            <button
                              onClick={() =>
                                etanolRefs.current[index] &&
                                // @ts-ignore
                                etanolRefs.current[index].click()
                              }
                              className={styles.MidiaField}
                            >
                              Carregue sua foto
                            </button>
                            {etanolImages[index] && (
                              <div>
                                <img
                                  // @ts-ignore
                                  src={URL.createObjectURL(etanolImages[index])}
                                  alt="Preview do teste de Etanol"
                                  style={{
                                    maxWidth: "17.5rem",
                                    height: "auto",
                                    border: "1px solid #939393",
                                    borderRadius: "20px",
                                  }}
                                  onLoad={() =>
                                    // @ts-ignore
                                    URL.revokeObjectURL(etanolImages[index])
                                  }
                                />
                                <p className={styles.fileName}>
                                  {etanolFileNames[index]}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    } else if (tank.product === "GC") {
                      return (
                        <div key={index} className={styles.InputContainer}>
                          <p className={styles.TankTitle}>{tankTitle}</p>
                          <div className={styles.InputField}>
                            <p className={styles.FieldLabel}>
                              Qualidade da Gasolina
                            </p>
                            <input
                              id="gasolineQuality"
                              type="text"
                              className={styles.Field}
                              value={gasolineData[index]?.gasolineQuality || ""}
                              onChange={(e) =>
                                handleGasolineFieldChange(
                                  index,
                                  "gasolineQuality",
                                  e.target.value
                                )
                              }
                              placeholder=""
                            />
                          </div>
                          <div className={styles.InputField}>
                            <p className={styles.FieldLabel}>
                              Imagem do teste de Gasolina Comum (GC)
                            </p>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              style={{ display: "none" }}
                              ref={(el) => (gcRefs.current[index] = el)}
                              onChange={(e) => handleGcImageChange(index, e)}
                            />
                            <button
                              onClick={() =>
                                gcRefs.current[index] &&
                                // @ts-ignore
                                gcRefs.current[index].click()
                              }
                              className={styles.MidiaField}
                            >
                              Carregue sua foto
                            </button>
                            {gcImages[index] && (
                              <div>
                                <img
                                  // @ts-ignore
                                  src={URL.createObjectURL(gcImages[index])}
                                  alt="Preview do teste de Gasolina Comum"
                                  style={{
                                    maxWidth: "17.5rem",
                                    height: "auto",
                                    border: "1px solid #939393",
                                    borderRadius: "20px",
                                  }}
                                  onLoad={() =>
                                    // @ts-ignore
                                    URL.revokeObjectURL(gcImages[index])
                                  }
                                />
                                <p className={styles.fileName}>
                                  {gcFileNames[index]}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          )}

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
