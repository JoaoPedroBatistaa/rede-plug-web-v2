import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderViewDischarge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";

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

  const [finalMeasurementImage, setFinalMeasurementImage] = useState("");
  const [finalMeasurementFileName, setFinalMeasurementFileName] = useState("");

  const [sealSelection, setSealSelection] = useState("");
  const [sealImage, setSealImage] = useState("");
  const [sealFileName, setSealFileName] = useState("");

  const [arrowSelection, setArrowSelection] = useState("");
  const [arrowPosition, setArrowPosition] = useState("");

  const [conversionData, setConversionData] = useState([]);
  const [initialLiters, setInitialLiters] = useState(null);
  const [finalLiters, setFinalLiters] = useState(null);
  const [totalDescarregado, setTotalDescarregado] = useState("");

  const [hydrationValue, setHydrationValue] = useState("");
  const [hydrationImage, setHydrationImage] = useState("");
  const [hydrationFileName, setHydrationFileName] = useState("");
  const hydrationRef = useRef(null);

  const [showHydrationField, setShowHydrationField] = useState(false);

  useEffect(() => {
    const tank = tanks.find((t) => t.tankNumber === selectedTank);
    if (
      tank &&
      selectedProduct === "SECO" &&
      tank.product !== "GC" &&
      tank.product !== "GA"
    ) {
      setShowHydrationField(true);
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
  }, [selectedTank, initialMeasurementCm, finalMeasurementCm, conversionData]);

  useEffect(() => {
    const fetchDischargeData = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "DISCHARGES", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setDate(data.date);
          setTime(data.time);
          setDriverName(data.driverName);
          setTruckPlate(data.truckPlate);
          setSelectedTank(data.tankNumber);
          setSelectedProduct(data.product);
          setInitialMeasurementCm(data.initialMeasurement.cm);
          setFinalMeasurementCm(data.finalMeasurement.cm);
          setInitialMeasurementImage(data.initialMeasurement.fileUrl);
          setFinalMeasurementImage(data.finalMeasurement.fileUrl);
          setObservations(data.observations);
          setSealSelection(data.seal.selection);
          setSealImage(data.seal.fileUrl);
          setArrowSelection(data.arrow.selection);
          setArrowPosition(data.arrow.position);
          setHydrationValue(data.hydration.value);
          setHydrationImage(data.hydration.fileUrl);
        } else {
          console.log("No such document!");
          toast.error("Descarga não encontrada.");
        }
      } catch (error) {
        console.error("Error fetching discharge data:", error);
        toast.error("Erro ao buscar os dados da descarga.");
      }
    };

    fetchDischargeData();
  }, [id]);

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

  const findLitersForMeasurement = (
    tankOption: string,
    measurementCm: string
  ) => {
    const measurementCmNumber = Number(measurementCm);

    const tankConversionData = conversionData.filter(
      // @ts-ignore
      (data) => data.Tanque === tankOption
    );

    const conversionRecord = tankConversionData.find(
      (data) => data["Regua (cm)"] === measurementCmNumber
    );

    // @ts-ignore
    return conversionRecord ? conversionRecord.Litros : null;
  };

  const updateLitersAndTotal = () => {
    const selectedTankObject = tanks.find(
      (tank) => tank.tankNumber === selectedTank
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
      setTotalDescarregado(`Total descarregado: ${diff} litros`);
    } else {
      setTotalDescarregado("Medições incompletas ou tanque não selecionado.");
    }
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
            <p className={styles.BudgetTitle}>Visualizar descarga</p>
            <div className={styles.BudgetHeadS}></div>
          </div>

          <p className={styles.Notes}>
            Visualize abaixo as informações da sua descarga
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
                    disabled
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
                    disabled
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
                    disabled
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Placa do caminhão</p>
                  {truckPlate && (
                    <div>
                      <img
                        src={truckPlate}
                        alt="Visualização da imagem da placa do caminhão"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Tanque</p>
                  <select
                    value={selectedTank}
                    id="tankNumber"
                    className={styles.SelectField}
                    onChange={(e) => setSelectedTank(e.target.value)}
                    disabled
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
                    disabled
                  >
                    {productOptions.map((product, index) => (
                      <option key={index} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                    />
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
                  <p className={styles.FieldLabel}>Medição inicial (cm)</p>
                  <input
                    id="initialMeasurementCm"
                    type="number"
                    className={styles.Field}
                    value={initialMeasurementCm}
                    onChange={(e) => setInitialMeasurementCm(e.target.value)}
                    placeholder=""
                    disabled
                  />
                </div>
              </div>

              {initialMeasurementImage && (
                <div>
                  <img
                    src={initialMeasurementImage}
                    alt="Visualização da imagem"
                    className={styles.imageStyle}
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
                    disabled
                  />
                </div>
              </div>

              {finalMeasurementImage && (
                <div>
                  <img
                    src={finalMeasurementImage}
                    alt="Visualização da imagem"
                    className={styles.imageStyle}
                  />
                  <p className={styles.fileName}>{finalMeasurementFileName}</p>
                </div>
              )}

              <div className={styles.totalDischarge}>{totalDescarregado}</div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Lacre</p>
                  <select
                    value={sealSelection}
                    onChange={(e) => setSealSelection(e.target.value)}
                    className={styles.SelectField}
                    disabled
                  >
                    <option value="">Selecione...</option>
                    <option value="SIM">SIM</option>
                    <option value="NAO">NÃO</option>
                  </select>
                </div>
              </div>

              {sealImage && (
                <div>
                  <img
                    src={sealImage}
                    alt="Visualização da imagem do lacre"
                    className={styles.imageStyle}
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
                    disabled
                  >
                    <option value="">Selecione...</option>
                    <option value="SIM">SIM</option>
                    <option value="NAO">NÃO</option>
                  </select>
                </div>

                {arrowPosition && (
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Posição da Seta</p>
                    <select
                      value={arrowPosition}
                      onChange={(e) => setArrowPosition(e.target.value)}
                      className={styles.SelectField}
                      disabled
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
                    disabled
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
