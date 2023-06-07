import Head from "next/head";
import styles from "../../styles/BudgetFinish.module.scss";
import { useRouter } from "next/router";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import MaskedInput from "react-input-mask";
import { db, addDoc, collection } from "../../../firebase";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function BudgetFinish() {
  const router = useRouter();

  let nomeCompleto: string | null;
  let Telefone: string | null;
  let email: string | null;
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

  if (typeof window !== "undefined") {
    nomeCompleto = localStorage.getItem("nomeCompleto");
    Telefone = localStorage.getItem("Telefone");
    email = localStorage.getItem("email");
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

  const Ativo = true;
  const valorTotal = "99,99";

  const handleSaveOrder = async () => {
    if (
      !nomeCompleto ||
      !Telefone ||
      !email ||
      !cpf ||
      !endereco ||
      !cidade ||
      !bairro ||
      !cep
    ) {
      // Se algum campo estiver vazio, exiba uma mensagem para preencher todos os dados

      console.log(cep);
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await addDoc(collection(db, "Orders"), {
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
        cpf,
        endereco,
        cidade,
        bairro,
        cep,
        complemento,
        tipoPessoa,
        Ativo,
        valorTotal
      });
      toast.success("Pedido enviado!");
      setTimeout(() => {
        window.location.href = "/Home";
      }, 500);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

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

  const [selectedOption, setSelectedOption] = useState("opcao1");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("tipoPessoa", selectedOption);
  };

  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  useEffect(() => {
    localStorage.setItem("cpf", cpf);
    localStorage.setItem("endereco", endereco);
    localStorage.setItem("numero", numero);
    localStorage.setItem("cep", cep);
    localStorage.setItem("estado", estado);
    localStorage.setItem("complemento", complemento);
    localStorage.setItem("bairro", bairro);
    localStorage.setItem("cidade", cidade);
  }, [cpf, endereco, numero, cep, estado, complemento, bairro, cidade]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case "CPF":
        setCpf(event.target.value);
        break;
      case "Endereco":
        setEndereco(event.target.value);
        break;
      case "Numero":
        setNumero(event.target.value);
        console.log(numero);

        break;
      case "CEP":
        setCep(event.target.value);
        break;
      case "estado":
        setEstado(event.target.value);
        break;
      case "Complemento":
        setComplemento(event.target.value);
        console.log(complemento);
        break;
      case "Bairro":
        setBairro(event.target.value);
        break;
      case "Cidade":
        setCidade(event.target.value);
        break;
    }
  };
  const checkCep = (event: any) => {
    const cep = event.target.value.replace(/\D/g, "");
    console.log(cep);

    const cepLength: number = cep.length;

    if (cepLength === 8 && cep.trim() !== "") {
      fetch(`https://viacep.com.br/ws/${cep}/json/`).then((response) =>
        response
          .json()
          .then((data) => {
            console.log(data);
            setCep(cep);
            console.log(cep);
          })
          .catch((err) => {
            alert("Digite o CEP!");
          })
      );
    }
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
      <ToastContainer />
      <div className={styles.Container}>
        <SideMenuBudget activeRoute={router.pathname}></SideMenuBudget>

        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Efetivar Pedido</p>
          </div>

          <div className={styles.BudgetData}>
            <div className={styles.PessoalData}>
              <p className={styles.BudgetSubTitle}>Dados pessoais</p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Tipo de pessoa</p>
                  <select
                    className={styles.SelectFieldPerson}
                    value={selectedOption}
                    onChange={handleSelectChange}
                  >
                    <option
                      value="FÍSICA"
                      selected={selectedOption === "FÍSICA"}
                    >
                      FÍSICA
                    </option>
                    <option
                      value="JURÍDICA"
                      selected={selectedOption === "JURÍDICA"}
                    >
                      JURÍDICA
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome completo</p>
                  <input
                    type="text"
                    className={styles.FieldSave}
                    placeholder=""
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>CPF</p>
                  <MaskedInput
                    mask="999.999.999-99"
                    id="CPF"
                    type="text"
                    className={styles.FieldSave}
                    placeholder=""
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Telefone</p>
                  <MaskedInput
                    id="Telefone"
                    type="tel"
                    className={styles.FieldSave}
                    mask="(99) 99999-9999" // máscara para telefone
                    placeholder=""
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Email</p>
                  <input
                    type="mail"
                    className={styles.FieldSave}
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            <div className={styles.linhaData}></div>

            <div className={styles.AdressData}>
              <p className={styles.BudgetSubTitle}>Endereço</p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>CEP</p>
                  <input
                    id="CEP"
                    type="text"
                    className={styles.FieldSmall}
                    placeholder=""
                    onKeyUp={checkCep}
                    maxLength={8}
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Endereço *</p>
                  <input
                    id="Endereco"
                    type="text"
                    className={styles.FieldSave}
                    placeholder=""
                    onChange={handleInputChange}
                    value={endereco}
                    disabled
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Número *</p>
                  <input
                    id="Numero"
                    type="text"
                    className={styles.FieldSmall}
                    placeholder=""
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Complemento</p>
                  <input
                    id="Complemento"
                    type="text"
                    className={styles.FieldSave}
                    placeholder=""
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Bairro *</p>
                  <input
                    id="Bairro"
                    type="text"
                    className={styles.Field}
                    placeholder=""
                    onChange={handleInputChange}
                    value={bairro}
                    disabled
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Cidade</p>
                  <input
                    id="Cidade"
                    type="text"
                    className={styles.Field}
                    placeholder=""
                    onChange={handleInputChange}
                    value={cidade}
                    disabled
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Estado *</p>
                  <input
                    id="estado"
                    type="text"
                    className={styles.Field}
                    placeholder=""
                    onChange={handleInputChange}
                    value={estado}
                    disabled
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Tipo de entrega</p>
                  <select
                    className={styles.SelectField}
                    value={selectedOption}
                    onChange={handleSelectChange}
                  >
                    <option
                      value="opcao1"
                      selected={selectedOption === "opcao1"}
                    >
                      TRANSPORTADORA
                    </option>
                    <option
                      value="opcao2"
                      selected={selectedOption === "opcao2"}
                    >
                      SEDEX
                    </option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Valor da entrega</p>
                  <p className={styles.FixedValue}>R$245,30</p>
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Necessita de instalação?</p>
                  <select
                    className={styles.SelectField}
                    value={selectedOption}
                    onChange={handleSelectChange}
                  >
                    <option
                      value="opcao1"
                      selected={selectedOption === "opcao1"}
                    >
                      SIM
                    </option>
                    <option
                      value="opcao2"
                      selected={selectedOption === "opcao2"}
                    >
                      NÃO
                    </option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Valor da instalação</p>
                  <p className={styles.FixedValue}>R$125,30</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.linhaSave}></div>

          <div className={styles.ButtonsFinish}>
            <Link href="BudgetSave">
              <button className={styles.CancelButton}>Cancelar</button>
            </Link>

            <button className={styles.SaveButton} onClick={handleSaveOrder}>
              Efetivar pedido
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
