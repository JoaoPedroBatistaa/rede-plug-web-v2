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

import LoadingOverlay from "@/components/Loading";

interface Tank {
  tankNumber: string;
  capacity: string;
  product: string;
  saleDefense: string;
  tankOption: string;
}

export default function NewPost() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [driverName, setDriverName] = useState("");
  const [truckPlate, setTruckPLate] = useState("");
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

  useEffect(() => {
    const postName = localStorage.getItem("userPost");

    if (postName) {
      const fetchPostDetails = async () => {
        try {
          const postsRef = collection(db, "POSTS");
          const q = query(postsRef, where("name", "==", postName));
          const querySnapshot = await getDocs(q);

          // @ts-ignore
          const tanksData = [];
          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            tanksData.push(...postData.tanks);
          });

          // @ts-ignore
          setTanks(tanksData);
        } catch (error) {
          console.error("Error fetching post details:", error);
        }
      };

      fetchPostDetails();
    }
  }, []);

  useEffect(() => {
    const tank = tanks.find((t) => t.tankNumber === selectedTank);
    if (tank) {
      if (
        (selectedProduct === "SECO" || selectedProduct === "ANIDRO") &&
        tank.product !== "GC" &&
        tank.product !== "GA"
      ) {
        setShowHydrationField(true);
      } else {
        setShowHydrationField(false);
      }
    } else {
      setShowHydrationField(false);
    }
  }, [selectedProduct, selectedTank, tanks]);

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
    };

    loadConversionData();
  }, []);

  useEffect(() => {
    updateLitersAndTotal();
  }, [
    selectedTank,
    initialMeasurementCm,
    finalMeasurementCm,
    conversionData,
    selectedProduct,
  ]);

  useEffect(() => {
    console.log("Selected tank changed:", selectedTank);
    console.log("Current tanks:", tanks);

    // @ts-ignore
    const tank = tanks.find((t) => t.tankNumber === Number(selectedTank));
    console.log("Found tank:", tank);

    if (tank) {
      // @ts-ignore

      let options = [];
      switch (tank.product) {
        case "GC":
          options = ["GC"];
          if (tank.saleDefense !== "Defesa") options.push("SECO");
          if (tank.saleDefense !== "Defesa") options.push("ET");
          if (tank.saleDefense !== "Defesa") options.push("ANIDRO");
          break;
        case "GA":
          options = ["GC", "GA"];
          break;
        case "ET":
          options = ["ET"];
          if (tank.saleDefense !== "Defesa") options.push("SECO");
          if (tank.saleDefense !== "Defesa") options.push("ANIDRO");
          break;
        case "S10":
          options = ["S10"];
          break;
        default:
          options = [];
      }
      // @ts-ignore
      console.log("Setting product options:", options);
      // @ts-ignore
      setProductOptions(options);
    } else {
      setProductOptions([]);
    }
  }, [selectedTank, tanks]);

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

  const updateLitersAndTotal = () => {
    const selectedTankObject = tanks.find(
      // @ts-ignore
      (tank) => tank.tankNumber === Number(selectedTank)
    );
    if (!selectedTankObject) {
      setTotalDescarregado("Tanque não selecionado ou não encontrado.");
      return;
    }

    const tankOption = selectedTankObject.tankOption;
    console.log(tankOption);

    const initialLitersValue = findLitersForMeasurement(
      tankOption,
      initialMeasurementCm
    );
    const finalLitersValue = findLitersForMeasurement(
      tankOption,
      finalMeasurementCm
    );

    setInitialLiters(initialLitersValue);
    setFinalLiters(finalLitersValue);

    if (initialLitersValue !== null && finalLitersValue !== null) {
      const diff = finalLitersValue - initialLitersValue;
      setTotalDescarregado(`Total descarregado: ${diff.toFixed(2)} litros`);

      if (showHydrationField === true && selectedProduct === "SECO") {
        setHydrationValue(((diff / 100) * 5).toFixed(2).toString());
      } else if (showHydrationField === true && selectedProduct === "ANIDRO") {
        setHydrationValue(((diff / 100) * 7).toFixed(2).toString());
      }
    } else {
      setTotalDescarregado("Medições incompletas ou tanque não selecionado.");
    }
  };

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
    setIsLoading(true);

    let missingField = "";
    if (!date) missingField = "Data";
    else if (!time) missingField = "Hora";
    else if (!driverName) missingField = "Nome do Motorista";
    else if (!truckPlate) missingField = "Placa do caminhão";
    // @ts-ignore
    else if (!truckPlateRef.current?.files[0])
      missingField = "Imagem da Placa do Caminhão";
    else if (!selectedTank) missingField = "Tanque";
    else if (!selectedProduct) missingField = "Produto";
    else if (!initialMeasurementCm) missingField = "Medição Inicial";
    else if (!finalMeasurementCm) missingField = "Medição Final";
    // @ts-ignore
    else if (sealSelection === "SIM" && !sealRef.current?.files[0])
      missingField = "Imagem do Lacre";
    else if (arrowSelection === "SIM" && !arrowPosition)
      missingField = "Posição da Seta";
    else if (
      (selectedProduct === "GC" || selectedProduct === "GA") &&
      !productQuality
    )
      missingField = "Qualidade do Produto";
    else if (
      (selectedProduct === "GC" || selectedProduct === "GA") &&
      // @ts-ignore
      !productQualityRef.current?.files[0]
    )
      missingField = "Imagem da Qualidade do Produto";
    else if (
      (selectedProduct === "ET" ||
        selectedProduct === "EA" ||
        selectedProduct === "SECO" ||
        selectedProduct === "ANIDRO") &&
      !weight
    )
      missingField = "Peso";
    else if (
      (selectedProduct === "ET" ||
        selectedProduct === "EA" ||
        selectedProduct === "SECO" ||
        selectedProduct === "ANIDRO") &&
      !temperature
    )
      missingField = "Temperatura";
    else if (
      (selectedProduct === "ET" ||
        selectedProduct === "EA" ||
        selectedProduct === "SECO" ||
        selectedProduct === "ANIDRO") &&
      // @ts-ignore
      !weightTemperatureRef.current?.files[0]
    )
      missingField = "Imagem do Peso e Temperatura";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);
      return;
    }

    const makerName = localStorage.getItem("userName");
    const postName = localStorage.getItem("userPost");
    // @ts-ignore

    const truckPlateImage = truckPlateRef.current?.files[0];

    const dischargeData = {
      date,
      time,
      driverName,
      truckPlate,
      truckPlateImage,
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
        position: arrowPosition,
      },
      observations,
      makerName,
      postName,
      hydration: {
        value: hydrationValue,
        // @ts-ignore

        image: hydrationRef.current?.files[0] || null,
      },
      initialLiters,
      finalLiters,
      totalLiters: totalDescarregado,
      productQuality,
      // @ts-ignore

      productQualityImage: productQualityRef.current?.files[0] || "",
      weight,
      temperature,
      // @ts-ignore

      weightTemperatureImage: weightTemperatureRef.current?.files[0] || "",
    };

    const updatedData = await uploadImagesAndUpdateData(dischargeData);

    try {
      const docRef = await addDoc(collection(db, "DISCHARGES"), updatedData);
      console.log("Documento salvo com ID: ", docRef.id);
      toast.success("Descarga salva com sucesso!");

      // Preparar dados para envio de mensagem
      const images = [
        {
          imageUrl: updatedData.truckPlateImage,
          description: "Placa do Caminhão",
        },
        {
          imageUrl: updatedData.initialMeasurement.fileUrl,
          description: "Medição Inicial",
        },
        {
          imageUrl: updatedData.finalMeasurement.fileUrl,
          description: "Medição Final",
        },
      ];
      if (updatedData.seal.fileUrl) {
        images.push({
          imageUrl: updatedData.seal.fileUrl,
          description: "Lacre",
        });
      }
      if (updatedData.hydration.fileUrl) {
        images.push({
          imageUrl: updatedData.hydration.fileUrl,
          description: "Hidratação",
        });
      }
      if (updatedData.productQualityImage) {
        images.push({
          imageUrl: updatedData.productQualityImage,
          description: "Qualidade do Produto",
        });
      }
      if (updatedData.weightTemperatureImage) {
        images.push({
          imageUrl: updatedData.weightTemperatureImage,
          description: "Peso e Temperatura",
        });
      }

      const messageData = {
        date,
        time,
        driverName,
        truckPlate,
        postName,
        managerName: makerName,
        images,
      };

      // @ts-ignore
      await sendDischargeMessage(messageData);

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
    truckPlateImage: any;
    hydration: any;
    tankNumber?: string;
    product?: string;
    initialMeasurement: any;
    finalMeasurement: any;
    seal: any;
    arrow?: { selection: string; position: string };
    observations?: string;
    makerName?: string | null;
    postName?: string | null;
    productQualityImage?: any;
    weightTemperatureImage?: any;
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

    if (data.truckPlateImage instanceof File) {
      const fileUrl = await uploadImageAndGetUrl(
        data.truckPlateImage,
        `dischargeImages/truckPlate/${data.truckPlateImage.name}_${Date.now()}`
      );
      data.truckPlateImage = fileUrl;
    }

    if (data.hydration.image instanceof File) {
      const fileUrl = await uploadImageAndGetUrl(
        data.hydration.image,
        `dischargeImages/hydration/${data.hydration.image.name}_${Date.now()}`
      );
      data.hydration.fileUrl = fileUrl;
      delete data.hydration.image;
    } else {
      data.hydration.fileUrl = null;
    }

    if (data.productQualityImage instanceof File) {
      const fileUrl = await uploadImageAndGetUrl(
        data.productQualityImage,
        `dischargeImages/productQuality/${
          data.productQualityImage.name
        }_${Date.now()}`
      );
      data.productQualityImage = fileUrl;
    }

    if (data.weightTemperatureImage instanceof File) {
      const fileUrl = await uploadImageAndGetUrl(
        data.weightTemperatureImage,
        `dischargeImages/weightTemperature/${
          data.weightTemperatureImage.name
        }_${Date.now()}`
      );
      data.weightTemperatureImage = fileUrl;
    }

    return data;
  };

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adicionando um dia
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${day}/${month}/${year}`;
  }

  async function shortenUrl(originalUrl: string): Promise<string> {
    console.log(`Iniciando encurtamento da URL: ${originalUrl}`);

    try {
      const response = await fetch("/api/shorten-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalURL: originalUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Falha ao encurtar URL:", data);
        throw new Error(`Erro ao encurtar URL: ${data.message}`);
      }

      const data = await response.json();
      const shortUrl = data.shortUrl;
      console.log(`URL encurtada: ${shortUrl}`);

      return shortUrl;
    } catch (error) {
      console.error("Erro ao encurtar URL:", error);
      throw error;
    }
  }

  async function sendDischargeMessage(data: {
    date: string;
    time: string;
    driverName: string;
    truckPlate: string;
    postName: string;
    managerName?: string | null;
    images: { imageUrl: string; description: string }[];
  }) {
    const formattedDate = formatDate(data.date);

    try {
      const imagesDescription = await Promise.all(
        data.images.map(async (image) => {
          const shortUrl = await shortenUrl(image.imageUrl);
          return `*${image.description}:* ${shortUrl}\n`;
        })
      ).then((descriptions) => descriptions.join("\n"));

      const messageBody = `*Nova Descarga Realizada*\n\nData: ${formattedDate}\nHora: ${data.time}\nMotorista: ${data.driverName}\nPlaca do Caminhão: ${data.truckPlate}\nPosto: ${data.postName}\n\n*Imagens da descarga*\n\n${imagesDescription}`;

      const postsRef = collection(db, "POSTS");
      const q = query(postsRef, where("name", "==", data.postName));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("Nenhum posto encontrado com o nome especificado.");
        throw new Error("Posto não encontrado");
      }

      const postData = querySnapshot.docs[0].data();
      const managerContact = postData.managers[0].contact;

      console.log("Manager Contact: ", managerContact);

      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          managerContact,
          messageBody,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        console.error("Falha ao enviar mensagem via WhatsApp: ", errorMessage);
        throw new Error("Falha ao enviar mensagem via WhatsApp");
      }

      console.log("Mensagem de descarga enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar mensagem: ", error);
      toast.error("Erro ao enviar mensagem.");
    }
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
            <p className={styles.BudgetTitle}>Nova descarga</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton} onClick={saveDischarge}>
                <img
                  src="/finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Cadastrar descarga</span>
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
                    Carregue sua foto
                  </button>
                </div>
              </div>
              {truckPlateImage && (
                <div>
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
                  <p className={styles.fileName}>{truckPlateFileName}</p>
                </div>
              )}

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
                        {tank.product}) - {tank.saleDefense}
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
                    <option value="">Selecione um Produto</option>

                    {productOptions.map((product, index) => (
                      <option key={index} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
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
                        Carregue sua foto
                      </button>
                    </div>
                  </div>
                  {productQualityImage && (
                    <div>
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
                      <p className={styles.fileName}>
                        {productQualityFileName}
                      </p>
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
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder=""
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Temperatura (Número)</p>
                      <input
                        type="number"
                        className={styles.Field}
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
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
                        Carregue sua foto
                      </button>
                    </div>
                  </div>
                  {weightTemperatureImage && (
                    <div>
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

              <div className={styles.totalDischarge}>{totalDescarregado}</div>

              {showHydrationField && (
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
                      Carregue sua foto
                    </button>
                  </div>
                </div>
              )}

              {hydrationImage && (
                <div>
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
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>
                      Carregar imagem do lacre
                    </p>
                    <input
                      ref={sealRef}
                      type="file"
                      accept="image/*,video/*"
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
                    <p className={styles.FieldLabel}>Posição da Seta</p>
                    <select
                      value={arrowPosition}
                      onChange={(e) => setArrowPosition(e.target.value)}
                      className={styles.SelectField}
                    >
                      <option value="">Selecione a posição...</option>
                      <option value="PRIMEIRA">PRIMEIRA</option>
                      <option value="SEGUNDA">SEGUNDA</option>
                      <option value="TERCEIRA">TERCEIRA</option>
                    </select>
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
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
