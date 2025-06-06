import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { db, getDownloadURL, ref, storage } from "../../../firebase";

import imageCompression from "browser-image-compression";
import { uploadBytes } from "firebase/storage";
import dynamic from "next/dynamic";
const LoadingOverlay = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});
async function compressImage(file: File) {
  // Se for vídeo, retorna o arquivo original sem compressão
  if (file.type.startsWith('video/')) {
    return file;
  }

  // Se for imagem, aplica a compressão
  if (file.type.startsWith('image/')) {
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

  // Se não for nem imagem nem vídeo, lança erro
  throw new Error("O arquivo deve ser uma imagem ou vídeo");
}

export default function NewPost() {
  const router = useRouter();
  const postName = router.query.post;
  const shift = router.query.shift;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [observations, setObservations] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [postCoordinates, setPostCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const [etanolWeight, setEtanolWeight] = useState<number | string>("");
  const [etanolTemperature, setEtanolTemperature] = useState<number | string>(
    ""
  );
  const [gasolineQuality, setGasolineQuality] = useState<number | string>("");

  const [etanolImageUrl, setEtanolImageUrl] = useState("");
  const [gasolineImageUrl, setGasolineImageUrl] = useState("");
  const [etanolFileType, setEtanolFileType] = useState<"image" | "video" | null>(null);
  const [gasolineFileType, setGasolineFileType] = useState<"image" | "video" | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const etanolRef = useRef(null);
  const gasolinaRef = useRef(null);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
    setImageUrl: (url: string) => void,
    setFileType: (type: "image" | "video" | null) => void,
    path: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const processedFile = await compressImage(file);
        const url = await uploadImageAndGetUrl(processedFile, path);
        setImageUrl(url);
        setFileType(file.type.startsWith('video/') ? 'video' : 'image');
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        toast.error("Erro ao processar o arquivo. Certifique-se de que é uma imagem ou vídeo válido.");
      } finally {
        setIsLoading(false);
      }
    }
  };

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
          setCoordinates({ lat: null, lng: null });
        }
      );
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, [date, time, observations]);

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
    if (!date) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);
      return;
    }

    if (!etanolWeight || !etanolTemperature || !gasolineQuality) {
      toast.error("Preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    const userName = localStorage.getItem("userName");

    const managersRef = collection(db, "SUPERVISORS");
    const q = query(
      managersRef,
      where("date", "==", today.date),
      where("id", "==", "combustiveis-defesa"),
      where("supervisorName", "==", userName),
      where("postName", "==", postName), // Usando `post` em vez de `postName`
      where("shift", "==", shift) // Também verificamos se o turno já foi salvo
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error(
        "A tarefa combustiveis de defesa já foi feita para esse turno hoje!"
      );
      setIsLoading(false);
      return;
    }

    const taskData = {
      date,
      time,
      supervisorName: userName,
      postName,
      shift,
      etanolWeight,
      etanolTemperature,
      etanolImageUrl,
      gasolineQuality,
      gasolineImageUrl,
      observations,
      id: "combustiveis-defesa",
    };

    try {
      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      toast.success("Tarefa salva com sucesso!");

      router.push(
        `/supervisors/use-machines?post=${encodeURIComponent(
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
            <p className={styles.BudgetTitle}>
              Combústiveis de defesa do tanque
            </p>
            <div className={styles.FinishTask}>
              <button className={styles.FinishButton} onClick={saveMeasurement}>
                <span className={styles.buttonTask}>Próxima tarefa</span>
                <img
                  src="/finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações dos combustiveis de defesa
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

              {/* Campo para o peso e temperatura do etanol */}
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Peso do Etanol</p>
                  <input
                    id="etanolWeight"
                    type="number"
                    className={styles.Field}
                    value={etanolWeight}
                    onChange={(e) => setEtanolWeight(e.target.value)}
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Temperatura do Etanol</p>
                  <input
                    id="etanolTemperature"
                    type="number"
                    className={styles.Field}
                    value={etanolTemperature}
                    onChange={(e) => setEtanolTemperature(e.target.value)}
                  />
                </div>
              </div>

              {/* Campo para a qualidade da gasolina */}
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Qualidade da Gasolina</p>
                  <input
                    id="gasolineQuality"
                    type="number"
                    className={styles.Field}
                    value={gasolineQuality}
                    onChange={(e) => setGasolineQuality(e.target.value)}
                  />
                </div>
              </div>

              {/* Campo de imagem para o etanol */}
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Foto do Etanol</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    style={{ display: "none" }}
                    ref={etanolRef}
                    onChange={(e) =>
                      handleFileChange(e, setEtanolImageUrl, setEtanolFileType, "etanolImage")
                    }
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
                  {isLoading && <p>Carregando mídia...</p>}
                  {etanolImageUrl && (
                    <div>
                      {etanolFileType === 'video' ? (
                        <video
                          src={etanolImageUrl}
                          controls
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      ) : (
                        <img
                          src={etanolImageUrl}
                          alt="Preview do Etanol"
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Campo de imagem para a gasolina */}
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Foto da Gasolina</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    style={{ display: "none" }}
                    ref={gasolinaRef}
                    onChange={(e) =>
                      handleFileChange(e, setGasolineImageUrl, setGasolineFileType, "gasolineImage")
                    }
                  />
                  <button
                    onClick={() =>
                      // @ts-ignore
                      gasolinaRef.current && gasolinaRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Tire sua foto/vídeo
                  </button>
                  {isLoading && <p>Carregando mídia...</p>}
                  {gasolineImageUrl && (
                    <div>
                      {gasolineFileType === 'video' ? (
                        <video
                          src={gasolineImageUrl}
                          controls
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      ) : (
                        <img
                          src={gasolineImageUrl}
                          alt="Preview da Gasolina"
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                    </div>
                  )}
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

              <div className={styles.space}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
