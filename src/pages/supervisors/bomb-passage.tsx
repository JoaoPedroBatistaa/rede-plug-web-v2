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

import imageCompression from "browser-image-compression";
import { uploadBytes } from "firebase/storage";
import dynamic from "next/dynamic";
const LoadingOverlay = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});
async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1,
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

export default function NewPost() {
  const router = useRouter();
  const postName = router.query.post;
  const docId = router.query.docId;
  const shift = router.query.shift;

  const [data, setData] = useState(null);

  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [postCoordinates, setPostCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [mapUrl, setMapUrl] = useState("");
  const [radiusCoordinates, setRadiusCoordinates] = useState([]);

  useEffect(() => {
    // Recupera os valores armazenados no localStorage para os campos
    const storedDate = localStorage.getItem("date");
    const storedTime = localStorage.getItem("time");
    const storedObservations = localStorage.getItem("observations");
    const storedPumps = localStorage.getItem("pumps");

    if (storedDate) setDate(storedDate);
    if (storedTime) setTime(storedTime);
    if (storedObservations) setObservations(storedObservations);
    if (storedPumps) setPumps(JSON.parse(storedPumps)); // Converte o JSON armazenado de volta para o array de objetos
  }, []);

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
  const [etanolImageUrl, setEtanolImageUrl] = useState("");

  const [gcImage, setGcImage] = useState<File | null>(null);
  const [gcFileName, setGcFileName] = useState("");
  const [gcImageUrl, setGcImageUrl] = useState("");

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
    stepSize = 0.1
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

  const handleSelectChange = (pumpIndex: number, value: string) => {
    const newPumps = [...pumps];
    // @ts-ignore
    newPumps[pumpIndex].ok = value;
    setPumps(newPumps);

    // Armazena no localStorage
    localStorage.setItem("pumps", JSON.stringify(newPumps));
  };

  // Helper function to check if the file is an image
  // Helper function to check if the file is an image
  function isImage(file: File) {
    return file && file.type && file.type.startsWith("image/");
  }

  async function handleFileChange(
    pumpIndex: number,
    imageKey: string,
    event: ChangeEvent<HTMLInputElement>
  ) {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);

      // Check if the file is an image before attempting compression
      if (isImage(file)) {
        const compressedFile = await compressImage(file);
        const url = await uploadImageAndGetUrl(
          compressedFile,
          `pumps/${file.name}`
        );

        // Update the pumps array with the compressed image data
        const newPumps = [...pumps];
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}File`] = compressedFile;
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}Preview`] =
          URL.createObjectURL(compressedFile);
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}Url`] = url;
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}Name`] = compressedFile.name;

        setPumps(newPumps);
      } else {
        // If it's not an image, handle the file normally (no compression)
        const url = await uploadImageAndGetUrl(file, `pumps/${file.name}`);

        // @ts-ignore
        const newPumps = [...pumps];
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}File`] = file;
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}Preview`] = URL.createObjectURL(file);
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}Url`] = url;
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}Name`] = file.name;

        setPumps(newPumps);
        localStorage.setItem("pumps", JSON.stringify(newPumps));
      }

      setIsLoading(false);
    }
  }

  const initializePumps = (num: any) => {
    const newPumps = Array.from({ length: num }, () => ({
      image1File: null,
    }));
    // @ts-ignore
    setPumps(newPumps);
  };

  const getLocalISODate = () => {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    return {
      date: date.toISOString().slice(0, 10),
      time: date.toISOString().slice(11, 19),
    };
  };

  const saveMeasurement = async () => {
    setIsLoading(true);

    fetchCoordinates();

    let missingField = "";
    const today = getLocalISODate();
    console.log(today);

    if (!date) missingField = "Data";
    else if (date !== today.date) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);
      return;
    } else if (!time) missingField = "Hora";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);
      return;
    }

    for (let pump of pumps) {
      // @ts-ignore
      if (!pump.ok) {
        missingField = "Todos os campos 'OK?' devem ser preenchidos";
        break;
      }
      // @ts-ignore
      if (!pump.image1File) {
        missingField = "Cada bomba deve ter pelo menos um vídeo...";
        break;
      }
    }

    if (missingField) {
      toast.error(missingField);
      setIsLoading(false);
      return;
    }

    const userName = localStorage.getItem("userName");

    const managersRef = collection(db, "SUPERVISORS");
    const q = query(
      managersRef,
      where("date", "==", today.date),
      where("id", "==", "passagem-bomba"),
      where("supervisorName", "==", userName),
      where("postName", "==", postName), // Usando `post` em vez de `postName`
      where("shift", "==", shift) // Também verificamos se o turno já foi salvo
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error(
        "A tarefa passagem de bombas já foi feita para esse turno hoje!"
      );
      setIsLoading(false);
      return;
    }

    const pumpsData = pumps.map((pump) => ({
      // @ts-ignore
      ok: pump.ok,
      // @ts-ignore
      image1: { url: pump.image1Url, name: pump.image1Name },
    }));

    const taskData = {
      date,
      time,
      supervisorName: userName,
      userName,
      postName,
      observations,
      coordinates,
      shift,
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

    if (!isWithinRadius && coordinates.lat && coordinates.lng) {
      toast.error(
        "Você não está dentro do raio permitido para realizar essa tarefa."
      );
      setIsLoading(false);
      return;
    }

    // sendMessage(taskData);

    try {
      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);

      toast.success("Tarefa salva com sucesso!");

      const itemsToKeep = ["userId", "userName", "userType", "userPost", "posts", "loginDate", "loginTime"];
      
      // Get all keys from localStorage
      const keys = Object.keys(localStorage);
      
      // Remove all items except the ones we want to keep
      keys.forEach(key => {
        if (!itemsToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // @ts-ignore
      router.push(
        `/supervisors/pump-calibration?post=${encodeURIComponent(
          // @ts-ignore
          postName
        )}&shift=${shift}`
      );
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
            <p className={styles.BudgetTitle}>Passagem de bombas</p>
            {!docId && (
              <div className={styles.FinishTask}>
                <button
                  className={styles.FinishButton}
                  onClick={saveMeasurement}
                >
                  <span className={styles.buttonTask}>Próxima tarefa</span>
                  <img
                    src="/finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                </button>
              </div>
            )}
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
                    onChange={(e) => {
                      setDate(e.target.value);
                      localStorage.setItem("date", e.target.value); // Armazena no localStorage
                    }}
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
                    onChange={(e) => {
                      setTime(e.target.value);
                      localStorage.setItem("time", e.target.value); // Armazena no localStorage
                    }}
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
                    {[1].map((imageIndex) => (
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
                    ))}
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>OK?</p>
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
                  {["image1"].map((imageKey, idx) => (
                    <div key={idx} className={styles.InputField}>
                      <p className={styles.FieldLabel}>
                        Video {idx + 1} da Bomba {index + 1}
                      </p>
                      <input
                        id={`file-input-${index}-${idx}`}
                        type="file"
                        accept="video/*"
                        capture="environment"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(index, imageKey, e)}
                      />
                      <button
                        onClick={() =>
                          // @ts-ignore
                          document
                            .getElementById(`file-input-${index}-${idx}`)
                            .click()
                        }
                        className={styles.MidiaField}
                      >
                        Carregue o vídeo {idx + 1}
                      </button>
                      {pump[`${imageKey}File`] && (
                        <>
                          {isImage(pump[`${imageKey}File`]) ? (
                            <img
                              src={pump[`${imageKey}Preview`]}
                              alt={`Preview da Imagem ${idx + 1} da Bomba ${
                                index + 1
                              }`}
                              style={{
                                maxWidth: "11.5rem",
                                height: "auto",
                                border: "1px solid #939393",
                                borderRadius: "20px",
                              }}
                            />
                          ) : (
                            <video
                              controls
                              style={{
                                maxWidth: "11.5rem",
                                height: "auto",
                                border: "1px solid #939393",
                                borderRadius: "20px",
                              }}
                            >
                              <source
                                src={pump[`${imageKey}Preview`]}
                                // @ts-ignore
                                type={pump[`${imageKey}File`].type}
                              />
                              Seu navegador não suporta o elemento de vídeo.
                            </video>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>OK?</p>
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
                    onChange={(e) => {
                      setObservations(e.target.value);
                      localStorage.setItem("observations", e.target.value); // Armazena no localStorage
                    }}
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
