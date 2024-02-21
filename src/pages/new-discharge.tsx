import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewDischarge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
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
  const [driverName, setDriverName] = useState("");
  const [truckPlate, setTruckPlate] = useState("");
  const [observations, setObservations] = useState("");
  const [initialMeasurementCm, setInitialMeasurementCm] = useState("");
  const [finalMeasurementCm, setFinalMeasurementCm] = useState("");

  const [tanks, setTanks] = useState<Tank[]>([]);
  const [selectedTank, setSelectedTank] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [productOptions, setProductOptions] = useState<string[]>([]);

  const [initialMeasurementImage, setInitialMeasurementImage] = useState("");
  const [initialMeasurementFileName, setInitialMeasurementFileName] =
    useState("");
  const initialMeasurementRef = useRef<HTMLInputElement>(null);

  const [finalMeasurementImage, setFinalMeasurementImage] = useState("");
  const [finalMeasurementFileName, setFinalMeasurementFileName] = useState("");
  const finalMeasurementRef = useRef<HTMLInputElement>(null);

  const [sealSelection, setSealSelection] = useState("");
  const [sealImage, setSealImage] = useState("");
  const [sealFileName, setSealFileName] = useState("");
  const sealRef = useRef<HTMLInputElement>(null);

  const [arrowSelection, setArrowSelection] = useState("");
  const [arrowImage, setArrowImage] = useState("");
  const [arrowFileName, setArrowFileName] = useState("");
  const arrowRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tank = tanks.find((t) => t.tankNumber === selectedTank);
    if (tank) {
      switch (tank.product) {
        case "GC":
          setProductOptions(["GC", "SECO"]);
          break;
        case "GA":
          setProductOptions(["GC", "GA"]);
          break;
        case "ET":
          setProductOptions(["ET", "SECO"]);
          break;
        case "S10":
          setProductOptions(["S10"]);
          break;
        default:
          setProductOptions([]);
      }
    } else {
      setProductOptions([]);
    }
  }, [selectedTank, tanks]);

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
    if (
      !date ||
      !time ||
      !driverName ||
      !truckPlate ||
      !selectedTank ||
      !selectedProduct ||
      !initialMeasurementCm ||
      !finalMeasurementCm ||
      // @ts-ignore
      (sealSelection === "SIM" && !sealRef.current?.files[0]) ||
      // @ts-ignore
      (arrowSelection === "SIM" && !arrowRef.current?.files[0])
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const makerName = localStorage.getItem("userName");
    const postName = localStorage.getItem("userPost");

    const dischargeData = {
      date,
      time,
      driverName,
      truckPlate,
      tankNumber: selectedTank,
      product: selectedProduct,
      initialMeasurement: {
        cm: initialMeasurementCm,
        // @ts-ignore
        image: initialMeasurementRef.current?.files[0],
      },
      finalMeasurement: {
        cm: finalMeasurementCm,
        // @ts-ignore
        image: finalMeasurementRef.current?.files[0],
      },
      seal: {
        selection: sealSelection,
        // @ts-ignore
        image: sealSelection === "SIM" ? sealRef.current?.files[0] : null,
      },
      arrow: {
        selection: arrowSelection,
        // @ts-ignore
        image: arrowSelection === "SIM" ? arrowRef.current?.files[0] : null,
      },
      observations,
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
    truckPlate?: string;
    tankNumber?: string;
    product?: string;
    initialMeasurement: any;
    finalMeasurement: any;
    seal: any;
    arrow: any;
    observations?: string;
  }) => {
    const uploadImageAndGetUrl = async (
      imageFile: Blob | Uint8Array | ArrayBuffer,
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

    if (data.arrow.image instanceof File && data.arrow.selection === "SIM") {
      const fileUrl = await uploadImageAndGetUrl(
        data.arrow.image,
        `dischargeImages/arrow/${data.arrow.image.name}_${Date.now()}`
      );
      data.arrow.fileUrl = fileUrl;
      delete data.arrow.image;
    } else {
      data.arrow.fileUrl = "";
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
            <p className={styles.BudgetTitle}>Nova descarga</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton}>
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText} onClick={saveDischarge}>
                  Cadastrar descarga
                </span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações da nova descarga
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
                  <p className={styles.FieldLabel}>Nome do motorista</p>
                  <input
                    id="driverName"
                    type="text"
                    className={styles.Field}
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Placa do caminhão</p>
                  <input
                    id="truckPlate"
                    type="text"
                    className={styles.Field}
                    value={truckPlate}
                    onChange={(e) => setTruckPlate(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Tanque</p>
                  <select
                    id="tankNumber"
                    className={styles.SelectField}
                    onChange={(e) => setSelectedTank(e.target.value)}
                  >
                    <option value="">Selecione um Tanque</option>
                    {tanks.map((tank, index) => (
                      <option key={index} value={tank.tankNumber}>
                        Tanque {tank.tankNumber} - {tank.capacity}L (
                        {tank.product})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Produto</p>
                  <select
                    id="product"
                    className={styles.SelectField}
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    {productOptions.map((product, index) => (
                      <option key={index} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Medição inicial (cm)</p>
                  <input
                    id="initialMeasurementCm"
                    type="number"
                    className={styles.Field}
                    value={initialMeasurementCm}
                    onChange={(e) => setInitialMeasurementCm(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Medição inicial (mídia)</p>
                  <input
                    ref={initialMeasurementRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handleFileChange(
                        event,
                        setInitialMeasurementImage,
                        setInitialMeasurementFileName
                      )
                    }
                  />
                  <button
                    onClick={() => triggerFileInput(initialMeasurementRef)}
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                </div>
              </div>

              {initialMeasurementImage && (
                <div>
                  <img
                    src={initialMeasurementImage}
                    alt="Visualização da imagem"
                    style={{
                      maxWidth: "17.5rem",
                      height: "auto",
                      border: "1px solid #939393",
                      borderRadius: "20px",
                    }}
                  />
                  <p className={styles.fileName}>
                    {initialMeasurementFileName}
                  </p>
                </div>
              )}

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Medição final (cm)</p>
                  <input
                    id="finalMeasurementCm"
                    type="number"
                    className={styles.Field}
                    value={finalMeasurementCm}
                    onChange={(e) => setFinalMeasurementCm(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Medição final (mídia)</p>
                  <input
                    ref={finalMeasurementRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handleFileChange(
                        event,
                        setFinalMeasurementImage,
                        setFinalMeasurementFileName
                      )
                    }
                  />
                  <button
                    onClick={() => triggerFileInput(finalMeasurementRef)}
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                </div>
              </div>

              {finalMeasurementImage && (
                <div>
                  <img
                    src={finalMeasurementImage}
                    alt="Visualização da imagem"
                    style={{
                      maxWidth: "17.5rem",
                      height: "auto",
                      border: "1px solid #939393",
                      borderRadius: "20px",
                    }}
                  />
                  <p className={styles.fileName}>{finalMeasurementFileName}</p>
                </div>
              )}

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Lacre</p>
                  <select
                    value={sealSelection}
                    onChange={(e) => setSealSelection(e.target.value)}
                    className={styles.SelectField}
                  >
                    <option value="">Selecione...</option>
                    <option value="SIM">SIM</option>
                    <option value="NAO">NÃO</option>
                  </select>
                </div>

                {sealSelection === "SIM" && (
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>
                      Carregar imagem do lacre
                    </p>
                    <input
                      ref={sealRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(event) =>
                        handleFileChange(event, setSealImage, setSealFileName)
                      }
                    />
                    <button
                      onClick={() => triggerFileInput(sealRef)}
                      className={styles.MidiaField}
                    >
                      Carregue sua foto
                    </button>
                  </div>
                )}
              </div>

              {sealImage && (
                <div>
                  <img
                    src={sealImage}
                    alt="Visualização da imagem do lacre"
                    style={{
                      maxWidth: "17.5rem",
                      height: "auto",
                      border: "1px solid #939393",
                      borderRadius: "20px",
                    }}
                  />
                  <p className={styles.fileName}>{sealFileName}</p>
                </div>
              )}

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Seta</p>
                  <select
                    value={arrowSelection}
                    onChange={(e) => setArrowSelection(e.target.value)}
                    className={styles.SelectField}
                  >
                    <option value="">Selecione...</option>
                    <option value="SIM">SIM</option>
                    <option value="NAO">NÃO</option>
                  </select>
                </div>

                {arrowSelection === "SIM" && (
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Carregar imagem da seta</p>
                    <input
                      ref={arrowRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(event) =>
                        handleFileChange(event, setArrowImage, setArrowFileName)
                      }
                    />
                    <button
                      onClick={() => triggerFileInput(arrowRef)}
                      className={styles.MidiaField}
                    >
                      Carregue sua foto
                    </button>
                  </div>
                )}
              </div>

              {arrowImage && (
                <div>
                  <img
                    src={arrowImage}
                    alt="Visualização da imagem da seta"
                    style={{
                      maxWidth: "17.5rem",
                      height: "auto",
                      border: "1px solid #939393",
                      borderRadius: "20px",
                    }}
                  />
                  <p className={styles.fileName}>{arrowFileName}</p>
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
                    placeholder=""
                  />
                </div>
              </div>
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
