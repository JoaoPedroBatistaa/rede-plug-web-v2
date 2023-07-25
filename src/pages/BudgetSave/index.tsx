import Head from "next/head";
import styles from "../../styles/BudgetSave.module.scss";
import { useRouter } from "next/router";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, useState, useEffect } from "react";
import Link from "next/link";
import MaskedInput from "react-input-mask";

import { db, addDoc, collection } from "../../../firebase";

import { ToastContainer, toast } from "react-toastify";
import { createSourceMapSource } from "typescript";
import "react-toastify/dist/ReactToastify.css";

import { useMenu } from "../../components/Context/context";
import classnames from "classnames";

export default function BudgetSave() {
  const router = useRouter();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [Telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === "nomeCompleto") {
      setNomeCompleto(value);
      localStorage.setItem("nomeCompleto", nomeCompleto);
    } else if (id === "Telefone") {
      setTelefone(value);
      localStorage.setItem("Telefone", Telefone);
    } else if (id === "email") {
      setEmail(value);
      localStorage.setItem("email", email);
    }
  };

  let valorTotal: string | null;

  if (typeof window !== "undefined") {
    valorTotal = localStorage.getItem("grandTotal");
  }

  const formatarData = (data: Date) => {
    const dia = data.getDate();
    const mes = data.getMonth() + 1; // Os meses começam do 0 em JavaScript
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  const dataCadastroInicial = new Date();
  const EntregaInicial = new Date();
  EntregaInicial.setDate(dataCadastroInicial.getDate() + 5);

  const dataCadastro = formatarData(dataCadastroInicial);
  const Entrega = formatarData(EntregaInicial);

  const Ativo = true;

  const [budgets, setBudgets] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localBudgets = localStorage.getItem('budgets');
      if (localBudgets) {
        const budgetsObject = JSON.parse(localBudgets);
        const budgetsArray = Object.values(budgetsObject);
        setBudgets(budgetsArray);
      }
    }
  }, []);



  const handleSaveBudget = async () => {
    try {
      await addDoc(collection(db, "Budget"), {
        nomeCompleto,
        Telefone,
        email,
        dataCadastro,
        budgets,
        valorTotal
      });

      toast.success("Salvo com sucesso!");

      setTimeout(() => {
        window.location.href = "/BudgetFinish";
      }, 500);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

  const { openMenu, setOpenMenu } = useMenu();
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

      <HeaderBudget></HeaderBudget>
      <div className={styles.Container} onClick={handleOpenMenuDiv}>
        <ToastContainer />
        <SideMenuBudget activeRoute={router.pathname}></SideMenuBudget>

        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Salvar Orçamento</p>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Nome completo</p>
              <input
                id="nomeCompleto"
                type="text"
                className={styles.FieldSave}
                placeholder=""
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.InputField}>
            <p className={styles.FieldLabel}>Telefone</p>
            <MaskedInput
              id="Telefone"
              type="tel"
              className={styles.FieldSave}
              mask="(99) 99999-9999" // Exemplo de máscara para telefone
              placeholder=""
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Email</p>
              <input
                id="email"
                type="mail"
                className={styles.FieldSave}
                placeholder=""
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.linhaSave}></div>

          <div className={styles.ButtonsFinish}>
            <Link href="Budgets">
              <button className={styles.CancelButton}>Cancelar</button>
            </Link>

            <button className={styles.SaveButton} onClick={handleSaveBudget}>
              Salvar Orçamento
            </button>
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
