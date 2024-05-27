import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewSupervisor";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import LoadingOverlay from "@/components/Loading";

export default function NewPost() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/");
    }
  }, []);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");

  const validateForm = () => {
    const fields = [name, contact, email];

    return fields.every((field) => {
      if (typeof field === "object") {
        // @ts-ignore
        return Object.values(field).every((value) => value.trim() !== "");
      }
      return field.trim() !== "";
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    const docId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;

    try {
      // @ts-ignore
      const docRef = doc(db, "USERS", docId);

      await updateDoc(docRef, {
        name,
        contact,
        email,
        type: "supervisor",
      });

      console.log("Supervisor atualizado com ID:", docId);

      toast.success("Supervisor atualizado com sucesso!");
      router.push("/supervisors");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("Erro ao completar o registro.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const docId = Array.isArray(router.query.id)
        ? router.query.id[0]
        : router.query.id;

      console.log("Fetching data for docId:", docId); // Log para depuração

      if (docId) {
        const docRef = doc(db, "USERS", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data()); // Log para depuração
          const postData = docSnap.data();
          setName(postData.name);
          setContact(postData.contact);
          setEmail(postData.email);

          if (postData.supervisors) {
            console.log("Supervisors data:", postData.supervisors); // Log para depuração
          }
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchData();
  }, [router.query.id]);

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
            <p className={styles.BudgetTitle}>Editar supervisor</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton} onClick={handleSubmit}>
                <img
                  src="/finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Editar supervisor</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Altere abaixo as informações do supervisor
          </p>

          <div className={styles.userContent}>
            <div className={styles.userData}>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome do supervisor</p>
                  <input
                    id="name"
                    type="text"
                    className={styles.Field}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Contato</p>
                  <input
                    id="contact"
                    type="text"
                    className={styles.Field}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Email</p>
                  <input
                    id="email"
                    type="text"
                    className={styles.Field}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
