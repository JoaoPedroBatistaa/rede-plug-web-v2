import Head from "next/head";
import styles from "../styles/Login.module.scss";

import { getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { collection, db } from "../../firebase";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UserType = "manager" | "supervisor" | "post" | "default";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  type: string;
  postName: string;
  posts: any;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, "USERS");
      const userSnapshot = await getDocs(dbCollection);
      const userList = userSnapshot.docs.map((doc) => {
        const data = doc.data();
        const user: User = {
          id: doc.id,
          name: data.name,
          email: data.email,
          password: data.password,
          type: data.type,
          postName: data.postName,
          posts: data.posts,
        };
        return user;
      });
      setUsers(userList);
    };
    fetchData();
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user } = data;

        const now = new Date();
        const date = now
          .toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })
          .split("/")
          .reverse()
          .join("-");
        const time = now.toLocaleTimeString("pt-BR", {
          hour12: false,
          timeZone: "America/Sao_Paulo",
        });

        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userType", user.type);
        localStorage.setItem("userPost", user.postName);
        localStorage.setItem("posts", JSON.stringify(user.posts));
        localStorage.setItem("loginDate", date);
        localStorage.setItem("loginTime", time);

        toast.success("Login realizado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        if (user.type === "manager") {
          setTimeout(() => {
            router.push("/managers");
          }, 2000);
        } else if (user.type === "supervisor") {
          setTimeout(() => {
            router.push("/supervisors-home");
          }, 2000);
        } else if (user.type === "post") {
          setTimeout(() => {
            router.push("/attendants");
          }, 2000);
        } else {
          setTimeout(() => {
            router.push("/home");
          }, 2000);
        }
      } else {
        setError(data.message || "Email ou senha incorretos");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <title>Rede Postos</title>
      </Head>

      <ToastContainer></ToastContainer>

      <div className={styles.Container}>
        <div className={styles.ImageContainer}>
          <div className={styles.Social}></div>
        </div>
        <div className={styles.LoginContainer}>
          <div className={styles.Login}>
            <p className={styles.title}>Login</p>
            <p className={styles.subtitle}>Informe seu acesso para entrar</p>

            <p className={styles.label}>Email</p>
            <input
              id="email"
              className={styles.field}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <p className={styles.label}>Senha</p>
            <input
              id="senha"
              className={styles.field}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className={styles.erro}>{error}</p>}

            <button className={styles.button} onClick={handleLogin}>
              Entrar
            </button>

            <div className={styles.linha}></div>
          </div>
        </div>
      </div>
    </>
  );
}
