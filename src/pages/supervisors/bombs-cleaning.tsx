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
    const checkLoginDuration = () => {
      console.log("Checking login duration...");
      const storedDate = localStorage.getItem("loginDate");
      const storedTime = localStorage.getItem("loginTime");

      if (storedDate && storedTime) {
        const storedDateTime = new Date(`${storedDate}T${storedTime}`);
        console.log("Stored login date and time:", storedDateTime);

        const now = new Date();
        const maxLoginDuration = 6 * 60 * 60 * 1000;

        if (now.getTime() - storedDateTime.getTime() > maxLoginDuration) {
          console.log("Login duration exceeded 60 seconds. Logging out...");

          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          localStorage.removeItem("userType");
          localStorage.removeItem("userPost");
          localStorage.removeItem("posts");
          localStorage.removeItem("loginDate");
          localStorage.removeItem("loginTime");

          alert("Sua sessão expirou. Por favor, faça login novamente.");
          window.location.href = "/";
        } else {
          console.log("Login duration within limits.");
        }
      } else {
        console.log("No stored login date and time found.");
      }
    };

    checkLoginDuration();
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
  const [etanolImageUrl, setEtanolImageUrl] = useState<string | null>(null);

  const [gcImage, setGcImage] = useState<File | null>(null);
  const [gcFileName, setGcFileName] = useState("");
  const [gcImageUrl, setGcImageUrl] = useState<string | null>(null);

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

  useEffect(() => {
    const storedDate = localStorage.getItem("date");
    const storedTime = localStorage.getItem("time");
    const storedObservations = localStorage.getItem("observations");

    if (storedDate) setDate(storedDate);
    if (storedTime) setTime(storedTime);
    if (storedObservations) setObservations(storedObservations);

    const storedPumps = [...Array(numberOfPumps)].map((_, index) => {
      const pumpOk = localStorage.getItem(`pumpOk${index}`);
      const image1Url = localStorage.getItem(`pump${index}_image1Url`);
      const image1Name = localStorage.getItem(`pump${index}_image1Name`);
      const image2Url = localStorage.getItem(`pump${index}_image2Url`);
      const image2Name = localStorage.getItem(`pump${index}_image2Name`);

      return {
        ok: pumpOk || "", // Restaura o valor do select
        image1Url: image1Url || null,
        image1Name: image1Name || null,
        image2Url: image2Url || null,
        image2Name: image2Name || null,
      };
    });

    // @ts-ignore
    setPumps(storedPumps);
  }, [numberOfPumps]);

  const handleImageChange = async (
    pumpIndex: number,
    imageKey: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newFile = event.target.files?.[0];
    if (newFile) {
      setIsLoading(true);
      try {
        let compressedFile = newFile;
        if (newFile.type.startsWith("image/")) {
          compressedFile = await compressImage(newFile);
        }
        const fileName = compressedFile.name;
        const imageUrl = await uploadImageAndGetUrl(
          compressedFile,
          `supervisors/${getLocalISODate()}/${fileName}_${Date.now()}`
        );

        const newPumps = [...pumps];
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}File`] = compressedFile;
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}Preview`] =
          URL.createObjectURL(compressedFile);
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}Name`] = fileName;
        // @ts-ignore
        newPumps[pumpIndex][`${imageKey}Url`] = imageUrl;

        setPumps(newPumps);

        // Salva as imagens no localStorage
        localStorage.setItem(`pump${pumpIndex}_${imageKey}Url`, imageUrl);
        localStorage.setItem(`pump${pumpIndex}_${imageKey}Name`, fileName);
      } catch (error) {
        console.error("Erro ao fazer upload do arquivo:", error);
        toast.error("Erro ao fazer upload do arquivo.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectChange = (pumpIndex: number, value: string) => {
    const newPumps = [...pumps];
    // @ts-ignore
    newPumps[pumpIndex].ok = value;

    // Atualiza o estado
    setPumps(newPumps);

    // Salva no localStorage
    localStorage.setItem(`pumpOk${pumpIndex}`, value);
  };

  const initializePumps = (num: any) => {
    const newPumps = Array.from({ length: num }, () => ({
      image1File: null,
      image1Url: null,
      image2File: null,
      image2Url: null,
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
      if (!pump.image1Url && !pump.image2Url) {
        missingField = "Cada bomba deve ter pelo menos uma imagem";
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
      where("id", "==", "limpeza-bombas"),
      where("supervisorName", "==", userName),
      where("postName", "==", postName), // Usando `post` em vez de `postName`
      where("shift", "==", shift) // Também verificamos se o turno já foi salvo
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error(
        "A tarefa limpeza das bombas já foi feita para esse turno hoje!"
      );
      setIsLoading(false);
      return;
    }

    const pumpsData = pumps.map((pump) => ({
      // @ts-ignore
      ok: pump.ok,
      // @ts-ignore
      image1: pump.image1Url
        ? // @ts-ignore
          { url: pump.image1Url, name: pump.image1Name }
        : null,
      // @ts-ignore
      image2: pump.image2Url
        ? // @ts-ignore
          { url: pump.image2Url, name: pump.image2Name }
        : null,
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
      id: "limpeza-bombas",
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

    try {
      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);

      toast.success("Tarefa salva com sucesso!");

      localStorage.removeItem("date");
      localStorage.removeItem("time");
      localStorage.removeItem("observations");

      [...Array(numberOfPumps)].forEach((_, index) => {
        localStorage.removeItem(`pumpOk${index}`);
        localStorage.removeItem(`pump${index}_image1Url`);
        localStorage.removeItem(`pump${index}_image1Name`);
        localStorage.removeItem(`pump${index}_image2Url`);
        localStorage.removeItem(`pump${index}_image2Name`);
      });

      // @ts-ignore
      router.push(
        `/supervisors/front-cleaning?post=${encodeURIComponent(
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
            <p className={styles.BudgetTitle}>Limpeza das bombas</p>
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
            Informe abaixo as informações da limpeza das bombas
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
                      localStorage.setItem("date", e.target.value); // Salva no localStorage
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
                      localStorage.setItem("time", e.target.value); // Salva no localStorage
                    }}
                    placeholder=""
                  />
                </div>
              </div>

              {docId &&
                // @ts-ignore
                data?.pumps.map((pump, index) => (
                  <div key={index} className={styles.InputContainer}>
                    {[1, 2].map((imageIndex) => (
                      <div key={imageIndex} className={styles.InputField}>
                        <p className={styles.FieldLabel}>
                          Imagem {imageIndex} da Bomba {index + 1}
                        </p>
                        {pump[`image${imageIndex}`] && (
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

              {pumps.map((pump, index) => (
                <div key={index} className={styles.InputContainer}>
                  {["image1", "image2"].map((imageKey, idx) => (
                    <div key={idx} className={styles.InputField}>
                      <p className={styles.FieldLabel}>
                        Imagem {idx + 1} da Bomba {index + 1}
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
                      {isLoading && <p>Carregando imagem...</p>}
                      {pump[`${imageKey}Url`] && (
                        <img
                          src={pump[`${imageKey}Url`]}
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
                      localStorage.setItem("observations", e.target.value); // Salva no localStorage
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
