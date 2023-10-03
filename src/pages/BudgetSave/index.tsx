import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/BudgetSave.module.scss";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import MaskedInput from "react-input-mask";

import { addDoc, collection, db } from "../../../firebase";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useMenu } from "../../components/Context/context";

interface Foam {
  id: string;
  NomeCompleto: string;
  Telefone: string;
  bairro: string;
  cep: string;
  cidade: string;
  complemento: string;
  cpf: string;
  email: string;
  estado: string;
  venue: string;
}

export default function BudgetSave() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectElement = document.getElementById(
      event.target.id
    ) as HTMLSelectElement;
    const selectedOption = selectElement.value;
    setSelectedOption(selectedOption);
    localStorage.setItem("tipoPessoa", selectedOption);
  };

  const [clientes, setClientes] = useState<Foam[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/${userId}/Clients`);
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          NomeCompleto: data.NomeCompleto,
          Telefone: data.Telefone,
          bairro: data.bairro,
          cep: data.cep,
          cidade: data.cidade,
          complemento: data.complemento,
          cpf: data.cpf,
          email: data.email,
          estado: data.estado,

          venue: data.venue,
          // Add other fields as needed
        };
      });
      setClientes(budgetList);
      console.log(clientes);
    };
    fetchData();
  }, []);

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [Telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  let valorTotal: string | null;

  if (typeof window !== "undefined") {
    valorTotal = localStorage.getItem("grandTotal");
    console.log("grandtotal: ", valorTotal);
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
      const localBudgets = localStorage.getItem("budgets");
      if (localBudgets) {
        const budgetsObject = JSON.parse(localBudgets);
        const budgetsArray = Object.values(budgetsObject);
        setBudgets(budgetsArray);
      }
    }
  }, []);

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  const handleInputChange = () => {
    const nomeCompleto = (
      document.getElementById("nomeCompleto") as HTMLInputElement
    ).value;
    const Telefone = (document.getElementById("Telefone") as HTMLInputElement)
      .value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const CPF = (document.getElementById("CPF") as HTMLInputElement).value; // Adicionado esta linha

    setNomeCompleto(nomeCompleto);
    localStorage.setItem("nomeCompleto", nomeCompleto);

    setTelefone(Telefone);
    localStorage.setItem("Telefone", Telefone);

    setEmail(email);
    localStorage.setItem("email", email);

    const cleanedCPF = CPF.replace(/[^\d]/g, "");
    setCpf(cleanedCPF);
    fetchSuggestions(cleanedCPF);
  };

  const [cpf, setCpf] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isInputFocused, setInputFocused] = useState(false);

  const fetchSuggestions = async (input: string) => {
    const dbCollection = collection(db, `Login/${userId}/Clients`);

    // Buscando documentos que começam com o input
    const startAtQuery = query(
      dbCollection,
      where("cpf", ">=", input),
      where("cpf", "<", input + "\uf8ff"),
      orderBy("cpf"),
      limit(10)
    );

    const querySnapshot = await getDocs(startAtQuery);

    if (!querySnapshot.empty) {
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (cliente: any) => {
    setCpf(cliente.cpf);
    setNomeCompleto(cliente.NomeCompleto || "");
    setEmail(cliente.email || "");
    setTelefone(cliente.Telefone || "");

    localStorage.setItem("endereco", cliente.venue || "");
    localStorage.setItem("bairro", cliente.bairro || "");
    localStorage.setItem("cidade", cliente.cidade || "");
    localStorage.setItem("estado", cliente.estado || "");
    localStorage.setItem("numero", cliente.numero || "");
    localStorage.setItem("cep", cliente.cep || "");
    localStorage.setItem("complemento", cliente.complemento || "");
    localStorage.setItem("cpf", cliente.cpf);
    localStorage.setItem("nomeCompleto", cliente.NomeCompleto || "");
    localStorage.setItem("Telefone", cliente.Telefone || "");
    localStorage.setItem("email", cliente.email || "");
    localStorage.setItem("searchSuccess", "true");

    setSuggestions([]);
  };

  const fetchClienteByCpfCnpj = async (cpfCnpj: any) => {
    const dbCollection = collection(db, `Login/${userId}/Clients`);
    const q = query(dbCollection, where("cpf", "==", cpfCnpj));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();

      return data;
    }

    return null;
  };

  const handleSearch = async () => {
    const cpfCnpjLimpo = cpf.replace(/[\.-]/g, "");
    console.log("Buscando cliente com CPF/CNPJ limpo:", cpfCnpjLimpo);
    const cliente = await fetchClienteByCpfCnpj(cpfCnpjLimpo);

    if (cliente) {
      setNomeCompleto(cliente.NomeCompleto || "");
      setEmail(cliente.email || "");
      setTelefone(cliente.Telefone || "");
      localStorage.setItem("endereco", cliente.venue || "");
      localStorage.setItem("bairro", cliente.bairro || "");
      localStorage.setItem("cidade", cliente.cidade || "");
      localStorage.setItem("estado", cliente.estado || "");
      localStorage.setItem("numero", cliente.numero || "");
      localStorage.setItem("cep", cliente.cep || "");
      localStorage.setItem("complemento", cliente.complemento || "");
      localStorage.setItem("cpf", cpfCnpjLimpo);
      localStorage.setItem("nomeCompleto", nomeCompleto);
      localStorage.setItem("Telefone", Telefone);
      localStorage.setItem("email", email);

      localStorage.setItem("searchSuccess", "true");
    }

    setSuggestions([]);
    setInputFocused(false);
  };

  const handleSaveBudget = async () => {
    try {
      const numeroDoOrcamentoRef = doc(
        db,
        `Login/${userId}/Budget`,
        "NumeroDoOrçamento"
      );
      const numeroDoOrcamentoSnap = await getDoc(numeroDoOrcamentoRef);

      let NumeroPedido;

      if (!numeroDoOrcamentoSnap.exists()) {
        await setDoc(numeroDoOrcamentoRef, {
          numero: 0,
        });
        NumeroPedido = 1;
      } else {
        const numeroAtual = numeroDoOrcamentoSnap.data().numero;

        NumeroPedido = Number(numeroAtual) + 1;
      }

      await addDoc(collection(db, `Login/${userId}/Budget`), {
        nomeCompleto,
        Telefone,
        email,
        dataCadastro,
        budgets,
        valorTotal,
        NumeroPedido,
      });

      await updateDoc(numeroDoOrcamentoRef, {
        numero: NumeroPedido,
      });

      toast.success("Salvo com sucesso!");

      setTimeout(() => {
        window.location.href = "/BudgetFinish";
      }, 500);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { openMenu, setOpenMenu } = useMenu();
  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 100);
  };

  // ENTER PULA INPUTS

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();

        const inputs = Array.from(document.querySelectorAll("input"));
        const index = inputs.indexOf(event.target);

        if (index > -1 && index < inputs.length - 1) {
          const nextInput = inputs[index + 1];
          nextInput.focus();
        }
      }
    };

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("keydown", handleKeyDown);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("keydown", handleKeyDown);
      });
    };
  }, []);

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
            <div className={styles.ButtonsFinish}>
              <Link href="Budgets">
                <button className={styles.CancelButton}>Cancelar</button>
              </Link>

              <button className={styles.SaveButton} onClick={handleSaveBudget}>
                Salvar Orçamento
              </button>
            </div>
          </div>

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
                <option value="FÍSICA" selected={selectedOption === "FÍSICA"}>
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
                value={cpf}
                onChange={handleInputChange}
                onBlur={handleSearch}
              />
              {suggestions.length > 0 && (
                <div className={styles.SuggestionsDropdown}>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={styles.SuggestionItem}
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion.cpf} - {suggestion.NomeCompleto}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                value={nomeCompleto}
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
              value={Telefone}
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
                value={email}
              />
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
