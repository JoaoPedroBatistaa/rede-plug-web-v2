import Head from "next/head";
import styles from "../../styles/BudgetDecision.module.scss";
import { useRouter } from "next/router";

import { toast } from 'react-toastify';

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuHome from "@/components/SideMenuHome";
import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";

import { db, doc, getDoc } from "../../../firebase";

type UserDataType = {
  Tamanho: string;
  impressao: string;
  tipoImpressao: string;
  codigoPerfil: string;
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
};

export default function BudgetDecision() {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false); // Inicializa o estado openMenu

  const [formaPagamento, setFormaPagamento] = useState("");
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
  const [valorVidro, setValorVidro] = useState("");
  const [valorPaspatur, setValorPaspatur] = useState("");
  const [valorImpressao, setValorImpressao] = useState("");
  const [valorColagem, setValorColagem] = useState("");
  const [valorInstalacao, setValorInstalacao] = useState("");
  const [precoTotal, setPrecoTotal] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (typeof window !== "undefined") {
        setValorPerfil(localStorage.getItem("valorPerfil") || '');
        setValorFoam(localStorage.getItem("valorFoam") || '');
        setValorVidro(localStorage.getItem("valorVidro") || '');
        setValorPaspatur(localStorage.getItem("valorPaspatur") || '');
        setValorImpressao(localStorage.getItem("valorImpressao") || '');
        setValorColagem(localStorage.getItem("valorColagem") || '');
        setValorInstalacao(localStorage.getItem("valorInstalacao") || '');

        const total = Number(valorPaspatur) + Number(valorPerfil) + Number(valorFoam) + Number(valorVidro) + Number(valorImpressao) + Number(valorInstalacao);

        if (!isNaN(total)) {
        }
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

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




  let nomeCompleto: string = '';
  let Telefone: string = '';
  let email: string = '';
  let instalacao: string = '';
  let tipoEntrega: string = '';
  let valorEntrega: string = '';
  let impressao: string = '';
  let tipoImpressao: string = '';
  let fileInput: string = '';
  let collage: string = '';
  let paspatur: string = '';
  let codigoPaspatur: string = '';
  let dimensoesPaspatur: string = '';
  let foam: string = '';
  let codigoFoam: string = '';
  let codigoImpressao: string = '';
  let codigoVidro: string = '';
  let codigoColagem: string = '';
  let mdf: string = '';
  let codigoMdf: string = '';
  let vidro: string = '';
  let espessuraVidro: string = '';
  let espelho: string = '';
  let espessuraEspelho: string = '';
  let codigoPerfil: string = '';
  let espessuraPerfil: string = '';
  let Tamanho: string = '';
  let tipoPessoa: string = '';
  let valorTotal: string = '';
  let obs: string = '';


  if (typeof window !== "undefined") {
    nomeCompleto = localStorage.getItem("nomeCompleto") || '';
    Telefone = localStorage.getItem("Telefone") || '';
    email = localStorage.getItem("email") || '';
    instalacao = localStorage.getItem("instalacao") || '';
    tipoEntrega = localStorage.getItem("tipoEntrega") || '';
    valorEntrega = localStorage.getItem("valorEntrega") || '';
    impressao = localStorage.getItem("impressao") || '';
    tipoImpressao = localStorage.getItem("tipoImpressao") || '';
    fileInput = localStorage.getItem("fileInput") || '';
    collage = localStorage.getItem("collage") || '';
    paspatur = localStorage.getItem("paspatur") || '';
    codigoPaspatur = localStorage.getItem("codigoPaspatur") || '';
    dimensoesPaspatur = localStorage.getItem("dimensoesPaspatur") || '';
    foam = localStorage.getItem("foam") || '';
    codigoFoam = localStorage.getItem("codigoFoam") || '';
    codigoImpressao = localStorage.getItem("codigoImpressao") || '';
    codigoVidro = localStorage.getItem("codigoVidro") || '';
    codigoColagem = localStorage.getItem("codigoColagem") || '';
    mdf = localStorage.getItem("mdf") || '';
    codigoMdf = localStorage.getItem("codigoMdf") || '';
    vidro = localStorage.getItem("vidro") || '';
    espessuraVidro = localStorage.getItem("espessuraVidro") || '';
    espelho = localStorage.getItem("espelho") || '';
    espessuraEspelho = localStorage.getItem("espessuraEspelho") || '';
    codigoPerfil = localStorage.getItem("codigoPerfil") || '';
    espessuraPerfil = localStorage.getItem("espessuraPerfil") || '';
    Tamanho = localStorage.getItem("novoTamanho") || localStorage.getItem("Tamanho") || '';
    tipoPessoa = localStorage.getItem("tipoPessoa") || '';
    obs = localStorage.getItem("obs") || '';
  }

  const [maoDeObraExtra, setMaoDeObraExtra] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Atualizando o valor do estado e salvando no localStorage ao mudar o select
  const handleSelectChange = (e: any) => {
    setFormaPagamento(e.target.value);
    localStorage.setItem('formaPagamento', e.target.value);
  };

  // Criando um useEffect para monitorar a mudança dos estados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localFormaPagamento = localStorage.getItem("formaPagamento");
      const localMaoDeObraExtra = localStorage.getItem("maoDeObraExtra");
      const localDataVencimento = localStorage.getItem("dataVencimento");
      const localObservacoes = localStorage.getItem("observacoes");

      if (localFormaPagamento) setFormaPagamento(localFormaPagamento);
      if (localMaoDeObraExtra) setMaoDeObraExtra(localMaoDeObraExtra);
      if (localDataVencimento) setDataVencimento(localDataVencimento);
      if (localObservacoes) setObservacoes(localObservacoes);
    }
  }, []);

  const novoValorTotal = precoTotal + parseFloat(maoDeObraExtra || '0');
  valorTotal = novoValorTotal.toString();

  function formatDate(date: any) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Aqui nós adicionamos 1 ao dia atual.
    const dia = newDate.getDate().toString().padStart(2, '0');
    const mes = (newDate.getMonth() + 1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
    const ano = newDate.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }


  // SALVAR ORÇAMENTO COMO OBJETO

  const [budgetId, setBudgetId] = useState<number>(0);

  function saveBudget(id: string, budgetData: any) {
    const existingBudgets = JSON.parse(localStorage.getItem('budgets') || '{}');
    existingBudgets[id] = budgetData;
    localStorage.setItem('budgets', JSON.stringify(existingBudgets));
  }

  const handleSaveMoreBudget = () => {
    let newBudgetId = budgetId;

    const localBudgetId = localStorage.getItem('budgetId');
    if (localBudgetId) {
      newBudgetId = Number(localBudgetId) + 1;
      localStorage.setItem('budgetId', newBudgetId.toString());
    } else {
      newBudgetId += 1;
      localStorage.setItem('budgetId', newBudgetId.toString());
    }

    const budgetData = {
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
      espessuraPerfil,
      Tamanho,
      valorTotal,
      maoDeObraExtra,
      dataVencimento,
      observacoes,
      formaPagamento // forma de pagamento
    };

    saveBudget(newBudgetId.toString(), budgetData);

    const itensParaManter = ['userId', 'ally-supports-cache', 'budgets', 'budgetId'];
    const todasAsChaves = Object.keys(localStorage);
    todasAsChaves.forEach(chave => {
      if (!itensParaManter.includes(chave)) {
        localStorage.removeItem(chave);
      }
    });

    router.push('/BudgetSize');
  };

  const handleSaveBudget = () => {
    let newBudgetId = budgetId;

    const localBudgetId = localStorage.getItem('budgetId');
    if (localBudgetId) {
      newBudgetId = Number(localBudgetId) + 1;
      localStorage.setItem('budgetId', newBudgetId.toString());
    } else {
      newBudgetId += 1;
      localStorage.setItem('budgetId', newBudgetId.toString());
    }

    const budgetData = {
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
      espessuraPerfil,
      Tamanho,
      valorTotal,
      maoDeObraExtra,
      dataVencimento,
      observacoes,
      formaPagamento // forma de pagamento
    };

    if (!formaPagamento || formaPagamento === "") {
      toast.error("Por favor, defina a forma de pagamento");
      return; // Termina a execução da função
    }

    if (!dataVencimento || dataVencimento === "") {
      toast.error("Por favor, defina a data de vencimento");
      return; // Termina a execução da função
    }

    saveBudget(newBudgetId.toString(), budgetData);

    router.push('/BudgetSave');
  };

  const [savedBudgets, setSavedBudgets] = useState<any[]>([]);


  useEffect(() => {
    const localBudgets = localStorage.getItem('budgets');
    if (localBudgets) {
      const budgetsObject = JSON.parse(localBudgets);
      const budgetsArray: any[] = Object.values(budgetsObject);
      setSavedBudgets(budgetsArray);
    }
  }, []);

  const totalSavedBudgets = savedBudgets ? savedBudgets.reduce((sum, budget) => {
    return sum + parseFloat(budget.valorTotal || '0');
  }, 0) : 0;

  const grandTotal = totalSavedBudgets + parseFloat(valorTotal || '0') + parseFloat(maoDeObraExtra || '0');
  if (typeof window !== "undefined") {
    localStorage.setItem("grandTotal", grandTotal);
  }



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
                <p className={styles.SubTitle}>Valor total: R$ {parseFloat(grandTotal || '0').toFixed(2)}</p>
              </div>
            </div>

            <div className={styles.linhaOrder}></div>

            <div className={styles.OrderData}>
              <div className={styles.Budgets}>
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
                        <p className={styles.ResValue}>
                          {codigoImpressao} - R$ {parseFloat(valorImpressao || '0').toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className={styles.ResName}>Perfil</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>
                          {codigoPerfil} - R$ {parseFloat(valorPerfil || '0').toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className={styles.ResName}>Vidro</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>
                          {codigoVidro} - R$ {parseFloat(valorVidro || '0').toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className={styles.ResName}>Foam</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>{codigoFoam} - R$ {parseFloat(valorFoam || '0').toFixed(2)}</p>
                      </div>
                    </div>

                    <div>
                      <p className={styles.ResName}>Paspatur</p>
                      <div>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>
                            {codigoPaspatur} - R$ {parseFloat(valorPaspatur || '0').toFixed(2)}
                          </p>
                        </div>

                        <p className={styles.ResValue}>
                          {dimensoesPaspatur}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className={styles.ResName}>Colagem</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>{codigoColagem} - R$ {parseFloat(valorColagem || '0').toFixed(2)}</p>
                      </div>
                    </div>
                    {/* 
                  <div>
                    <p className={styles.ResName}>Impressão</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>SIM</p>
                    </div>
                  </div> */}

                    <div>
                      <p className={styles.ResName}>Instalação</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>
                          {instalacao} - {valorInstalacao}
                        </p>
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

                    <div>
                      <p className={styles.ResName}>Mão de obra externa</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>{maoDeObraExtra}</p>
                      </div>
                    </div>

                    <div>
                      <p className={styles.ResName}>Forma de pagamento</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>{formaPagamento}</p>
                      </div>
                    </div>

                    <div>
                      <p className={styles.ResName}>Prazo para entrega</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>{formatDate(dataVencimento)}</p>
                      </div>
                    </div>

                    <div className={styles.OrderNotes}>
                      <p className={styles.ResName}>Observação</p>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>
                          {observacoes}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.OrderRes}>
                    <p className={styles.ResTitle}>Valor total</p>
                    <div>
                      <p className={styles.ResTotal}>R$ {parseFloat(valorTotal || '0').toFixed(2)}</p>
                    </div>
                  </div>
                </div>

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
                          <p className={styles.ResValue}>
                            {budget.codigoImpressao} - R$ {parseFloat(budget.valorImpressao || '0').toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Perfil</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>
                            {budget.codigoPerfil} - R$ {parseFloat(budget.valorPerfil || '0').toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Vidro</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>
                            {budget.codigoVidro} - R$ {parseFloat(budget.valorVidro || '0').toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Foam</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.codigoFoam} - R$ {parseFloat(budget.valorFoam || '0').toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Paspatur</p>
                        <div>
                          <div className={styles.OrderResValue}>
                            <p className={styles.ResValue}>
                              {budget.codigoPaspatur} - R$ {parseFloat(budget.valorPaspatur || '0').toFixed(2)}
                            </p>
                          </div>
                          <p className={styles.ResValue}>
                            {budget.dimensoesPaspatur}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Colagem</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.codigoColagem} - R$ {parseFloat(budget.valorColagem || '0').toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Instalação</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>
                            {budget.instalacao} - {budget.valorInstalacao}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Entrega</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.tipoEntrega}</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.OrderRes}>
                      <p className={styles.ResTitle}>Pagamentos e prazos</p>

                      <div>
                        <p className={styles.ResName}>Mão de obra externa</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.maoDeObraExtra}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Forma de pagamento</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{budget.formaPagamento}</p>
                        </div>
                      </div>

                      <div>
                        <p className={styles.ResName}>Prazo para entrega</p>
                        <div className={styles.OrderResValue}>
                          <p className={styles.ResValue}>{formatDate(budget.dataVencimento)}</p>
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
                        <p className={styles.ResTotal}>R$ {parseFloat(budget.valorTotal || '0').toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.CtaOne}>
                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Forma de pagamento</p>
                    <select
                      className={styles.SelectFieldPersonDes}
                      value={formaPagamento}
                      onChange={handleSelectChange}
                    >
                      <option value="" disabled selected>
                        Defina a forma de pagamento
                      </option>
                      <option
                        value="A VISTA"
                        selected={formaPagamento === "A VISTA"}
                      >
                        A VISTA
                      </option>
                      <option
                        value="A PRAZO"
                        selected={formaPagamento === "A PRAZO"}
                      >
                        A PRAZO
                      </option>
                    </select>
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Mão de obra extra</p>
                    <input
                      type="text"
                      className={styles.FieldSaveDes}
                      placeholder=""
                      value={maoDeObraExtra}
                      onKeyPress={(e) => {
                        const char = e.key;
                        if (!(/[0-9.,]/.test(char))) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        setMaoDeObraExtra(e.target.value);
                        localStorage.setItem('maoDeObraExtra', e.target.value);
                      }}
                    />


                  </div>
                </div>

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
                        localStorage.setItem('dataVencimento', e.target.value);
                      }}
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
                        localStorage.setItem('observacoes', e.target.value);
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
                <div className={styles.PdfButton} onClick={handleSaveMoreBudget}>
                  <img className={styles.WhatsImg} src="./MoreBud.png" alt="" />
                  <p className={styles.PdfText}>ORÇAR MAIS UM PRODUTO</p>
                </div>
                {/* </Link> */}
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
