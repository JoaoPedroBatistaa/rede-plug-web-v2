import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useRef, useState } from "react";
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

  const [isANPOk, setIsANPOk] = useState("");
  const [isLicencaOperacaoOk, setIsLicencaOperacaoOk] = useState("");
  const [isContratoSocialOk, setIsContratoSocialoOk] = useState("");
  const [isAlvaraFuncionamentoOk, setIsAlvaraFuncionamentoOk] = useState("");
  const [isBombeirosOk, setIsBombeirosOk] = useState("");
  const [isEpaeOk, setIsEpaeOk] = useState("");
  const [isBrigadaOk, setIsBrigadaOk] = useState("");
  const [isLaudoCompressorOk, setIsLaudoCompressorOk] = useState("");
  const [isLaudoEstanqueidadeOk, setIsLaudoEstanqueidadeOk] = useState("");
  const [isLaudoEletricaOk, setIsLaudoEletricaOk] = useState("");
  const [observations, setObservations] = useState("");

  const etanolRef = useRef(null);
  const gcRef = useRef(null);
  const ContratoSocialRef = useRef(null);
  const AlvaraFuncionamentoRef = useRef(null);
  const BombeirosRef = useRef(null);
  const EpaeRef = useRef(null);
  const BrigadaRef = useRef(null);
  const LaudoCompressorRef = useRef(null);
  const LaudoEstanqueidadeRef = useRef(null);
  const LaudoEletricaRef = useRef(null);

  const [etanolImage, setEtanolImage] = useState<File | null>(null);
  const [etanolFileName, setEtanolFileName] = useState("");

  const [gcImage, setGcImage] = useState<File | null>(null);
  const [gcFileName, setGcFileName] = useState("");

  const [contratoSocialImage, setContratoSocialImage] = useState<File | null>(
    null
  );
  const [contratoSocialFileName, setContratoSocialFileName] = useState("");

  const [alvaraFuncionamentoImage, setAlvaraFuncionamentoImage] =
    useState<File | null>(null);
  const [alvaraFuncionamentoFileName, setAlvaraFuncionamentoFileName] =
    useState("");

  const [bombeirosImage, setBombeirosImage] = useState<File | null>(null);
  const [bombeirosFileName, setBombeirosFileName] = useState("");

  const [epaeImage, setEpaeImage] = useState<File | null>(null);
  const [epaeFileName, setEpaeFileName] = useState("");

  const [brigadaImage, setBrigadaImage] = useState<File | null>(null);
  const [brigadaFileName, setBrigadaFileName] = useState("");

  const [laudoCompressorImage, setLaudoCompressorImage] = useState<File | null>(
    null
  );
  const [laudoCompressorFileName, setLaudoCompressorFileName] = useState("");

  const [laudoEstanqueidadeImage, setLaudoEstanqueidadeImage] =
    useState<File | null>(null);
  const [laudoEstanqueidadeFileName, setLaudoEstanqueidadeFileName] =
    useState("");

  const [laudoEletricaImage, setLaudoEletricaImage] = useState<File | null>(
    null
  );
  const [laudoEletricaFileName, setLaudoEletricaFileName] = useState("");

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

  const handleGcImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setGcImage(file);
      setGcFileName(file.name);
    }
  };

  const handleContratoSocialImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setContratoSocialImage(file);
      setContratoSocialFileName(file.name);
    }
  };

  const handleAlvaraFuncionamentoImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setAlvaraFuncionamentoImage(file);
      setAlvaraFuncionamentoFileName(file.name);
    }
  };

  const handleBombeirosImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setBombeirosImage(file);
      setBombeirosFileName(file.name);
    }
  };

  const handleEpaeImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setEpaeImage(file);
      setEpaeFileName(file.name);
    }
  };

  const handleBrigadaImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setBrigadaImage(file);
      setBrigadaFileName(file.name);
    }
  };

  const handleLaudoCompressorImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setLaudoCompressorImage(file);
      setLaudoCompressorFileName(file.name);
    }
  };

  const handleLaudoEstanqueidadeImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setLaudoEstanqueidadeImage(file);
      setLaudoEstanqueidadeFileName(file.name);
    }
  };

  const handleLaudoEletricaImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setLaudoEletricaImage(file);
      setLaudoEletricaFileName(file.name);
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
    else if (!isANPOk) missingField = "ANP ok?";
    else if (!isLicencaOperacaoOk)
      missingField = "Licença de Operação está ok?";
    else if (
      !etanolImage &&
      !gcImage &&
      !contratoSocialImage &&
      !alvaraFuncionamentoImage &&
      bombeirosImage &&
      !epaeImage &&
      brigadaImage &&
      !laudoCompressorImage &&
      !laudoEstanqueidadeImage &&
      !laudoEletricaImage
    )
      missingField = "Fotos do Documento";
    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);

      return;
    }

    const userName = localStorage.getItem("userName");
    // const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "SUPERVISORS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("id", "==", "documentos"),
      where("userName", "==", userName),
      where("postName", "==", postName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("A tarefa documentos já foi feita hoje!");
      setIsLoading(false);

      return;
    }

    const taskData = {
      date,
      time,
      supervisorName: userName,
      userName,
      postName,
      isANPOk,
      isLicencaOperacaoOk,
      observations,
      images: [],
      id: "documentos",
    };

    const uploadPromises = [];
    if (etanolImage) {
      const etanolPromise = uploadImageAndGetUrl(
        etanolImage,
        `supervisors/${date}/${etanolFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem do ANP",
        imageUrl,
        fileName: etanolFileName,
      }));
      uploadPromises.push(etanolPromise);
    }

    if (gcImage) {
      const gcPromise = uploadImageAndGetUrl(
        gcImage,
        `fuelTests/${date}/gc_${gcFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem da Licença de Operação",
        imageUrl,
        fileName: gcFileName,
      }));
      uploadPromises.push(gcPromise);
    }

    if (contratoSocialImage) {
      const gcPromise = uploadImageAndGetUrl(
        contratoSocialImage,
        `fuelTests/${date}/gc_${contratoSocialFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem do contrato social",
        imageUrl,
        fileName: contratoSocialFileName,
      }));
      uploadPromises.push(gcPromise);
    }

    if (alvaraFuncionamentoImage) {
      const gcPromise = uploadImageAndGetUrl(
        alvaraFuncionamentoImage,
        `fuelTests/${date}/gc_${alvaraFuncionamentoFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem do Alvará de funcionamento",
        imageUrl,
        fileName: alvaraFuncionamentoFileName,
      }));
      uploadPromises.push(gcPromise);
    }

    if (bombeirosImage) {
      const gcPromise = uploadImageAndGetUrl(
        bombeirosImage,
        `fuelTests/${date}/gc_${bombeirosFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem do Alvará dos Bombeiros",
        imageUrl,
        fileName: bombeirosFileName,
      }));
      uploadPromises.push(gcPromise);
    }

    if (epaeImage) {
      const gcPromise = uploadImageAndGetUrl(
        epaeImage,
        `fuelTests/${date}/gc_${epaeFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem do EPAE",
        imageUrl,
        fileName: epaeFileName,
      }));
      uploadPromises.push(gcPromise);
    }

    if (brigadaImage) {
      const gcPromise = uploadImageAndGetUrl(
        brigadaImage,
        `fuelTests/${date}/gc_${brigadaFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem do Brigada",
        imageUrl,
        fileName: brigadaFileName,
      }));
      uploadPromises.push(gcPromise);
    }

    if (laudoCompressorImage) {
      const gcPromise = uploadImageAndGetUrl(
        laudoCompressorImage,
        `fuelTests/${date}/gc_${laudoCompressorFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem do Laudo Compressor",
        imageUrl,
        fileName: laudoCompressorFileName,
      }));
      uploadPromises.push(gcPromise);
    }

    if (laudoEstanqueidadeImage) {
      const gcPromise = uploadImageAndGetUrl(
        laudoEstanqueidadeImage,
        `fuelTests/${date}/gc_${laudoEstanqueidadeFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem do Laudo Estanqueidade",
        imageUrl,
        fileName: laudoEstanqueidadeFileName,
      }));
      uploadPromises.push(gcPromise);
    }

    if (laudoEletricaImage) {
      const gcPromise = uploadImageAndGetUrl(
        laudoEletricaImage,
        `fuelTests/${date}/gc_${laudoEletricaFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem do Laudo Eletrica",
        imageUrl,
        fileName: laudoEletricaFileName,
      }));
      uploadPromises.push(gcPromise);
    }

    try {
      const images = await Promise.all(uploadPromises);
      // @ts-ignore
      taskData.images = images;

      const docRef = await addDoc(collection(db, "SUPERVISORS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);
      toast.success("Tarefa salva com sucesso!");
      // @ts-ignore
      router.push(`/supervisors-routine?post=${encodeURIComponent(postName)}`);
    } catch (error) {
      console.error("Erro ao salvar os dados da tarefa: ", error);
      toast.error("Erro ao salvar a medição.");
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
            <p className={styles.BudgetTitle}>Documentos</p>
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
            Informe abaixo as informações dos documentos
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
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>ANP OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isANPOk}
                    onChange={(e) => setIsANPOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem do ANP</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={etanolRef}
                    onChange={handleEtanolImageChange}
                  />
                  <button
                    // @ts-ignore
                    onClick={() =>
                      // @ts-ignore
                      etanolRef.current && etanolRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {etanolImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(etanolImage)}
                        alt="Preview do ANP"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(etanolImage)}
                      />
                      <p className={styles.fileName}>{etanolFileName}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Licença de Operação OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isLicencaOperacaoOk}
                    onChange={(e) => setIsLicencaOperacaoOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Imagem do teste da Licença de Operação
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={gcRef}
                    onChange={handleGcImageChange}
                  />
                  <button
                    // @ts-ignore
                    onClick={() => gcRef.current && gcRef.current.click()}
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {gcImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(gcImage)}
                        alt="Preview da Licença de Operaçaõ"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(gcImage)}
                      />
                      <p className={styles.fileName}>{gcFileName}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Contrato Social OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isContratoSocialOk}
                    onChange={(e) => setIsContratoSocialoOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem do Contrato Social</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={ContratoSocialRef}
                    onChange={handleContratoSocialImageChange}
                  />
                  <button
                    onClick={() =>
                      ContratoSocialRef.current &&
                      // @ts-ignore
                      ContratoSocialRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {contratoSocialImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(contratoSocialImage)}
                        alt="Preview do Contrato social"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(contratoSocialImage)}
                      />
                      <p className={styles.fileName}>
                        {contratoSocialFileName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Alvará de funcionamento OK?
                  </p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isAlvaraFuncionamentoOk}
                    onChange={(e) => setIsAlvaraFuncionamentoOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Imagem do Alvará de funcionamento
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={AlvaraFuncionamentoRef}
                    onChange={handleAlvaraFuncionamentoImageChange}
                  />
                  <button
                    onClick={() =>
                      AlvaraFuncionamentoRef.current &&
                      // @ts-ignore
                      AlvaraFuncionamentoRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {alvaraFuncionamentoImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(alvaraFuncionamentoImage)}
                        alt="Preview do Alvara de funcionamento"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        onLoad={() =>
                          // @ts-ignore
                          URL.revokeObjectURL(alvaraFuncionamentoImage)
                        }
                      />
                      <p className={styles.fileName}>
                        {alvaraFuncionamentoFileName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Bombeiros OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isBombeirosOk}
                    onChange={(e) => setIsBombeirosOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem dos Bombeiros</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={BombeirosRef}
                    onChange={handleBombeirosImageChange}
                  />
                  <button
                    onClick={() =>
                      BombeirosRef.current &&
                      // @ts-ignore
                      BombeirosRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {bombeirosImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(bombeirosImage)}
                        alt="Preview dos Bombeiros"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(bombeirosImage)}
                      />
                      <p className={styles.fileName}>{bombeirosFileName}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>EPAE OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isEpaeOk}
                    onChange={(e) => setIsEpaeOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem do EPAE</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={EpaeRef}
                    onChange={handleEpaeImageChange}
                  />
                  <button
                    onClick={() =>
                      EpaeRef.current &&
                      // @ts-ignore
                      EpaeRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {epaeImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(epaeImage)}
                        alt="Preview do EPAE"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(epaeImage)}
                      />
                      <p className={styles.fileName}>{epaeFileName}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Brigada OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isBrigadaOk}
                    onChange={(e) => setIsBrigadaOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem da Brigada</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={BrigadaRef}
                    onChange={handleBrigadaImageChange}
                  />
                  <button
                    onClick={() =>
                      BrigadaRef.current &&
                      // @ts-ignore
                      BrigadaRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {brigadaImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(brigadaImage)}
                        alt="Preview do Brigada"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(brigadaImage)}
                      />
                      <p className={styles.fileName}>{brigadaFileName}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Laudo Compressor OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isLaudoCompressorOk}
                    onChange={(e) => setIsLaudoCompressorOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Imagem do Laudo Compressor
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={LaudoCompressorRef}
                    onChange={handleLaudoCompressorImageChange}
                  />
                  <button
                    onClick={() =>
                      LaudoCompressorRef.current &&
                      // @ts-ignore
                      LaudoCompressorRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {laudoCompressorImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(laudoCompressorImage)}
                        alt="Preview do Laudo Compressor"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(laudoCompressorImage)}
                      />
                      <p className={styles.fileName}>
                        {laudoCompressorFileName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Laudo Estanqueidade OK?</p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isLaudoEstanqueidadeOk}
                    onChange={(e) => setIsLaudoEstanqueidadeOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Imagem do Laudo Estanqueidade
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={LaudoEstanqueidadeRef}
                    onChange={handleLaudoEstanqueidadeImageChange}
                  />
                  <button
                    onClick={() =>
                      LaudoEstanqueidadeRef.current &&
                      // @ts-ignore
                      LaudoEstanqueidadeRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {laudoEstanqueidadeImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(laudoEstanqueidadeImage)}
                        alt="Preview do Laudo Estanqueidade"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        onLoad={() =>
                          // @ts-ignore
                          URL.revokeObjectURL(laudoEstanqueidadeImage)
                        }
                      />
                      <p className={styles.fileName}>
                        {laudoEstanqueidadeFileName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Laudo Elétrica e Para Raio OK?
                  </p>
                  <select
                    id="isOk"
                    className={styles.SelectField}
                    value={isLaudoEletricaOk}
                    onChange={(e) => setIsLaudoEletricaOk(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Imagem do Laudo Eletrica e Para Raio
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={LaudoEletricaRef}
                    onChange={handleLaudoEletricaImageChange}
                  />
                  <button
                    onClick={() =>
                      LaudoEletricaRef.current &&
                      // @ts-ignore
                      LaudoEletricaRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {laudoEletricaImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(laudoEletricaImage)}
                        alt="Preview do Laudo Eletrica"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(laudoEletricaImage)}
                      />
                      <p className={styles.fileName}>{laudoEletricaFileName}</p>
                    </div>
                  )}
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
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
