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
import { useMenu } from "../../components/Context/context";
import classnames from "classnames";

export default function BudgetFinish() {
  const router = useRouter();

  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState("");


  let nomeCompleto: string | null;
  let Telefone: string | null;
  let email: string | null;
  let tipoPessoa: string | null;
  let valorTotal: string | null;

  if (typeof window !== "undefined") {
    valorTotal = localStorage.getItem("grandTotal");
  }

  if (typeof window !== "undefined") {
    nomeCompleto = localStorage.getItem("nomeCompleto");
    Telefone = localStorage.getItem("Telefone");
    email = localStorage.getItem("email");
    tipoPessoa = localStorage.getItem("tipoPessoa")
  }

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

  const handleSaveOrder = async () => {
    if (!nomeCompleto) {
      toast.error("Por favor, preencha o campo Nome Completo.");
      return;
    }

    if (!Telefone) {
      toast.error("Por favor, preencha o campo Telefone.");
      return;
    }

    if (!email) {
      toast.error("Por favor, preencha o campo Email.");
      return;
    }

    if (!cpf) {
      toast.error("Por favor, preencha o campo CPF.");
      return;
    }

    if (!endereco) {
      toast.error("Por favor, preencha o campo Endereço.");
      return;
    }

    if (!cidade) {
      toast.error("Por favor, preencha o campo Cidade.");
      return;
    }

    if (!bairro) {
      toast.error("Por favor, preencha o campo Bairro.");
      return;
    }

    if (!cep) {
      toast.error("Por favor, preencha o campo CEP.");
      return;
    }

    try {
      await addDoc(collection(db, "Orders"), {
        nomeCompleto,
        Telefone,
        email,
        dataCadastro,
        Entrega,
        cpf,
        endereco,
        cidade,
        bairro,
        cep,
        complemento,
        tipoPessoa,
        valorTotal,
        budgets
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

  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("tipoPessoa", selectedOption);
  };

  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
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
            setEndereco(data.logradouro);
            setBairro(data.bairro);
            setCidade(data.localidade);
            setEstado(data.uf);
            console.log(endereco);
          })
          .catch((err) => {
            alert("Digite o CEP!");
          })
      );
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
      <ToastContainer />
      <div className={styles.Container} onClick={handleOpenMenuDiv}>
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
                  <p className={styles.FieldLabel}>Pessoa física/jurídica</p>
                  <select
                    className={styles.SelectFieldPerson}
                    value={selectedOption}
                    onChange={handleSelectChange}
                  >
                    <option value="" disabled selected>
                      Defina: física/jurídica
                    </option>
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
