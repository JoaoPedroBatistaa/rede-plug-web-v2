import Head from "next/head";
import styles from "../styles/Login.module.scss";

import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

import FingerprintJS from "@fingerprintjs/fingerprintjs"; // Importa a biblioteca FingerprintJS
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingOverlay from "@/components/Loading";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fingerprintId, setFingerprintId] = useState<string | null>(null); // Armazena o fingerprintId
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Função para gerar o FingerprintID
    const fetchFingerprintId = async () => {
      const fp = await FingerprintJS.load(); // Inicializa o FingerprintJS
      const result = await fp.get(); // Obtém o fingerprintId
      setFingerprintId(result.visitorId); // Armazena o fingerprintId no estado
      console.log("Fingerprint ID:", result.visitorId); // Log do fingerprintId para depuração
    };

    fetchFingerprintId();
  }, []);

  // Função para limpar o cache e recarregar a página
  const handleRefresh = () => {
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        // Após limpar o cache, atualiza a data e hora no localStorage
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

        // Recarrega a página para garantir que a nova versão esteja carregada
        window.location.reload(); // true força o recarregamento do cache do servidor
      })
      .catch((error) => {
        console.error("Erro ao limpar o cache:", error);
      });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (!fingerprintId) {
      toast.error("Erro ao gerar Fingerprint. Tente novamente.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);

      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fingerprintId }), // Envia o fingerprintId junto com o email e senha
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

        // Salva os dados corretamente no localStorage
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userType", user.type);
        localStorage.setItem("userPost", user.postName || ""); // Adiciona verificação para postName
        localStorage.setItem("posts", JSON.stringify(user.posts || [])); // Verifica se posts está definido
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

        setIsLoading(false);

        // Redirecionamento baseado no tipo de usuário e refresh após login
        setTimeout(() => {
          if (user.type === "manager") {
            router.push("/").then(() => handleRefresh()); // Chama handleRefresh após redirecionar
          } else if (user.type === "supervisor") {
            router.push("/supervisors-home").then(() => handleRefresh()); // Chama handleRefresh após redirecionar
          } else if (user.type === "post") {
            router.push("/").then(() => handleRefresh()); // Chama handleRefresh após redirecionar
          } else {
            router.push("/home").then(() => handleRefresh()); // Chama handleRefresh após redirecionar
          }
        }, 2000);
      } else {
        // Exibe mensagens personalizadas para diferentes tipos de erro
        if (response.status === 403) {
          setError(
            "Dispositivo não autorizado. Verifique com o administrador."
          );
          setIsLoading(false);
        } else {
          setError(data.message || "Email ou senha incorretos");
          setIsLoading(false);
        }

        toast.error(data.message || "Erro ao fazer login.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsLoading(false);
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor");
      toast.error("Erro ao conectar com o servidor.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
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

      <LoadingOverlay isLoading={isLoading} />

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
