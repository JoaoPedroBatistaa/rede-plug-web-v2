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
import { db } from "../../../firebase";

import LoadingOverlay from "@/components/Loading";

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
  const [qtd, setQtd] = useState(0); // Controla a quantidade de campos de imagem
  const [images, setImages] = useState([]); // Para armazenar as imagens e seus URLs
  const inputRefs = useRef([]); // Array de referências dos inputs de imagem

  const handleImageChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedImages = [...images];
      // @ts-ignore
      updatedImages[index] = URL.createObjectURL(file); // Simula preview da imagem
      setImages(updatedImages);
    }
  };

  const handleQtdChange = (e: { target: { value: string } }) => {
    const newQtd = Number(e.target.value);
    setQtd(newQtd);
    // @ts-ignore
    setImages(new Array(newQtd).fill(null)); // Inicializa o array com `null` para cada imagem
    localStorage.setItem("qtd", e.target.value); // Armazena no localStorage
  };

  useEffect(() => {
    const storedDate = localStorage.getItem("date");
    const storedTime = localStorage.getItem("time");
    const storedIsOk = localStorage.getItem("isOk");
    const storedQtd = localStorage.getItem("qtd");
    const storedObservations = localStorage.getItem("observations");

    if (storedDate) setDate(storedDate);
    if (storedTime) setTime(storedTime);
    if (storedIsOk) setIsOk(storedIsOk);
    if (storedQtd) setQtd(Number(storedQtd)); // Transformar em número
    if (storedObservations) setObservations(storedObservations);
  }, []);

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
          console.log("Login duration exceeded. Logging out...");

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
          setIsOk(fetchedData.isOk);
          setQtd(fetchedData.qtd);

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
  const [isOk, setIsOk] = useState("");
  const [observations, setObservations] = useState("");

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
  }, [date, time, isOk, observations]);

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
    center: { lat: any; lng: any },
    radius = 200,
    stepSize = 0.1
  ) => {
    const points = [];
    const earthRadius = 6371000; // Raio da Terra em metros

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

    return points;
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
    else if (!isOk) missingField = "Está ok?";
    else if (!qtd) missingField = "Quantidade";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);
      return;
    }

    const userName = localStorage.getItem("userName");

    const managersRef = collection(db, "SUPERVISORS");
    const q = query(
      managersRef,
      where("date", "==", today.date),
      where("id", "==", "placas-faixa-preco"),
      where("supervisorName", "==", userName),
      where("postName", "==", postName),
      where("shift", "==", shift)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error(
        "A tarefa placas de faixa de preço já foi feita para esse turno hoje!"
      );
      setIsLoading(false);
      return;
    }

    const taskData = {
      date,
      time,
      supervisorName: userName,
      userName,
      postName,
      isOk,
      qtd,
      observations,
      coordinates,
      shift,
      id: "placas-faixa-preco",
    };

    const radiusCoords = calculateCoordinatesInRadius(postCoordinates);
    // @ts-ignore
    radiusCoords.push(postCoordinates); // Adiciona a coordenada principal do posto

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
      localStorage.removeItem("isOk");
      localStorage.removeItem("qtd");
      localStorage.removeItem("observations");

      router.push(
        `/supervisors/extinguishers?post=${encodeURIComponent(
          // @ts-ignore
          postName
        )}&shift=${shift}`
      );
    } catch (error) {
      console.error("Erro ao salvar os dados da tarefa: ", error);
      toast.error("Erro ao salvar a medição.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className={styles.BudgetTitle}>Placas de faixa de preço</p>
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
            Informe abaixo as informações das placas de faixa de preço
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

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isOk}
                    onChange={(e) => {
                      setIsOk(e.target.value);
                      localStorage.setItem("isOk", e.target.value);
                    }}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Quantidade</p>
                  <input
                    id="observations"
                    type="number"
                    className={styles.Field}
                    value={qtd}
                    onChange={handleQtdChange}
                  />
                </div>
              </div>

              {/* Renderiza campos de upload de imagem */}
              {Array.from({ length: qtd }).map((_, index) => (
                <div key={index} className={styles.InputContainer}>
                  <p className={styles.FieldLabel}>Imagem {index + 1}</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    style={{ display: "none" }}
                    // @ts-ignore
                    ref={(el) => (inputRefs.current[index] = el)} // Armazena as referências dos inputs
                    onChange={(event) => handleImageChange(index, event)}
                  />

                  <button
                    onClick={() =>
                      inputRefs.current[index] &&
                      // @ts-ignore
                      inputRefs.current[index].click()
                    }
                    className={styles.MidiaField}
                  >
                    Tire sua foto/vídeo
                  </button>

                  {isLoading && <p>Carregando imagem...</p>}
                  {images[index] && (
                    <div>
                      <img
                        src={images[index]}
                        alt={`Preview da Imagem ${index + 1}`}
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                      />
                      <p className={styles.fileName}>Imagem {index + 1}</p>
                    </div>
                  )}
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
                      localStorage.setItem("observations", e.target.value);
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
