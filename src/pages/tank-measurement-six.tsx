import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";

interface Tank {
  tankNumber: string;
  capacity: string;
  product: string;
  saleDefense: string;
  tableParam01: string;
  tableParam02: string;
}

interface TankMeasurement {
  tankNumber: string;
  measurement: string;
  imageUrl: string;
}

interface MeasurementData {
  date: string;
  time: string;
  managerName: string;
  userName: string | null;
  postName: string | null;
  measurements: TankMeasurement[];
  id: string;
}

interface TankMeasurements {
  [key: string]: string;
}

interface TankImages {
  [key: string]: File;
}

export default function NewPost() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [managerName, setManagerName] = useState("");
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [tankMeasurements, setTankMeasurements] = useState<TankMeasurements>(
    {}
  );
  const [tankImages, setTankImages] = useState<TankImages>({});
  const [tankFileNames, setTankFileNames] = useState({});
  const [fileInputRefs, setFileInputRefs] = useState({});

  const handleMeasurementChange = (tankNumber: string, value: string) => {
    setTankMeasurements((prev) => ({ ...prev, [tankNumber]: value }));
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    tankNumber: string
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setTankImages((prev) => ({
        ...prev,
        [tankNumber]: file, // Armazenando o objeto File
      }));
      setTankFileNames((prev) => ({ ...prev, [tankNumber]: file.name }));
    }
  };

  useEffect(() => {
    const refs = tanks.reduce((acc, tank) => {
      // @ts-ignore
      acc[tank.tankNumber] = React.createRef();
      return acc;
    }, {});
    setFileInputRefs(refs);
  }, [tanks]);

  useEffect(() => {
    const postName = localStorage.getItem("userPost");

    if (postName) {
      const fetchPostDetails = async () => {
        try {
          const postsRef = collection(db, "POSTS");
          const q = query(postsRef, where("name", "==", postName));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            setTanks(postData.tanks || []);
          });
        } catch (error) {
          console.error("Error fetching post details:", error);
        }
      };

      fetchPostDetails();
    }
  }, []);

  const saveMeasurement = async () => {
    let missingField = "";
    const today = new Date().toISOString().slice(0, 10);

    if (!date) missingField = "Data";
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      return;
    } else if (!time) missingField = "Hora";
    else if (!managerName) missingField = "Nome do Gerente";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      return;
    }

    const userName = localStorage.getItem("userName");
    const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "MANAGERS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("id", "==", "medicao-tanques-6h"),
      where("userName", "==", userName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A medição dos tanques das 6h já foi feita hoje!");
      return;
    }

    const measurementData: MeasurementData = {
      date,
      time,
      managerName,
      userName,
      postName,
      measurements: [],
      id: "medicao-tanques-6h",
    };

    for (const tank of tanks) {
      const tankData = {
        tankNumber: tank.tankNumber,
        measurement: tankMeasurements[tank.tankNumber] || "",
        imageUrl: "",
      };

      const imageFile = tankImages[tank.tankNumber];
      if (imageFile instanceof File) {
        try {
          const imageUrl = await uploadImageAndGetUrl(
            imageFile,
            `tankMeasurements/${tank.tankNumber}/${
              imageFile.name
            }_${Date.now()}`
          );
          tankData.imageUrl = imageUrl;
        } catch (error) {
          console.error("Erro ao fazer upload da imagem do tanque: ", error);
          toast.error(`Erro ao salvar a imagem do tanque ${tank.tankNumber}.`);
          return;
        }
      }

      measurementData.measurements.push(tankData);
    }

    try {
      const docRef = await addDoc(collection(db, "MANAGERS"), measurementData);
      console.log("Medição salva com ID: ", docRef.id);
      toast.success("Medição salva com sucesso!");
      router.push("/manager-six-routine");
    } catch (error) {
      console.error("Erro ao salvar os dados da medição: ", error);
      toast.error("Erro ao salvar a medição.");
    }
  };

  async function uploadImageAndGetUrl(
    imageFile: Blob | ArrayBuffer,
    path: string | undefined
  ) {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, imageFile);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
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

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Medição de tanques 6h</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton}>
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText} onClick={saveMeasurement}>
                  Cadastrar medição
                </span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações da medição
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
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome do gerente</p>
                  <input
                    id="driverName"
                    type="text"
                    className={styles.Field}
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              {tanks.map((tank) => (
                <>
                  <p className={styles.titleTank}>
                    Tanque {tank.tankNumber} - {tank.capacity}L ({tank.product})
                  </p>

                  <div key={tank.tankNumber} className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Medição em cm</p>
                      <input
                        type="number"
                        // @ts-ignore
                        value={tankMeasurements[tank.tankNumber] || ""}
                        onChange={(e) =>
                          handleMeasurementChange(
                            tank.tankNumber,
                            e.target.value
                          )
                        }
                        className={styles.Field}
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Foto da medição</p>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        // @ts-ignore
                        ref={fileInputRefs[tank.tankNumber]}
                        onChange={(event) =>
                          handleImageChange(event, tank.tankNumber)
                        }
                      />
                      <button
                        onClick={() =>
                          // @ts-ignore

                          fileInputRefs[tank.tankNumber].current &&
                          // @ts-ignore

                          fileInputRefs[tank.tankNumber].current.click()
                        }
                        className={styles.MidiaField}
                      >
                        Carregue sua foto
                      </button>
                    </div>
                  </div>
                  {tankImages[tank.tankNumber] && (
                    <div>
                      <img
                        src={URL.createObjectURL(tankImages[tank.tankNumber])}
                        alt="Visualização da imagem"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        onLoad={() =>
                          // @ts-ignore
                          URL.revokeObjectURL(tankImages[tank.tankNumber])
                        }
                      />
                      <p className={styles.fileName}>
                        {
                          //@ts-ignore
                          tankFileNames[tank.tankNumber]
                        }
                      </p>
                    </div>
                  )}
                </>
              ))}
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
