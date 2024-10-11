import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ChangeEvent, useEffect, useState } from "react";
import { db, getDownloadURL, ref, storage } from "../../../firebase";

import LoadingOverlay from "@/components/Loading";
import imageCompression from "browser-image-compression";
import { uploadBytes } from "firebase/storage";

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

  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [observations, setObservations] = useState("");

  const [numberOfPumps, setNumberOfPumps] = useState(0);
  const [pumps, setPumps] = useState([]);

  useEffect(() => {
    const storedPumps = localStorage.getItem("pumps");
    if (storedPumps) {
      setPumps(JSON.parse(storedPumps)); // Converte o JSON armazenado de volta para o array de objetos
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pumps", JSON.stringify(pumps));
  }, [pumps]);

  useEffect(() => {
    // Recupera os valores armazenados no localStorage para os campos
    const storedDate = localStorage.getItem("date");
    const storedTime = localStorage.getItem("time");
    const storedObservations = localStorage.getItem("observations");

    if (storedDate) setDate(storedDate);
    if (storedTime) setTime(storedTime);
    if (storedObservations) setObservations(storedObservations);
  }, []);

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
  }, [date, time, observations]);

  useEffect(() => {
    const fetchPostCoordinates = async () => {
      if (!postName) return;

      console.log("Fetching post coordinates for:", postName);

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
        } else {
          console.log("No posts found with this name.");
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

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!postName) return;

      try {
        const postsRef = collection(db, "POSTS");
        const q = query(postsRef, where("name", "==", postName));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const postData = doc.data();

          // Verifica se já temos dados salvos no localStorage para `pumps`
          const storedPumps = localStorage.getItem("pumps");

          if (storedPumps) {
            // Se houver dados no localStorage, restaura os dados de lá
            const pumpsFromStorage = JSON.parse(storedPumps);

            // Checa se o número de bicos armazenados corresponde ao número de bicos do Firestore
            if (pumpsFromStorage.length === postData.nozzles.length) {
              // Se o número de bicos coincidir, use os dados armazenados
              const pumpsWithDefaults = pumpsFromStorage.map(
                (pump: any, index: number) => ({
                  ...initializePump(), // Preenche com campos vazios onde faltar
                  ...pump, // Mantém os valores já preenchidos
                })
              );
              setPumps(pumpsWithDefaults);
            } else {
              // Se o número de bicos não coincidir, inicializa novamente
              setNumberOfPumps(postData.nozzles.length || []);
              initializePumps(postData.nozzles.length || []);
            }
          } else {
            // Caso contrário, inicializa as pumps com base nos dados do Firestore
            setNumberOfPumps(postData.nozzles.length || []);
            initializePumps(postData.nozzles.length || []);
          }
        });
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [postName]);

  // Função auxiliar para inicializar um pump vazio
  const initializePump = () => ({
    image1File: null,
    image1Url: "",
    liters: "", // Campo para Litros bomba
    percentage: "", // Campo para Porcentagem
    ok: "",
  });

  const initializePumps = (num: number) => {
    const newPumps = Array.from({ length: num }, () => initializePump());
    // @ts-ignore
    setPumps(newPumps);
  };

  const handleImageChange = async (
    pumpIndex: number,
    imageKey: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newFile = event.target.files?.[0];
    if (newFile) {
      setIsLoading(true);
      const compressedFile = await compressImage(newFile); // Supondo que você tem uma função compressImage
      const url = await uploadImageAndGetUrl(
        compressedFile,
        `pumps/${compressedFile.name}`
      );

      const newPumps = [...pumps];
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}File`] = newFile;
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Preview`] = URL.createObjectURL(newFile);
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Url`] = url;
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Name`] = newFile.name;

      setPumps(newPumps); // Atualiza o estado e salva no localStorage automaticamente
      setIsLoading(false);
    }
  };

  // Função para lidar com alterações no campo Litros
  const handleLitersChange = (pumpIndex: number, value: string) => {
    const newPumps = [...pumps];
    // @ts-ignore
    newPumps[pumpIndex].liters = value;

    const liters = parseFloat(value);
    if (!isNaN(liters)) {
      const percentage = ((liters - 20) / 20) * 100;
      // @ts-ignore
      newPumps[pumpIndex].percentage = percentage.toFixed(1);
    }

    setPumps(newPumps); // Atualiza o estado e salva no localStorage automaticamente
  };

  // Função para lidar com a alteração do select "OK?"
  const handleSelectChange = (pumpIndex: number, value: string) => {
    const newPumps = [...pumps];
    // @ts-ignore
    newPumps[pumpIndex].ok = value;
    setPumps(newPumps); // Atualiza o estado e salva no localStorage automaticamente
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
      where("id", "==", "game"),
      where("supervisorName", "==", userName),
      where("postName", "==", postName),
      where("shift", "==", shift)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A tarefa já foi feita para esse turno hoje!");
      setIsLoading(false);
      return;
    }

    const pumpsData = pumps.map((pump) => ({
      // @ts-ignore
      ok: pump.ok,
      // @ts-ignore
      image1: { url: pump.image1Url, name: pump.image1Name },
      // @ts-ignore
      liters: pump.liters,
      // @ts-ignore
      percentage: pump.percentage,
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
      nozzles: pumpsData,
      id: "game",
    };

    // @ts-ignore
    const radiusCoords = calculateCoordinatesInRadius(postCoordinates);
    // @ts-ignore
    radiusCoords.push(postCoordinates);

    const isWithinRadius = radiusCoords.some(
      (coord) =>
        // @ts-ignore
        Math.abs(coord.lat - coordinates.lat) < 0.0001 &&
        // @ts-ignore
        Math.abs(coord.lng - coordinates.lng) < 0.0001
    );

    if (!isWithinRadius && coordinates.lat && coordinates.lng) {
      toast.error(
        "Você não está dentro do raio permitido para realizar essa tarefa."
      );
      setIsLoading(false);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);

      toast.success("Tarefa salva com sucesso!");

      localStorage.removeItem("date");
      localStorage.removeItem("time");
      localStorage.removeItem("observations");
      localStorage.removeItem("pumps");

      router.push(
        `/supervisors/fuel-sell-test?post=${encodeURIComponent(
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
            <p className={styles.BudgetTitle}>Game</p>
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

          <p className={styles.Notes}>Informe abaixo as informações do game</p>

          <div className={styles.userContent}>
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
                    localStorage.setItem("date", e.target.value);
                  }}
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
                    localStorage.setItem("time", e.target.value);
                  }}
                />
              </div>
            </div>

            {pumps.map((pump, index) => (
              <div key={index} className={styles.InputContainer}>
                {["image1"].map((imageKey, idx) => (
                  <div key={idx} className={styles.InputField}>
                    <p className={styles.FieldLabel}>
                      Imagem {idx + 1} do bico {index + 1}
                    </p>
                    <input
                      id={`file-input-${index}-${idx}`}
                      type="file"
                      accept="image/*,video/*"
                      capture="environment"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(index, imageKey, e)}
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
                        alt={`Preview da Imagem ${idx + 1} do bico ${
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
                  <p className={styles.FieldLabel}>Litros bomba</p>
                  <input
                    type="number"
                    className={styles.Field}
                    // @ts-ignore
                    value={pump.liters}
                    onChange={(e) => handleLitersChange(index, e.target.value)}
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Porcentagem</p>
                  <input
                    type="text"
                    className={styles.Field}
                    // @ts-ignore

                    value={pump.percentage}
                    readOnly
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>OK?</p>
                  <select
                    className={styles.SelectField}
                    // @ts-ignore
                    value={pump.ok}
                    onChange={(e) => handleSelectChange(index, e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>
              </div>
            ))}

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Observações</p>
              <textarea
                id="observations"
                className={styles.Field}
                value={observations}
                onChange={(e) => {
                  setObservations(e.target.value);
                  localStorage.setItem("observations", e.target.value);
                }}
                rows={3}
              />
            </div>
            <div className={styles.InputContainer}></div>
            <div className={styles.InputContainer}></div>
            <div className={styles.InputContainer}></div>
          </div>
        </div>
      </div>
    </>
  );
}
