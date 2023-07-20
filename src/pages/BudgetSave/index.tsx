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
  const [obs, setObs] = useState("");


  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === "nomeCompleto") {
      setNomeCompleto(value);
    } else if (id === "Telefone") {
      setTelefone(value);
    } else if (id === "email") {
      setEmail(value);
    }
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    if (id === "obs") {
      setObs(value);
    }
  };


  const [precoTotal, setPrecoTotal] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => { // Salve o ID do intervalo para limpar mais tarde
      if (typeof window !== "undefined") {
        const valorPerfil = Number(localStorage.getItem("valorPerfil"));
        const valorFoam = Number(localStorage.getItem("valorFoam"));
        const valorVidro = Number(localStorage.getItem("valorVidro"));
        const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
        const valorImpressao = Number(localStorage.getItem("valorImpressao"));
        const valorColagem = Number(localStorage.getItem("valorColagem"));

        setPrecoTotal(valorPaspatur + valorPerfil + valorFoam + valorVidro + valorImpressao)
      }
    }, 200); // Tempo do intervalo em milissegundos

    return () => clearInterval(intervalId); // Limpe o intervalo quando o componente for desmontado
  }, []);


  let instalacao: string | null;
  let valorInstalacao: string | null;
  let tipoEntrega: string | null;
  let valorEntrega: string | null;
  let impressao: string | null;
  let tipoImpressao: string | null;
  let fileInput: string | null;
  let collage: string | null;
  let paspatur: string | null;
  let codigoPaspatur: string | null;
  let dimensoesPaspatur: string | null;
  let foam: string | null;
  let codigoFoam: string | null;
  let mdf: string | null;
  let codigoMdf: string | null;
  let vidro: string | null;
  let espessuraVidro: string | null;
  let espelho: string | null;
  let espessuraEspelho: string | null;
  let codigoPerfil: string | null;
  let espessuraPerfil: string | null;
  let Tamanho: string | null;
  let tipoPessoa: string | null;
  let valorTotal: string | null;




  valorTotal = precoTotal.toString();
  console.log("valor total --> ", valorTotal)


  if (typeof window !== "undefined") {
    instalacao = localStorage.getItem("instalacao");
    valorInstalacao = localStorage.getItem("valorInstalacao");
    tipoEntrega = localStorage.getItem("tipoEntrega");
    valorEntrega = localStorage.getItem("valorEntrega");
    impressao = localStorage.getItem("impressao");
    tipoImpressao = localStorage.getItem("tipoImpressao");
    fileInput = localStorage.getItem("fileInput");
    collage = localStorage.getItem("collage");
    paspatur = localStorage.getItem("paspatur");
    codigoPaspatur = localStorage.getItem("codigoPaspatur");
    dimensoesPaspatur = localStorage.getItem("dimensoesPaspatur");
    foam = localStorage.getItem("foam");
    codigoFoam = localStorage.getItem("codigoFoam");
    mdf = localStorage.getItem("mdf");
    codigoMdf = localStorage.getItem("codigoMdf");
    vidro = localStorage.getItem("vidro");
    espessuraVidro = localStorage.getItem("espessuraVidro");
    espelho = localStorage.getItem("espelho");
    espessuraEspelho = localStorage.getItem("espessuraEspelho");
    codigoPerfil = localStorage.getItem("codigoPerfil");
    espessuraPerfil = localStorage.getItem("espessuraPerfil");
    Tamanho = localStorage.getItem("Tamanho");
    tipoPessoa = localStorage.getItem("tipoPessoa");

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



  const handleSaveBudget = async () => {
    try {
      await addDoc(collection(db, "Budget"), {
        nomeCompleto,
        Telefone,
        email,
        instalacao,
        valorInstalacao,
        tipoEntrega,
        valorEntrega,
        impressao,
        tipoImpressao,
        fileInput,
        collage,
        paspatur,
        codigoPaspatur,
        dimensoesPaspatur,
        foam,
        codigoFoam,
        mdf,
        codigoMdf,
        vidro,
        espessuraVidro,
        espelho,
        espessuraEspelho,
        codigoPerfil,
        espessuraPerfil,
        Tamanho,
        dataCadastro,
        Entrega,
        Ativo,
        valorTotal,
        obs
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

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Observações</p>
              <textarea
                id="obs"
                className={styles.FieldSave}
                placeholder=""
                onChange={handleTextAreaChange}
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
