import Head from "next/head";
import styles from "../../styles/BudgetDecision.module.scss";
import { useRouter } from "next/router";

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

  const [selectedOption, setSelectedOption] = useState("");
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

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

  let nomeCompleto: string = '';
  let Telefone: string = '';
  let email: string = '';
  let instalacao: string = '';
  let valorInstalacao: string = '';
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

  valorTotal = precoTotal.toString();


  if (typeof window !== "undefined") {
    nomeCompleto = localStorage.getItem("nomeCompleto") || '';
    Telefone = localStorage.getItem("Telefone") || '';
    email = localStorage.getItem("email") || '';
    instalacao = localStorage.getItem("instalacao") || '';
    valorInstalacao = localStorage.getItem("valorInstalacao") || '';
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
    mdf = localStorage.getItem("mdf") || '';
    codigoMdf = localStorage.getItem("codigoMdf") || '';
    vidro = localStorage.getItem("vidro") || '';
    espessuraVidro = localStorage.getItem("espessuraVidro") || '';
    espelho = localStorage.getItem("espelho") || '';
    espessuraEspelho = localStorage.getItem("espessuraEspelho") || '';
    codigoPerfil = localStorage.getItem("codigoPerfil") || '';
    espessuraPerfil = localStorage.getItem("espessuraPerfil") || '';
    Tamanho = localStorage.getItem("Tamanho") || '';
    tipoPessoa = localStorage.getItem("tipoPessoa") || '';
    obs = localStorage.getItem("obs") || '';
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

              {/* <div className={styles.BudgetHeadO}>
                <p className={styles.Title}>Valor total:</p>
              </div> */}
            </div>

            <div className={styles.linhaOrder}></div>

            <div className={styles.OrderData}>
              <div className={styles.OrderAll}>
                <div className={styles.OrderRes}>
                  <p className={styles.ResTitle}>Resumo do orçamento</p>

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
                        {impressao} - {tipoImpressao}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Perfil</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>
                        {codigoPerfil} - {espessuraPerfil}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Vidro</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>
                        {vidro} - {espessuraVidro}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Foam</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>{foam}</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Paspatur</p>
                    <div>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>
                          {paspatur} - {codigoPaspatur}
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
                      <p className={styles.ResValue}>{collage}</p>
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
                      <p className={styles.ResValue}></p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Forma de pagamento</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}></p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Prazo para entrega</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}></p>
                    </div>
                  </div>

                  <div className={styles.OrderNotes}>
                    <p className={styles.ResName}>Observação</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>
                        {obs}
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

              <div className={styles.CtaOne}>
                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Forma de pagamento</p>
                    <select
                      className={styles.SelectFieldPersonDes}
                      value={selectedOption}
                      onChange={handleSelectChange}
                    >
                      <option value="" disabled selected>
                        Defina a forma de pagamento
                      </option>
                      <option
                        value="A VISTA"
                        selected={selectedOption === "FÍSICA"}
                      >
                        A VISTA
                      </option>
                      <option
                        value="A PRAZO"
                        selected={selectedOption === "JURÍDICA"}
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
                    />
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Data de vencimento</p>
                    <input
                      type="date"
                      className={styles.FieldSaveDes}
                      placeholder=""
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
                    />
                  </div>
                </div>
              </div>

              <div className={styles.Cta}>
                <div className={styles.WhatsButton}>
                  <img className={styles.WhatsImg} src="./Save.png" alt="" />
                  <p className={styles.WhatsText}>SALVAR ORÇAMENTO</p>
                </div>

                <div className={styles.PdfButton}>
                  <img className={styles.WhatsImg} src="./MoreBud.png" alt="" />
                  <p className={styles.PdfText}>ORÇAR MAIS UM PRODUTO</p>
                </div>
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
