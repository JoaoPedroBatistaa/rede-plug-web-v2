import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import imageCompression from "browser-image-compression";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { createRef, useEffect, useRef, useState } from "react";
import { db, getDownloadURL, ref, storage } from "../../../firebase";

import LoadingOverlay from "@/components/Loading";
import { uploadBytes } from "firebase/storage";

interface TankMeasurements {
  [key: string]: string;
}

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
  const postName = router.query.post;
  const docId = router.query.docId;
  const shift = router.query.shift;

  const [data, setData] = useState(null);

  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [postCoordinates, setPostCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [mapUrl, setMapUrl] = useState("");
  const [radiusCoordinates, setRadiusCoordinates] = useState([]);

  const [tanks, setTanks] = useState<Tank[]>([]);

  useEffect(() => {
    const checkLoginDuration = () => {
      console.log("Checking login duration...");
      const storedDate = localStorage.getItem("loginDate");
      const storedTime = localStorage.getItem("loginTime");

      if (storedDate && storedTime) {
        const storedDateTime = new Date(`${storedDate}T${storedTime}`);
        console.log("Stored login date and time:", storedDateTime);

        const now = new Date();
        const maxLoginDuration = 6 * 60 * 60 * 1000;

        if (now.getTime() - storedDateTime.getTime() > maxLoginDuration) {
          console.log("Login duration exceeded 60 seconds. Logging out...");

          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          localStorage.removeItem("userType");
          localStorage.removeItem("userPost");
          localStorage.removeItem("posts");
          localStorage.removeItem("loginDate");
          localStorage.removeItem("loginTime");

          alert("Sua sessão expirou. Por favor, faça login novamente.");
          window.location.href = "/";
        } else {
          console.log("Login duration within limits.");
        }
      } else {
        console.log("No stored login date and time found.");
      }
    };

    checkLoginDuration();
  }, []);

  useEffect(() => {
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
  }, [postName]);

  useEffect(() => {
    const fetchData = async () => {
      if (!docId) return;

      try {
        const docRef = doc(db, "SUPERVISORS", docId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          // @ts-ignore
          setData(fetchedData);

          setDate(fetchedData.date);
          setTime(fetchedData.time);
          setAttendant(fetchedData.attendant);
          setEtPrice(fetchedData.etPrice);
          setGcPrice(fetchedData.gcPrice);
          setGaPrice(fetchedData.gaPrice);
          setS10Price(fetchedData.s10Price);
          setEtSales(fetchedData.etSales);
          setGcSales(fetchedData.gcSales);
          setGaSales(fetchedData.gaSales);
          setS10Sales(fetchedData.s10Sales);
          setTotalLiters(fetchedData.totalLiters);
          setCash(fetchedData.cash);
          setDebit(fetchedData.debit);
          setCredit(fetchedData.credit);
          setPix(fetchedData.pix);
          setTotalOutput(fetchedData.totalOutput);
          setTotalInput(fetchedData.totalInput);
          setDifference(fetchedData.difference);
          setObservations(fetchedData.observations);
          setExpenses(fetchedData.expenses);
          setMediaUrl(fetchedData.mediaUrl);

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

  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attendant, setAttendant] = useState("");
  const [managerName, setManagerName] = useState("");

  const [isOk, setIsOk] = useState("");
  const [observations, setObservations] = useState("");

  // States para preços
  const [etPrice, setEtPrice] = useState("");
  const [gcPrice, setGcPrice] = useState("");
  const [gaPrice, setGaPrice] = useState("");
  const [s10Price, setS10Price] = useState("");

  // States para vendas de combustíveis
  const [etSales, setEtSales] = useState("");
  const [gcSales, setGcSales] = useState("");
  const [gaSales, setGaSales] = useState("");
  const [s10Sales, setS10Sales] = useState("");
  const [totalLiters, setTotalLiters] = useState("");

  // States para movimento
  const [cash, setCash] = useState("");
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");
  const [pix, setPix] = useState("");

  // States para total de entrada e saída
  const [totalOutput, setTotalOutput] = useState(0);
  const [totalInput, setTotalInput] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [difference, setDifference] = useState(0);

  const [expenses, setExpenses] = useState([
    { expenseValue: "", expenseType: "" }, // Estado inicial com um item, se necessário
  ]);

  const [numMaquininhas, setNumMaquininhas] = useState(0);
  const [maquininhasImages, setMaquininhasImages] = useState<File[][]>([
    // @ts-ignore
    [null, null], // Inicializamos com os campos para as duas imagens fixas
  ]);
  const [maquininhasFileNames, setMaquininhasFileNames] = useState<string[][]>([
    ["", ""], // Inicializamos com os campos para as duas imagens fixas
  ]);
  const maquininhasRefs = useRef([createRef(), createRef()]);

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const mediaRef = useRef<HTMLInputElement>(null);
  const [mediaFileName, setMediaFileName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const [initialMeasurements, setInitialMeasurements] =
    useState<TankMeasurements>({});
  const [finalMeasurements, setFinalMeasurements] = useState<TankMeasurements>(
    {}
  );
  const [litersOut, setLitersOut] = useState<{ [key: string]: number | null }>(
    {}
  );
  const [conversionData, setConversionData] = useState([]);

  const [differenceLiters, setDifferenceLiters] = useState({
    ET: 0,
    GC: 0,
    GA: 0,
    S10: 0,
  });

  const [differencePercentage, setDifferencePercentage] = useState({
    ET: 0,
    GC: 0,
    GA: 0,
    S10: 0,
  });

  useEffect(() => {
    calculateDifference();
  }, [litersOut, etSales, gcSales, gaSales, s10Sales]);

  const calculateDifference = () => {
    const totalSaiuET = tanks
      .filter((tank) => tank.product === "ET")
      .reduce((sum, tank) => sum + (litersOut[tank.tankNumber] || 0), 0);

    const totalSaiuGC = tanks
      .filter((tank) => tank.product === "GC")
      .reduce((sum, tank) => sum + (litersOut[tank.tankNumber] || 0), 0);

    const totalSaiuGA = tanks
      .filter((tank) => tank.product === "GA")
      .reduce((sum, tank) => sum + (litersOut[tank.tankNumber] || 0), 0);

    const totalSaiuS10 = tanks
      .filter((tank) => tank.product === "S10")
      .reduce((sum, tank) => sum + (litersOut[tank.tankNumber] || 0), 0);

    // Calcula as diferenças em litros
    const diffLitersET = Number(etSales) - totalSaiuET;
    const diffLitersGC = Number(gcSales) - totalSaiuGC;
    const diffLitersGA = Number(gaSales) - totalSaiuGA;
    const diffLitersS10 = Number(s10Sales) - totalSaiuS10;

    // Calcula a porcentagem de diferença correta (em relação às vendas)
    const percentageET =
      Number(etSales) > 0 ? (diffLitersET / Number(etSales)) * 100 : 0;
    const percentageGC =
      Number(gcSales) > 0 ? (diffLitersGC / Number(gcSales)) * 100 : 0;
    const percentageGA =
      Number(gaSales) > 0 ? (diffLitersGA / Number(gaSales)) * 100 : 0;
    const percentageS10 =
      Number(s10Sales) > 0 ? (diffLitersS10 / Number(s10Sales)) * 100 : 0;

    // Atualiza os estados
    setDifferenceLiters({
      ET: diffLitersET,
      GC: diffLitersGC,
      GA: diffLitersGA,
      S10: diffLitersS10,
    });

    setDifferencePercentage({
      ET: percentageET,
      GC: percentageGC,
      GA: percentageGA,
      S10: percentageS10,
    });
  };

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
      console.log("Conversions", conversionData);
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

  const handleInitialMeasurementChange = (
    tankNumber: string,
    measurementCm: string
  ) => {
    const selectedTankObject = tanks.find(
      (tank) => tank.tankNumber === tankNumber
    );

    if (!selectedTankObject) {
      console.error("Tanque não selecionado ou não encontrado.");
      return;
    }

    // Aqui estamos passando o tankOption ao invés de tankNumber
    const liters = findLitersForMeasurement(
      // @ts-ignore
      selectedTankObject.tankOption,
      measurementCm
    );

    // @ts-ignore
    setInitialMeasurements((prev) => ({
      ...prev,
      [tankNumber]: {
        cm: measurementCm,
        liters: liters ?? null,
      },
    }));

    // Calcular a quantidade "saiu" após a alteração da medição inicial
    calculateLitersOut(
      tankNumber,
      liters,
      // @ts-ignore
      finalMeasurements[tankNumber]?.liters || null
    );
  };

  const handleFinalMeasurementChange = (
    tankNumber: string,
    measurementCm: string
  ) => {
    const selectedTankObject = tanks.find(
      (tank) => tank.tankNumber === tankNumber
    );

    if (!selectedTankObject) {
      console.error("Tanque não selecionado ou não encontrado.");
      return;
    }

    // Passando o tankOption corretamente
    const liters = findLitersForMeasurement(
      // @ts-ignore
      selectedTankObject.tankOption,
      measurementCm
    );

    // @ts-ignore
    setFinalMeasurements((prev) => ({
      ...prev,
      [tankNumber]: {
        cm: measurementCm,
        liters: liters ?? null,
      },
    }));

    // Calcular a quantidade "saiu" após a alteração da medição final
    calculateLitersOut(
      tankNumber,
      // @ts-ignore
      initialMeasurements[tankNumber]?.liters || null,
      liters
    );
  };

  // Função para calcular a quantidade "saiu"
  const calculateLitersOut = (
    tankNumber: string,
    initialLiters: number | null,
    finalLiters: number | null
  ) => {
    const litersOutValue =
      initialLiters !== null && finalLiters !== null
        ? initialLiters - finalLiters
        : null;
    setLitersOut((prev) => ({ ...prev, [tankNumber]: litersOutValue }));
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
          console.log(
            `Supervisor coordinates obtained: lat=${position.coords.latitude}, lng=${position.coords.longitude}`
          );
        },
        (error) => {
          console.error("Error obtaining location:", error);
          setCoordinates({ lat: null, lng: null });
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, [date, time, isOk, observations, managerName]);

  useEffect(() => {
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
          console.log("Post coordinates fetched: ", postData.location);
        }
      } catch (error) {
        console.error("Error fetching post coordinates:", error);
      }
    };

    fetchPostCoordinates();
  }, [postName]);

  const getLocalISODate = () => {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    return {
      date: date.toISOString().slice(0, 10),
      time: date.toISOString().slice(11, 19),
    };
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

    console.log("Radius coordinates calculated: ", points);
    return points;
  };

  async function compressImage(file: File) {
    const options = {
      maxSizeMB: 2, // Tamanho máximo do arquivo final em megabytes
      maxWidthOrHeight: 1920, // Dimensão máxima (largura ou altura) da imagem após a compressão
      useWebWorker: true, // Utiliza Web Workers para melhorar o desempenho
    };

    try {
      console.log(
        `Tamanho original da imagem: ${(file.size / 1024 / 1024).toFixed(2)} MB`
      );
      const compressedFile = await imageCompression(file, options);
      console.log(
        `Tamanho da imagem comprimida: ${(
          compressedFile.size /
          1024 /
          1024
        ).toFixed(2)} MB`
      );
      return compressedFile;
    } catch (error) {
      console.error("Erro ao comprimir imagem:", error);
      throw error;
    }
  }

  const handleNumMaquininhasChange = (event: { target: { value: string } }) => {
    const value = parseInt(event.target.value, 10);
    setNumMaquininhas(isNaN(value) ? 0 : value);

    // @ts-ignore
    setMaquininhasImages((prev) => [
      prev[0] || [null, null], // Manter as imagens fixas já existentes ou inicializar
      ...Array.from({ length: isNaN(value) ? 0 : value }, () => [null]),
    ]);

    setMaquininhasFileNames((prev) => [
      prev[0] || ["", ""], // Manter os nomes de arquivos fixos já existentes ou inicializar
      ...Array.from({ length: isNaN(value) ? 0 : value }, () => [""]),
    ]);

    maquininhasRefs.current = [
      maquininhasRefs.current[0] || createRef(),
      maquininhasRefs.current[1] || createRef(),
      ...Array.from({ length: isNaN(value) ? 0 : value }, () => createRef()),
    ];
  };

  const handleImageChange =
    (maquininhaIndex: number, imageIndex: number) =>
    async (event: { target: { files: any[] } }) => {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          console.error("O arquivo fornecido não é uma imagem");
          toast.error("Por favor, selecione um arquivo de imagem.");
          return;
        }

        setIsLoading(true);
        try {
          const compressedFile = await compressImage(file);
          const imageUrl = await uploadImageAndGetUrl(
            compressedFile,
            `attendants/${getLocalISODate()}/${
              compressedFile.name
            }_${Date.now()}`
          );

          if (imageIndex < 2) {
            // Para Filipeta Sistema Frente e Verso, use sempre os índices 0 e 1
            setMaquininhasImages((prev) => {
              const newImages = [...prev];
              // @ts-ignore
              newImages[0][imageIndex] = imageUrl;
              return newImages;
            });
            setMaquininhasFileNames((prev) => {
              const newFileNames = [...prev];
              newFileNames[0][imageIndex] = compressedFile.name;
              return newFileNames;
            });
          } else {
            // Para Filipeta Maquininha, use o índice da maquininha atual mais 2
            setMaquininhasImages((prev) => {
              const newImages = [...prev];
              // @ts-ignore
              newImages[maquininhaIndex + 1][0] = imageUrl;
              return newImages;
            });
            setMaquininhasFileNames((prev) => {
              const newFileNames = [...prev];
              newFileNames[maquininhaIndex + 1][0] = compressedFile.name;
              return newFileNames;
            });
          }
        } catch (error) {
          console.error("Erro ao fazer upload da imagem:", error);
          toast.error("Erro ao fazer upload da imagem.");
        } finally {
          setIsLoading(false);
        }
      }
    };

  const handleInputChange =
    (setter: (arg0: any) => void) => (e: { target: { value: string } }) => {
      const value = e.target.value.replace(",", ".");
      setter(value);
    };

  const handleExpenseChange = (index: number, field: string, value: string) => {
    const newExpenses = expenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value.replace(",", ".") } : expense
    );
    setExpenses(newExpenses);
  };

  const addExpense = () => {
    setExpenses([...expenses, { expenseValue: "", expenseType: "" }]);
  };

  const removeExpense = (index: number) => {
    const newExpenses = [...expenses];
    newExpenses.splice(index, 1);
    setExpenses(newExpenses);
  };

  const handleMediaChange = async (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        console.error("O arquivo fornecido não é uma imagem ou vídeo");
        toast.error("Por favor, selecione um arquivo de imagem ou vídeo.");
        return;
      }

      setIsLoading(true);
      try {
        const compressedFile = await compressImage(file);
        const mediaUrl = await uploadImageAndGetUrl(
          compressedFile,
          `attendants/${getLocalISODate()}/${compressedFile.name}_${Date.now()}`
        );
        setMediaFile(compressedFile);
        setMediaFileName(compressedFile.name);
        setMediaUrl(mediaUrl);
      } catch (error) {
        console.error("Erro ao fazer upload da mídia:", error);
        toast.error("Erro ao fazer upload da mídia.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const total =
      Number(gcPrice) * Number(gcSales) +
      Number(etPrice) * Number(etSales) +
      Number(gaPrice) * Number(gaSales) +
      Number(s10Price) * Number(s10Sales);

    setTotalLiters(
      // @ts-ignore
      Number(gcSales) + Number(etSales) + Number(gaSales) + Number(s10Sales)
    );
    // @ts-ignore
    setTotalOutput(total);
  }, [
    gcPrice,
    gcSales,
    etPrice,
    etSales,
    gaPrice,
    gaSales,
    s10Price,
    s10Sales,
  ]);

  useEffect(() => {
    const totalPayments =
      Number(cash) + Number(debit) + Number(credit) + Number(pix);

    const totalExpenses = expenses.reduce((acc, current) => {
      return acc + Number(current.expenseValue);
    }, 0);

    const total = totalPayments;

    // @ts-ignore
    setTotalInput(total);
  }, [cash, debit, credit, pix, expenses]);

  useEffect(() => {
    const totalExpenses = expenses.reduce((acc, current) => {
      return acc + Number(current.expenseValue);
    }, 0);

    const total = totalExpenses;

    // @ts-ignore
    setTotalExpenses(total);
  }, [expenses]);

  useEffect(() => {
    let total = 0;

    // @ts-ignore
    total = totalInput + totalExpenses - totalOutput;

    // @ts-ignore
    setDifference(total);
  }, [totalInput, totalOutput, totalExpenses]);

  const saveMeasurement = async () => {
    setIsLoading(true);

    fetchCoordinates();

    const today = getLocalISODate();
    console.log(today);

    // Verificação de campos NaN
    const fields = [
      etPrice,
      gcPrice,
      gaPrice,
      s10Price,
      etSales,
      gcSales,
      gaSales,
      s10Sales,
      totalLiters,
      cash,
      debit,
      credit,
      pix,
      totalOutput,
      totalInput,
      difference,
      ...expenses.map((expense) => expense.expenseValue),
    ];

    const hasNaN = fields.some((field) => isNaN(Number(field)));

    if (hasNaN) {
      toast.error("Por favor, preencha todos os campos corretamente.");
      setIsLoading(false);
      return;
    }

    let missingField = "";

    // Verificação para todos os campos obrigatórios
    if (!date) missingField = "Data";
    else if (date !== today.date) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);
      return;
    } else if (!time) missingField = "Hora";
    else if (!etPrice) missingField = "Preço ET";
    else if (!gcPrice) missingField = "Preço GC";
    else if (!gaPrice) missingField = "Preço GA";
    else if (!s10Price) missingField = "Preço S10";
    else if (!etSales) missingField = "Vendas ET";
    else if (!gcSales) missingField = "Vendas GC";
    else if (!gaSales) missingField = "Vendas GA";
    else if (!s10Sales) missingField = "Vendas S10";
    else if (!totalLiters) missingField = "Total de Litros";
    else if (!cash) missingField = "Dinheiro";
    else if (!debit) missingField = "Débito";
    else if (!credit) missingField = "Crédito";
    else if (!pix) missingField = "Pix";

    // Caso tenha algum campo faltando, exibe o erro correspondente
    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);
      return;
    }

    const userName = localStorage.getItem("userName");

    const managersRef = collection(db, "SUPERVISORS");
    const q = query(
      managersRef,
      where("date", "==", today.date),
      where("id", "==", "caixa-surpresa"),
      where("supervisorName", "==", userName),
      where("postName", "==", postName), // Usando `post` em vez de `postName`
      where("shift", "==", shift) // Também verificamos se o turno já foi salvo
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A tarefa caixa surpresa já foi feita para esse turno hoje!");
      setIsLoading(false);
      return;
    }

    const images = maquininhasImages.flatMap((imageFiles) =>
      imageFiles.filter((image) => image !== null)
    );

    console.log(images);

    const taskData = {
      date,
      time,
      supervisorName: userName,
      postName,
      shift,
      etPrice,
      gcPrice,
      gaPrice,
      s10Price,
      etSales,
      gcSales,
      gaSales,
      s10Sales,
      totalLiters,
      cash,
      debit,
      credit,
      pix,
      totalOutput,
      totalExpenses,
      totalInput,
      difference,
      observations,
      expenses,
      images,
      mediaUrl,
      id: "caixa-surpresa",
    };

    // @ts-ignore
    const radiusCoords = calculateCoordinatesInRadius(postCoordinates);
    // @ts-ignore
    radiusCoords.push(postCoordinates); // Add the main post coordinate to the array for comparison

    const isWithinRadius = radiusCoords.some(
      (coord) =>
        // @ts-ignore
        Math.abs(coord.lat - coordinates.lat) < 0.0001 &&
        // @ts-ignore
        Math.abs(coord.lng - coordinates.lng) < 0.0001
    );

    console.log(`Supervisor is within radius: ${isWithinRadius}`);

    if (!isWithinRadius && coordinates.lat && coordinates.lng) {
      toast.error(
        "Você não está dentro do raio permitido para realizar essa tarefa."
      );
      setIsLoading(false);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);
      toast.success("Tarefa salva com sucesso!");

      // @ts-ignore
      router.push(
        `/supervisors/uniforms?post=${encodeURIComponent(
          // @ts-ignore
          postName
        )}&shift=${shift}`
      );
    } catch (error) {
      console.error("Erro ao salvar os dados da tarefa: ", error);
      toast.error("Erro ao salvar a medição.");
    } finally {
      setIsLoading(false);
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
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
`}</style>
      </Head>

      <HeaderNewProduct></HeaderNewProduct>
      <ToastContainer />
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Caixa surpresa</p>
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
            Informe abaixo as informações do caixa surpresa
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

              <p className={styles.BudgetTitle}>Maquininhas</p>
              <p className={styles.Notes}>
                Informe abaixo as informações das maquininhas
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Número de maquininhas</p>
                  <input
                    type="number"
                    className={styles.Field}
                    value={numMaquininhas}
                    onChange={handleNumMaquininhasChange}
                    placeholder=""
                  />
                </div>
              </div>
              <div className={styles.InputField}>
                <div className={styles.InputContainer}>
                  {["Filipeta Sistema Frente", "Filipeta Sistema Verso"].map(
                    (label, imageIndex) => (
                      <div key={imageIndex} className={styles.InputField}>
                        <p className={styles.FieldLabel}>{label}</p>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          capture="environment"
                          style={{ display: "none" }}
                          ref={(el) => {
                            // @ts-ignore
                            maquininhasRefs.current[imageIndex] = el;
                          }}
                          // @ts-ignore
                          onChange={handleImageChange(0, imageIndex)}
                        />
                        <button
                          onClick={() =>
                            // @ts-ignore

                            maquininhasRefs.current[imageIndex]?.click()
                          }
                          className={styles.MidiaField}
                        >
                          Tire sua foto/vídeo
                        </button>
                        {maquininhasImages[0] &&
                          maquininhasImages[0][imageIndex] && (
                            <div>
                              <img
                                // @ts-ignore
                                src={maquininhasImages[0][imageIndex]}
                                alt={`Preview da ${label}`}
                                style={{
                                  maxWidth: "17.5rem",
                                  height: "auto",
                                  border: "1px solid #939393",
                                  borderRadius: "20px",
                                }}
                                onLoad={() =>
                                  URL.revokeObjectURL(
                                    // @ts-ignore

                                    maquininhasImages[0][imageIndex]
                                  )
                                }
                              />
                              <p className={styles.fileName}>
                                {maquininhasFileNames[0][imageIndex]}
                              </p>
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
                {Array.from(
                  { length: numMaquininhas },
                  (_, maquininhaIndex) => (
                    <div
                      key={maquininhaIndex}
                      className={styles.InputContainer}
                    >
                      <p className={styles.FieldLabel}>
                        Maquininha {maquininhaIndex + 1}
                      </p>
                      <div className={styles.InputField}>
                        <p className={styles.FieldLabel}>Filipeta Maquininha</p>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          capture="environment"
                          style={{ display: "none" }}
                          ref={(el) => {
                            // @ts-ignore

                            maquininhasRefs.current[maquininhaIndex + 2] = el;
                          }}
                          // @ts-ignore
                          onChange={handleImageChange(maquininhaIndex, 2)}
                        />
                        <button
                          onClick={() =>
                            maquininhasRefs.current[
                              maquininhaIndex + 2
                              // @ts-ignore
                            ]?.click()
                          }
                          className={styles.MidiaField}
                        >
                          Tire sua foto/vídeo
                        </button>
                        {maquininhasImages[maquininhaIndex + 1] &&
                          maquininhasImages[maquininhaIndex + 1][0] && (
                            <div>
                              <img
                                // @ts-ignore
                                src={maquininhasImages[maquininhaIndex + 1][0]}
                                alt={`Preview da Filipeta Maquininha ${
                                  maquininhaIndex + 1
                                }`}
                                style={{
                                  maxWidth: "17.5rem",
                                  height: "auto",
                                  border: "1px solid #939393",
                                  borderRadius: "20px",
                                }}
                                onLoad={() =>
                                  URL.revokeObjectURL(
                                    // @ts-ignore
                                    maquininhasImages[maquininhaIndex + 1][0]
                                  )
                                }
                              />
                              <p className={styles.fileName}>
                                {maquininhasFileNames[maquininhaIndex + 1][0]}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  )
                )}
              </div>

              <p className={styles.BudgetTitle}>Preços</p>
              <p className={styles.Notes}>
                Informe abaixo as informações dos preços
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Preço GC</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={gcPrice}
                    onChange={handleInputChange(setGcPrice)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Preço ET</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={etPrice}
                    onChange={handleInputChange(setEtPrice)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Preço GA</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={gaPrice}
                    onChange={handleInputChange(setGaPrice)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Preço S10</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={s10Price}
                    onChange={handleInputChange(setS10Price)}
                    placeholder=""
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Vendas Combústiveis</p>
              <p className={styles.Notes}>
                Informe abaixo as informações das vendas
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendas GC</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={gcSales}
                    onChange={handleInputChange(setGcSales)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendas ET</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={etSales}
                    onChange={handleInputChange(setEtSales)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendas GA</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={gaSales}
                    onChange={handleInputChange(setGaSales)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendas S10</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={s10Sales}
                    onChange={handleInputChange(setS10Sales)}
                    placeholder=""
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Medições</p>
              <p className={styles.Notes}>
                Informe abaixo as informações das medições
              </p>

              {tanks.map((tank) => (
                <div key={tank.tankNumber} className={styles.InputContainer}>
                  <p className={styles.titleTank}>
                    Tanque {tank.tankNumber} - {tank.capacity}L ({tank.product})
                  </p>

                  {/* Medição inicial */}
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Medição inicial (cm)</p>
                    <input
                      type="number"
                      // @ts-ignore
                      value={initialMeasurements[tank.tankNumber]?.cm || ""}
                      onChange={(e) =>
                        handleInitialMeasurementChange(
                          tank.tankNumber,
                          e.target.value
                        )
                      }
                      className={styles.Field}
                    />
                  </div>

                  {/* Medição final */}
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Medição final (cm)</p>
                    <input
                      type="number"
                      // @ts-ignore
                      value={finalMeasurements[tank.tankNumber]?.cm || ""}
                      onChange={(e) =>
                        handleFinalMeasurementChange(
                          tank.tankNumber,
                          e.target.value
                        )
                      }
                      className={styles.Field}
                    />
                  </div>

                  {/* Campo "saiu" */}
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Saiu (litros)</p>
                    <input
                      type="text"
                      value={
                        litersOut[tank.tankNumber] !== null
                          ? litersOut[tank.tankNumber]?.toFixed(2)
                          : ""
                      }
                      className={styles.Field}
                      disabled
                    />
                  </div>
                </div>
              ))}

              <p className={styles.BudgetTitle}>Diferença Vendas x Medição</p>
              <p className={styles.Notes}>
                Informe abaixo as informações da diferença
              </p>

              <p className={styles.titleTank}>ET</p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Sobra ET (litros)</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={differenceLiters.ET.toFixed(2)}
                    disabled
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Sobra ET (%)</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={differencePercentage.ET.toFixed(2)}
                    disabled
                  />
                </div>

                <p className={styles.titleTank}>GC</p>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Sobra GC (litros)</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={differenceLiters.GC.toFixed(2)}
                    disabled
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Sobra GC (%)</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={differencePercentage.GC.toFixed(2)}
                    disabled
                  />
                </div>

                <p className={styles.titleTank}>GA</p>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Sobra GA (litros)</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={differenceLiters.GA.toFixed(2)}
                    disabled
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Sobra GA (%)</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={differencePercentage.GA.toFixed(2)}
                    disabled
                  />
                </div>

                <p className={styles.titleTank}>S10</p>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Sobra S10 (litros)</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={differenceLiters.S10.toFixed(2)}
                    disabled
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Sobra S10 (%)</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={differencePercentage.S10.toFixed(2)}
                    disabled
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Movimento</p>
              <p className={styles.Notes}>
                Informe abaixo as informações do movimento
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Dinheiro</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={cash}
                    onChange={handleInputChange(setCash)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Débito</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={debit}
                    onChange={handleInputChange(setDebit)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Crédito</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={credit}
                    onChange={handleInputChange(setCredit)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Pix</p>
                  <input
                    type="text"
                    className={styles.Field}
                    value={pix}
                    onChange={handleInputChange(setPix)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Total Despesas</p>
                  <input
                    id="totalExpenses"
                    type="text"
                    className={styles.Field}
                    value={totalExpenses.toFixed(2)}
                    onChange={(e) =>
                      setTotalExpenses(parseFloat(e.target.value))
                    }
                    placeholder=""
                    disabled
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Despesas</p>
              <p className={styles.Notes}>
                Informe abaixo as informações das despesas
              </p>

              {expenses.map((expense, index) => (
                <div key={index} className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Valor da despesa</p>
                    <input
                      type="text"
                      className={styles.Field}
                      value={expense.expenseValue}
                      onChange={(e) =>
                        handleExpenseChange(
                          index,
                          "expenseValue",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Tipo de Despesa</p>
                    <input
                      type="text"
                      className={styles.Field}
                      value={expense.expenseType}
                      onChange={(e) =>
                        handleExpenseChange(
                          index,
                          "expenseType",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  {expenses.length > 1 && (
                    <button
                      onClick={() => removeExpense(index)}
                      className={styles.DeleteButton}
                    >
                      <span className={styles.buttonText}>Excluir despesa</span>
                    </button>
                  )}

                  <button onClick={addExpense} className={styles.NewButton}>
                    <span className={styles.buttonText}>Nova despesa</span>
                  </button>
                </div>
              ))}

              <p className={styles.BudgetTitle}>Comprovante de aferição</p>
              <p className={styles.Notes}>
                Informe abaixo as informações do comprovante
              </p>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    style={{ display: "none" }}
                    ref={mediaRef}
                    // @ts-ignore
                    onChange={handleMediaChange}
                  />
                  <button
                    onClick={() => mediaRef.current?.click()}
                    className={styles.MidiaField}
                  >
                    Carregue seu comprovante
                  </button>
                  {mediaFile && (
                    <div>
                      <p className={styles.fileName}>{mediaFileName}</p>
                    </div>
                  )}
                </div>
              </div>

              <p className={styles.BudgetTitle}>Total</p>
              <p className={styles.Notes}>
                Informe abaixo as informações do total
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Total Saída</p>
                  <input
                    id="totalOutput"
                    type="text"
                    className={styles.Field}
                    value={totalOutput.toFixed(2)}
                    onChange={(e) => setTotalOutput(parseFloat(e.target.value))}
                    placeholder=""
                    disabled
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Total Entrada</p>
                  <input
                    id="totalInput"
                    type="text"
                    className={styles.Field}
                    value={totalInput.toFixed(2)}
                    onChange={(e) => setTotalInput(parseFloat(e.target.value))}
                    placeholder=""
                    disabled
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Diferença</p>
                  <input
                    id="difference"
                    type="text"
                    className={styles.Field}
                    value={difference.toFixed(2)}
                    onChange={(e) => setDifference(parseFloat(e.target.value))}
                    placeholder=""
                    disabled
                  />
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
