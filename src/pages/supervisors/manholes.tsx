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
import imageCompression from "browser-image-compression";
import { uploadBytes } from "firebase/storage";

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
    const storedDate = localStorage.getItem("date");
    const storedTime = localStorage.getItem("time");
    const storedIsOk = localStorage.getItem("isOk");
    const storedObservations = localStorage.getItem("observations");
    const storedPumps = localStorage.getItem("pumps");

    if (storedDate) setDate(storedDate);
    if (storedTime) setTime(storedTime);
    if (storedIsOk) setIsOk(storedIsOk);
    if (storedObservations) setObservations(storedObservations);
    if (storedPumps) setPumps(JSON.parse(storedPumps));
  }, []);

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
            setNumberOfPumps(postData.tanks.length || []);
            initializePumps(postData.tanks.length || []);
          });
        } catch (error) {
          console.error("Error fetching post details:.", error);
        }
      };

      fetchPostDetails();
    }
  }, [postName]);

  const handleFileChange = async (
    pumpIndex: number,
    imageKey: any,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const compressedFile = file.type.startsWith("image/")
        ? await compressImage(file)
        : file;
      const fileUrl = await uploadImageAndGetUrl(
        compressedFile,
        `supervisors/${getLocalISODate()}/${file.name}_${Date.now()}`
      );
      const newPumps = [...pumps];
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}File`] = file;
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Url`] = fileUrl;
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Name`] = file.name;
      setPumps(newPumps);

      // Armazena no localStorage
      localStorage.setItem("pumps", JSON.stringify(newPumps));
      setIsLoading(false);
    }
  };

  const handleSelectChange = (pumpIndex: number, value: string) => {
    const newPumps = [...pumps];
    // @ts-ignore
    newPumps[pumpIndex].ok = value;
    setPumps(newPumps);

    // Armazena no localStorage
    localStorage.setItem("pumps", JSON.stringify(newPumps));
  };

  const initializePumps = (num: any) => {
    const newPumps = Array.from({ length: num }, () => ({
      image1File: null,
      image1Url: "",
      image1Name: "",
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
        missingField = "Cada tanque deve ter pelo menos uma imagem";
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
      where("id", "==", "bocas-visita"),
      where("supervisorName", "==", userName),
      where("postName", "==", postName), // Usando `post` em vez de `postName`
      where("shift", "==", shift) // Também verificamos se o turno já foi salvo
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error(
        "A tarefa bocas de visita já foi feita para esse turno hoje!"
      );
      setIsLoading(false);
      return;
    }

    const uploadPromises = pumps.map((pump, index) =>
      Promise.all(
        ["image1"].map((key) =>
          pump[`${key}File`]
            ? Promise.resolve({
                url: pump[`${key}Url`],
                name: pump[`${key}Name`],
              })
            : Promise.resolve({ url: null, name: null })
        )
      ).then((results) => ({
        // @ts-ignore
        ok: pump.ok,
        image1: results[0],
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
        shift,
        tanks: pumpsData,
        id: "bocas-visita",
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

      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);

      toast.success("Tarefa salva com sucesso!");

      localStorage.removeItem("date");
      localStorage.removeItem("time");
      localStorage.removeItem("isOk");
      localStorage.removeItem("observations");
      localStorage.removeItem("pumps");

      // @ts-ignore
      router.push(
        `/supervisors/discharge-nozzles-and-padlocks?post=${encodeURIComponent(
          // @ts-ignore
          postName
        )}&shift=${shift}`
      );
    } catch (error) {
      console.error("Erro ao salvar os dados da tarefa: ", error);
      toast.error("Erro ao salvar a tarefa.");
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
            <p className={styles.BudgetTitle}>Bocas de visita</p>
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
            Informe abaixo as informações das bocas de visita
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
                data.tanks &&
                // @ts-ignore
                data.tanks.map((pump, index) => (
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
                        Imagem {idx + 1} do tanque {index + 1}
                      </p>
                      <input
                        id={`file-input-${index}-${idx}`}
                        type="file"
                        accept="image/*,video/*"
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
                        Carregue a Imagem {idx + 1}
                      </button>
                      {pump[`${imageKey}File`] && (
                        <img
                          src={pump[`${imageKey}Url`]}
                          alt={`Preview da Imagem ${idx + 1} do tanque ${
                            index + 1
                          }`}
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
