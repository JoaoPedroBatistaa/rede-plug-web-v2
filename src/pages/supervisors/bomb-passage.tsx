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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { db, getDownloadURL, ref, storage } from "../../../firebase";

import LoadingOverlay from "@/components/Loading";
import { uploadBytes } from "firebase/storage";

export default function NewPost() {
  const router = useRouter();
  const postName = router.query.postName;

  const docId = router.query.docId;
  const [data, setData] = useState(null);

  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [postCoordinates, setPostCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [mapUrl, setMapUrl] = useState("");
  const [radiusCoordinates, setRadiusCoordinates] = useState([]);

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

  const [isOk, setIsOk] = useState("");
  const [observations, setObservations] = useState("");

  const etanolRef = useRef(null);
  const gcRef = useRef(null);

  const [etanolImage, setEtanolImage] = useState<File | null>(null);
  const [etanolFileName, setEtanolFileName] = useState("");

  const [gcImage, setGcImage] = useState<File | null>(null);
  const [gcFileName, setGcFileName] = useState("");

  const fetchCoordinates = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            // @ts-ignore
            lat: position.coords.latitude,
            // @ts-ignore
            lng: position.coords.longitude,
          });
          console.log(
            `Supervisor coordinates obtained: lat=${position.coords.latitude}, lng=${position.coords.longitude}`
          );
        },
        (error) => {
          console.error("Error obtaining location:", error);
          setCoordinates({ lat: null, lng: null });
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, [date, time, isOk, observations, managerName]);

  useEffect(() => {
    const fetchPostCoordinates = async () => {
      if (!postName) return;

      try {
        const postsRef = collection(db, "POSTS");
        const q = query(postsRef, where("name", "==", postName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const postData = querySnapshot.docs[0].data();
          setPostCoordinates({
            lat: postData.location.lat,
            lng: postData.location.lng,
          });
          console.log("Post coordinates fetched: ", postData.location);
        }
      } catch (error) {
        console.error("Error fetching post coordinates:", error);
      }
    };

    fetchPostCoordinates();
  }, [postName]);

  const calculateCoordinatesInRadius = (
    center: { lat: number; lng: number },
    radius = 200,
    stepSize = 2
  ) => {
    const points = [];
    const earthRadius = 6371000;

    const lat1 = (center.lat * Math.PI) / 180;
    const lng1 = (center.lng * Math.PI) / 180;

    for (let angle = 0; angle < 360; angle += stepSize) {
      const bearing = (angle * Math.PI) / 180;

      for (let dist = 0; dist <= radius; dist += stepSize) {
        const lat2 = Math.asin(
          Math.sin(lat1) * Math.cos(dist / earthRadius) +
            Math.cos(lat1) * Math.sin(dist / earthRadius) * Math.cos(bearing)
        );
        const lng2 =
          lng1 +
          Math.atan2(
            Math.sin(bearing) * Math.sin(dist / earthRadius) * Math.cos(lat1),
            Math.cos(dist / earthRadius) - Math.sin(lat1) * Math.sin(lat2)
          );

        points.push({
          lat: (lat2 * 180) / Math.PI,
          lng: (lng2 * 180) / Math.PI,
        });
      }
    }

    console.log("Radius coordinates calculated: ", points);
    return points;
  };

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

  const [numberOfPumps, setNumberOfPumps] = useState(0);
  const [pumps, setPumps] = useState([]);

  useEffect(() => {
    if (postName) {
      const fetchPostDetails = async () => {
        try {
          const postsRef = collection(db, "POSTS");
          const q = query(postsRef, where("name", "==", postName));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            setNumberOfPumps(postData.bombs.length || []);
            initializePumps(postData.bombs.length || []);
          });
        } catch (error) {
          console.error("Error fetching post details:.", error);
        }
      };

      fetchPostDetails();
    }
  }, [postName]);

  const updatePumps = (num: number) => {
    setPumps(
      // @ts-ignore
      Array.from({ length: num }, (_, index) => ({
        image1File: null,
        image1Preview: "",
        image1Name: "",
        image2File: null,
        image2Preview: "",
        image2Name: "",
        ok: "",
      }))
    );
  };

  const handleImageChange = (
    pumpIndex: number,
    imageKey: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const newFile = event.target.files[0];
    if (newFile) {
      const newPumps = [...pumps];
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}File`] = newFile;
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Preview`] = URL.createObjectURL(newFile);
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Name`] = newFile.name;

      setPumps(newPumps);
    }
  };

  const handleSelectChange = (pumpIndex: number, value: string) => {
    const newPumps = [...pumps];
    // @ts-ignore
    newPumps[pumpIndex].ok = value;
    setPumps(newPumps);
  };

  const handleFileChange = (
    pumpIndex: number,
    imageKey: any,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      const newPumps = [...pumps];
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}File`] = file;
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Preview`] = URL.createObjectURL(file);
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Name`] = file.name;
      setPumps(newPumps);
    }
  };

  const uploadButton = (
    event: { preventDefault: () => void },
    pumpIndex: any,
    imageIndex: any
  ) => {
    const fileInput = document.getElementById(
      `file-input-${pumpIndex}-${imageIndex}`
    );
    if (fileInput) {
      fileInput.click();
    }
    event.preventDefault(); // Prevent form submission if it's part of a form
  };

  const initializePumps = (num: any) => {
    const newPumps = Array.from({ length: num }, () => ({
      image1File: null,
      image2File: null,
    }));
    // @ts-ignore
    setPumps(newPumps);
  };

  const uploadFile = (pumpIndex: number, imageRefKey: string) => {
    const ref = pumps[pumpIndex][imageRefKey];
    // @ts-ignore
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.click();
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

    fetchCoordinates();

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

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);
      return;
    }

    // Verificação de campos para cada bomba
    for (let pump of pumps) {
      // @ts-ignore
      if (!pump.ok) {
        missingField = "Todos os campos 'OK?' devem ser preenchidos";
        break;
      }
      // @ts-ignore
    }

    if (missingField) {
      toast.error(missingField);
      setIsLoading(false);
      return;
    }

    const userName = localStorage.getItem("userName");
    // const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "SUPERVISORS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("id", "==", "passagem-bomba"),
      where("userName", "==", userName),
      where("postName", "==", postName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A tarefa passsagem de bombas já foi feita hoje!");
      setIsLoading(false);
      return;
    }

    const uploadPromises = pumps.map((pump, index) =>
      Promise.all(
        ["image1", "image2"].map((key) =>
          pump[`${key}File`]
            ? uploadImageAndGetUrl(
                pump[`${key}File`],
                `supervisors/${date}/${pump[`${key}Name`]}_${Date.now()}`
              ).then((imageUrl) => ({
                url: imageUrl,
                name: pump[`${key}Name`],
              }))
            : Promise.resolve({ url: null, name: null })
        )
      ).then((results) => ({
        // @ts-ignore
        ok: pump.ok,
      }))
    );

    try {
      const pumpsData = await Promise.all(uploadPromises);

      const taskData = {
        date,
        time,
        supervisorName: userName,
        userName,
        postName,
        observations,
        coordinates,

        pumps: pumpsData,
        id: "passagem-bomba",
      };

      // @ts-ignore
      const radiusCoords = calculateCoordinatesInRadius(postCoordinates);
      // @ts-ignore
      radiusCoords.push(postCoordinates); // Add the main post coordinate to the array for comparison

      const isWithinRadius = radiusCoords.some(
        (coord) =>
          // @ts-ignore
          Math.abs(coord.lat - coordinates.lat) < 0.0001 &&
          // @ts-ignore
          Math.abs(coord.lng - coordinates.lng) < 0.0001
      );

      console.log(`Supervisor is within radius: ${isWithinRadius}`);

      if (!isWithinRadius) {
        toast.error(
          "Você não está dentro do raio permitido para realizar essa tarefa."
        );
        setIsLoading(false);
        return;
      }

      sendMessage(taskData);

      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);

      toast.success("Tarefa salva com sucesso!");
      // @ts-ignore
      router.push(`/supervisors-routine?post=${encodeURIComponent(postName)}`);
    } catch (error) {
      console.error("Erro ao salvar os dados da tarefa: ", error);
      toast.error("Erro ao salvar a medição.");
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
    date.setDate(date.getDate() + 1); // Adicionando um dia
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${day}/${month}/${year}`;
  }

  async function sendMessage(data: {
    date: string | number | Date;
    pumps: any[];
    time: any;
    postName: any;
    supervisorName: any;
    observations: any;
  }) {
    const formattedDate = formatDate(data.date); // Assumindo uma função de formatação de data existente

    // Encurtar URLs das imagens e construir a descrição dos estados e imagens de cada bomba
    let pumpDescriptions = await Promise.all(
      data.pumps.map(async (pump, index) => {
        const status = pump.ok === "yes" ? "OK" : "NÃO OK";

        return `*Bomba ${index + 1}:* ${status}\n`;
      })
    ).then((descriptions) => descriptions.join(""));

    // Montar o corpo da mensagem
    const messageBody = `*Passagem de bomba*\n\n*Data:* ${formattedDate}\n*Hora:* ${
      data.time
    }\n*Posto:* ${data.postName}\n*Supervisor:* ${
      data.supervisorName
    }\n\n${pumpDescriptions}\n\n${
      data.observations
        ? `*Observações:* ${data.observations}`
        : "_*Sem observações adicionais*_"
    }`;

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

    console.log("Mensagem de inspeção de bocas de visita enviada com sucesso!");
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
            <p className={styles.BudgetTitle}>Passagem de bombas</p>
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

          <p className={styles.Notes}>
            Informe abaixo as informações da passagem de bombas
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
                data &&
                // @ts-ignore
                data.pumps &&
                // @ts-ignore
                data.pumps.map((pump, index) => (
                  <div key={index} className={styles.InputContainer}>
                    {/* {[1, 2].map((imageIndex) => (
                      <div key={imageIndex} className={styles.InputField}>
                        <p className={styles.FieldLabel}>
                          Imagem {imageIndex} da Bomba {index + 1}
                        </p>
                        {pump && pump[`image${imageIndex}`] && (
                          <img
                            src={pump[`image${imageIndex}`].url}
                            alt={`Imagem ${imageIndex} da Bomba ${index + 1}`}
                            style={{
                              maxWidth: "11.5rem",
                              height: "auto",
                              border: "1px solid #939393",
                              borderRadius: "20px",
                            }}
                          />
                        )}
                      </div>
                    ))} */}
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Bomba {index + 1} OK?</p>
                      <select
                        className={styles.SelectField}
                        value={pump && pump.ok ? pump.ok : ""}
                        onChange={(e) =>
                          handleSelectChange(index, e.target.value)
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="yes">Sim</option>
                        <option value="no">Não</option>
                      </select>
                    </div>
                  </div>
                ))}

              {pumps.map((pump, index) => (
                <div key={index} className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Bomba {index + 1} OK?</p>
                    <select
                      className={styles.SelectField}
                      // @ts-ignore
                      value={pump.ok}
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                    >
                      <option value="">Selecione</option>
                      <option value="yes">Sim</option>
                      <option value="no">Não</option>
                    </select>
                  </div>
                </div>
              ))}
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
