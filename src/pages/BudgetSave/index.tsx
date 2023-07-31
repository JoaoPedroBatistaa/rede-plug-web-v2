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
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function BudgetSave() {
  const router = useRouter();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [Telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const handleInputChange = () => {
    const nomeCompleto = (document.getElementById('nomeCompleto') as HTMLInputElement).value;
    const Telefone = (document.getElementById('Telefone') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;

    setNomeCompleto(nomeCompleto);
    localStorage.setItem("nomeCompleto", nomeCompleto);

    setTelefone(Telefone);
    localStorage.setItem("Telefone", Telefone);

    setEmail(email);
    localStorage.setItem("email", email);
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
      // Recuperar o documento "NumeroDoOrçamento" na coleção "Budgets"
      const numeroDoOrcamentoRef = doc(db, "Budget", "NumeroDoOrçamento");
      const numeroDoOrcamentoSnap = await getDoc(numeroDoOrcamentoRef);

      if (numeroDoOrcamentoSnap.exists()) {
        // Recuperar o valor atual do campo "numero"
        const numeroAtual = numeroDoOrcamentoSnap.data().numero;

        // Incrementar o valor atual para obter o "NumeroPedido" para o novo orçamento
        const NumeroPedido = Number(numeroAtual) + 1;

        // Adicionar o novo orçamento
        await addDoc(collection(db, "Budget"), {
          nomeCompleto,
          Telefone,
          email,
          dataCadastro,
          budgets,
          valorTotal,
          NumeroPedido,  // Aqui está o novo campo
        });

        // Incrementar o valor do campo "numero" no documento "NumeroDoOrcamento"
        await updateDoc(numeroDoOrcamentoRef, {
          numero: NumeroPedido
        });

        toast.success("Salvo com sucesso!");

        setTimeout(() => {
          window.location.href = "/BudgetFinish";
        }, 500);
      } else {
        console.error("Erro: documento 'NumeroDoOrçamento' não existe na coleção 'Budgets'");
      }
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
