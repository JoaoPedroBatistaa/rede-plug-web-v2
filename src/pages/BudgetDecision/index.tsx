import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/BudgetDecision.module.scss";

import { toast } from "react-toastify";

import HeaderBudget from "@/components/HeaderBudget";
import Link from "next/link";
import { useEffect, useState } from "react";

import { db, doc, getDoc } from "../../../firebase";

type UserDataType = {
  Tamanho: string;
  impressao: string;
  tipoImpressao: string;
  codigoPerfil: string;
  codigoPerfilDois: string;
  espessuraPerfil: string;
  vidro: string;
  espessuraVidro: string;
  foam: string;
  paspatur: string;
  codigoPaspatur: string;
  dimensoesPaspatur: string;
  collage: string;
  instalacao: string;
  valorInstalacao: string;
  tipoEntrega: string;
  formaPagamento: string;
  observacao: string;
  dataCadastro: string;
  valorTotal: string;
  obs: string;

  valorPerfil: string;
  valorPerfilUm: string;
  valorPerfilDois: string;
  valorVidro: string;
  valorFoam: string;
  valorColagem: string;
  valorImpressao: string;
  valorPaspatur: string;
};

export default function BudgetDecision() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const [openMenu, setOpenMenu] = useState(false); // Inicializa o estado openMenu

  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedBudgetId(localStorage.getItem("selectedBudgetId"));
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (selectedBudgetId) {
        try {
          const docRef = doc(db, "Budget", selectedBudgetId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserDataType);
          } else {
            console.log("Nenhum documento encontrado!");
          }
        } catch (error) {
          console.error("Erro ao buscar documento:", error);
        }
      } else {
        console.log("Nenhum ID selecionado!");
      }
    }

    fetchData();
  }, [selectedBudgetId]);

  const [valorPerfil, setValorPerfil] = useState("");
  const [valorFoam, setValorFoam] = useState("");
  const [valorMontagem, setValorMontagem] = useState("");
  const [valorVidro, setValorVidro] = useState("");
  const [valorPaspatur, setValorPaspatur] = useState("");
  const [valorImpressao, setValorImpressao] = useState("");
  const [valorColagem, setValorColagem] = useState("");
  const [valorInstalacao, setValorInstalacao] = useState("");
  const [precoTotal, setPrecoTotal] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (typeof window !== "undefined") {
        setValorPerfil(localStorage.getItem("valorPerfil") || "");
        setValorMontagem(localStorage.getItem("valorMontagem") || "");
        setValorFoam(localStorage.getItem("valorFoam") || "");
        setValorVidro(localStorage.getItem("valorVidro") || "");
        setValorPaspatur(localStorage.getItem("valorPaspatur") || "");
        setValorImpressao(localStorage.getItem("valorImpressao") || "");
        setValorColagem(localStorage.getItem("valorColagem") || "");
        setValorInstalacao(localStorage.getItem("valorInstalacao") || "");

        const total =
          Number(valorPaspatur) +
          Number(valorPerfil) +
          Number(valorFoam) +
          Number(valorVidro) +
          Number(valorImpressao) +
          Number(valorMontagem) +
          Number(valorInstalacao);

        if (!isNaN(total)) {
        }
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Salve o ID do intervalo para limpar mais tarde
      if (typeof window !== "undefined") {
        const valorPerfil = Number(localStorage.getItem("valorPerfil"));
        const valorFoam = Number(localStorage.getItem("valorFoam"));
        const valorVidro = Number(localStorage.getItem("valorVidro"));
        const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
        const valorMontagem = Number(localStorage.getItem("valorMontagem"));
        const valorImpressao = Number(localStorage.getItem("valorImpressao"));
        const valorColagem = Number(localStorage.getItem("valorColagem"));
        const valorInstalacao = Number(localStorage.getItem("valorInstalacao"));

        setPrecoTotal(
          valorPaspatur +
            valorPerfil +
            valorFoam +
            valorVidro +
            valorImpressao +
            valorInstalacao +
            valorColagem +
            valorMontagem
        );
      }
    }, 200); // Tempo do intervalo em milissegundos

    return () => clearInterval(intervalId); // Limpe o intervalo quando o componente for desmontado
  }, []);

  let nomeCompleto: string = "";
  let Telefone: string = "";
  let email: string = "";
  let instalacao: string = "";
  let tipoEntrega: string = "";
  let valorEntrega: string = "";
  let impressao: string = "";
  let tipoImpressao: string = "";
  let fileInput: string = "";
  let collage: string = "";
  let paspatur: string = "";
  let codigoPaspatur: string = "";
  let dimensoesPaspatur: string = "";
  let foam: string = "";
  let codigoFoam: string = "";
  let codigoImpressao: string = "";
  let codigoMontagem: string = "";
  let codigoVidro: string = "";
  let codigoColagem: string = "";
  let mdf: string = "";
  let codigoMdf: string = "";
  let vidro: string = "";
  let espessuraVidro: string = "";
  let espelho: string = "";
  let espessuraEspelho: string = "";
  let codigoPerfil: string = "";
  let codigoPerfilDois: string = "";
  let valorPerfilUm: string = "";
  let valorPerfilDois: string = "";
  let espessuraPerfil: string = "";
  let Tamanho: string = "";
  let tipoPessoa: string = "";
  let obs: string = "";

  let descricaoPerfil: string = "";
  let descricaoVidro: string = "";
  let descricaoMontagem: string = "";
  let descricaoColagem: string = "";
  let descricaoImpressao: string = "";
  let descricaoPaspatur: string = "";
  let descricaoInstalacao: string = "";
  let descricaoFoam: string = "";

  const [valorTotal, setValorTotal] = useState<string>("0");

  useEffect(() => {
    setValorTotal(precoTotal.toString());
  }, [precoTotal]);

  if (typeof window !== "undefined") {
    nomeCompleto = localStorage.getItem("nomeCompleto") || "";
    Telefone = localStorage.getItem("Telefone") || "";
    email = localStorage.getItem("email") || "";
    instalacao = localStorage.getItem("instalacao") || "";
    tipoEntrega = localStorage.getItem("tipoEntrega") || "";
    valorEntrega = localStorage.getItem("valorEntrega") || "";
    impressao = localStorage.getItem("impressao") || "";
    tipoImpressao = localStorage.getItem("tipoImpressao") || "";
    fileInput = localStorage.getItem("fileInput") || "";
    collage = localStorage.getItem("collage") || "";
    paspatur = localStorage.getItem("paspatur") || "";
    codigoPaspatur = localStorage.getItem("codigoPaspatur") || "";
    dimensoesPaspatur = localStorage.getItem("dimensoesPaspatur") || "";
    foam = localStorage.getItem("foam") || "";
    codigoFoam = localStorage.getItem("codigoFoam") || "";
    codigoImpressao = localStorage.getItem("codigoImpressao") || "";
    codigoMontagem = localStorage.getItem("codigoMontagem") || "";
    codigoVidro = localStorage.getItem("codigoVidro") || "";
    codigoColagem = localStorage.getItem("codigoColagem") || "";
    mdf = localStorage.getItem("mdf") || "";
    codigoMdf = localStorage.getItem("codigoMdf") || "";
    vidro = localStorage.getItem("vidro") || "";
    espessuraVidro = localStorage.getItem("espessuraVidro") || "";
    espelho = localStorage.getItem("espelho") || "";
    espessuraEspelho = localStorage.getItem("espessuraEspelho") || "";
    codigoPerfil = localStorage.getItem("codigoPerfil") || "";
    codigoPerfilDois = localStorage.getItem("codigoPerfilDois") || "";
    valorPerfilUm = localStorage.getItem("valorPerfilUm") || "";
    valorPerfilDois = localStorage.getItem("valorPerfilDois") || "";
    espessuraPerfil = localStorage.getItem("espessuraPerfil") || "";
    Tamanho =
      localStorage.getItem("novoTamanho") ||
      localStorage.getItem("Tamanho") ||
      "";
    tipoPessoa = localStorage.getItem("tipoPessoa") || "";
    obs = localStorage.getItem("obs") || "";

    descricaoPerfil = localStorage.getItem("descricaoPerfil") || "";
    descricaoVidro = localStorage.getItem("descricaoVidro") || "";
    descricaoFoam = localStorage.getItem("descricaoFoam") || "";
    descricaoColagem = localStorage.getItem("descricaoColagem") || "";
    descricaoImpressao = localStorage.getItem("descricaoImpressao") || "";
    descricaoInstalacao = localStorage.getItem("descricaoInstalacao") || "";
    descricaoPaspatur = localStorage.getItem("descricaoPaspatur") || "";
    descricaoMontagem = localStorage.getItem("descricaoMontagem") || "";
  }

  const [dataVencimento, setDataVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Criando um useEffect para monitorar a mudança dos estados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localFormaPagamento = localStorage.getItem("formaPagamento");
      const localMaoDeObraExtra = localStorage.getItem("maoDeObraExtra");
      const localDataVencimento = localStorage.getItem("dataVencimento");
      const localObservacoes = localStorage.getItem("observacoes");

      if (localDataVencimento) setDataVencimento(localDataVencimento);
      if (localObservacoes) setObservacoes(localObservacoes);
    }
  }, []);

  // const novoValorTotal = precoTotal + parseFloat(maoDeObraExtra || "0");
  // valorTotal = novoValorTotal.toString();

  function formatDate(date: any) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Aqui nós adicionamos 1 ao dia atual.
    const dia = newDate.getDate().toString().padStart(2, "0");
    const mes = (newDate.getMonth() + 1).toString().padStart(2, "0"); //+1 pois no getMonth Janeiro começa com zero.
    const ano = newDate.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // SALVAR ORÇAMENTO COMO OBJETO

  const [budgetId, setBudgetId] = useState<number>(0);

  function saveBudget(id: string, budgetData: any) {
    const existingBudgets = JSON.parse(localStorage.getItem("budgets") || "{}");
    existingBudgets[id] = budgetData;
    localStorage.setItem("budgets", JSON.stringify(existingBudgets));
  }

  const handleSaveMoreBudget = () => {
    let newBudgetId = budgetId;

    const localBudgetId = localStorage.getItem("budgetId");
    if (localBudgetId) {
      newBudgetId = Number(localBudgetId) + 1;
      localStorage.setItem("budgetId", newBudgetId.toString());
    } else {
      newBudgetId += 1;
      localStorage.setItem("budgetId", newBudgetId.toString());
    }

    const budgetData = {
      instalacao,
      tipoEntrega,
      valorEntrega,
      impressao,
      tipoImpressao,
      fileInput,
      collage,
      paspatur,
      codigoPaspatur,
      codigoColagem,
      codigoFoam,
      codigoImpressao,
      codigoVidro,
      dimensoesPaspatur,
      foam,
      mdf,
      codigoMdf,
      vidro,
      espessuraVidro,
      espelho,
      espessuraEspelho,
      codigoPerfil,
      codigoPerfilDois,
      valorPerfilUm,
      valorPerfilDois,
      espessuraPerfil,
      Tamanho,
      valorTotal,
      dataVencimento,
      observacoes,
      codigoMontagem,
      valorPerfil,
      valorColagem,
      valorFoam,
      valorImpressao,
      valorPaspatur,
      valorInstalacao,
      valorVidro,
      descricaoMontagem,
      descricaoPerfil,
      descricaoColagem,
      descricaoFoam,
      descricaoImpressao,
      descricaoInstalacao,
      descricaoPaspatur,
      descricaoVidro,
      valorMontagem,
    };

    saveBudget(newBudgetId.toString(), budgetData);

    const itensParaManter = [
      "userId",
      "ally-supports-cache",
      "budgets",
      "budgetId",
      "typeUser",
      "logo",
      "nome",
    ];
    const todasAsChaves = Object.keys(localStorage);
    todasAsChaves.forEach((chave) => {
      if (!itensParaManter.includes(chave)) {
        localStorage.removeItem(chave);
      }
    });

    router.push("/BudgetSize");
  };

  const handleSaveBudget = () => {
    let newBudgetId = budgetId;

    const localBudgetId = localStorage.getItem("budgetId");
    if (localBudgetId) {
      newBudgetId = Number(localBudgetId) + 1;
      localStorage.setItem("budgetId", newBudgetId.toString());
    } else {
      newBudgetId += 1;
      localStorage.setItem("budgetId", newBudgetId.toString());
    }

    const budgetData = {
      instalacao,
      tipoEntrega,
      valorEntrega,
      impressao,
      tipoImpressao,
      fileInput,
      collage,
      paspatur,
      codigoPaspatur,
      codigoColagem,
      codigoFoam,
      codigoImpressao,
      codigoVidro,
      dimensoesPaspatur,
      foam,
      mdf,
      codigoMdf,
      vidro,
      espessuraVidro,
      espelho,
      espessuraEspelho,
      codigoPerfil,
      codigoPerfilDois,
      valorPerfilUm,
      valorPerfilDois,
      espessuraPerfil,
      Tamanho,
      valorTotal,
      dataVencimento,
      observacoes,
      valorPerfil,
      valorColagem,
      valorFoam,
      valorImpressao,
      valorPaspatur,
      valorInstalacao,
      valorMontagem,
      valorVidro,
      codigoMontagem,
      descricaoMontagem,
      descricaoPerfil,
      descricaoColagem,
      descricaoFoam,
      descricaoImpressao,
      descricaoInstalacao,
      descricaoPaspatur,
      descricaoVidro,
    };

    // if (!formaPagamento || formaPagamento === "") {
    //   toast.error("Por favor, defina a forma de pagamento");
    //   return; // Termina a execução da função
    // }

    if (!dataVencimento || dataVencimento === "") {
      toast.error("Por favor, defina a data de vencimento");
      return; // Termina a execução da função
    }

    saveBudget(newBudgetId.toString(), budgetData);

    router.push("/BudgetSave");
  };

  const [savedBudgets, setSavedBudgets] = useState<any[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  // Carregar savedBudgets do localStorage ao montar o componente
  useEffect(() => {
    const localBudgets = localStorage.getItem("budgets");
    if (localBudgets) {
      const budgetsObject = JSON.parse(localBudgets);
      const budgetsArray: any[] = Object.values(budgetsObject);
      setSavedBudgets(budgetsArray);
    }
  }, []);

  // Atualizar grandTotal no localStorage sempre que savedBudgets ou valorTotal mudar
  useEffect(() => {
    const totalSavedBudgets = savedBudgets
      ? savedBudgets.reduce((sum, budget) => {
          return sum + parseFloat(budget.valorTotal || "0");
        }, 0)
      : 0;

    const calculatedGrandTotal =
      totalSavedBudgets + parseFloat(valorTotal || "0");

    setGrandTotal(calculatedGrandTotal);

    if (typeof window !== "undefined") {
      localStorage.setItem("grandTotal", calculatedGrandTotal.toString());
      console.log("grandtotal: ", calculatedGrandTotal);
    }
  }, [savedBudgets, valorTotal]);

  const [desconto, setDesconto] = useState(0);

  const handleInputChange = () => {
    const descontoInput = document.getElementById(
      "Desconto"
    ) as HTMLInputElement;
    const Desconto = parseFloat(descontoInput.value);

    setDesconto(Desconto);
    localStorage.setItem("desconto", Desconto.toString());
  };

  const [valorComDesconto, setValorComDesconto] = useState<number>(0); // preco após desconto

  useEffect(() => {
    let novoValorComDesconto = precoTotal;

    if (
      desconto !== null &&
      !isNaN(desconto) &&
      desconto >= 0 &&
      desconto <= 100
    ) {
      novoValorComDesconto = precoTotal - precoTotal * (desconto / 100);
    }

    setValorComDesconto(novoValorComDesconto);
    setGrandTotal(novoValorComDesconto);

    // Se você realmente precisa salvar no localStorage a cada mudança:
    if (typeof window !== "undefined") {
      localStorage.setItem("grandTotal", novoValorComDesconto.toString());
    }
  }, [desconto, precoTotal]);

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div className={styles.Container}>
        <div className={styles.OrderContainer}>
          <HeaderBudget></HeaderBudget>

          <div className={styles.OrderDataContainer}>
            <div className={styles.BudgetHead}>
              <div className={styles.Nav}>
                <Link href="ViewBudgetBudget">
                  <div>
                    <p className={`${styles.Title} ${styles.active}`}>
                      Total do Orçamento
                    </p>
                  </div>
                </Link>
              </div>

              <div className={styles.BudgetHeadO}>
                <p className={styles.SubTitle}>
                  Valor total: R$ {grandTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className={styles.linhaOrder}></div>

            <div className={styles.OrderData}>
              <div className={styles.Budgets}>
                {precoTotal > 0 && (
                  <div className={styles.OrderAll}>
                    <div className={styles.OrderRes}>
                      <p className={styles.ResTitle}>ORÇAMENTO ATUAL:</p>

                      <div>
                        <p className={styles.ResName}>Tamanho</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{Tamanho}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Impressão</p>
                        <div className={styles.OrderResValue}>
                          {codigoImpressao && valorImpressao && (
                            <p className={styles.ResValue}>
                              {codigoImpressao} - R${" "}
                              {parseFloat(valorImpressao || "0").toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {codigoImpressao && valorImpressao && (
                            <p className={styles.ResValue}>
                              {descricaoImpressao}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Perfil</p>
                        <div className={styles.OrderResValue}>
                          {codigoPerfil && valorPerfilUm && (
                            <p className={styles.ResValue}>
                              {codigoPerfil} - R${" "}
                              {parseFloat(valorPerfilUm || "0").toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {codigoPerfilDois && valorPerfilDois && (
                            <p className={styles.ResValue}>
                              {codigoPerfilDois} - R${" "}
                              {parseFloat(valorPerfilDois || "0").toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Vidro</p>
                        <div className={styles.OrderResValue}>
                          {codigoVidro && valorVidro && (
                            <p className={styles.ResValue}>
                              {codigoVidro} - R${" "}
                              {parseFloat(valorVidro || "0").toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {codigoVidro && valorVidro && (
                            <p className={styles.ResValue}>{descricaoVidro}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Foam</p>
                        <div className={styles.OrderResValue}>
                          {codigoFoam && valorFoam && (
                            <p className={styles.ResValue}>
                              {codigoFoam} - R${" "}
                              {parseFloat(valorFoam || "0").toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {codigoFoam && valorFoam && (
                            <p className={styles.ResValue}>{descricaoFoam}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Paspatur</p>
                        <div>
                          <div className={styles.OrderResValue}>
                            {codigoPaspatur && valorPaspatur && (
                              <p className={styles.ResValue}>
                                {codigoPaspatur} - R${" "}
                                {parseFloat(valorPaspatur || "0").toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className={styles.OrderResValue}>
                            {codigoPaspatur && valorPaspatur && (
                              <p className={styles.ResValue}>
                                {descricaoPaspatur}
                              </p>
                            )}
                          </div>
                          {dimensoesPaspatur && (
                            <p className={styles.ResValue}>
                              {dimensoesPaspatur}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Colagem</p>
                        <div className={styles.OrderResValue}>
                          {codigoColagem && valorColagem && (
                            <p className={styles.ResValue}>
                              {codigoColagem} - R${" "}
                              {parseFloat(valorColagem || "0").toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {codigoColagem && valorColagem && (
                            <p className={styles.ResValue}>
                              {descricaoColagem}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Diversos</p>
                        <div className={styles.OrderResValue}>
                          {valorInstalacao && (
                            <p className={styles.ResValue}>{valorInstalacao}</p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {valorInstalacao && (
                            <p className={styles.ResValue}>
                              {descricaoInstalacao}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Montagem</p>
                        <div className={styles.OrderResValue}>
                          {valorMontagem && (
                            <p className={styles.ResValue}>{valorMontagem}</p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {valorMontagem && (
                            <p className={styles.ResValue}>
                              {descricaoMontagem}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Entrega</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{tipoEntrega}</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.OrderRes}>
                      <p className={styles.ResTitle}>Pagamentos e prazos</p>

                      {/* <div>
                      <p className={styles.ResName}>Mão de obra </p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>{maoDeObraExtra}</p>
                      </div>
                    </div>

                    <div>
                      <p className={styles.ResName}>Forma de pagamento</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>{formaPagamento}</p>
                      </div>
                    </div> */}

                      <div>
                        <p className={styles.ResName}>Prazo para entrega</p>
                        <div className={styles.OrderResValue}>
                          {dataVencimento && (
                            <p className={styles.ResValue}>
                              {formatDate(dataVencimento)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className={styles.OrderNotes}>
                        <p className={styles.ResName}>Observação</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{observacoes}</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.OrderResEdit}>
                      <Link href="/BudgetSize">
                        <img
                          src="/lapis.png"
                          className={styles.editIcon}
                          alt=""
                        />
                      </Link>

                      <div className={styles.totalValue}>
                        <p className={styles.ResTitle}>Valor total</p>
                        <div>
                          <p className={styles.ResTotal}>
                            R$ {parseFloat(valorTotal || "0").toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {savedBudgets.map((budget, index) => (
                  <div key={index} className={styles.OrderAll}>
                    <div className={styles.OrderRes}>
                      <p className={styles.ResTitle}>ORÇAMENTO {index + 1}</p>

                      <div>
                        <p className={styles.ResName}>Tamanho</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.Tamanho}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Impressão</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoImpressao && (
                            <p className={styles.ResValue}>
                              {budget.codigoImpressao} - R${" "}
                              {parseFloat(budget.valorImpressao || "0").toFixed(
                                2
                              )}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {budget.codigoImpressao && (
                            <p className={styles.ResValue}>
                              {budget.descricaoImpressao}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Perfil</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoPerfil && (
                            <p className={styles.ResValue}>
                              {budget.codigoPerfil} - R${" "}
                              {parseFloat(budget.valorPerfilUm || "0").toFixed(
                                2
                              )}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {budget.codigoPerfilDois && (
                            <p className={styles.ResValue}>
                              {budget.codigoPerfilDois} - R${" "}
                              {parseFloat(
                                budget.valorPerfilDois || "0"
                              ).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Vidro</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoVidro && (
                            <p className={styles.ResValue}>
                              {budget.codigoVidro} - R${" "}
                              {parseFloat(budget.valorVidro || "0").toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {budget.codigoVidro && (
                            <p className={styles.ResValue}>
                              {budget.descricaoVidro}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Foam</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoFoam && (
                            <p className={styles.ResValue}>
                              {budget.codigoFoam} - R${" "}
                              {parseFloat(budget.valorFoam || "0").toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {budget.codigoFoam && (
                            <p className={styles.ResValue}>
                              {budget.descricaoFoam}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Paspatur</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoPaspatur && (
                            <p className={styles.ResValue}>
                              {budget.codigoPaspatur} - R${" "}
                              {parseFloat(budget.valorPaspatur || "0").toFixed(
                                2
                              )}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {budget.codigoPaspatur && (
                            <p className={styles.ResValue}>
                              {budget.descricaoPaspatur}
                            </p>
                          )}
                        </div>
                        {budget.dimensoesPaspatur && (
                          <p className={styles.ResValue}>
                            {budget.dimensoesPaspatur}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className={styles.ResName}>Colagem</p>
                        <div className={styles.OrderResValue}>
                          {budget.codigoColagem && (
                            <p className={styles.ResValue}>
                              {budget.codigoColagem} - R${" "}
                              {parseFloat(budget.valorColagem || "0").toFixed(
                                2
                              )}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {budget.codigoColagem && (
                            <p className={styles.ResValue}>
                              {budget.descricaoColagem}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Diversos</p>
                        <div className={styles.OrderResValue}>
                          {budget.instalacao && (
                            <p className={styles.ResValue}>
                              {budget.instalacao} - {budget.valorInstalacao}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {budget.instalacao && (
                            <p className={styles.ResValue}>
                              {budget.descricaoInstalacao}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Montagem</p>
                        <div className={styles.OrderResValue}>
                          {budget.montagem && (
                            <p className={styles.ResValue}>
                              {budget.montagem} - {budget.valorMontagem}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {budget.montagem && (
                            <p className={styles.ResValue}>
                              {budget.descricaoMontagem}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Entrega</p>
                        <div className={styles.OrderResValue}>
                          {budget.tipoEntrega && (
                            <p className={styles.ResValue}>
                              {budget.tipoEntrega}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className={styles.OrderRes}>
                        <p className={styles.ResTitle}>Pagamentos e prazos</p>

                        {/* <div>
                          <p className={styles.ResName}>Mão de obra</p>
                          <div className={styles.OrderResValue}>
                            {budget.maoDeObraExtra && (
                              <p className={styles.ResValue}>
                                {budget.maoDeObraExtra}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className={styles.ResName}>Forma de pagamento</p>
                          <div className={styles.OrderResValue}>
                            {budget.formaPagamento && (
                              <p className={styles.ResValue}>
                                {budget.formaPagamento}
                              </p>
                            )}
                          </div>
                        </div> */}

                        <div>
                          <p className={styles.ResName}>Prazo para entrega</p>
                          <div className={styles.OrderResValue}>
                            {budget.dataVencimento && (
                              <p className={styles.ResValue}>
                                {formatDate(budget.dataVencimento)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.OrderNotes}>
                        <p className={styles.ResName}>Observação</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>
                            {budget.observacoes}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.OrderRes}>
                      <p className={styles.ResTitle}>Valor total</p>
                      <div>
                        <p className={styles.ResTotal}>
                          R$ {parseFloat(budget.valorTotal || "0").toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.CtaOne}>
                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Data de entrega</p>
                    <input
                      type="date"
                      className={styles.FieldSaveDes}
                      placeholder=""
                      value={dataVencimento}
                      onChange={(e) => {
                        setDataVencimento(e.target.value);
                        localStorage.setItem("dataVencimento", e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Desconto (%)</p>

                    <input
                      id="Desconto"
                      type="number"
                      className={styles.FieldSaveDes}
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
                      className={styles.FieldObs}
                      placeholder=""
                      value={observacoes}
                      onChange={(e) => {
                        setObservacoes(e.target.value);
                        localStorage.setItem("observacoes", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.Cta}>
                {/* <Link href="/BudgetSave"> */}
                <div className={styles.WhatsButton} onClick={handleSaveBudget}>
                  <img className={styles.WhatsImg} src="./Save.png" alt="" />
                  <p className={styles.WhatsText}>SALVAR ORÇAMENTO</p>
                </div>
                {/* </Link> */}

                {/* <Link href="/BudgetSize"> */}
                <div
                  className={styles.PdfButton}
                  onClick={handleSaveMoreBudget}
                >
                  <img className={styles.WhatsImg} src="./MoreBud.png" alt="" />
                  <p className={styles.PdfText}>ORÇAR MAIS UM PRODUTO</p>
                </div>
                {/* </Link> */}

                {/* <Link href="/BudgetSize">
                  <div className={styles.EditButton}>
                    <img className={styles.WhatsImg} src="./MoreBud.png" alt="" />
                    <p className={styles.PdfText}>EDITAR ORÇAMENTO ATUAL</p>
                  </div>
                </Link> */}
              </div>
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
