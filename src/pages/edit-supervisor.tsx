import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderEditSupervisor";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import dynamic from "next/dynamic";
import AsyncSelect from "react-select/async";
const LoadingOverlay = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});
interface PostOption {
  label: string;
  value: string;
}

interface RoutineDay {
  date: string;
  firstShift: PostOption | null;
  secondShift: PostOption | null;
}

interface WeekRoutine {
  week: RoutineDay[];
  isFromDatabase: boolean; // Agora este campo é sempre presente
}

export default function EditSupervisor() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ipAddress, setIpAddress] = useState("");
  const [editIp, setEditIp] = useState(false);
  const [posts, setPosts] = useState<PostOption[]>([]);

  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [routine, setRoutine] = useState<WeekRoutine[]>([]);

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
        const sortedPosts = data
          .map((post: any) => ({ label: post.name, value: post.id }))
          .sort((a: { label: string }, b: { label: string }) =>
            a.label.localeCompare(b.label)
          );

        setPosts(sortedPosts);
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
    try {
      const docId = Array.isArray(router.query.id)
        ? router.query.id[0]
        : (router.query.id as string);

      const docRef = doc(db, "USERS", docId);

      const updatedRoutine = routine.map((weekObj) => ({
        week: weekObj.week,
        isFromDatabase: weekObj.isFromDatabase,
      }));

      // Montando o objeto de atualização sem `IpAddress` se ele for undefined
      const updateData: any = {
        name,
        contact,
        email,
        password,
        editIp,
        routine: updatedRoutine,
      };

      // Somente adicionar IpAddress se ele estiver definido
      if (ipAddress) {
        updateData.IpAddress = ipAddress;
      }

      await updateDoc(docRef, updateData);

      toast.success("Supervisor atualizado com sucesso!");
      router.push("/supervisors");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("Erro ao completar o registro.");
    } finally {
      setIsLoading(false);
    }
  };

  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const daysUntilNextMonday = (1 + 7 - dayOfWeek) % 7;

    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    return nextMonday;
  };

  const handleAddRoutine = () => {
    const nextMonday = getNextMonday();
    const newWeek: RoutineDay[] = [];

    for (let i = 0; i < 6; i++) {
      const day = new Date(nextMonday);
      day.setDate(nextMonday.getDate() + i);
      if (day.getDay() !== 0) {
        newWeek.push({
          date: day.toISOString().split("T")[0],
          firstShift: null,
          secondShift: null,
        });
      }
    }

    const newRoutine: WeekRoutine = { week: newWeek, isFromDatabase: false };
    setRoutine((prevRoutine) => [...prevRoutine, newRoutine]);

    console.log("Nova rotina adicionada:", newRoutine);
  };

  const handleRoutineChange = (
    dayIndex: number,
    shift: "firstShift" | "secondShift",
    value: PostOption | null
  ) => {
    const updatedRoutine = [...routine];

    // Identifica o índice da última semana (maior índice)
    const lastWeekIndex = updatedRoutine.length - 1;

    console.log("Tentando alterar a última rotina", {
      dayIndex,
      shift,
      value,
      lastWeekIndex,
    });

    // Atualiza o turno na última semana
    updatedRoutine[lastWeekIndex].week[dayIndex][shift] = value;
    console.log("Última semana atualizada:", updatedRoutine);

    setRoutine(updatedRoutine);
  };

  const renderRoutine = () => {
    const daysOfWeek = [
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    return routine
      .filter((weekObj) => !weekObj.isFromDatabase)
      .map((weekObj, weekIndex) => (
        <div key={weekIndex} className={styles.week}>
          {Array.isArray(weekObj.week) &&
            weekObj.week.map((day, dayIndex) => {
              const dayDate = new Date(day.date + "T00:00:00-03:00");
              const formattedDate = dayDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              const dayName = daysOfWeek[dayIndex];

              return (
                <div key={dayIndex} className={styles.day}>
                  <p className={styles.dayTitle}>
                    {`${dayName} - ${formattedDate}`}
                  </p>
                  <div className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>
                        Primeiro turno (8h-14h)
                      </p>
                      <AsyncSelect
                        cacheOptions
                        loadOptions={loadOptions}
                        defaultOptions={posts}
                        value={day.firstShift}
                        onChange={(selectedOption) =>
                          handleRoutineChange(
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
                      <p className={styles.FieldLabel}>
                        Segundo turno (14h-22h)
                      </p>
                      <AsyncSelect
                        cacheOptions
                        loadOptions={loadOptions}
                        defaultOptions={posts}
                        value={day.secondShift}
                        onChange={(selectedOption) =>
                          handleRoutineChange(
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

  const renderExistingRoutine = () => {
    const daysOfWeek = [
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    // Filtra apenas a última rotina do banco de dados (a última com isFromDatabase como true)
    const lastDatabaseRoutine = routine
      .filter((weekObj) => weekObj.isFromDatabase)
      .slice(-1); // Pega apenas o último elemento

    return lastDatabaseRoutine.map((weekObj, weekIndex) => (
      <div key={weekIndex} className={styles.week}>
        {Array.isArray(weekObj.week) &&
          weekObj.week.map((day, dayIndex) => {
            const dayDate = new Date(day.date + "T00:00:00-03:00");
            const formattedDate = dayDate.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            const dayName = daysOfWeek[dayIndex];

            return (
              <div key={dayIndex} className={styles.day}>
                <p className={styles.dayTitle}>
                  {`${dayName} - ${formattedDate}`}
                </p>
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
                          dayIndex,
                          "firstShift",
                          selectedOption
                        )
                      }
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
                          dayIndex,
                          "secondShift",
                          selectedOption
                        )
                      }
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
          setIpAddress(postData.ipAddress);

          // Certifique-se de que as rotinas estão sendo corretamente carregadas
          if (postData.routine) {
            const existingRoutines = postData.routine.map((routine: any) => ({
              week: routine.week,
              isFromDatabase: true, // Define que essas rotinas vêm do banco de dados
            }));

            console.log("Rotinas existentes carregadas:", existingRoutines);
            setRoutine(existingRoutines); // Armazena as rotinas no estado
          }
        }
      }
    };

    fetchData();
  }, [router.query.id]);

  const handleEnableNewDevice = () => {
    setEditIp(true);
  };

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
              <button className={styles.editButton} onClick={handleSubmit}>
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
            <p className={styles.BudgetTitle}>Dispositivo do supervisor</p>
          </div>

          <p className={styles.Notes}>
            Veja abaixo o endereço IP do dispositivo validado do supervisor no
            sistema e se desejar habilite a vaidação de um novo dispositivo
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Endereço IP cadastrado</p>
              <input
                type="text"
                value={ipAddress}
                className={styles.Field}
                disabled
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Habilitar novo dispositivo</p>
              <button
                className={styles.locationButton}
                onClick={handleEnableNewDevice}
              >
                {editIp
                  ? "Habilitado novo cadastro"
                  : "Habilitar novo cadastro"}
              </button>
            </div>
          </div>

          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Produtividade do supervisor</p>
          </div>

          <p className={styles.Notes}>
            Clique abaixo para que possa ver o relatório de produtividade do
            supervisor com base nas tarefas atribuidas a ele na programação
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <button
                className={styles.locationButton}
                onClick={() =>
                  router.push(`/supervisor-productivity?id=${router.query.id}`)
                }
              >
                Ver produtividade
              </button>
            </div>
          </div>

          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Programação</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.editButton} onClick={handleAddRoutine}>
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
          {renderExistingRoutine()}

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
