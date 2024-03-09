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

export default function NewPost() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [managerName, setManagerName] = useState("");
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [tankMeasurements, setTankMeasurements] = useState({});
  const [tankImages, setTankImages] = useState({});
  const [tankFileNames, setTankFileNames] = useState({});
  const [fileInputRefs, setFileInputRefs] = useState({});

  const handleMeasurementChange = (tankNumber: string, value: string) => {
    setTankMeasurements((prev) => ({ ...prev, [tankNumber]: value }));
  };

  const handleImageChange = (
    event: { target: { files: any } },
    tankNumber: any
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setTankImages((prev) => ({
        ...prev,
        [tankNumber]: URL.createObjectURL(file),
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

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string>>,
    setFileName: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const saveDischarge = async () => {
    let missingField = "";
    if (!date) missingField = "Data";
    else if (!time) missingField = "Hora";
    else if (!managerName) missingField = "Nome do Gerente";
    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      return;
    }

    const makerName = localStorage.getItem("userName");
    const postName = localStorage.getItem("userPost");

    const dischargeData = {
      date,
      time,
      managerName,
      makerName,
      postName,
    };

    await uploadImagesAndUpdateData(dischargeData);

    try {
      const docRef = await addDoc(collection(db, "DISCHARGES"), dischargeData);
      console.log("Documento salvo com ID: ", docRef.id);
      toast.success("Descarga salva com sucesso!");
      router.push("/discharges");
    } catch (error) {
      console.error("Erro ao salvar os dados da descarga: ", error);
      toast.error("Erro ao salvar a descarga.");
    }
  };

  const uploadImagesAndUpdateData = async (data: {
    date?: string;
    time?: string;
    driverName?: string;
    truckPlate: any;
    tankNumber?: string;
    product?: string;
    initialMeasurement: any;
    finalMeasurement: any;
    seal: any;
    arrow?: { selection: string; position: string };
    observations?: string;
    makerName?: string | null;
    postName?: string | null;
  }) => {
    const uploadImageAndGetUrl = async (
      imageFile: Blob | ArrayBuffer,
      path: string | undefined
    ) => {
      if (!imageFile) return "";
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, imageFile);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    };

    if (data.initialMeasurement.image instanceof File) {
      const fileUrl = await uploadImageAndGetUrl(
        data.initialMeasurement.image,
        `dischargeImages/initialMeasurement/${
          data.initialMeasurement.image.name
        }_${Date.now()}`
      );
      data.initialMeasurement.fileUrl = fileUrl;
      delete data.initialMeasurement.image;
    }

    if (data.finalMeasurement.image instanceof File) {
      const fileUrl = await uploadImageAndGetUrl(
        data.finalMeasurement.image,
        `dischargeImages/finalMeasurement/${
          data.finalMeasurement.image.name
        }_${Date.now()}`
      );
      data.finalMeasurement.fileUrl = fileUrl;
      delete data.finalMeasurement.image;
    }

    if (data.seal.image instanceof File && data.seal.selection === "SIM") {
      const fileUrl = await uploadImageAndGetUrl(
        data.seal.image,
        `dischargeImages/seal/${data.seal.image.name}_${Date.now()}`
      );
      data.seal.fileUrl = fileUrl;
      delete data.seal.image;
    } else {
      data.seal.fileUrl = "";
    }

    if (data.truckPlate instanceof File) {
      const fileUrl = await uploadImageAndGetUrl(
        data.truckPlate,
        `dischargeImages/truckPlate/${data.truckPlate.name}_${Date.now()}`
      );
      data.truckPlate = fileUrl;
    }

    return data;
  };

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
            <p className={styles.BudgetTitle}>Medição de tanques 14h</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton}>
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText} onClick={saveDischarge}>
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
                  {
                    //@ts-ignore
                    tankImages[tank.tankNumber] && (
                      <div>
                        <img
                          // @ts-ignore
                          src={tankImages[tank.tankNumber]}
                          alt="Visualização da imagem"
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                        <p className={styles.fileName}>
                          {
                            // @ts-ignore
                            tankFileNames[tank.tankNumber]
                          }
                        </p>
                      </div>
                    )
                  }
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
