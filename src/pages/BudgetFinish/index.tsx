import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/BudgetFinish.module.scss";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import MaskedInput from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addDoc, collection, db } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

export default function BudgetFinish() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

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
    tipoPessoa = localStorage.getItem("tipoPessoa");
  }

  const [budgets, setBudgets] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localBudgets = localStorage.getItem("budgets");
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
      // Recuperar o documento "NumeroDoOrçamento" na coleção "Budgets"
      const numeroDoOrcamentoRef = doc(db, "Orders", "NumeroDoPedido");
      const numeroDoOrcamentoSnap = await getDoc(numeroDoOrcamentoRef);

      if (numeroDoOrcamentoSnap.exists()) {
        // Recuperar o valor atual do campo "numero"
        const numeroAtual = numeroDoOrcamentoSnap.data().numero;

        // Incrementar o valor atual para obter o "NumeroPedido" para o novo orçamento
        const NumeroPedido = Number(numeroAtual) + 1;

        // Adicionar o novo orçamento
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
          budgets,
          NumeroPedido, // Aqui está o novo campo
        });

        // Incrementar o valor do campo "numero" no documento "NumeroDoOrçamento"
        await updateDoc(numeroDoOrcamentoRef, {
          numero: NumeroPedido,
        });

        toast.success("Pedido enviado!");
        setTimeout(() => {
          window.location.href = "/Home";
        }, 500);
      } else {
        console.error(
          "Erro: documento 'NumeroDoOrçamento' não existe na coleção 'Budgets'"
        );
      }
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
    const selectElement = document.getElementById(
      event.target.id
    ) as HTMLSelectElement;
    const selectedOption = selectElement.value;
    setSelectedOption(selectedOption);
    localStorage.setItem("tipoPessoa", selectedOption);
  };

  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  const handleInputChange = () => {
    const CPF = (document.getElementById("CPF") as HTMLInputElement).value;
    const Endereco = (document.getElementById("Endereco") as HTMLInputElement)
      .value;
    const Numero = (document.getElementById("Numero") as HTMLInputElement)
      .value;
    const CEP = (document.getElementById("CEP") as HTMLInputElement).value;
    const estado = (document.getElementById("estado") as HTMLInputElement)
      .value;
    const Complemento = (
      document.getElementById("Complemento") as HTMLInputElement
    ).value;
    const Bairro = (document.getElementById("Bairro") as HTMLInputElement)
      .value;
    const Cidade = (document.getElementById("Cidade") as HTMLInputElement)
      .value;

    setCpf(CPF);
    setEndereco(Endereco);
    setNumero(Numero);
    setCep(CEP);
    setEstado(estado);
    setComplemento(Complemento);
    setBairro(Bairro);
    setCidade(Cidade);
  };

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

            <div className={styles.ButtonsFinish}>
              <Link href="BudgetSave">
                <button className={styles.CancelButton}>Cancelar</button>
              </Link>

              <button className={styles.SaveButton} onClick={handleSaveOrder}>
                Efetivar pedido
              </button>
            </div>
          </div>

          <div className={styles.BudgetData}>
            <div className={styles.PessoalData}>
              <p className={styles.BudgetSubTitle}>Dados pessoais</p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Pessoa física/jurídica</p>
                  <select
                    id="tipoPessoaSelect"
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

              {/* <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome completo</p>
                  <input
                    type="text"
                    className={styles.FieldSave}
                    placeholder=""
                  />
                </div>
              </div> */}

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    {selectedOption === "FÍSICA" ? "CPF" : "CNPJ"}
                  </p>
                  <MaskedInput
                    mask={
                      selectedOption === "FÍSICA"
                        ? "999.999.999-99"
                        : "99.999.999/9999-99"
                    }
                    id="CPF"
                    type="text"
                    className={styles.FieldSave}
                    placeholder=""
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* <div className={styles.InputContainer}>
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
              </div> */}

              {/* <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Email</p>
                  <input
                    type="mail"
                    className={styles.FieldSave}
                    placeholder=""
                  />
                </div>
              </div> */}
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

              {/* <div className={styles.InputContainer}>
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
              </div> */}

              {/* <div className={styles.InputContainer}>
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
              </div> */}
            </div>
          </div>

          <div className={styles.linhaSave}></div>

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
