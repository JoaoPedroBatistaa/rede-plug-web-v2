import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderEditSupervisor";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import AsyncSelect from "react-select/async";

import dynamic from "next/dynamic";
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
  const [supervisorPosts, setSupervisorPosts] = useState<PostOption[]>([]);

  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [routine, setRoutine] = useState<WeekRoutine[]>([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const handleAddPost = (selectedPost: PostOption | null) => {
    if (
      selectedPost &&
      !supervisorPosts.some((p) => p.value === selectedPost.value)
    ) {
      setSupervisorPosts([...supervisorPosts, selectedPost]);
    }
  };

  const handleRemovePost = (postId: string) => {
    setSupervisorPosts(supervisorPosts.filter((post) => post.value !== postId));
  };

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
        postsAvailable: supervisorPosts,
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
          setSupervisorPosts(postData.postsAvailable);
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
            <p className={styles.BudgetTitle}>Postos do supervisor</p>
          </div>

          <div className={styles.InputContainerPost}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Selecione um Posto</p>
              <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions={posts}
                onChange={handleAddPost}
                placeholder="Selecione um posto"
              />
            </div>
          </div>

          <div className={styles.postList}>
            {supervisorPosts.map((post) => (
              <div key={post.value} className={styles.postItem}>
                <p>{post.label}</p>
                <button
                  className={styles.editButton}
                  onClick={() => handleRemovePost(post.value)}
                >
                  Remover
                </button>
              </div>
            ))}
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
