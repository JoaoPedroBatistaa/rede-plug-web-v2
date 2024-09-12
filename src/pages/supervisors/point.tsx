import HeaderNewProduct from "@/components/HeaderNewTask";
import LoadingOverlay from "@/components/Loading";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../../firebase";
import styles from "../../styles/ProductFoam.module.scss";

export default function DigitalPointTask() {
  const router = useRouter();
  const { post, shift } = router.query; // Extraindo post e shift da query
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isInspection, setIsInspection] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  // Função para pegar as coordenadas do supervisor
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

  // Função para salvar o horário local com fuso -03:00
  const getLocalISODateTime = () => {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    return {
      date: date.toISOString().slice(0, 10),
      time: date.toISOString().slice(11, 19),
    };
  };

  useEffect(() => {
    fetchCoordinates();
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const saveMeasurement = async () => {
    if (!post || !shift) {
      toast.error(
        "Posto ou turno não definido. Por favor, recarregue a página."
      );
      return;
    }

    if (!userName) {
      toast.error("Usuário não definido. Faça login novamente.");
      return;
    }

    setIsLoading(true);

    const today = getLocalISODateTime();

    if (!isInspection) {
      toast.error("Por favor, selecione se há fiscalização.");
      setIsLoading(false);
      return;
    }

    const taskData = {
      date: today.date,
      time: today.time,
      supervisorName: userName,
      postName: post, // Usando `post` em vez de `postName`
      shift, // Incluímos o turno (shift) no salvamento do documento
      isInspection,
      coordinates,
      id: "digital_point",
    };

    try {
      // Verifica se a tarefa já foi realizada hoje
      const managersRef = collection(db, "SUPERVISORS");
      const q = query(
        managersRef,
        where("date", "==", today.date),
        where("id", "==", "digital_point"),
        where("supervisorName", "==", userName),
        where("postName", "==", post), // Usando `post` em vez de `postName`
        where("shift", "==", shift) // Também verificamos se o turno já foi salvo
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        toast.error(
          "A tarefa de ponto digital já foi feita para esse turno hoje!"
        );
        setIsLoading(false);
        return;
      }

      await addDoc(collection(db, "SUPERVISORS"), taskData);
      toast.success("Tarefa de ponto digital salva com sucesso!");
      // @ts-ignore
      router.push(`/supervisors-routine?post=${encodeURIComponent(post)}`); // Usando `post` em vez de `postName`
    } catch (error) {
      console.error("Erro ao salvar a tarefa de ponto digital: ", error);
      toast.error("Erro ao salvar a tarefa.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');`}</style>
      </Head>

      <HeaderNewProduct />
      <ToastContainer />
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Ponto Digital</p>
            <div className={styles.FinishTask}>
              <button className={styles.FinishButton} onClick={saveMeasurement}>
                <span className={styles.buttonTask}>Próxima tarefa</span>
                <img
                  src="/finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Faça o registro da sua entrada no posto e informe se há fiscalização
            ocorrendo em seu turno.
          </p>

          <div className={styles.userContent}>
            <div className={styles.userData}>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Havendo fiscalização?</p>
                  <select
                    id="isInspection"
                    className={styles.SelectField}
                    value={isInspection}
                    onChange={(e) => setIsInspection(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </select>
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
