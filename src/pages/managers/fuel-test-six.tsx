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
  const [data, setData] = useState<any>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [ethanolTemperature, setEthanolTemperature] = useState("");
  const [ethanolWeight, setEthanolWeight] = useState("");
  const [gasolineQuality, setGasolineQuality] = useState("");

  const [managerName, setManagerName] = useState("");

  const [etanolImages, setEtanolImages] = useState<(File | null)[]>([]);
  const [etanolImageUrls, setEtanolImageUrls] = useState<string[]>([]);
  const [etanolFileNames, setEtanolFileNames] = useState<string[]>([]);

  const [gcImages, setGcImages] = useState<(File | null)[]>([]);
  const [gcImageUrls, setGcImageUrls] = useState<string[]>([]);
  const [gcFileNames, setGcFileNames] = useState<string[]>([]);

  const [tanks, setTanks] = useState<Tank[]>([]);
  const [ethanolTankData, setEthanolTankData] = useState<any[]>([]);
  const [gasolineTankData, setGasolineTankData] = useState<any[]>([]);

  const etanolRefs = useRef<(HTMLInputElement | null)[]>([]);
  const gcRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!docId) return;

      try {
        const docRef = doc(db, "MANAGERS", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedData = docSnap.data();

          setDate(fetchedData.date || "");
          setTime(fetchedData.time || "");
          setEthanolTemperature(fetchedData.ethanolTemperature || "");
          setEthanolWeight(fetchedData.ethanolWeight || "");
          setGasolineQuality(fetchedData.gasolineQuality || "");

          console.log(fetchedData);
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
    const postName = localStorage.getItem("userPost");

    if (postName) {
      const fetchPostDetails = async () => {
        try {
          const postsRef = collection(db, "POSTS");
          const q = query(postsRef, where("name", "==", postName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const postData = querySnapshot.docs[0].data();
            setTanks(postData.tanks);
            setEtanolImages(Array(postData.tanks.length).fill(null));
            setGcImages(Array(postData.tanks.length).fill(null));
            setEtanolImageUrls(Array(postData.tanks.length).fill(""));
            setGcImageUrls(Array(postData.tanks.length).fill(""));
            setEtanolFileNames(Array(postData.tanks.length).fill(""));
            setGcFileNames(Array(postData.tanks.length).fill(""));
            etanolRefs.current = Array(postData.tanks.length).fill(null);
            gcRefs.current = Array(postData.tanks.length).fill(null);
          }
        } catch (error) {
          console.error("Error fetching post details:", error);
        }
      };

      fetchPostDetails();
    }
  }, []);

  const handleEthanolFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setEthanolTankData((prev) => {
      const updatedData = [...prev];
      if (!updatedData[index]) updatedData[index] = {};
      updatedData[index][field] = value;
      return updatedData;
    });
  };

  const handleGasolineFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setGasolineTankData((prev) => {
      const updatedData = [...prev];
      if (!updatedData[index]) updatedData[index] = {};
      updatedData[index][field] = value;
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

  const handleEtanolImageChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
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

        setEtanolImages((prev) => {
          const updatedImages = [...prev];
          updatedImages[index] = processedFile;
          return updatedImages;
        });
        setEtanolFileNames((prev) => {
          const updatedFileNames = [...prev];
          updatedFileNames[index] = processedFile.name;
          return updatedFileNames;
        });
        setEtanolImageUrls((prev) => {
          const updatedImageUrls = [...prev];
          updatedImageUrls[index] = imageUrl;
          return updatedImageUrls;
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

        setGcImages((prev) => {
          const updatedImages = [...prev];
          updatedImages[index] = processedFile;
          return updatedImages;
        });
        setGcFileNames((prev) => {
          const updatedFileNames = [...prev];
          updatedFileNames[index] = processedFile.name;
          return updatedFileNames;
        });
        setGcImageUrls((prev) => {
          const updatedImageUrls = [...prev];
          updatedImageUrls[index] = imageUrl;
          return updatedImageUrls;
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
    const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "MANAGERS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("userName", "==", userName),
      where("id", "==", "teste-combustiveis-6h")
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("O teste dos combustíveis das 6h já foi cadastrado hoje!");
      setIsLoading(false);
      return;
    }

    const images: { type: string; imageUrl: string; fileName: string }[] = [];

    etanolImageUrls.forEach((url, index) => {
      if (url) {
        images.push({
          type: `Etanol ${index + 1}`,
          imageUrl: url,
          fileName: etanolFileNames[index],
        });
      }
    });

    gcImageUrls.forEach((url, index) => {
      if (url) {
        images.push({
          type: `GC ${index}`,
          imageUrl: url,
          fileName: gcFileNames[index],
        });
      }
    });

    const ethanolData = ethanolTankData.filter((data) => data);
    const gasolineData = gasolineTankData.filter((data) => data);

    const fuelTestData = {
      date,
      time,
      managerName: userName,
      userName,
      postName,
      ethanolData,
      gasolineData,
      images,
      id: "teste-combustiveis-6h",
    };

    try {
      await sendMessage(fuelTestData);

      const docRef = await addDoc(collection(db, "MANAGERS"), fuelTestData);
      console.log("Teste dos combustíveis salvo com ID: ", docRef.id);

      toast.success("Teste dos combustíveis salvo com sucesso!");
      router.push("/manager-six-routine");
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

  async function sendMessage(data: any) {
    const formattedDate = formatDate(data.date);

    // Processar as URLs das imagens
    console.log("Iniciando processamento das URLs das imagens.");
    const imagesDescription = await Promise.all(
      data.images.map(async (image: any) => {
        console.log(`Encurtando URL da imagem: ${image.imageUrl}`);
        const shortUrl = await shortenUrl(image.imageUrl);
        console.log(`URL encurtada: ${shortUrl}`);
        return { type: image.type, url: shortUrl };
      })
    );

    console.log("Descrições das imagens processadas:", imagesDescription);

    let messageBody =
      `*Novo Teste de Combustíveis às 6h*\n\n` +
      `*Data:* ${formattedDate}\n` +
      `*Hora:* ${data.time}\n` +
      `*Posto:* ${data.postName}\n` +
      `*Gerente:* ${data.managerName}\n\n`;

    if (data.ethanolData.length > 0) {
      console.log("Processando dados de etanol.");
      data.ethanolData.forEach((ethanol: any, index: number) => {
        messageBody +=
          `*Tanque de Etanol ${index + 1}*\n` +
          `*Temperatura:* ${ethanol.ethanolTemperature}\n` +
          `*Peso:* ${ethanol.ethanolWeight}\n`;
        const ethanolImage = imagesDescription.find(
          (image: any) => image.type === `Etanol ${index + 1}`
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
      });
    }

    if (data.gasolineData.length > 0) {
      console.log("Processando dados de gasolina.");
      data.gasolineData.forEach((gasoline: any, index: number) => {
        messageBody +=
          `*Tanque de Gasolina ${index + 1}*\n` +
          `*Qualidade:* ${gasoline.gasolineQuality}\n`;
        const gcImage = imagesDescription.find(
          (image: any) => image.type === `GC ${index + 1}`
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
      });
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

    console.log("Mensagem de teste de combustíveis enviada com sucesso!");
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
            <p className={styles.BudgetTitle}>Teste dos combustíveis 6h</p>
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
              {tanks
                .filter((tank) => tank.saleDefense === "Venda")
                .map((tank, index) => {
                  if (tank.product === "ET" || tank.product === "GC") {
                    return (
                      <div key={index} className={styles.InputContainer}>
                        {tank.product === "ET" && (
                          <>
                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Temperatura do Etanol
                              </p>
                              <input
                                id="ethanolTemperature"
                                type="text"
                                className={styles.Field}
                                value={
                                  ethanolTankData[index]?.ethanolTemperature ||
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
                                  ethanolTankData[index]?.ethanolWeight || ""
                                }
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
                                    src={URL.createObjectURL(
                                      // @ts-ignore
                                      etanolImages[index]
                                    )}
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
                          </>
                        )}
                        {tank.product === "GC" && (
                          <>
                            <div className={styles.InputField}>
                              <p className={styles.FieldLabel}>
                                Qualidade da Gasolina
                              </p>
                              <input
                                id="gasolineQuality"
                                type="text"
                                className={styles.Field}
                                value={
                                  gasolineTankData[index]?.gasolineQuality || ""
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
                          </>
                        )}
                      </div>
                    );
                  }
                })}
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
