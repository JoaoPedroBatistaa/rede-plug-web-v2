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
import { useEffect, useRef, useState } from "react";
import { db, getDownloadURL, ref, storage } from "../../../firebase";

import LoadingOverlay from "@/components/Loading";
import { uploadBytes } from "firebase/storage";

export default function NewPost() {
  const router = useRouter();
  const postName = router.query.postName;

  const docId = router.query.docId;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!docId) return;

      try {
        const docRef = doc(db, "SUPERVISORS", docId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedData = docSnap.data();

          // @ts-ignore
          setData(fetchedData);
          setDate(fetchedData.date);
          setTime(fetchedData.time);
          setObservations(fetchedData.observations);
          setIsEtanolOk(fetchedData.isEtanolOk);
          setIsGasolinaOk(fetchedData.isGasolinaOk);

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

  const [isEtanolOk, setIsEtanolOk] = useState("");
  const [isGasolinaOk, setIsGasolinaOk] = useState("");
  const [observations, setObservations] = useState("");

  const etanolRef = useRef(null);
  const gcRef = useRef(null);

  const [etanolImage, setEtanolImage] = useState<File | null>(null);
  const [etanolFileName, setEtanolFileName] = useState("");

  const [gcImage, setGcImage] = useState<File | null>(null);
  const [gcFileName, setGcFileName] = useState("");

  const handleEtanolImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setEtanolImage(file);
      setEtanolFileName(file.name);
    }
  };

  const handleGcImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setGcImage(file);
      setGcFileName(file.name);
    }
  };

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
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);

      return;
    } else if (!time) missingField = "Hora";
    // else if (!managerName) missingField = "Nome do supervisor";
    else if (!isEtanolOk) missingField = "Etanol está ok?";
    else if (!isGasolinaOk) missingField = "Gasolina está ok?";
    else if (!etanolImage && !gcImage)
      missingField = "Fotos do Teste dos Combustíveis";
    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);

      return;
    }

    const userName = localStorage.getItem("userName");
    // const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "SUPERVISORS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("id", "==", "vira"),
      where("userName", "==", userName),
      where("postName", "==", postName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A tarefa vira já foi feita hoje!");
      setIsLoading(false);

      return;
    }

    const taskData = {
      date,
      time,
      supervisorName: userName,
      userName,
      postName,
      isEtanolOk,
      isGasolinaOk,
      observations,
      images: [],
      id: "vira",
    };

    const uploadPromises = [];
    if (etanolImage) {
      const etanolPromise = uploadImageAndGetUrl(
        etanolImage,
        `supervisors/${date}/${etanolFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Etanol",
        imageUrl,
        fileName: etanolFileName,
      }));
      uploadPromises.push(etanolPromise);
    }

    if (gcImage) {
      const gcPromise = uploadImageAndGetUrl(
        gcImage,
        `fuelTests/${date}/gc_${gcFileName}_${Date.now()}`
      ).then((imageUrl) => ({ type: "GC", imageUrl, fileName: gcFileName }));
      uploadPromises.push(gcPromise);
    }

    try {
      const images = await Promise.all(uploadPromises);
      // @ts-ignore
      taskData.images = images;

      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);

      sendMessage(taskData);

      toast.success("Tarefa salva com sucesso!");
      // @ts-ignore
      router.push(`/supervisors-routine?post=${encodeURIComponent(postName)}`);
    } catch (error) {
      console.error("Erro ao salvar os dados da tarefa: ", error);
      toast.error("Erro ao salvar a medição.");
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
    isEtanolOk: any;
    isGasolinaOk: any;
    observations: any;
    images: any[];
    time: any;
    postName: any;
    supervisorName: any;
  }) {
    const formattedDate = formatDate(data.date); // Assumindo uma função de formatação de data existente

    // Montar o corpo da mensagem
    const etanolStatus = data.isEtanolOk
      ? "Etanol: Conforme"
      : "Etanol: Não conforme";
    const gasolinaStatus = data.isGasolinaOk
      ? "Gasolina: Conforme"
      : "Gasolina: Não conforme";
    const observationsMsg = data.observations
      ? `Observações: ${data.observations}`
      : "Sem observações adicionais";

    let imagesDescription = "";
    if (data.images && data.images.length > 0) {
      imagesDescription = await Promise.all(
        data.images.map(async (image, index) => {
          const shortUrl = await shortenUrl(image.imageUrl);
          return `Imagem (${image.type}): ${shortUrl}\n`;
        })
      ).then((descriptions) => descriptions.join("\n"));
    }

    const messageBody = `*Vira*\n\nData: ${formattedDate}\nPosto: ${data.postName}\nSupervisor: ${data.supervisorName}\n\n*Status dos Combustíveis*\n\n${etanolStatus}\n${gasolinaStatus}\n\n${observationsMsg}\n\n*Detalhes das Imagens*\n\n${imagesDescription}`;

    const postsRef = collection(db, "USERS");
    const q = query(postsRef, where("name", "==", data.supervisorName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Nenhum supervisor encontrado com o nome especificado.");
      throw new Error("Supervisor não encontrado");
    }

    const postData = querySnapshot.docs[0].data();
    const managerContact = postData.contact;

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

    console.log(
      "Mensagem de teste dos combustíveis de venda enviada com sucesso!"
    );
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
            <p className={styles.BudgetTitle}>Vira</p>
            <div className={styles.BudgetHeadS}>
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
                  <span className={styles.buttonText}>Cadastrar tarefa</span>
                </button>
              )}
            </div>
          </div>

          <p className={styles.Notes}>Informe abaixo as informações dao vira</p>

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
              {/* <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome do supervisor</p>
                  <input
                    id="driverName"
                    type="text"
                    className={styles.Field}
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div> */}
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Etanol OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isEtanolOk}
                    onChange={(e) => setIsEtanolOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Gasolina OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isGasolinaOk}
                    onChange={(e) => setIsGasolinaOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>
              </div>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Observações</p>
                  <textarea
                    id="observations"
                    className={styles.Field}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {
                // @ts-ignore
                docId && data && data.images && (
                  <div>
                    {
                      // @ts-ignore
                      data.images.map((image, index) => (
                        <div key={index} className={styles.InputField}>
                          <p className={styles.FieldLabel}>
                            Imagem {image.type}
                          </p>
                          <img
                            src={image.imageUrl}
                            alt={`Preview do teste de ${image.type}`}
                            style={{
                              maxWidth: "17.5rem",
                              height: "auto",
                              border: "1px solid #939393",
                              borderRadius: "20px",
                            }}
                          />
                        </div>
                      ))
                    }
                  </div>
                )
              }

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem do teste de Etanol</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={etanolRef}
                    onChange={handleEtanolImageChange}
                  />
                  <button
                    // @ts-ignore
                    onClick={() =>
                      // @ts-ignore
                      etanolRef.current && etanolRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {etanolImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(etanolImage)}
                        alt="Preview do teste de Etanol"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(etanolImage)}
                      />
                      <p className={styles.fileName}>{etanolFileName}</p>
                    </div>
                  )}
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Imagem do teste de Gasolina Comum (GC)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={gcRef}
                    onChange={handleGcImageChange}
                  />
                  <button
                    // @ts-ignore
                    onClick={() => gcRef.current && gcRef.current.click()}
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {gcImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(gcImage)}
                        alt="Preview do teste de Gasolina Comum"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(gcImage)}
                      />
                      <p className={styles.fileName}>{gcFileName}</p>
                    </div>
                  )}
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
