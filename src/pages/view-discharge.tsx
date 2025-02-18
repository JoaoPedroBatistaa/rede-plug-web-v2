import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewDischarge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";

import dynamic from "next/dynamic";
const LoadingOverlay = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});
interface Tank {
  tankNumber: string;
  capacity: string;
  product: string;
  saleDefense: string;
  tankOption: string;
}

export default function NewPost() {
  const router = useRouter();
  const { id } = router.query;

  // useEffect(() => {
  // //   const checkLoginDuration = () => {
  // //     console.log("Checking login duration...");
  // //     const storedDate = localStorage.getItem("loginDate");
  // //     const storedTime = localStorage.getItem("loginTime");

  // //     if (storedDate && storedTime) {
  // //       const storedDateTime = new Date(`${storedDate}T${storedTime}`);
  // //       console.log("Stored login date and time:", storedDateTime);

  // //       const now = new Date();
  // //       const maxLoginDuration = 6 * 60 * 60 * 1000;

  // //       if (now.getTime() - storedDateTime.getTime() > maxLoginDuration) {
  // //         console.log("Login duration exceeded 60 seconds. Logging out...");

  // //         localStorage.removeItem("userId");
  // //         localStorage.removeItem("userName");
  // //         localStorage.removeItem("userType");
  // //         localStorage.removeItem("userPost");
  // //         localStorage.removeItem("posts");
  // //         localStorage.removeItem("loginDate");
  // //         localStorage.removeItem("loginTime");

  // //         alert("Sua sessão expirou. Por favor, faça login novamente.");
  // //         window.location.href = "/";
  // //       } else {
  // //         console.log("Login duration within limits.");
  // //       }
  // //     } else {
  // //       console.log("No stored login date and time found.");
  // //     }
  // //   };

  // //   checkLoginDuration();
  // // }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [driverName, setDriverName] = useState("");
  const [makerName, setMakerName] = useState("");
  const [truckPlate, setTruckPLate] = useState("");
  const [observations, setObservations] = useState("");
  const [initialMeasurementCm, setInitialMeasurementCm] = useState("");
  const [finalMeasurementCm, setFinalMeasurementCm] = useState("");

  const [tanks, setTanks] = useState<Tank[]>([]);
  const [selectedTank, setSelectedTank] = useState<string>("");
  const [selectedTankDescription, setSelectedTankDescription] =
    useState<string>("");
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
  const [sealImage1, setSealImage1] = useState("");
  const [sealFileName1, setSealFileName1] = useState("");
  const sealRef1 = useRef(null);

  const [sealImage2, setSealImage2] = useState("");
  const [sealFileName2, setSealFileName2] = useState("");
  const sealRef2 = useRef(null);

  const [sealImage3, setSealImage3] = useState("");
  const [sealFileName3, setSealFileName3] = useState("");
  const sealRef3 = useRef(null);

  const [arrowSelection, setArrowSelection] = useState("");
  const [arrowPosition, setArrowPosition] = useState("");

  const [truckPlateImage, setTruckPlateImage] = useState("");
  const [truckPlateFileName, setTruckPlateFileName] = useState("");
  const truckPlateRef = useRef<HTMLInputElement>(null);

  const [conversionData, setConversionData] = useState([]);
  const [initialLiters, setInitialLiters] = useState(null);
  const [finalLiters, setFinalLiters] = useState(null);
  const [totalDescarregado, setTotalDescarregado] = useState("");

  const [hydrationValue, setHydrationValue] = useState("");
  const [hydrationImage, setHydrationImage] = useState("");
  const [hydrationFileName, setHydrationFileName] = useState("");
  const hydrationRef = useRef(null);

  const [showHydrationField, setShowHydrationField] = useState(false);

  const [productQuality, setProductQuality] = useState("");
  const [productQualityImage, setProductQualityImage] = useState("");
  const [productQualityFileName, setProductQualityFileName] = useState("");
  const productQualityRef = useRef<HTMLInputElement>(null);

  const [weight, setWeight] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weightTemperatureImage, setWeightTemperatureImage] = useState("");
  const [weightTemperatureFileName, setWeightTemperatureFileName] =
    useState("");
  const weightTemperatureRef = useRef<HTMLInputElement>(null);

  const [decalitro, setDecalitro] = useState("");
  const [inicioDescargaVideo, setInicioDescargaVideo] = useState("");
  const [inicioDescargaFileName, setInicioDescargaFileName] = useState("");
  const inicioDescargaRef = useRef<HTMLInputElement>(null);

  const [finalDescargaVideo, setFinalDescargaVideo] = useState("");
  const [finalDescargaFileName, setFinalDescargaFileName] = useState("");
  const finalDescargaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const fetchDischargeData = async () => {
        try {
          const docRef = doc(collection(db, "DISCHARGES"), id as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setDate(data.date || "");
            setTime(data.time || "");
            setDriverName(data.driverName || "");
            setTruckPLate(data.truckPlate || "");
            setTruckPlateImage(data.truckPlateImage || "");
            setSelectedTank(data.tankNumber || "");
            setSelectedTankDescription(data.selectedTankDescription || "");
            setSelectedProduct(data.product || "");
            setInitialMeasurementCm(data.initialMeasurement?.cm || "");
            setInitialMeasurementImage(data.initialMeasurement?.fileUrl || "");
            setFinalMeasurementCm(data.finalMeasurement?.cm || "");
            setFinalMeasurementImage(data.finalMeasurement?.fileUrl || "");
            setSealSelection(data.seal?.selection || "");
            setSealImage1(data.seal?.fileUrls ? data.seal.fileUrls[0] : "");
            setSealImage2(data.seal?.fileUrls ? data.seal.fileUrls[1] : "");
            setSealImage3(data.seal?.fileUrls ? data.seal.fileUrls[2] : "");
            setArrowSelection(data.arrow?.selection || "");
            setArrowPosition(data.arrow?.position || "");
            setObservations(data.observations || "");
            setMakerName(data.makerName || "");
            setHydrationValue(data.hydration?.value || "");
            setHydrationImage(data.hydration?.fileUrl || "");
            setInitialLiters(data.initialLiters || null);
            setFinalLiters(data.finalLiters || null);
            setTotalDescarregado(data.totalLiters || "");
            setProductQuality(data.productQuality || "");
            setProductQualityImage(data.productQualityImage || "");
            setWeight(data.weight || "");
            setTemperature(data.temperature || "");
            setWeightTemperatureImage(data.weightTemperatureImage || "");
            setDecalitro(data.decalitro || "");
            setInicioDescargaVideo(data.inicioDescarga.fileUrl || "");
            setFinalDescargaVideo(data.finalDescarga.fileUrl || "");
            console.log(weightTemperatureImage);
          } else {
            toast.error("Dados da descarga não encontrados.");
          }
        } catch (error) {
          console.error("Erro ao buscar dados da descarga:", error);
          toast.error("Erro ao carregar os dados da descarga.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchDischargeData();
    }
  }, [id]);

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
            <p className={styles.BudgetTitle}>Visualizar descarga</p>
            <div className={styles.BudgetHeadS}></div>
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

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Responsável</p>
                  <input
                    id="time"
                    type="text"
                    className={styles.Field}
                    value={makerName}
                    onChange={(e) => setMakerName(e.target.value)}
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
                    id="driverName"
                    type="text"
                    className={styles.Field}
                    value={truckPlate}
                    onChange={(e) => setTruckPLate(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Placa do caminhão (mídia)</p>
                  <input
                    ref={truckPlateRef}
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handleFileChange(
                        event,
                        setTruckPlateImage,
                        setTruckPlateFileName
                      )
                    }
                  />
                  <button
                    onClick={() => triggerFileInput(truckPlateRef)}
                    className={styles.MidiaField}
                  >
                    Tire sua foto/vídeo
                  </button>
                </div>
              </div>
              {truckPlateImage && (
                <div>
                  {truckPlateImage.includes(".mp4") ||
                  truckPlateImage.includes(".mov") ? (
                    <video
                      controls
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    >
                      <source src={truckPlateImage} type="video/mp4" />
                      <source src={truckPlateImage} type="video/quicktime" />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  ) : (
                    <img
                      src={truckPlateImage}
                      alt="Visualização da imagem da placa do caminhão"
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    />
                  )}
                  <p className={styles.fileName}>{truckPlateFileName}</p>
                </div>
              )}

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Tanque</p>
                  <input
                    id="driverName"
                    type="text"
                    className={styles.Field}
                    value={selectedTank}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Produto</p>
                  <input
                    id="driverName"
                    type="text"
                    className={styles.Field}
                    value={selectedProduct}
                    placeholder=""
                  />
                </div>
              </div>

              {selectedProduct === "GC" || selectedProduct === "GA" ? (
                <>
                  <div className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>
                        Qualidade do produto (Número)
                      </p>
                      <input
                        type="number"
                        className={styles.Field}
                        value={productQuality}
                        onChange={(e) => setProductQuality(e.target.value)}
                        placeholder=""
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>
                        Qualidade do produto (Mídia)
                      </p>
                      <input
                        ref={productQualityRef}
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                        onChange={(event) =>
                          handleFileChange(
                            event,
                            setProductQualityImage,
                            setProductQualityFileName
                          )
                        }
                      />
                      <button
                        onClick={() => triggerFileInput(productQualityRef)}
                        className={styles.MidiaField}
                      >
                        Tire sua foto/vídeo
                      </button>
                    </div>
                  </div>
                  {productQualityImage && (
                    <div>
                      {productQualityImage.includes(".mp4") ||
                      productQualityImage.includes(".mov") ? (
                        <video
                          controls
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        >
                          <source src={productQualityImage} type="video/mp4" />
                          <source
                            src={productQualityImage}
                            type="video/quicktime"
                          />
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      ) : (
                        <img
                          src={productQualityImage}
                          alt="Visualização da imagem da qualidade do produto"
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                      <p className={styles.fileName}>{truckPlateFileName}</p>
                    </div>
                  )}
                </>
              ) : null}

              {selectedProduct === "ET" ||
              selectedProduct === "EA" ||
              selectedProduct === "SECO" ||
              selectedProduct === "ANIDRO" ? (
                <>
                  <div className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Peso (Número)</p>
                      <input
                        type="number"
                        className={styles.Field}
                        value={weight}
                        placeholder=""
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Temperatura (Número)</p>
                      <input
                        type="number"
                        className={styles.Field}
                        value={temperature}
                        placeholder=""
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>
                        Peso e Temperatura (Mídia)
                      </p>
                      <input
                        ref={weightTemperatureRef}
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                        onChange={(event) =>
                          handleFileChange(
                            event,
                            setWeightTemperatureImage,
                            setWeightTemperatureFileName
                          )
                        }
                      />
                      <button
                        onClick={() => triggerFileInput(weightTemperatureRef)}
                        className={styles.MidiaField}
                      >
                        Tire sua foto/vídeo
                      </button>
                    </div>
                  </div>

                  {weightTemperatureImage && (
                    <div>
                      {weightTemperatureImage.includes(".mp4") ||
                      weightTemperatureImage.includes(".mov") ? (
                        <video
                          controls
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        >
                          <source
                            src={weightTemperatureImage}
                            type="video/mp4"
                          />
                          <source
                            src={weightTemperatureImage}
                            type="video/quicktime"
                          />
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      ) : (
                        <img
                          src={weightTemperatureImage}
                          alt="Visualização da imagem do peso e temperatura"
                          style={{
                            maxWidth: "17.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                      <p className={styles.fileName}>
                        {weightTemperatureFileName}
                      </p>
                    </div>
                  )}
                </>
              ) : null}

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
                    accept="image/*,video/*"
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
                    Tire sua foto/vídeo
                  </button>
                </div>
              </div>

              {initialMeasurementImage && (
                <div>
                  {initialMeasurementImage.includes(".mp4") ||
                  initialMeasurementImage.includes(".mov") ? (
                    <video
                      controls
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    >
                      <source src={initialMeasurementImage} type="video/mp4" />
                      <source
                        src={initialMeasurementImage}
                        type="video/quicktime"
                      />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  ) : (
                    <img
                      src={initialMeasurementImage}
                      alt="Visualização da imagem da medição inicial"
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    />
                  )}
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
                    accept="image/*,video/*"
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
                    Tire sua foto/vídeo
                  </button>
                </div>
              </div>

              {finalMeasurementImage && (
                <div>
                  {finalMeasurementImage.includes(".mp4") ||
                  finalMeasurementImage.includes(".mov") ? (
                    <video
                      controls
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    >
                      <source src={finalMeasurementImage} type="video/mp4" />
                      <source
                        src={finalMeasurementImage}
                        type="video/quicktime"
                      />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  ) : (
                    <img
                      src={finalMeasurementImage}
                      alt="Visualização da imagem da medição final"
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    />
                  )}
                  <p className={styles.fileName}>{finalMeasurementFileName}</p>
                </div>
              )}

              <div className={styles.totalDischarge}>{totalDescarregado}</div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Decalitro</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={decalitro}
                    onChange={(e) => setDecalitro(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Início Descarga (Vídeo)</p>
                  <input
                    ref={inicioDescargaRef}
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handleFileChange(
                        event,
                        setInicioDescargaVideo,
                        setInicioDescargaFileName
                      )
                    }
                  />
                  <button
                    onClick={() => triggerFileInput(inicioDescargaRef)}
                    className={styles.MidiaField}
                  >
                    Carregue seu vídeo
                  </button>
                </div>
                {inicioDescargaVideo && (
                  <div>
                    <video
                      src={inicioDescargaVideo}
                      controls
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    />
                    <p className={styles.fileName}>{inicioDescargaFileName}</p>
                  </div>
                )}

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Final Descarga (Vídeo)</p>
                  <input
                    ref={finalDescargaRef}
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handleFileChange(
                        event,
                        setFinalDescargaVideo,
                        setFinalDescargaFileName
                      )
                    }
                  />
                  <button
                    onClick={() => triggerFileInput(finalDescargaRef)}
                    className={styles.MidiaField}
                  >
                    Carregue seu vídeo
                  </button>
                </div>
                {finalDescargaVideo && (
                  <div>
                    <video
                      src={finalDescargaVideo}
                      controls
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    />
                    <p className={styles.fileName}>{finalDescargaFileName}</p>
                  </div>
                )}
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Hidratação (Número)</p>
                  <input
                    type="number"
                    className={styles.Field}
                    value={hydrationValue}
                    onChange={(e) => setHydrationValue(e.target.value)}
                    placeholder=""
                    disabled
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Hidratação (Mídia)</p>
                  <input
                    ref={hydrationRef}
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handleFileChange(
                        event,
                        setHydrationImage,
                        setHydrationFileName
                      )
                    }
                  />
                  <button
                    onClick={() => triggerFileInput(hydrationRef)}
                    className={styles.MidiaField}
                  >
                    Tire sua foto/vídeo
                  </button>
                </div>
              </div>

              {hydrationImage && (
                <div>
                  {hydrationImage.includes(".mp4") ||
                  hydrationImage.includes(".mov") ? (
                    <video
                      controls
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    >
                      <source src={hydrationImage} type="video/mp4" />
                      <source src={hydrationImage} type="video/quicktime" />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  ) : (
                    <img
                      src={hydrationImage}
                      alt="Visualização da imagem de hidratação"
                      style={{
                        maxWidth: "17.5rem",
                        height: "auto",
                        border: "1px solid #939393",
                        borderRadius: "20px",
                      }}
                    />
                  )}
                  <p className={styles.fileName}>{hydrationFileName}</p>
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
                  <div className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <input
                        ref={sealRef1}
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                        onChange={(event) =>
                          handleFileChange(
                            event,
                            setSealImage1,
                            setSealFileName1
                          )
                        }
                      />
                      <p className={styles.FieldLabel}>Foto 1</p>

                      <button
                        onClick={() => triggerFileInput(sealRef1)}
                        className={styles.MidiaField}
                      >
                        Tire sua foto/vídeo 1
                      </button>
                      {sealImage1 && (
                        <div>
                          {sealImage1.includes(".mp4") ||
                          sealImage1.includes(".mov") ||
                          sealImage1.includes(".avi") ? (
                            <video
                              controls
                              style={{
                                maxWidth: "17.5rem",
                                height: "auto",
                                border: "1px solid #939393",
                                borderRadius: "20px",
                              }}
                            >
                              <source src={sealImage1} type="video/mp4" />
                              <source src={sealImage1} type="video/quicktime" />
                              Seu navegador não suporta o elemento de vídeo.
                            </video>
                          ) : (
                            <img
                              src={sealImage1}
                              alt="Visualização da imagem do lacre 1"
                              style={{
                                maxWidth: "17.5rem",
                                height: "auto",
                                border: "1px solid #939393",
                                borderRadius: "20px",
                              }}
                            />
                          )}
                          <p className={styles.fileName}>{sealFileName1}</p>
                        </div>
                      )}
                    </div>

                    <div className={styles.InputField}>
                      <input
                        ref={sealRef2}
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                        onChange={(event) =>
                          handleFileChange(
                            event,
                            setSealImage2,
                            setSealFileName2
                          )
                        }
                      />
                      <p className={styles.FieldLabel}>Foto 2</p>

                      <button
                        onClick={() => triggerFileInput(sealRef2)}
                        className={styles.MidiaField}
                      >
                        Tire sua foto/vídeo 2
                      </button>
                      {sealImage2 && (
                        <div>
                          {sealImage2.includes(".mp4") ||
                          sealImage2.includes(".mov") ||
                          sealImage2.includes(".avi") ? (
                            <video
                              controls
                              style={{
                                maxWidth: "17.5rem",
                                height: "auto",
                                border: "1px solid #939393",
                                borderRadius: "20px",
                              }}
                            >
                              <source src={sealImage2} type="video/mp4" />
                              <source src={sealImage2} type="video/quicktime" />
                              Seu navegador não suporta o elemento de vídeo.
                            </video>
                          ) : (
                            <img
                              src={sealImage2}
                              alt="Visualização da imagem do lacre 2"
                              style={{
                                maxWidth: "17.5rem",
                                height: "auto",
                                border: "1px solid #939393",
                                borderRadius: "20px",
                              }}
                            />
                          )}
                          <p className={styles.fileName}>{sealFileName2}</p>
                        </div>
                      )}
                    </div>

                    <div className={styles.InputField}>
                      <input
                        ref={sealRef3}
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                        onChange={(event) =>
                          handleFileChange(
                            event,
                            setSealImage3,
                            setSealFileName3
                          )
                        }
                      />
                      <p className={styles.FieldLabel}>Foto 3</p>

                      <button
                        onClick={() => triggerFileInput(sealRef3)}
                        className={styles.MidiaField}
                      >
                        Tire sua foto/vídeo 3
                      </button>
                      {sealImage3 && (
                        <div>
                          {sealImage3.includes(".mp4") ||
                          sealImage3.includes(".mov") ||
                          sealImage3.includes(".avi") ? (
                            <video
                              controls
                              style={{
                                maxWidth: "17.5rem",
                                height: "auto",
                                border: "1px solid #939393",
                                borderRadius: "20px",
                              }}
                            >
                              <source src={sealImage3} type="video/mp4" />
                              <source src={sealImage3} type="video/quicktime" />
                              Seu navegador não suporta o elemento de vídeo.
                            </video>
                          ) : (
                            <img
                              src={sealImage3}
                              alt="Visualização da imagem do lacre 3"
                              style={{
                                maxWidth: "17.5rem",
                                height: "auto",
                                border: "1px solid #939393",
                                borderRadius: "20px",
                              }}
                            />
                          )}
                          <p className={styles.fileName}>{sealFileName3}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

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
                    <p className={styles.FieldLabel}>Posição da Seta</p>
                    <input
                      type="text"
                      value={arrowPosition}
                      onChange={(e) => setArrowPosition(e.target.value)}
                      className={styles.Field}
                    />
                  </div>
                )}
              </div>

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
              © Rede Postos 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
