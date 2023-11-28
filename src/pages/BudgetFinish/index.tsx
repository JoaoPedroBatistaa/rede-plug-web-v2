import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/BudgetFinish.module.scss";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import MaskedInput from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addDoc, collection, db } from "../../../firebase";
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

export default function BudgetFinish() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const [formaPagamento, setFormaPagamento] = useState("");
  const [maoDeObraExtra, setMaoDeObraExtra] = useState("");
  const [vendedor, setVendedor] = useState("");

  let nomeCompleto: string | null;
  let Telefone: string | null;
  let email: string | null;
  let tipoPessoa: string | null;

  const [valorOriginal, setValorOriginal] = useState<number>(0);

  const [valorTotal, setValorTotal] = useState<number>(0);

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

      const grandTotalFromStorage = localStorage.getItem("grandTotal");
      const parsedTotal = grandTotalFromStorage
        ? parseFloat(grandTotalFromStorage)
        : 0;

      if (!isNaN(parsedTotal)) {
        setValorTotal(parsedTotal);
        setValorOriginal(parsedTotal);
        console.log("grandtotal: ", valorTotal);
      } else {
        console.log("ELSE");
        setValorTotal(0); // or any default value you'd like
      }
    }
  }, []);

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  const handleSaveOrder = async () => {
    try {
      const numeroDoPedidoRef = doc(
        db,
        `Login/${userId}/Orders`,
        "NumeroDoPedido"
      );
      const numeroDoPedidoSnap = await getDoc(numeroDoPedidoRef);

      let NumeroPedido;

      if (!numeroDoPedidoSnap.exists()) {
        await setDoc(numeroDoPedidoRef, {
          numero: 0,
        });
        NumeroPedido = 1;
      } else {
        const numeroAtual = numeroDoPedidoSnap.data().numero;

        NumeroPedido = Number(numeroAtual) + 1;
      }

      // Adicionar o novo pedido
      await addDoc(collection(db, `Login/${userId}/Orders`), {
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
        numero,
        complemento,
        tipoPessoa,
        valorTotal,
        budgets,
        NumeroPedido,
        formaPagamento,
        vendedor,
        desconto,
        estado,
        // ICMS
        orig,
        CSTICMS,
        modBC,
        vBC,
        pICMS,
        vICMS,
        pFCP,
        vFCP,

        // IPI
        cEnq,
        CSTIPI,

        // PIS
        CSTPIS,
        vBCPIS,
        pPIS,
        vPIS,

        // COFINS
        CSTCOFINS,
        vBCCOFINS,
        pCOFINS,
        vCOFINS,
      });

      await updateDoc(numeroDoPedidoRef, {
        numero: NumeroPedido,
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

  const MaskedInputAny: any = MaskedInput;

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

  const handlePaymentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    localStorage.setItem("formaPagamento", selectedOption);
    setFormaPagamento(localStorage.getItem("formaPagamento") ?? "");
  };

  const [cpf, setCpf] = useState("");
  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  // ICMS
  const [orig, setOrig] = useState("");
  const [CSTICMS, setCST] = useState("");
  const [modBC, setModBC] = useState("");
  const [vBC, setVBC] = useState("");
  const [pICMS, setPICMS] = useState("");
  const [vICMS, setVICMS] = useState("");
  const [pFCP, setPFCP] = useState("");
  const [vFCP, setVFCP] = useState("");

  // IPI
  const [cEnq, setCEnq] = useState("");
  const [CSTIPI, setCSTIPI] = useState("");

  // PIS
  const [CSTPIS, setCSTPIS] = useState("");
  const [vBCPIS, setVBCPIS] = useState("");
  const [pPIS, setPPIS] = useState("");
  const [vPIS, setVPIS] = useState("");

  // COFINS
  const [CSTCOFINS, setCSTCOFINS] = useState("");
  const [vBCCOFINS, setVBCCOFINS] = useState("");
  const [pCOFINS, setPCOFINS] = useState("");
  const [vCOFINS, setVCOFINS] = useState("");

  useEffect(() => {
    const searchSuccess = localStorage.getItem("searchSuccess");

    if (searchSuccess === "true") {
      const cpfFromLocalStorage = localStorage.getItem("cpf");
      if (cpfFromLocalStorage) {
        setCpf(cpfFromLocalStorage);
      }

      const numeroFromLocalStorage = localStorage.getItem("numero");
      if (numeroFromLocalStorage) {
        setNumero(numeroFromLocalStorage);
      }

      const estadoFromLocalStorage = localStorage.getItem("estado");
      if (estadoFromLocalStorage) {
        setEstado(estadoFromLocalStorage);
      }

      const enderecoFromLocalStorage = localStorage.getItem("endereco");
      if (enderecoFromLocalStorage) {
        setEndereco(enderecoFromLocalStorage);
      }

      const cepFromLocalStorage = localStorage.getItem("cep");
      if (cepFromLocalStorage) {
        setCep(cepFromLocalStorage);
      }

      const complementoFromLocalStorage = localStorage.getItem("complemento");
      if (complementoFromLocalStorage) {
        setComplemento(complementoFromLocalStorage);
      }

      const bairroFromLocalStorage = localStorage.getItem("bairro");
      if (bairroFromLocalStorage) {
        setBairro(bairroFromLocalStorage);
      }

      const cidadeFromLocalStorage = localStorage.getItem("cidade");
      if (cidadeFromLocalStorage) {
        setCidade(cidadeFromLocalStorage);
      }

      // ICMS
      const origFromLocalStorage = localStorage.getItem("orig");
      if (origFromLocalStorage) {
        setOrig(origFromLocalStorage);
      }

      const CSTFromLocalStorage = localStorage.getItem("CSTICMS");
      if (CSTFromLocalStorage) {
        setCST(CSTFromLocalStorage);
      }

      const modBCFromLocalStorage = localStorage.getItem("modBC");
      if (modBCFromLocalStorage) {
        setModBC(modBCFromLocalStorage);
      }

      const vBCFromLocalStorage = localStorage.getItem("vBC");
      if (vBCFromLocalStorage) {
        setVBC(vBCFromLocalStorage);
      }

      const pICMSFromLocalStorage = localStorage.getItem("pICMS");
      if (pICMSFromLocalStorage) {
        setPICMS(pICMSFromLocalStorage);
      }

      const vICMSFromLocalStorage = localStorage.getItem("vICMS");
      if (vICMSFromLocalStorage) {
        setVICMS(vICMSFromLocalStorage);
      }

      const pFCPFromLocalStorage = localStorage.getItem("pFCP");
      if (pFCPFromLocalStorage) {
        setPFCP(pFCPFromLocalStorage);
      }

      const vFCPFromLocalStorage = localStorage.getItem("vFCP");
      if (vFCPFromLocalStorage) {
        setVFCP(vFCPFromLocalStorage);
      }

      // IPI
      const cEnqFromLocalStorage = localStorage.getItem("cEnq");
      if (cEnqFromLocalStorage) {
        setCEnq(cEnqFromLocalStorage);
      }

      const CSTIPIFromLocalStorage = localStorage.getItem("CSTIPI");
      if (CSTIPIFromLocalStorage) {
        setCSTIPI(CSTIPIFromLocalStorage);
      }

      // PIS
      const CSTPISFromLocalStorage = localStorage.getItem("CSTPIS");
      if (CSTPISFromLocalStorage) {
        setCSTPIS(CSTPISFromLocalStorage);
      }

      const vBCPISFromLocalStorage = localStorage.getItem("vBCPIS");
      if (vBCPISFromLocalStorage) {
        setVBCPIS(vBCPISFromLocalStorage);
      }

      const pPISFromLocalStorage = localStorage.getItem("pPIS");
      if (pPISFromLocalStorage) {
        setPPIS(pPISFromLocalStorage);
      }

      const vPISFromLocalStorage = localStorage.getItem("vPIS");
      if (vPISFromLocalStorage) {
        setVPIS(vPISFromLocalStorage);
      }

      // COFINS
      const CSTCOFINSFromLocalStorage = localStorage.getItem("CSTCOFINS");
      if (CSTCOFINSFromLocalStorage) {
        setCSTCOFINS(CSTCOFINSFromLocalStorage);
      }

      const vBCCOFINSFromLocalStorage = localStorage.getItem("vBCCOFINS");
      if (vBCCOFINSFromLocalStorage) {
        setVBCCOFINS(vBCCOFINSFromLocalStorage);
      }

      const pCOFINSFromLocalStorage = localStorage.getItem("pCOFINS");
      if (pCOFINSFromLocalStorage) {
        setPCOFINS(pCOFINSFromLocalStorage);
      }

      const vCOFINSFromLocalStorage = localStorage.getItem("vCOFINS");
      if (vCOFINSFromLocalStorage) {
        setVCOFINS(vCOFINSFromLocalStorage);
      }
    }
  }, []);

  const handleInputChange = () => {
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

  const [desconto, setDesconto] = useState(0);

  useEffect(() => {
    // Tenta recuperar o valor do desconto do localStorage
    const descontoSalvo = localStorage.getItem("valorComDesconto");

    // Se houver um valor salvo e ele for um número válido, atualiza o estado
    if (descontoSalvo !== null) {
      const descontoNumerico = parseFloat(descontoSalvo);
      if (!isNaN(descontoNumerico)) {
        setDesconto(descontoNumerico);
      }
    }
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
              <p className={styles.BudgetSubTitle}>Dados adicionais</p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Forma de pagamento</p>
                  <select
                    className={styles.SelectFieldPersonDes}
                    value={formaPagamento}
                    onChange={handlePaymentChange}
                  >
                    <option value="" disabled>
                      Defina a forma de pagamento
                    </option>
                    <option value="PIX">PIX</option>
                    <option value="DÉBITO">DÉBITO</option>
                    <option value="CRÉDITO">CRÉDITO</option>
                    <option value="DINHEIRO">DINHEIRO</option>
                    <option value="BOLETO">BOLETO</option>
                    <option value="A VISTA">A VISTA</option>
                    <option value="A PRAZO">A PRAZO</option>
                  </select>
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendedor</p>
                  <input
                    type="text"
                    className={styles.FieldSaveDes}
                    placeholder=""
                    onChange={(e) => {
                      setVendedor(e.target.value);
                    }}
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
                    onChange={handleInputChange}
                    maxLength={8}
                    value={cep}
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
                    value={numero}
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
                    value={complemento}
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
                  <p className={styles.FieldLabel}>Necessita de Diversos?</p>
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
                  <p className={styles.FieldLabel}>Valor da Diversos</p>
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
