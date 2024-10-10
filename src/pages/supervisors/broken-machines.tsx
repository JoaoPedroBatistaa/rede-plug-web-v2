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
  const docId = router.query.docId;
  const shift = router.query.shift;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [useMachines, setUseMachines] = useState(0);
  const [observations, setObservations] = useState("");
  const [machinesData, setMachinesData] = useState(
    Array(useMachines).fill({ serialNumber: "", protocolNumber: "" })
  );
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [postCoordinates, setPostCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [etanolImageUrl, setEtanolImageUrl] = useState("");
  const [etanolFileName, setEtanolFileName] = useState("");
  const etanolRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleEtanolImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const compressedFile = await compressImage(file);
        const imageUrl = await uploadImageAndGetUrl(
          compressedFile,
          `supervisors/${getLocalISODate()}/${
            compressedFile.name
          }_${Date.now()}`
        );
        setEtanolImageUrl(imageUrl);
        setEtanolFileName(compressedFile.name);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        toast.error("Erro ao fazer upload da imagem.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMachinesDataChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedMachines = [...machinesData];
    updatedMachines[index] = { ...updatedMachines[index], [field]: value };
    setMachinesData(updatedMachines);
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

    const today = getLocalISODate();

    let missingField = "";
    if (!date) missingField = "Data";
    else if (date !== today.date) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);
      return;
    } else if (!time) missingField = "Hora";
    else if (useMachines && !etanolImageUrl) missingField = "Fotos da tarefa";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
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

    const userName = localStorage.getItem("userName");
    const taskData = {
      date,
      time,
      supervisorName: userName,
      postName,
      observations,
      coordinates,
      shift,
      machinesData,
      images: [{ imageUrl: etanolImageUrl, fileName: etanolFileName }],
      id: "maquininhas-quebradas",
    };

    try {
      await addDoc(collection(db, "SUPERVISORS"), taskData);
      toast.success("Tarefa salva com sucesso!");
      router.push(
        `/supervisors/work-schedule?post=${encodeURIComponent(
          // @ts-ignore
          postName
        )}&shift=${shift}`
      );
    } catch (error) {
      toast.error("Erro ao salvar a medição.");
      console.error("Erro ao salvar os dados da tarefa: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function uploadImageAndGetUrl(imageFile: File, path: string) {
    const storageRef = ref(storage, path);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    return getDownloadURL(uploadResult.ref);
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
            <p className={styles.BudgetTitle}>Maquininhas quebradas</p>
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
            Informe abaixo as informações das maquininhas quebradas
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
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Quantidade de maquininhas</p>
                  <input
                    id="useMachines"
                    type="number"
                    className={styles.Field}
                    value={useMachines}
                    onChange={(e) => setUseMachines(Number(e.target.value))}
                  />
                </div>
              </div>

              {Array(useMachines)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>
                        Número de série da maquininha {index + 1}
                      </p>
                      <input
                        type="text"
                        className={styles.Field}
                        value={machinesData[index]?.serialNumber || ""}
                        onChange={(e) =>
                          handleMachinesDataChange(
                            index,
                            "serialNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>
                        Número de protocolo bk da maquininha {index + 1}
                      </p>
                      <input
                        type="text"
                        className={styles.Field}
                        value={machinesData[index]?.protocolNumber || ""}
                        onChange={(e) =>
                          handleMachinesDataChange(
                            index,
                            "protocolNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}

              {useMachines > 0 && (
                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Imagem da tarefa</p>
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
                          alt="Preview da imagem da tarefa"
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
                </div>
              )}

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
