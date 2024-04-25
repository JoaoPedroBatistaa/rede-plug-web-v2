import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { db, getDownloadURL, ref, storage } from "../../firebase";

import LoadingOverlay from "@/components/Loading";
import { uploadBytes } from "firebase/storage";

export default function NewPost() {
  const router = useRouter();
  const postName = router.query.postName;

  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [managerName, setManagerName] = useState("");

  const [isOk, setIsOk] = useState("");
  const [observations, setObservations] = useState("");

  const etanolRef = useRef(null);
  const gcRef = useRef(null);

  const [etanolImage, setEtanolImage] = useState<File | null>(null);
  const [etanolFileName, setEtanolFileName] = useState("");

  const [gcImage, setGcImage] = useState<File | null>(null);
  const [gcFileName, setGcFileName] = useState("");

  const handleEtanolImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setEtanolImage(file);
      setEtanolFileName(file.name);
    }
  };

  const [numberOfPumps, setNumberOfPumps] = useState(0);
  const [pumps, setPumps] = useState([]);

  useEffect(() => {
    if (postName) {
      const fetchPostDetails = async () => {
        try {
          const postsRef = collection(db, "POSTS");
          const q = query(postsRef, where("name", "==", postName));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            setNumberOfPumps(postData.bombs.length || []);
            initializePumps(postData.bombs.length || []);
          });
        } catch (error) {
          console.error("Error fetching post details:.", error);
        }
      };

      fetchPostDetails();
    }
  }, [postName]);

  const updatePumps = (num: number) => {
    setPumps(
      // @ts-ignore
      Array.from({ length: num }, (_, index) => ({
        image1File: null,
        image1Preview: "",
        image1Name: "",
        image2File: null,
        image2Preview: "",
        image2Name: "",
        ok: "",
      }))
    );
  };

  const handleImageChange = (
    pumpIndex: number,
    imageKey: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const newFile = event.target.files[0];
    if (newFile) {
      const newPumps = [...pumps];
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}File`] = newFile;
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Preview`] = URL.createObjectURL(newFile);
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Name`] = newFile.name;

      setPumps(newPumps);
    }
  };

  const handleSelectChange = (pumpIndex: number, value: string) => {
    const newPumps = [...pumps];
    // @ts-ignore
    newPumps[pumpIndex].ok = value;
    setPumps(newPumps);
  };

  const handleFileChange = (
    pumpIndex: number,
    imageKey: any,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      const newPumps = [...pumps];
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}File`] = file;
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Preview`] = URL.createObjectURL(file);
      // @ts-ignore
      newPumps[pumpIndex][`${imageKey}Name`] = file.name;
      setPumps(newPumps);
    }
  };

  const uploadButton = (
    event: { preventDefault: () => void },
    pumpIndex: any,
    imageIndex: any
  ) => {
    const fileInput = document.getElementById(
      `file-input-${pumpIndex}-${imageIndex}`
    );
    if (fileInput) {
      fileInput.click();
    }
    event.preventDefault(); // Prevent form submission if it's part of a form
  };

  const initializePumps = (num: any) => {
    const newPumps = Array.from({ length: num }, () => ({
      image1File: null,
      image2File: null,
    }));
    // @ts-ignore
    setPumps(newPumps);
  };

  const uploadFile = (pumpIndex: number, imageRefKey: string) => {
    const ref = pumps[pumpIndex][imageRefKey];
    // @ts-ignore
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.click();
    }
  };

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
    // else if (!managerName) missingField = "Nome do supervisor";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);
      return;
    }

    // Verificação de campos para cada bomba
    for (let pump of pumps) {
      // @ts-ignore
      if (!pump.ok) {
        missingField = "Todos os campos 'OK?' devem ser preenchidos";
        break;
      }
      // @ts-ignore
      if (!pump.image1File && !pump.image2File) {
        missingField = "Cada bomba deve ter pelo menos uma imagem";
        break;
      }
    }

    if (missingField) {
      toast.error(missingField);
      setIsLoading(false);
      return;
    }

    const userName = localStorage.getItem("userName");
    // const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "SUPERVISORS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("id", "==", "lacre-bombas"),
      where("userName", "==", userName),
      where("postName", "==", postName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A tarefa lacre das bombas já foi feita hoje!");
      setIsLoading(false);
      return;
    }

    const uploadPromises = pumps.map((pump, index) =>
      Promise.all(
        ["image1", "image2"].map((key) =>
          pump[`${key}File`]
            ? uploadImageAndGetUrl(
                pump[`${key}File`],
                `supervisors/${date}/${pump[`${key}Name`]}_${Date.now()}`
              ).then((imageUrl) => ({
                url: imageUrl,
                name: pump[`${key}Name`],
              }))
            : Promise.resolve({ url: null, name: null })
        )
      ).then((results) => ({
        // @ts-ignore
        ok: pump.ok,
        image1: results[0],
        image2: results[1],
      }))
    );

    try {
      const pumpsData = await Promise.all(uploadPromises);

      const taskData = {
        date,
        time,
        supervisorName: userName,
        userName,
        postName,
        observations,
        pumps: pumpsData,
        id: "lacre-bombas",
      };

      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);
      toast.success("Tarefa salva com sucesso!");
      // @ts-ignore
      router.push(`/supervisors-routine?post=${encodeURIComponent(postName)}`);
    } catch (error) {
      console.error("Erro ao salvar os dados da tarefa: ", error);
      toast.error("Erro ao salvar a medição.");
      setIsLoading(false);
    }
  };

  async function uploadImageAndGetUrl(imageFile: File, path: string) {
    const storageRef = ref(storage, path);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
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
            <p className={styles.BudgetTitle}>Lacre das bombas</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton} onClick={saveMeasurement}>
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Cadastrar tarefa</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações do lacre das bombas
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
                  <p className={styles.FieldLabel}>Nome do supervisor</p>
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
              {/* <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Quantidade de Bombas</p>
                  <input
                    type="number"
                    className={styles.Field}
                    value={numberOfPumps}
                    onChange={(e) => {
                      const num = parseInt(e.target.value, 10) || 0;
                      setNumberOfPumps(num);
                      initializePumps(num);
                    }}
                  />
                </div>
              </div> */}
              {pumps.map((pump, index) => (
                <div key={index} className={styles.InputContainer}>
                  {["image1", "image2"].map((imageKey, idx) => (
                    <div key={idx} className={styles.InputField}>
                      <p className={styles.FieldLabel}>
                        Imagem {idx + 1} da Bomba {index + 1}
                      </p>
                      <input
                        id={`file-input-${index}-${idx}`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(index, imageKey, e)}
                      />
                      <button
                        onClick={() =>
                          // @ts-ignore
                          document
                            .getElementById(`file-input-${index}-${idx}`)
                            .click()
                        }
                        className={styles.MidiaField}
                      >
                        Carregue a Imagem {idx + 1}
                      </button>
                      {pump[`${imageKey}File`] && (
                        <img
                          src={pump[`${imageKey}Preview`]}
                          alt={`Preview da Imagem ${idx + 1} da Bomba ${
                            index + 1
                          }`}
                          style={{
                            maxWidth: "11.5rem",
                            height: "auto",
                            border: "1px solid #939393",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                    </div>
                  ))}
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>OK?</p>
                    <select
                      className={styles.SelectField}
                      // @ts-ignore
                      value={pump.ok}
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                    >
                      <option value="">Selecione</option>
                      <option value="yes">Sim</option>
                      <option value="no">Não</option>
                    </select>
                  </div>
                </div>
              ))}
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
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
