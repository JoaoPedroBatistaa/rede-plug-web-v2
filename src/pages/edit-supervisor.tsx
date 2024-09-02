import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderEditSupervisor";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import LoadingOverlay from "@/components/Loading";
import AsyncSelect from "react-select/async";

interface PostOption {
  label: string;
  value: string;
}

interface RoutineDay {
  date: string;
  firstShift: PostOption | null;
  secondShift: PostOption | null;
}

export default function EditSupervisor() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [posts, setPosts] = useState<PostOption[]>([]);

  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [routine, setRoutine] = useState<RoutineDay[][]>([]);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIpAddress();
  }, []);

  useEffect(() => {
    const checkLoginDuration = () => {
      const storedDate = localStorage.getItem("loginDate");
      const storedTime = localStorage.getItem("loginTime");

      if (storedDate && storedTime) {
        const storedDateTime = new Date(`${storedDate}T${storedTime}`);
        const now = new Date();
        const maxLoginDuration = 6 * 60 * 60 * 1000;

        if (now.getTime() - storedDateTime.getTime() > maxLoginDuration) {
          localStorage.clear();
          alert("Sua sessão expirou. Por favor, faça login novamente.");
          window.location.href = "/";
        }
      }
    };

    checkLoginDuration();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(
          data.map((post: any) => ({ label: post.name, value: post.id }))
        );
      } catch (error) {
        console.error("Erro ao buscar postos:", error);
      }
    };

    fetchPosts();
  }, []);

  const filterPosts = (inputValue: string) => {
    return posts.filter((post) =>
      post.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: PostOption[]) => void
  ) => {
    callback(filterPosts(inputValue));
  };

  const validateForm = () => {
    const fields = [name, contact, email, password];
    return fields.every((field) => field.trim() !== "");
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
      : (router.query.id as string);

    try {
      const docRef = doc(db, "USERS", docId);

      // Flattening da rotina: transforma o array aninhado em uma lista plana de objetos
      const flattenedRoutine = routine.flatMap((week, weekIndex) =>
        week.map((day, dayIndex) => ({
          ...day,
          weekIndex,
          dayIndex,
        }))
      );

      await updateDoc(docRef, {
        name,
        contact,
        email,
        password,
        type: "supervisor",
        ipAddress,
        routine: flattenedRoutine, // Substitua a rotina aninhada pela versão "achatada"
      });

      toast.success("Supervisor atualizado com sucesso!");
      router.push("/supervisors");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("Erro ao completar o registro.");
      setIsLoading(false);
    }
  };

  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Domingo) a 6 (Sábado)
    console.log(
      "Hoje é:",
      today.toLocaleDateString("pt-BR"),
      "Dia da semana:",
      dayOfWeek
    );

    const daysUntilNextMonday = (1 + 7 - dayOfWeek) % 7;
    console.log("Dias até a próxima segunda-feira:", daysUntilNextMonday);

    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    console.log(
      "Próxima segunda-feira será em:",
      nextMonday.toLocaleDateString("pt-BR")
    );

    return nextMonday;
  };

  const handleAddRoutine = () => {
    const nextMonday = getNextMonday();
    const newWeek: RoutineDay[] = [];

    console.log(
      "Iniciando a criação da semana, começando na segunda-feira:",
      nextMonday.toLocaleDateString("pt-BR")
    );

    for (let i = 0; i < 6; i++) {
      const day = new Date(nextMonday);
      day.setDate(nextMonday.getDate() + i);

      // Inclui os dias de segunda (1) a sábado (6)
      if (day.getDay() !== 0) {
        newWeek.push({
          date: day.toISOString().split("T")[0],
          firstShift: null,
          secondShift: null,
        });
        console.log(
          "Dia adicionado à rotina:",
          day.toLocaleDateString("pt-BR"),
          "Dia da semana:",
          day.getDay()
        );
      }
    }

    setRoutine([...routine, newWeek]);
    console.log("Rotina finalizada:", newWeek);
  };

  const handleRoutineChange = (
    weekIndex: number,
    dayIndex: number,
    shift: "firstShift" | "secondShift",
    value: PostOption | null
  ) => {
    const updatedRoutine = [...routine];
    updatedRoutine[weekIndex][dayIndex][shift] = value;
    setRoutine(updatedRoutine);
  };

  const renderRoutine = () => {
    return routine.map((week, weekIndex) => (
      <div key={weekIndex} className={styles.week}>
        {week.map((day, dayIndex) => {
          const dayDate = new Date(day.date);
          const formattedDate = dayDate.toISOString().split("T")[0]; // Formato ISO da data

          console.log(
            "Renderizando dia:",
            formattedDate, // Mostra a data no formato ISO
            "Data:",
            day.date,
            "Dia da semana:",
            dayDate.getDay()
          );

          // Renderize apenas os dias, sem considerar o nome do dia da semana
          return (
            <div key={dayIndex} className={styles.day}>
              <p className={styles.dayTitle}>{formattedDate}</p>{" "}
              {/* Exibe a data no formato ISO */}
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Primeiro turno (8h-14h)</p>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptions}
                    defaultOptions={posts}
                    value={day.firstShift}
                    onChange={(selectedOption) =>
                      handleRoutineChange(
                        weekIndex,
                        dayIndex,
                        "firstShift",
                        selectedOption
                      )
                    }
                    placeholder="Selecione o posto"
                    className={styles.SelectFieldSearch}
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Segundo turno (14h-22h)</p>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptions}
                    defaultOptions={posts}
                    value={day.secondShift}
                    onChange={(selectedOption) =>
                      handleRoutineChange(
                        weekIndex,
                        dayIndex,
                        "secondShift",
                        selectedOption
                      )
                    }
                    placeholder="Selecione o posto"
                    className={styles.SelectFieldSearch}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      const docId = Array.isArray(router.query.id)
        ? router.query.id[0]
        : (router.query.id as string);

      if (docId) {
        const docRef = doc(db, "USERS", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = docSnap.data();
          setName(postData.name);
          setContact(postData.contact);
          setEmail(postData.email);
          setPassword(postData.password);

          if (postData.routine) {
            setRoutine(postData.routine);
          }
        }
      }
    };

    fetchData();
  }, [router.query.id]);

  return (
    <>
      <Head>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
`}</style>
      </Head>

      <HeaderNewProduct />
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

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Senha de acesso</p>
                  <input
                    id="password"
                    type="text"
                    className={styles.Field}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Programação</p>
            <div className={styles.BudgetHeadS}>
              <button
                className={styles.FinishButton}
                onClick={handleAddRoutine}
              >
                <img
                  src="/plus.png"
                  alt="Adicionar rotina"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Nova rotina</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Altere abaixo as rotinas do supervisor, para definir em qual posto
            ele deverá atuar em determinada data/turno
          </p>

          {renderRoutine()}

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
