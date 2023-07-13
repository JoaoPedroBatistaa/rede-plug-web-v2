import Head from "next/head";
import styles from "../../styles/Login.module.scss";
import Link from "next/link";

import { collection, db, getDoc, doc } from "../../../firebase";
import UserContext from '../../../UserContext';
import { GetServerSidePropsContext } from "next";
import { getDocs } from "firebase/firestore";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from "react";

interface Login {
  id: string;
  Login: string;

  Senha: string;
}

interface UserContextType {
  user: Login| null;
  setUser: React.Dispatch<React.SetStateAction<Login | null>>;
}


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [teste, setTeste] = useState<Login[]>([]);
  const { setUser } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, "Login");
      const loginSnapshot = await getDocs(dbCollection);
      const loginList = loginSnapshot.docs.map((doc) => {
        const data = doc.data();
        const login: Login = {
          id: doc.id,
          Login: data.Login,
          Senha: data.Senha,
        };
        return login;
      });
      setTeste(loginList);
      console.log(loginList);
    };
    fetchData();
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    const user = teste.find(
      (user) => user.Login === email && user.Senha === password
    );

    if (user) {
      setUser(user);
      router.push("/Home");
    } else {
      setError("Email ou senha incorretos");
    }
  };

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div className={styles.Container}>
        <div className={styles.ImageContainer}>
          <img className={styles.logo} src="/logo.png" alt="logo" />
          <div className={styles.Social}>
            <img src="/facebook.png" alt="aaa" />
            <img src="instagram.png" alt="aaa" />
            <img src="twitter.png" alt="aa" />
          </div>
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

            <a className={styles.forget} href="">
              Esqueci minha senha
            </a>

            {error && <p className={styles.erro}>{error}</p>}

            <button className={styles.button} onClick={handleLogin}>
              Entrar
            </button>

            <div className={styles.linha}></div>

            <div className={styles.sign}>
              <p className={styles.signNew}>Ainda não tem uma conta? </p>
              <a className={styles.create} href="">
                Criar
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}