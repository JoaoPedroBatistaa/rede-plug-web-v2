import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMenu } from "../../components/Context/context";
import styles from "../../styles/BudgetPerfil.module.scss";

import { getDocs } from "firebase/firestore";
import { collection, db } from "../../../firebase";

interface Foam {
  id: string;

  codigo: string;
  descricao: string;
  margemLucro: number;
  valorMetro: number;
  valorPerda: number;
  fabricante: string;
  largura: number;
}

export default function BudgetPerfil() {
  const router = useRouter();
  const [hasBudgets, setHasBudgets] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const budgets = localStorage.getItem("budgets");

    if (budgets) {
      setHasBudgets(true);
    }

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const [produtos, setProdutos] = useState<Foam[]>([]);

  const [selectedOption, setSelectedOption] = useState(() => {
    if (typeof window !== "undefined") {
      const codigoPerfil = localStorage.getItem("codigoPerfil");
      return codigoPerfil ? codigoPerfil : "";
    }
  });

  const [selectedOption2, setSelectedOption2] = useState(() => {
    if (typeof window !== "undefined") {
      const codigoPerfil2 = localStorage.getItem("codigoPerfil2");
      return codigoPerfil2 ? codigoPerfil2 : "";
    }
  });

  const [espessura, setEspessura] = useState("");
  const { openMenu, setOpenMenu } = useMenu();
  const [precoTotal, setPrecoTotal] = useState(0);

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, `Login/lB2pGqkarGyq98VhMGM6/Perfil`);
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          descricao: data.descricao,
          codigo: data.codigo,
          margemLucro: data.margemLucro,
          valorMetro: data.valorMetro,
          valorPerda: data.valorPerda,
          fabricante: data.fabricante,
          largura: data.largura,
        };
      });
      setProdutos(budgetList);
    };
    fetchData();
  }, []);

  const [preco, setPreco] = useState(() => {
    if (typeof window !== "undefined") {
      const valorPerfil = localStorage.getItem("valorPerfil");
      return valorPerfil ? Number(valorPerfil) : 0;
    }
  });

  useEffect(() => {
    let totalPreco = 0;

    // Logic for selectedOption
    if (selectedOption) {
      const selectedProduto1 = produtos.find(
        (produto) => produto.codigo === selectedOption
      );
      if (selectedProduto1) {
        const tamanho =
          localStorage.getItem("novoTamanho") ||
          localStorage.getItem("Tamanho") ||
          "0x0";
        const [altura, largura] = tamanho.split("x").map(Number);

        const valor1 =
          ((altura * 2 + largura * 2 + selectedProduto1.largura * 4) / 100) *
          selectedProduto1.valorMetro;
        const perda1 = (valor1 / 100) * selectedProduto1.valorPerda;
        const lucro1 = ((valor1 + perda1) * selectedProduto1.margemLucro) / 100;

        localStorage.setItem(
          "metroPerfil",
          selectedProduto1.valorMetro.toString()
        );
        localStorage.setItem(
          "perdaPerfil",
          selectedProduto1.valorPerda.toString()
        );
        localStorage.setItem(
          "lucroPerfil",
          selectedProduto1.margemLucro.toString()
        );
        localStorage.setItem(
          "larguraPerfil",
          selectedProduto1.largura.toString()
        );

        const priceForOption1 = valor1 + perda1 + lucro1;

        localStorage.setItem("valorPerfilUm", priceForOption1.toString());

        totalPreco += priceForOption1;
      }
    }

    // Logic for selectedOption2
    if (selectedOption2) {
      const selectedProduto2 = produtos.find(
        (produto) => produto.codigo === selectedOption2
      );
      if (selectedProduto2) {
        const tamanho =
          localStorage.getItem("novoTamanho") ||
          localStorage.getItem("Tamanho") ||
          "0x0";
        const [altura, largura] = tamanho.split("x").map(Number);

        const valor2 =
          ((altura * 2 + largura * 2 + selectedProduto2.largura * 4) / 100) *
          selectedProduto2.valorMetro;
        const perda2 = (valor2 / 100) * selectedProduto2.valorPerda;
        const lucro2 = ((valor2 + perda2) * selectedProduto2.margemLucro) / 100;

        localStorage.setItem("codigoPerfilDois", selectedOption2);
        localStorage.setItem(
          "metroPerfilDois",
          selectedProduto2.valorMetro.toString()
        );
        localStorage.setItem(
          "perdaPerfilDois",
          selectedProduto2.valorPerda.toString()
        );
        localStorage.setItem(
          "lucroPerfilDois",
          selectedProduto2.margemLucro.toString()
        );
        localStorage.setItem(
          "larguraPerfilDois",
          selectedProduto2.largura.toString()
        );

        const priceForOption2 = valor2 + perda2 + lucro2;

        localStorage.setItem("valorPerfilDois", priceForOption2.toString());

        totalPreco += priceForOption2;
      }
    }

    setPreco(totalPreco);
    localStorage.setItem("valorPerfil", totalPreco.toString());
  }, [selectedOption, selectedOption2, espessura, produtos]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Salve o ID do intervalo para limpar mais tarde
      if (typeof window !== "undefined") {
        const valorPerfil = Number(localStorage.getItem("valorPerfil"));
        const valorFoam = Number(localStorage.getItem("valorFoam"));
        const valorVidro = Number(localStorage.getItem("valorVidro"));
        const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
        const valorImpressao = Number(localStorage.getItem("valorImpressao"));
        const valorColagem = Number(localStorage.getItem("valorColagem"));
        const valorMontagem = Number(localStorage.getItem("valorMontagem"));
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

  useEffect(() => {
    if (selectedOption) {
      if (typeof window !== "undefined") {
        localStorage.setItem("espessuraPerfil", espessura);
      }
    }
  }, [selectedOption, espessura]);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("codigoPerfil", event.target.value);
  };

  const handleSelectChange2 = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption2(event.target.value);
    localStorage.setItem("codigoPerfil2", event.target.value);
  };

  const handleEspessuraChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEspessura(event.target.value);
  };

  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    if (typeof window !== "undefined") {
      const valorPerfil = Number(localStorage.getItem("valorPerfil"));
      const valorFoam = Number(localStorage.getItem("valorFoam"));
      const valorVidro = Number(localStorage.getItem("valorVidro"));
      const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
      const valorMontagem = Number(localStorage.getItem("valorMontagem"));
      const tamanho = localStorage.getItem("Tamanho") || "0x0";

      if (
        valorPerfil ||
        valorFoam ||
        valorVidro ||
        valorMontagem ||
        (valorPaspatur && tamanho !== "0x0") ||
        tamanho !== "x"
      ) {
        window.localStorage.setItem("preco", JSON.stringify(precoTotal));

        toast.success("Finalizando Orçamento!");
        setTimeout(() => {
          window.location.href = "/BudgetDecision";
        }, 500);
      } else {
        toast.error("Informe os dados necessarios");
      }
    }
  }

  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 100);
  };

  function handleRemoveProduct() {
    // Limpa os valores do localStorage
    localStorage.removeItem("valorPerfil");
    localStorage.removeItem("metroPerfil");
    localStorage.removeItem("perdaPerfil");
    localStorage.removeItem("lucroPerfil");
    localStorage.removeItem("larguraPerfil");
    localStorage.removeItem("descricaoPerfil");
    localStorage.removeItem("codigoPerfil");
    localStorage.removeItem("perfil");

    // Chama setPreco(0)
    setPreco(0);
    setSelectedOption("");
  }

  const handleRemoveProduct1 = () => {
    setSelectedOption("");
    localStorage.removeItem("codigoPerfil");
  };

  const handleRemoveProduct2 = () => {
    setSelectedOption2("");
    setShowSecondInput(false);
    localStorage.removeItem("codigoPerfil2");
  };

  const [showSecondInput, setShowSecondInput] = useState(false);

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
            <p className={styles.BudgetTitle}>Qual perfil será utilizado?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor do perfil</p>
                <p className={styles.Value}>R${preco ? preco.toFixed(2) : 0}</p>
              </div>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R${precoTotal.toFixed(2)}</p>
              </div>

              <button
                className={styles.FinishButton}
                onClick={handleButtonFinish}
              >
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Finalizar Orçamento</span>
              </button>

              {hasBudgets && (
                <button
                  className={styles.DesistirOrcamento}
                  onClick={handleButtonFinish}
                >
                  <img
                    src="./finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>
                    Desistir Do Orçamento
                  </span>
                </button>
              )}
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo qual perfil será utilizado no pedido
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <select
                id="codigo"
                className={styles.SelectField}
                value={selectedOption}
                onChange={handleSelectChange}
              >
                <option value="" disabled selected>
                  Selecione um código
                </option>
                {[...produtos]
                  .sort((a, b) => Number(a.codigo) - Number(b.codigo))
                  .map((produto) => (
                    <option key={produto.codigo} value={produto.codigo}>
                      {produto.codigo} - {produto.descricao}
                    </option>
                  ))}
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>.</p>

              <button
                className={styles.removeProduct}
                onClick={handleRemoveProduct1}
              >
                Remover
              </button>
            </div>

            {!showSecondInput && (
              <>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>.</p>

                  <button
                    className={styles.addProduct}
                    onClick={() => setShowSecondInput(true)}
                  >
                    Adicionar mais um perfil
                  </button>
                </div>
              </>
            )}

            {showSecondInput && (
              <>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Código 2</p>
                  <select
                    id="codigo2"
                    className={styles.SelectField}
                    value={selectedOption2}
                    onChange={handleSelectChange2}
                  >
                    <option value="" disabled selected>
                      Selecione um código
                    </option>
                    {[...produtos]
                      .sort((a, b) => Number(a.codigo) - Number(b.codigo))
                      .map((produto) => (
                        <option key={produto.codigo} value={produto.codigo}>
                          {produto.codigo} - {produto.descricao}
                        </option>
                      ))}
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>.</p>
                  <button
                    className={styles.removeProduct}
                    onClick={handleRemoveProduct2}
                  >
                    Remover
                  </button>
                </div>
              </>
            )}
          </div>

          <p className={styles.Preview}>PREVIEW</p>

          <div className={styles.PreviewContainer}>
            <div className={styles.PreviewImgContainer}>
              <img src="./molduraPerfil.png" className={styles.PreviewImg} />
            </div>

            <p className={styles.PreviewSize}>{espessura} CM</p>
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
