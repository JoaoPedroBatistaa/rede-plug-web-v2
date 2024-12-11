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

interface Tank {
  product: string;
  saleDefense: string;
  tankNumber: number;
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
  const [s10Data, setS10Data] = useState<any[]>([]);

  const [taskMedia, setTaskMedia] = useState<File | null>(null);
  const [taskMediaName, setTaskMediaName] = useState("");
  const [taskMediaUrl, setTaskMediaUrl] = useState("");

  const taskMediaRef = useRef<HTMLInputElement | null>(null);

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
          setS10Data(data.s10Data || []);
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
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [postName]);

  const handleEthanolFieldChange = (
    index: number,
    tankNumber: number,
    field: string,
    value: string
  ) => {
    setEthanolData((prev) => {
      const updatedData = [...prev];
      if (!updatedData[index]) updatedData[index] = { tankNumber };
      updatedData[index][field] = value;
      return updatedData;
    });
  };

  const handleGasolineFieldChange = (
    index: number,
    tankNumber: number,
    field: string,
    value: string
  ) => {
    setGasolineData((prev) => {
      const updatedData = [...prev];
      if (!updatedData[index]) updatedData[index] = { tankNumber };
      updatedData[index][field] = value;
      return updatedData;
    });
  };

  const handleS10FieldChange = (
    index: number,
    tankNumber: number,
    field: string,
    value: string
  ) => {
    setS10Data((prev) => {
      const updatedData = [...prev];
      if (!updatedData[index]) updatedData[index] = { tankNumber };
      updatedData[index][field] = value;
      return updatedData;
    });
  };

  const handleTaskMediaChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Verifica o tamanho do arquivo (máximo 10MB)
      const maxFileSize = 10 * 1024 * 1024; // 10MB em bytes
      if (file.size > maxFileSize) {
        toast.error("O arquivo deve ter no máximo 10MB.");
        return;
      }

      setIsLoading(true);
      setTaskMedia(file);
      setTaskMediaName(file.name);

      try {
        // Faz o upload da mídia e obtém a URL
        const path = `uploads/tasks/${file.name}`;
        const uploadedUrl = await uploadImageAndGetUrl(file, path);

        console.log("URL da mídia carregada:", uploadedUrl);

        // Atualiza o estado com a URL da mídia
        setTaskMediaUrl(uploadedUrl);
      } catch (error) {
        console.error("Erro durante o upload da mídia:", error);
        toast.error("Erro ao fazer upload da mídia.");
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
    else if (!taskMediaUrl) missingField = "Mídia";

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
      where("id", "==", "teste-combustiveis-6h")
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("O teste dos combustíveis das 6h já foi cadastrado hoje!");
      setIsLoading(false);
      return;
    }

    const ethanolDataFiltered = ethanolData.filter((data: any) => data);
    const gasolineDataFiltered = gasolineData.filter((data: any) => data);
    const s10DataFiltered = s10Data.filter((data: any) => data);

    const fuelTestData = {
      date,
      time,
      managerName: userName,
      userName,
      postName: userPost,
      ethanolData: ethanolDataFiltered,
      gasolineData: gasolineDataFiltered,
      s10Data: s10DataFiltered,
      tanks: fetchedData?.tanks || [],
      taskMediaUrl,
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

  async function sendMessage(data: {
    date: any;
    time: any;
    managerName: any;
    userName?: string | null;
    postName: any;
    ethanolData: any;
    gasolineData: any;
    s10Data: any;
    tanks: any;
    id?: string;
  }) {
    const formattedDate = formatDate(data.date);

    let messageBody =
      `*Novo Teste de Combustíveis às 6h*\n\n` +
      `*Data:* ${formattedDate}\n` +
      `*Hora:* ${data.time}\n` +
      `*Posto:* ${data.postName}\n` +
      `*Gerente:* ${data.managerName}\n\n`;

    const sortedTanks = data.tanks.sort(
      (a: { tankNumber: number }, b: { tankNumber: number }) =>
        a.tankNumber - b.tankNumber
    );

    sortedTanks.forEach((tank: { product: string; tankNumber: number }) => {
      if (tank.product === "ET") {
        const ethanol = data.ethanolData.find(
          (eth: any) => eth.tankNumber === tank.tankNumber
        );
        if (ethanol) {
          const tankTitle = `Tanque ${tank.tankNumber} - ET Venda`;
          messageBody +=
            `*${tankTitle}*\n` +
            `*Temperatura:* ${ethanol.ethanolTemperature}\n` +
            `*Peso:* ${ethanol.ethanolWeight}\n\n`;
        }
      } else if (tank.product === "GC") {
        const gasoline = data.gasolineData.find(
          (gas: any) => gas.tankNumber === tank.tankNumber
        );
        if (gasoline) {
          const tankTitle = `Tanque ${tank.tankNumber} - GC Venda`;
          messageBody +=
            `*${tankTitle}*\n` + `*Qualidade:* ${gasoline.gasolineQuality}\n\n`;
        }
      } else if (tank.product === "S10") {
        const s10 = data.s10Data.find(
          (s: any) => s.tankNumber === tank.tankNumber
        );
        if (s10) {
          const tankTitle = `Tanque ${tank.tankNumber} - S10 Venda`;
          messageBody += `*${tankTitle}*\n` + `*Peso:* ${s10.s10Weight}\n\n`;
        }
      }
    });

    // Encurtando a URL do vídeo
    let shortVideoUrl;
    try {
      shortVideoUrl = await shortenUrl(taskMediaUrl);
    } catch (error) {
      console.error("Erro ao encurtar a URL do vídeo:", error);
      throw new Error("Falha ao encurtar a URL do vídeo");
    }

    messageBody += `*Vídeo da tarefa:* ${shortVideoUrl}\n`;

    // Obtendo o contato do gerente
    const postsRef = collection(db, "POSTS");
    const q = query(postsRef, where("name", "==", data.postName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Nenhum posto encontrado com o nome especificado.");
      throw new Error("Posto não encontrado");
    }

    const postData = querySnapshot.docs[0].data();
    const managerContact = postData.managers[0].contact;

    const contacts = [managerContact];

    // Enviando a mensagem
    const sendMessages = contacts.map(async (contact) => {
      try {
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
          throw new Error(`Falha ao enviar mensagem para ${contact}`);
        }

        console.log(`Mensagem enviada com sucesso para ${contact}!`);
      } catch (error) {
        console.error(`Erro ao enviar mensagem para ${contact}:`, error);
      }
    });

    await Promise.all(sendMessages);
  }

  return (
    <>
      <Head>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
`}</style>
      </Head>

      <HeaderNewProduct />
      <ToastContainer />
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Teste dos combustíveis 6h</p>
            <div className={styles.FinishTask}>
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
                      placeholder=""
                      disabled
                    />
                  </div>
                </div>
                {fetchedData?.tanks?.length > 0 &&
                  fetchedData.tanks
                    .filter((tank: any) => tank.saleDefense === "Venda")
                    .map((tank: any, index: number) => {
                      const tankTitle = `Tanque ${tank.tankNumber} - ${tank.product} Venda`;
                      const currentData = {
                        ET: ethanolData.find(
                          (d) => d.tankNumber === tank.tankNumber
                        ),
                        GC: gasolineData.find(
                          (d) => d.tankNumber === tank.tankNumber
                        ),
                        S10: s10Data.find(
                          (d) => d.tankNumber === tank.tankNumber
                        ),
                      };

                      return (
                        <div key={index} className={styles.InputContainer}>
                          <p className={styles.TankTitle}>{tankTitle}</p>
                          {["ET", "GC", "S10"].includes(tank.product) && (
                            <>
                              {tank.product === "ET" && (
                                <>
                                  <div className={styles.InputField}>
                                    <p className={styles.FieldLabel}>
                                      Temperatura do Etanol
                                    </p>
                                    <input
                                      id={`ethanolTemperature-${tank.tankNumber}`}
                                      type="text"
                                      className={styles.Field}
                                      value={
                                        currentData.ET?.ethanolTemperature || ""
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
                                      id={`ethanolWeight-${tank.tankNumber}`}
                                      type="text"
                                      className={styles.Field}
                                      value={
                                        currentData.ET?.ethanolWeight || ""
                                      }
                                      placeholder=""
                                      disabled
                                    />
                                  </div>
                                </>
                              )}
                              {tank.product === "GC" && (
                                <div className={styles.InputField}>
                                  <p className={styles.FieldLabel}>
                                    Qualidade da Gasolina
                                  </p>
                                  <input
                                    id={`gasolineQuality-${tank.tankNumber}`}
                                    type="text"
                                    className={styles.Field}
                                    value={
                                      currentData.GC?.gasolineQuality || ""
                                    }
                                    placeholder=""
                                    disabled
                                  />
                                </div>
                              )}
                              {tank.product === "S10" && (
                                <div className={styles.InputField}>
                                  <p className={styles.FieldLabel}>
                                    Peso do S10
                                  </p>
                                  <input
                                    id={`s10Weight-${tank.tankNumber}`}
                                    type="text"
                                    className={styles.Field}
                                    value={currentData.S10?.s10Weight || ""}
                                    placeholder=""
                                    disabled
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
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
                                  tank.tankNumber,
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
                                  tank.tankNumber,
                                  "ethanolWeight",
                                  e.target.value
                                )
                              }
                              placeholder=""
                            />
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
                                  tank.tankNumber,
                                  "gasolineQuality",
                                  e.target.value
                                )
                              }
                              placeholder=""
                            />
                          </div>
                        </div>
                      );
                    } else if (tank.product === "S10") {
                      return (
                        <div key={index} className={styles.InputContainer}>
                          <p className={styles.TankTitle}>{tankTitle}</p>
                          <div className={styles.InputField}>
                            <p className={styles.FieldLabel}>Peso do S10</p>
                            <input
                              id="s10Weight"
                              type="text"
                              className={styles.Field}
                              value={s10Data[index]?.s10Weight || ""}
                              onChange={(e) =>
                                handleS10FieldChange(
                                  index,
                                  tank.tankNumber,
                                  "s10Weight",
                                  e.target.value
                                )
                              }
                              placeholder=""
                            />
                          </div>
                        </div>
                      );
                    }
                  })}

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vídeo de todos os testes</p>
                  <input
                    type="file"
                    capture="environment"
                    accept="video/*"
                    style={{ display: "none" }}
                    ref={taskMediaRef}
                    onChange={handleTaskMediaChange}
                  />
                  <button
                    onClick={() => taskMediaRef.current?.click()}
                    className={styles.MidiaField}
                  >
                    Tire sua foto/vídeo
                  </button>
                  {taskMedia && (
                    <div>
                      <img
                        src={URL.createObjectURL(taskMedia)}
                        alt="Preview da Imagem/Vídeo"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(taskMedia)}
                      />
                      <p className={styles.fileName}>{taskMediaName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
