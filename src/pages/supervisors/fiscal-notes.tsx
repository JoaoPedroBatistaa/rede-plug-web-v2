import HeaderNewProduct from "@/components/HeaderNewTask";
import LoadingOverlay from "@/components/Loading";
import imageCompression from "browser-image-compression";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { uploadBytes } from "firebase/storage";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, getDownloadURL, ref, storage } from "../../../firebase";
import styles from "../../styles/ProductFoam.module.scss";

async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Erro ao comprimir imagem:", error);
    throw error;
  }
}

export default function NewPost() {
  const router = useRouter();
  const postName = router.query.post;
  const shift = router.query.shift;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isOk, setIsOk] = useState("");
  const [observations, setObservations] = useState("");
  const [notaEtanol, setNotaEtanol] = useState("");
  const [notaGc, setNotaGc] = useState("");
  const [notaS10, setNotaS10] = useState("");
  const [etanolImageUrl, setEtanolImageUrl] = useState("");
  const [gcImageUrl, setGcImageUrl] = useState("");
  const [s10ImageUrl, setS10ImageUrl] = useState("");
  const [etanolFileName, setEtanolFileName] = useState("");
  const [gcFileName, setGcFileName] = useState("");
  const [s10FileName, setS10FileName] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [postCoordinates, setPostCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const etanolRef = useRef(null);
  const gcRef = useRef(null);
  const s10Ref = useRef(null);

  useEffect(() => {
    fetchCoordinates();
    fetchPostCoordinates();
  }, [postName]);

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
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    }
  };

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
      }
    } catch (error) {
      console.error("Error fetching post coordinates:", error);
    }
  };

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
    return points;
  };

  const handleEtanolImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const compressedFile = await compressImage(file);
        const imageUrl = await uploadImageAndGetUrl(
          compressedFile,
          `etanol/${compressedFile.name}`
        );
        setEtanolFileName(compressedFile.name);
        setEtanolImageUrl(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGcImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const compressedFile = await compressImage(file);
        const imageUrl = await uploadImageAndGetUrl(
          compressedFile,
          `gc/${compressedFile.name}`
        );
        setGcFileName(compressedFile.name);
        setGcImageUrl(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleS10ImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const compressedFile = await compressImage(file);
        const imageUrl = await uploadImageAndGetUrl(
          compressedFile,
          `s10/${compressedFile.name}`
        );
        setS10FileName(compressedFile.name);
        setS10ImageUrl(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const uploadImageAndGetUrl = async (imageFile: File, path: string) => {
    const storageRef = ref(storage, path);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(uploadResult.ref);
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

    const today = getLocalISODate();
    if (!date || date !== today.date) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);
      return;
    }
    if (!time) {
      toast.error("Por favor, preencha o campo obrigatório: Hora.");
      setIsLoading(false);
      return;
    }

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

    if (!isWithinRadius) {
      toast.error(
        "Você não está dentro do raio permitido para realizar essa tarefa."
      );
      setIsLoading(false);
      return;
    }

    const taskData = {
      date,
      time,
      postName,
      isOk,
      observations,
      coordinates,
      shift,
      images: [],
      id: "notas-fiscais",
      notaEtanol,
      notaGc,
      notaS10,
    };

    const uploadPromises = [];
    if (etanolImageUrl) {
      uploadPromises.push({
        type: "Imagem do Etanol",
        imageUrl: etanolImageUrl,
        fileName: etanolFileName,
      });
    }
    if (gcImageUrl) {
      uploadPromises.push({
        type: "Imagem da Gasolina Comum",
        imageUrl: gcImageUrl,
        fileName: gcFileName,
      });
    }
    if (s10ImageUrl) {
      uploadPromises.push({
        type: "Imagem do Diesel S10",
        imageUrl: s10ImageUrl,
        fileName: s10FileName,
      });
    }

    // @ts-ignore
    taskData.images = await Promise.all(uploadPromises);

    try {
      await addDoc(collection(db, "SUPERVISORS"), taskData);
      toast.success("Tarefa salva com sucesso!");

      router.push(
        // @ts-ignore
        `/supervisors/documents?post=${encodeURIComponent(postName)}&shift=${
          shift as string
        }`
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
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');`}</style>
      </Head>

      <HeaderNewProduct />
      <ToastContainer />
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Notas fiscais</p>
            <button className={styles.FinishButton} onClick={saveMeasurement}>
              <span className={styles.buttonTask}>Próxima tarefa</span>
              <img
                src="/finishBudget.png"
                alt="Finalizar"
                className={styles.buttonImage}
              />
            </button>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações das notas fiscais
          </p>

          <div>
            <div className={styles.InputContainer}>
              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Data</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={styles.Field}
                />
              </div>
              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Hora</p>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={styles.Field}
                />
              </div>
            </div>

            <div className={styles.InputContainer}>
              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Observações</p>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className={styles.Field}
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.InputContainer}>
              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Nota Etanol (OK/Não OK)</p>
                <select
                  value={notaEtanol}
                  onChange={(e) => setNotaEtanol(e.target.value)}
                  className={styles.SelectField}
                >
                  <option value="">Selecione</option>
                  <option value="ok">OK</option>
                  <option value="naoOk">Não OK</option>
                </select>
              </div>
              {notaEtanol === "ok" && (
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem do Etanol</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    style={{ display: "none" }}
                    ref={etanolRef}
                    onChange={handleEtanolImageChange}
                  />
                  <button
                    onClick={() =>
                      // @ts-ignore
                      etanolRef.current && etanolRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Tire sua foto/vídeo
                  </button>
                  {etanolImageUrl && (
                    <div>
                      <img
                        src={etanolImageUrl}
                        alt="Preview do teste de Etanol"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                      />
                      <p className={styles.fileName}>{etanolFileName}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.InputContainer}>
              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Nota GC (OK/Não OK)</p>
                <select
                  value={notaGc}
                  onChange={(e) => setNotaGc(e.target.value)}
                  className={styles.SelectField}
                >
                  <option value="">Selecione</option>
                  <option value="ok">OK</option>
                  <option value="naoOk">Não OK</option>
                </select>
              </div>
              {notaGc === "ok" && (
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem da Gasolina Comum</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    style={{ display: "none" }}
                    ref={gcRef}
                    onChange={handleGcImageChange}
                  />
                  <button
                    // @ts-ignore
                    onClick={() => gcRef.current && gcRef.current.click()}
                    className={styles.MidiaField}
                  >
                    Tire sua foto/vídeo
                  </button>
                  {gcImageUrl && (
                    <div>
                      <img
                        src={gcImageUrl}
                        alt="Preview do teste de Gasolina Comum"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                      />
                      <p className={styles.fileName}>{gcFileName}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.InputContainer}>
              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Nota S10 (OK/Não OK)</p>
                <select
                  value={notaS10}
                  onChange={(e) => setNotaS10(e.target.value)}
                  className={styles.SelectField}
                >
                  <option value="">Selecione</option>
                  <option value="ok">OK</option>
                  <option value="naoOk">Não OK</option>
                </select>
              </div>
              {notaS10 === "ok" && (
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem do Diesel S10</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    style={{ display: "none" }}
                    ref={s10Ref}
                    onChange={handleS10ImageChange}
                  />
                  <button
                    // @ts-ignore
                    onClick={() => s10Ref.current && s10Ref.current.click()}
                    className={styles.MidiaField}
                  >
                    Tire sua foto/vídeo
                  </button>
                  {s10ImageUrl && (
                    <div>
                      <img
                        src={s10ImageUrl}
                        alt="Preview do teste de Diesel S10"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                      />
                      <p className={styles.fileName}>{s10FileName}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
