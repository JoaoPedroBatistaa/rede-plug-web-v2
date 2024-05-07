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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";

import LoadingOverlay from "@/components/Loading";

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

  const [isLoading, setIsLoading] = useState(false);

  const docId = router.query.docId;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!docId) return;

      try {
        const docRef = doc(db, "MANAGERS", docId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedData = docSnap.data();

          // @ts-ignore
          setData(fetchedData);
          setDate(fetchedData.date);
          setTime(fetchedData.time);

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

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [managerName, setManagerName] = useState("");
  const [postName, setPostName] = useState("");
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [tankMeasurements, setTankMeasurements] = useState<TankMeasurements>(
    {}
  );
  const [tankImages, setTankImages] = useState<TankImages>({});
  const [tankFileNames, setTankFileNames] = useState({});
  const [fileInputRefs, setFileInputRefs] = useState({});

  const [conversionData, setConversionData] = useState([]);
  const [tankLiters, setTankLiters] = useState({});

  useEffect(() => {
    const loadConversionData = async () => {
      const filePath = `/data/conversion.json`;
      const response = await fetch(filePath);
      if (!response.ok) {
        console.error(
          "Falha ao carregar o arquivo de conversão",
          response.statusText
        );
        return;
      }
      const data = await response.json();

      setConversionData(data);
      console.log(conversionData);
    };

    loadConversionData();
  }, []);

  // @ts-ignore
  const findLitersForMeasurement = (tankOption, measurementCm) => {
    const measurementCmNumber = Number(measurementCm);

    const tankConversionData = conversionData.filter(
      // @ts-ignore
      (data) => data.Tanque.toString() === tankOption.toString()
    );

    console.log(
      `Dados de conversão filtrados para Tanque ${tankOption}:`,
      tankConversionData
    );

    const conversionRecord = tankConversionData.find(
      (data) => Number(data["Regua (cm)"]) === measurementCmNumber
    );

    if (conversionRecord) {
      console.log(`Registro de conversão encontrado:`, conversionRecord);
    } else {
      console.log(
        `Nenhum registro de conversão encontrado para Tanque ${tankOption} e Medição ${measurementCmNumber}`
      );
    }

    // @ts-ignore
    return conversionRecord ? conversionRecord.Litros : null;
  };

  // @ts-ignore
  const handleMeasurementChange = (tankNumber, measurementCm) => {
    const selectedTankObject = tanks.find(
      (tank) => tank.tankNumber === tankNumber
    );
    if (!selectedTankObject) {
      console.error("Tanque não selecionado ou não encontrado.");
      return;
    }

    const liters = findLitersForMeasurement(
      // @ts-ignore
      selectedTankObject.tankOption,
      measurementCm
    );

    setTankMeasurements((prev) => ({
      ...prev,
      [tankNumber]: {
        cm: measurementCm,
        liters: liters ?? null,
      },
    }));
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
        [tankNumber]: file,
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
    setIsLoading(true);

    let missingField = "";
    const today = new Date().toISOString().slice(0, 10);

    if (!date) missingField = "Data";
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);

      return;
    } else if (!time) missingField = "Hora";
    // else if (!managerName) missingField = "Nome do Gerente";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);

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
      setIsLoading(false);

      return;
    }

    const measurementData: MeasurementData = {
      date,
      time,
      // @ts-ignore
      managerName: userName,
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
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Medição de tanques 6h</p>
            <div className={styles.BudgetHeadS}>
              {!docId && (
                <button
                  className={styles.FinishButton}
                  onClick={saveMeasurement}
                >
                  <img
                    src="./finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>Cadastrar medição</span>
                </button>
              )}
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

              {docId &&
                // @ts-ignore
                data?.measurements.map((measurement, index) => (
                  <div key={index}>
                    <p className={styles.titleTank}>
                      Tanque {measurement.tankNumber}
                    </p>

                    <div className={styles.InputContainer}>
                      <div className={styles.InputField}>
                        <p className={styles.FieldLabel}>Medição em cm</p>
                        <input
                          type="number"
                          value={measurement.measurement.cm}
                          className={styles.Field}
                          disabled
                        />
                      </div>

                      <div className={styles.InputField}>
                        <p className={styles.FieldLabel}>Litros</p>
                        <input
                          type="text"
                          value={measurement.measurement.liters}
                          className={styles.Field}
                          disabled
                        />
                      </div>

                      <div className={styles.InputField}>
                        <p className={styles.FieldLabel}>Foto da medição</p>
                        <img
                          src={measurement.imageUrl}
                          alt="Visualização da imagem"
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

              {tanks.map((tank) => (
                <>
                  <p className={styles.titleTank}>
                    Tanque {tank.tankNumber} - {tank.capacity}L ({tank.product})
                    - {tank.saleDefense}
                  </p>

                  <div key={tank.tankNumber} className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Medição em cm</p>
                      <input
                        type="number"
                        // @ts-ignore
                        value={tankMeasurements[tank.tankNumber]?.cm || ""}
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

                  {
                    // @ts-ignore
                    tankMeasurements[tank.tankNumber]?.liters !== undefined && (
                      <div className={styles.InputField}>
                        <p className={styles.totalDischarge}>
                          {
                            // @ts-ignore
                            tankMeasurements[tank.tankNumber]?.liters !==
                              undefined &&
                            // @ts-ignore
                            tankMeasurements[tank.tankNumber].liters !== null
                              ? `Medição atual em litros: ${
                                  // @ts-ignore
                                  tankMeasurements[tank.tankNumber].liters
                                }`
                              : "A régua deste tanque não contém este valor"
                          }
                        </p>
                      </div>
                    )
                  }

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
