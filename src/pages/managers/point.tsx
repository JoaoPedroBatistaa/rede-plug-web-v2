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

  const [isLoading, setIsLoading] = useState(false);
  const [isInspection, setIsInspection] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  const [date, setDate] = useState("");

  useEffect(() => {
    const storedInspection = localStorage.getItem("isInspection");
    if (storedInspection) {
      setIsInspection(storedInspection); // Recupera o valor do localStorage
    }
  }, []);

  const getLocalISODateTime = () => {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    return {
      date: date.toISOString().slice(0, 10),
      time: date.toISOString().slice(11, 19),
    };
  };

  const saveMeasurement = async () => {
    setIsLoading(true);

    const today = getLocalISODateTime();

    const userName = localStorage.getItem("userName");
    const postName = localStorage.getItem("userPost");

    const managersRef = collection(db, "MANAGERS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("userName", "==", userName),
      where("id", "==", "digital_point")
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("O ponto já foi cadastrado hoje!");
      setIsLoading(false);
      return;
    }

    if (!isInspection) {
      toast.error("Por favor, selecione se há fiscalização.");
      setIsLoading(false);
      return;
    }

    const taskData = {
      date: today.date,
      time: today.time,
      managerName: userName,
      postName,
      isInspection,
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
        where("postName", "==", postName)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        toast.error(
          "A tarefa de ponto digital já foi feita para esse turno hoje!"
        );
        setIsLoading(false);
        return;
      }

      await addDoc(collection(db, "MANAGERS"), taskData);

      toast.success("Tarefa de ponto digital salva com sucesso!");
      localStorage.removeItem("isInspection");

      router.push(`/managers`);
    } catch (error) {
      console.error("Erro ao salvar a tarefa de ponto digital: ", error);
      toast.error(
        "Erro inesperado ao salvar a tarefa. Tente novamente mais tarde."
      );
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
                <span className={styles.buttonTask}>Finalizar tarefa</span>
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
                    onChange={(e) => {
                      setIsInspection(e.target.value);
                      localStorage.setItem("isInspection", e.target.value); // Salva no localStorage
                    }}
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
