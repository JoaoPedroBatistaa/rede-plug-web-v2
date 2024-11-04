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

export default function NewPost() {
  const router = useRouter();

  const docId = router.query.docId;
  const [data, setData] = useState(null);

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

          setEtSales(fetchedData.etSales);
          setGcSales(fetchedData.gcSales);
          setS10Sales(fetchedData.s10Sales);
          setGaSales(fetchedData.gaSales);

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
  const [managerName, setManagerName] = useState("");
  const [numMaquininhas, setNumMaquininhas] = useState("");
  const [maquininhasImages, setMaquininhasImages] = useState<File[]>([]);
  const [maquininhasFileNames, setMaquininhasFileNames] = useState<string[]>(
    []
  );

  const [etSales, setEtSales] = useState("");
  const [gcSales, setGcSales] = useState("");
  const [gaSales, setGaSales] = useState("");
  const [s10Sales, setS10Sales] = useState("");
  const [totalOutput, setTotalOutput] = useState("");

  useEffect(() => {
    const total =
      Number(gcSales) + Number(etSales) + Number(gaSales) + Number(s10Sales);

    // @ts-ignore
    setTotalOutput(total);
  }, [gcSales, etSales, gaSales, s10Sales]);

  const handleNumMaquininhasChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    // Permite apenas números, pontos e vírgulas
    if (/^[0-9.,]*$/.test(value)) {
      // @ts-ignore
      setNumMaquininhas(value); // Atualiza o estado com o valor permitido
    }
  };

  const handleInputChange =
    (setter: (arg0: any) => void) => (e: { target: { value: string } }) => {
      const value = e.target.value.replace(",", ".");
      setter(value);
    };

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
          });
        } catch (error) {
          console.error("Error fetching post details:", error);
        }
      };

      fetchPostDetails();
    }
  }, []);

  const getLocalISODate = () => {
    const date = new Date();
    // Ajustar para o fuso horário -03:00
    date.setHours(date.getHours() - 3);
    return date.toISOString().slice(0, 10);
  };

  const savePhotoMachines = async () => {
    setIsLoading(true);

    let missingField = "";
    const today = getLocalISODate();
    console.log(today);

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
      where("id", "==", "quantidade-vendida-dia-anterior-6h"),
      where("userName", "==", userName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error(
        "A quantidade vendida do dia anterior das 6h já foi feita hoje!"
      );
      setIsLoading(false);

      return;
    }

    const photoMachinesData = {
      date,
      time,
      managerName: userName,
      userName,
      postName,
      etSales,
      gcSales,
      gaSales,
      s10Sales,
      totalOutput,
      id: "quantidade-vendida-dia-anterior-6h",
    };

    // Processamento paralelo dos uploads de imagens
    const uploadPromises = maquininhasImages.map((imageFile, index) =>
      uploadImageAndGetUrl(
        imageFile,
        `competitorsPrice/${date}/${imageFile.name}_${Date.now()}`
      ).then((imageUrl) => {
        return {
          fileName: maquininhasFileNames[index],
          imageUrl,
        };
      })
    );

    try {
      const images = await Promise.all(uploadPromises);
      // @ts-ignore
      photoMachinesData.images = images;

      // @ts-ignore
      // sendMessageSalesData(photoMachinesData);

      const docRef = await addDoc(
        collection(db, "MANAGERS"),
        photoMachinesData
      );
      console.log("Preço dos concorrentes salvo com ID: ", docRef.id);

      toast.success("Vendas do dia anterior salvo com sucesso!");
      router.push("/manager-six-routine");
    } catch (error) {
      console.error("Erro ao salvar o preço dos concorrentes: ", error);
      toast.error("Erro ao salvar o preço dos concorrentes.");
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

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adicionando um dia
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${day}/${month}/${year}`;
  }

  async function sendMessageSalesData(data: {
    date: string | number | Date;
    etSales: any;
    gcSales: any;
    gaSales: any;
    s10Sales: any;
    totalOutput: any;
    images: any[];
    time: any;
    postName: any;
    managerName: any;
  }) {
    const formattedDate = formatDate(data.date); // Assume uma função de formatação de data existente

    // Construir a descrição das vendas
    const salesDescription = `*ET:* ${Number(data.etSales).toFixed(
      3
    )} litros\n*GC:* ${Number(data.gcSales).toFixed(3)} litros\n*GA:* ${Number(
      data.gaSales
    ).toFixed(3)} litros\n*S10:* ${Number(data.s10Sales).toFixed(
      3
    )} litros\n*Total Vendido:* ${Number(data.totalOutput).toFixed(3)}`;

    // Construir a descrição das imagens, se houver
    let imagesDescription = "";
    if (data.images && data.images.length > 0) {
      imagesDescription = data.images
        .map((image, index) => {
          return `Imagem ${index + 1}: ${image.imageUrl}\n`;
        })
        .join("\n");
    }

    // Montar o corpo da mensagem
    const messageBody = `*Novo Vendas do Dia Anterior às 6h*\n\n*Data:* ${formattedDate}\n*Hora:* ${data.time}\n*Posto:* ${data.postName}\n*Gerente:* ${data.managerName}\n\n*Detalhes das Vendas*\n${salesDescription}\n\n`;

    const postsRef = collection(db, "POSTS");
    const q = query(postsRef, where("name", "==", data.postName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Nenhum posto encontrado com o nome especificado.");
      throw new Error("Posto não encontrado");
    }

    const postData = querySnapshot.docs[0].data();
    const managerContact = postData.managers[0].contact;

    console.log(managerContact);

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
      throw new Error("Falha ao enviar mensagem via WhatsApp");
    }

    console.log("Mensagem de vendas do dia anterior enviada com sucesso!");
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
              Quantidade vendida no dia anterior 6h
            </p>
            <div className={styles.FinishTask}>
              {!docId && (
                <button
                  className={styles.FinishButton}
                  onClick={savePhotoMachines}
                >
                  <img
                    src="/finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>Cadastrar vendas</span>
                </button>
              )}
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações da quantidade vendida no dia anterior
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
              {/* <div className={styles.InputContainer}>
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
              </div> */}

              <p className={styles.BudgetTitle}>Vendas Combústiveis</p>
              <p className={styles.Notes}>
                Informe abaixo as informações das vendas
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendas GC</p>
                  <input
                    id="gcSales"
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
                    id="etSales"
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
                    id="gaSales"
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
                    id="s10Sales"
                    type="text"
                    className={styles.Field}
                    value={s10Sales}
                    onChange={handleInputChange(setS10Sales)}
                    placeholder=""
                  />
                </div>
              </div>

              <div className={styles.InputField}>
                <p className={styles.FieldLabel}>Total Litros</p>
                <input
                  id="attendant"
                  type="text"
                  className={styles.Field}
                  value={parseFloat(totalOutput).toFixed(3)}
                  onChange={(e) => setTotalOutput(e.target.value)}
                  placeholder=""
                  disabled
                />
              </div>

              {docId &&
                // @ts-ignore
                data?.images.map((image, index) => (
                  <div key={index} className={styles.InputField}>
                    <p className={styles.titleTank}>Imagem {index + 1}</p>
                    {image.imageUrl.includes(".mp4") ||
                    image.imageUrl.includes(".avi") ||
                    image.imageUrl.includes(".mov") ? (
                      <video
                        controls
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                      >
                        <source src={image.imageUrl} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                    ) : (
                      <img
                        src={image.imageUrl}
                        alt={`Imagem ${index + 1}`}
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                      />
                    )}
                    <a
                      href={image.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.openMediaLink}
                    >
                      Abrir mídia
                    </a>
                  </div>
                ))}
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
