import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewUser";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUserToLogin } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

export default function AddUser() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const { openMenu, setOpenMenu } = useMenu();

  const [Nome, setNome] = useState("");
  const [Login, setLogin] = useState<string | null>(null);
  const [NomeEmpresa, setNomeEmpresa] = useState<string | null>(null);
  const [Tipo, setTipo] = useState<string | null>(null);
  const [Senha, setSenha] = useState<string | null>(null);

  const handleButtonFinish = async (event: any) => {
    event.preventDefault();

    let userId = localStorage.getItem("userId");

    const foam = {
      Nome,
      Login,
      NomeEmpresa,
      Tipo,
      Senha,
    };

    // Verificações para cada variável do objeto foam
    if (!Nome) {
      toast.error("Por favor, insira o nome.");
      return;
    }

    if (!Login) {
      toast.error("Por favor, insira o login.");
      return;
    }

    if (!NomeEmpresa) {
      toast.error("Por favor, insira o nome da empresa.");
      return;
    }

    if (!Tipo) {
      toast.error("Por favor, selecione o tipo.");
      return;
    }

    if (!Senha) {
      toast.error("Por favor, insira a senha.");
      return;
    }

    try {
      // Substitua 'id_do_login' pelo id do login onde você quer adicionar o paspatur
      await addUserToLogin(foam, userId);
      toast.success("Usuário Cadastrado!");
    } catch (e) {
      toast.error("Erro ao cadastrar usuário.");
    }

    setTimeout(() => {
      router.push("/Users");
    }, 500);
  };

  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 100);
  };

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
      <div className={styles.Container} onClick={handleOpenMenuDiv}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Usuário</p>
            <div className={styles.BudgetHeadS}>
              <button
                className={styles.FinishButton}
                onClick={handleButtonFinish}
              >
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Cadastrar usuário</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as credencias do novo Usuário
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Nome completo</p>
              <input
                id="margemLucro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Nome da empresa</p>
              <input
                id="margemLucro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setNomeEmpresa(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Email</p>
              <input
                id="valorMetro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Tipo de usuário</p>
              <select
                id="valorPerda"
                className={styles.SelectField}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="" disabled selected>
                  Selecione o tipo de usuário
                </option>
                <option value="admin">admin</option>
                <option value="vendedor">vendedor</option>
              </select>
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Senha</p>
              <input
                id="valorMetro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Total Maxx 2023, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
