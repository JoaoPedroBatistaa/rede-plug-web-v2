import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/BudgetPaspatur.module.scss";

import HeaderBudget from "@/components/HeaderBudget";
import SideMenuBudget from "@/components/SideMenuBudget";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMenu } from "../../components/Context/context";

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

export default function BudgetPaspatur() {
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

  const { openMenu, setOpenMenu } = useMenu();
  const [selectedOptionPaspatur, setSelectedOptionPaspatur] = useState("");

  const [selectedOptionCodigoPaspatur, setSelectedOptionCodigoPaspatur] =
    useState(() => {
      if (typeof window !== "undefined") {
        const codigoPaspatur = localStorage.getItem("codigoPaspatur");
        return codigoPaspatur ? codigoPaspatur : "";
      }
    });

  const [produtos, setProdutos] = useState<Foam[]>([]);

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  // Fetch produtos do banco de dados
  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(
        db,
        `Login/lB2pGqkarGyq98VhMGM6/Paspatur`
      );
      console.log("Fetching from: ", dbCollection);
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        const budget: Foam = {
          id: doc.id,
          descricao: data.descricao,
          codigo: data.codigo,
          margemLucro: data.margemLucro,
          valorMetro: data.valorMetro,
          valorPerda: data.valorPerda,
          fabricante: data.fabricante,
          largura: data.largura,
        };
        console.log("Fetched data:", budget);
        return budget;
      });
      setProdutos(budgetList);
      console.log("Set data: ", budgetList);
    };
    fetchData();
  }, []);

  const [larguraEsquerda, setLarguraEsquerda] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("larguraEsquerda") || "";
    }
    return "";
  });

  const [larguraInferior, setLarguraInferior] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("larguraInferior") || "";
    }
    return "";
  });

  const [larguraSuperior, setLarguraSuperior] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("larguraSuperior") || "";
    }
    return "";
  });

  const [larguraDireita, setLarguraDireita] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("larguraDireita") || "";
    }
    return "";
  });

  const handleSelectChangePaspatur = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionPaspatur(event.target.value);
  };

  const handleInputChangeEsquerda = (event: ChangeEvent<HTMLInputElement>) => {
    const inputElement = document.getElementById(
      "larguraEsquerda"
    ) as HTMLInputElement;
    const inputValue = inputElement.value;

    const tamanho = localStorage.getItem("Tamanho") || "0x0";
    const [altura, largura] = tamanho.split("x").map(Number);

    setLarguraEsquerda(inputValue);
    localStorage.setItem("larguraEsquerda", inputValue);

    if (
      !larguraEsquerda &&
      !larguraSuperior &&
      !larguraDireita &&
      !larguraInferior
    ) {
      setTimeout(() => {
        setLarguraSuperior(localStorage.getItem("larguraEsquerda") || "");
        localStorage.setItem(
          "larguraSuperior",
          localStorage.getItem("larguraEsquerda") || ""
        );

        setLarguraDireita(localStorage.getItem("larguraEsquerda") || "");
        localStorage.setItem(
          "larguraDireita",
          localStorage.getItem("larguraEsquerda") || ""
        );

        setLarguraInferior(localStorage.getItem("larguraEsquerda") || "");
        localStorage.setItem(
          "larguraInferior",
          localStorage.getItem("larguraEsquerda") || ""
        );

        let novoTamanho = `${
          altura +
          Number(localStorage.getItem("larguraEsquerda")) +
          Number(localStorage.getItem("larguraEsquerda"))
        }x${
          largura +
          (Number(localStorage.getItem("larguraEsquerda")) +
            Number(localStorage.getItem("larguraEsquerda")))
        }`;
        localStorage.setItem("novoTamanho", novoTamanho);
      }, 1000);
    } else if (larguraDireita && larguraInferior && larguraSuperior) {
      let novoTamanho = `${
        altura +
        Number(localStorage.getItem("larguraSuperior")) +
        Number(localStorage.getItem("larguraInferior"))
      }x${
        largura +
        (Number(localStorage.getItem("larguraEsquerda")) +
          Number(localStorage.getItem("larguraDireita")))
      }`;
      localStorage.setItem("novoTamanho", novoTamanho);
    }
  };

  const handleInputChangeDireita = () => {
    const inputElement = document.getElementById(
      "larguraDireita"
    ) as HTMLInputElement;
    const inputValue = inputElement.value;

    setLarguraDireita(inputValue);
    localStorage.setItem("larguraDireita", inputValue);

    const tamanho = localStorage.getItem("Tamanho") || "0x0";
    const [altura, largura] = tamanho.split("x").map(Number);

    if (
      !larguraEsquerda &&
      !larguraSuperior &&
      !larguraDireita &&
      !larguraInferior
    ) {
      setTimeout(() => {
        setLarguraSuperior(localStorage.getItem("larguraDireita") || "");
        localStorage.setItem(
          "larguraSuperior",
          localStorage.getItem("larguraDireita") || ""
        );

        setLarguraEsquerda(localStorage.getItem("larguraDireita") || "");
        localStorage.setItem(
          "larguraEsquerda",
          localStorage.getItem("larguraDireita") || ""
        );

        setLarguraInferior(localStorage.getItem("larguraDireita") || "");
        localStorage.setItem(
          "larguraInferior",
          localStorage.getItem("larguraDireita") || ""
        );

        let novoTamanho = `${
          altura +
          Number(localStorage.getItem("larguraDireita")) +
          Number(localStorage.getItem("larguraDireita"))
        }x${
          largura +
          (Number(localStorage.getItem("larguraDireita")) +
            Number(localStorage.getItem("larguraDireita")))
        }`;
        localStorage.setItem("novoTamanho", novoTamanho);
      }, 1000);
    } else if (larguraEsquerda && larguraInferior && larguraSuperior) {
      let novoTamanho = `${
        altura +
        Number(localStorage.getItem("larguraSuperior")) +
        Number(localStorage.getItem("larguraInferior"))
      }x${
        largura +
        (Number(localStorage.getItem("larguraEsquerda")) +
          Number(localStorage.getItem("larguraDireita")))
      }`;
      localStorage.setItem("novoTamanho", novoTamanho);
    }
  };

  const handleInputChangeInferior = () => {
    const inputElement = document.getElementById(
      "larguraInferior"
    ) as HTMLInputElement;
    const inputValue = inputElement.value;

    setLarguraInferior(inputValue);
    localStorage.setItem("larguraInferior", inputValue);

    const tamanho = localStorage.getItem("Tamanho") || "0x0";
    const [altura, largura] = tamanho.split("x").map(Number);

    if (
      !larguraEsquerda &&
      !larguraSuperior &&
      !larguraDireita &&
      !larguraInferior
    ) {
      setTimeout(() => {
        setLarguraSuperior(localStorage.getItem("larguraInferior") || "");
        localStorage.setItem(
          "larguraSuperior",
          localStorage.getItem("larguraInferior") || ""
        );

        setLarguraEsquerda(localStorage.getItem("larguraInferior") || "");
        localStorage.setItem(
          "larguraEsquerda",
          localStorage.getItem("larguraInferior") || ""
        );

        setLarguraDireita(localStorage.getItem("larguraInferior") || "");
        localStorage.setItem(
          "larguraDireita",
          localStorage.getItem("larguraInferior") || ""
        );

        let novoTamanho = `${
          altura +
          Number(localStorage.getItem("larguraInferior")) +
          Number(localStorage.getItem("larguraInferior"))
        }x${
          largura +
          (Number(localStorage.getItem("larguraInferior")) +
            Number(localStorage.getItem("larguraInferior")))
        }`;
        localStorage.setItem("novoTamanho", novoTamanho);
      }, 1000);
    } else if (larguraEsquerda && larguraDireita && larguraSuperior) {
      let novoTamanho = `${
        altura +
        Number(localStorage.getItem("larguraSuperior")) +
        Number(localStorage.getItem("larguraInferior"))
      }x${
        largura +
        (Number(localStorage.getItem("larguraEsquerda")) +
          Number(localStorage.getItem("larguraDireita")))
      }`;
      localStorage.setItem("novoTamanho", novoTamanho);
    }
  };

  const handleInputChangeSuperior = (event: ChangeEvent<HTMLInputElement>) => {
    const inputElement = document.getElementById(
      "larguraSuperior"
    ) as HTMLInputElement;
    const inputValue = inputElement.value;

    setLarguraSuperior(inputValue);
    localStorage.setItem("larguraSuperior", inputValue);

    const tamanho = localStorage.getItem("Tamanho") || "0x0";
    const [altura, largura] = tamanho.split("x").map(Number);

    if (
      !larguraEsquerda &&
      !larguraSuperior &&
      !larguraDireita &&
      !larguraInferior
    ) {
      setTimeout(() => {
        setLarguraInferior(localStorage.getItem("larguraSuperior") || "");
        localStorage.setItem(
          "larguraInferior",
          localStorage.getItem("larguraSuperior") || ""
        );

        setLarguraEsquerda(localStorage.getItem("larguraSuperior") || "");
        localStorage.setItem(
          "larguraEsquerda",
          localStorage.getItem("larguraSuperior") || ""
        );

        setLarguraDireita(localStorage.getItem("larguraSuperior") || "");
        localStorage.setItem(
          "larguraDireita",
          localStorage.getItem("larguraSuperior") || ""
        );

        let novoTamanho = `${
          altura +
          Number(localStorage.getItem("larguraSuperior")) +
          Number(localStorage.getItem("larguraSuperior"))
        }x${
          largura +
          (Number(localStorage.getItem("larguraSuperior")) +
            Number(localStorage.getItem("larguraSuperior")))
        }`;
        localStorage.setItem("novoTamanho", novoTamanho);
      }, 1000);
    } else if (larguraEsquerda && larguraDireita && larguraInferior) {
      let novoTamanho = `${
        altura +
        Number(localStorage.getItem("larguraSuperior")) +
        Number(localStorage.getItem("larguraInferior"))
      }x${
        largura +
        (Number(localStorage.getItem("larguraEsquerda")) +
          Number(localStorage.getItem("larguraDireita")))
      }`;
      localStorage.setItem("novoTamanho", novoTamanho);
    }
  };

  function handleButtonFinish(event: MouseEvent<HTMLButtonElement>) {
    if (typeof window !== "undefined") {
      const valorPerfil = Number(localStorage.getItem("valorPerfil"));
      const valorFoam = Number(localStorage.getItem("valorFoam"));
      const valorVidro = Number(localStorage.getItem("valorVidro"));
      const valorMontagem = Number(localStorage.getItem("valorMontagem"));
      const valorPaspatur = Number(localStorage.getItem("valorPaspatur"));
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

  const handleSelectChangeCodigoPaspatur = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionCodigoPaspatur(event.target.value);
    localStorage.setItem("codigoPaspatur", event.target.value);
  };

  const [preco, setPreco] = useState(() => {
    if (typeof window !== "undefined") {
      const valorPaspatur = localStorage.getItem("valorPaspatur");
      return valorPaspatur ? Number(valorPaspatur) : 0;
    }
  });

  const [precoPerfil, setPrecoPerfil] = useState(0);
  const [precoFoam, setPrecoFoam] = useState(0);
  const [precoVidro, setPrecoVidro] = useState(0);
  const [precoImpressao, setPrecoImpressao] = useState(0);
  const [precoColagem, setPrecoColagem] = useState(0);
  const [precoTotal, setPrecoTotal] = useState(0);

  // useEffect(() => {
  //   if (larguraInferior || larguraEsquerda) {
  //     const tamanho = localStorage.getItem("Tamanho") || "0x0";
  //     const [altura, largura] = tamanho.split('x').map(Number);

  //     const novaAltura = altura + (Number(larguraInferior) * 2);
  //     const novaLargura = largura + (Number(larguraEsquerda) * 2);
  //     const novoTamanho = `${novaAltura}x${novaLargura}`;

  //     localStorage.setItem("Tamanho", novoTamanho);
  //   }
  // }, [larguraInferior, larguraEsquerda]);

  useEffect(() => {
    const metroPerfil = localStorage.getItem("metroPerfil");
    const perdaPerfil = localStorage.getItem("perdaPerfil");
    const lucroPerfil = localStorage.getItem("lucroPerfil");
    const perfil = localStorage.getItem("larguraPerfil");

    const metroVidro = localStorage.getItem("metroVidro");
    const perdaVidro = localStorage.getItem("perdaVidro");
    const lucroVidro = localStorage.getItem("lucroVidro");

    const metroFoam = localStorage.getItem("metroFoam");
    const perdaFoam = localStorage.getItem("perdaFoam");
    const lucroFoam = localStorage.getItem("lucroFoam");

    const metroColagem = localStorage.getItem("metroColagem");
    const perdaColagem = localStorage.getItem("perdaColagem");
    const lucroColagem = localStorage.getItem("lucroColagem");

    const metroImpressao = localStorage.getItem("metroImpressao");
    const perdaImpressao = localStorage.getItem("perdaImpressao");
    const lucroImpressao = localStorage.getItem("lucroImpressao");

    if (
      (selectedOptionCodigoPaspatur && !localStorage.getItem("novoTamanho")) ||
      !larguraDireita ||
      !larguraEsquerda ||
      !larguraInferior ||
      !larguraSuperior
    ) {
      toast.error("Preencha os campos de tamanho do paspatur");
      setSelectedOptionCodigoPaspatur("");
      return;
    } else {
      if (
        larguraDireita ||
        larguraEsquerda ||
        larguraInferior ||
        larguraSuperior
      ) {
        const selectedProduto = produtos.find(
          (produto) => produto.codigo === selectedOptionCodigoPaspatur
        );
        if (selectedProduto) {
          const tamanho = localStorage.getItem("Tamanho") || "0x0";
          const [altura, largura] = tamanho.split("x").map(Number);

          // BAGUNCEI OS VALORES POR CAUSA DA PERSPECTIVA, A LEGENDA ESTÁ ABAIXO:

          // console.log("larguraDireita:", larguraInferior);
          // console.log("larguraSuperior:", larguraEsquerda);

          // VALOR PASPATUR
          const valor =
            ((altura + (Number(larguraInferior) + Number(larguraSuperior))) /
              100) *
            ((largura + Number(larguraEsquerda) * 2) / 100) *
            selectedProduto.valorMetro;
          const perda = (valor / 100) * selectedProduto.valorPerda;
          const lucro = ((valor + perda) * selectedProduto.margemLucro) / 100;

          // VALOR PERFIL NOVO
          const valorP =
            Number(metroPerfil) && perfil !== null
              ? (((altura + Number(larguraInferior) + Number(larguraSuperior)) *
                  2 +
                  (largura + Number(larguraEsquerda) + Number(larguraDireita)) *
                    2 +
                  Number(perfil) * 4) /
                  100) *
                Number(metroPerfil)
              : 0;
          const perdaP =
            Number(perdaPerfil) !== null
              ? (valorP / 100) * Number(perdaPerfil)
              : 0;
          const lucroP =
            Number(lucroPerfil) !== null
              ? ((valorP + perdaP) * Number(lucroPerfil)) / 100
              : 0;

          localStorage.setItem(
            "valorPerfil",
            (valorP + perdaP + lucroP).toString()
          );
          setPrecoPerfil(valorP + perdaP + lucroP);

          // VALOR VIDRO NOVO
          const valorV =
            Number(metroPerfil) !== null
              ? ((altura +
                  (Number(larguraInferior) + Number(larguraSuperior))) /
                  100) *
                ((largura +
                  (Number(larguraEsquerda) + Number(larguraDireita))) /
                  100) *
                Number(metroVidro)
              : 0;
          const perdaV =
            Number(perdaVidro) !== null
              ? (valorV / 100) * Number(perdaVidro)
              : 0;
          const lucroV =
            Number(lucroVidro) !== null
              ? ((valorV + perdaV) * Number(lucroVidro)) / 100
              : 0;

          localStorage.setItem(
            "valorVidro",
            (valorV + perdaV + lucroV).toString()
          );
          setPrecoVidro(valorV + perdaV + lucroV);

          // VALOR FOAM NOVO
          const valorF =
            Number(metroFoam) !== null
              ? ((altura +
                  (Number(larguraInferior) + Number(larguraSuperior))) /
                  100) *
                ((largura +
                  (Number(larguraEsquerda) + Number(larguraDireita))) /
                  100) *
                Number(metroFoam)
              : 0;
          const perdaF =
            Number(perdaFoam) !== null ? (valorF / 100) * Number(perdaFoam) : 0;
          const lucroF =
            Number(lucroFoam) !== null
              ? ((valorF + perdaF) * Number(lucroFoam)) / 100
              : 0;
          localStorage.setItem(
            "valorFoam",
            (valorF + perdaF + lucroF).toString()
          );
          setPrecoFoam(valorF + perdaF + lucroF);

          // VALOR IMPRESSAO NOVO
          const valorI =
            Number(metroImpressao) !== null
              ? ((altura +
                  (Number(larguraInferior) + Number(larguraSuperior))) /
                  100) *
                ((largura +
                  (Number(larguraEsquerda) + Number(larguraDireita))) /
                  100) *
                Number(metroImpressao)
              : 0;
          const perdaI =
            Number(perdaImpressao) !== null
              ? (valorI / 100) * Number(perdaImpressao)
              : 0; // Corrigido
          const lucroI =
            Number(lucroImpressao) !== null
              ? ((valorI + perdaI) * Number(lucroImpressao)) / 100
              : 0;
          localStorage.setItem(
            "valorImpressao",
            (valorI + perdaI + lucroI).toString()
          );
          setPrecoImpressao(valorI + perdaI + lucroI);

          // VALOR COLAGEM NOVO
          const valorC =
            Number(metroColagem) !== null
              ? ((altura +
                  (Number(larguraInferior) + Number(larguraSuperior))) /
                  100) *
                ((largura +
                  (Number(larguraEsquerda) + Number(larguraDireita))) /
                  100) *
                Number(metroColagem)
              : 0;
          const perdaC =
            Number(perdaColagem) !== null
              ? (valorC / 100) * Number(perdaColagem)
              : 0; // Corrigido
          const lucroC =
            Number(lucroColagem) !== null
              ? ((valorC + perdaC) * Number(lucroColagem)) / 100
              : 0;

          localStorage.setItem(
            "valorColagem",
            (valorC + perdaC + lucroC).toString()
          );
          setPrecoColagem(valorC + perdaC + lucroC);

          setPreco((prevPreco) => {
            const novoPreco = valor + perda + lucro;
            localStorage.setItem("valorPaspatur", novoPreco.toString());
            localStorage.setItem(
              "metroPaspatur",
              selectedProduto.valorMetro.toString()
            );
            localStorage.setItem(
              "perdaPaspatur",
              selectedProduto.valorPerda.toString()
            );
            localStorage.setItem(
              "lucroPaspatur",
              selectedProduto.margemLucro.toString()
            );
            localStorage.setItem(
              "descricaoPaspatur",
              selectedProduto.descricao.toString()
            );

            localStorage.setItem(
              "dimensoesPaspatur",
              `${localStorage.getItem(
                "larguraSuperior"
              )} x ${localStorage.getItem(
                "larguraEsquerda"
              )} x ${localStorage.getItem(
                "larguraInferior"
              )} x ${localStorage.getItem("larguraDireita")}`
            );
            // localStorage.setItem("valorFoam", precoFoam.toString());
            // localStorage.setItem("valorVidro", precoVidro.toString());
            // localStorage.setItem("valorPerfil", precoPerfil.toString());
            // localStorage.setItem("valorImpressao", precoImpressao.toString());
            // localStorage.setItem("valorColagem", precoColagem.toString());

            // localStorage.setItem("Tamanho", novoTamanho)

            return novoPreco;
          });
        }
      }
    }
  }, [selectedOptionCodigoPaspatur]);

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

  function handleRemoveProduct() {
    // Limpa os valores do localStorage
    localStorage.removeItem("valorPaspatur");
    localStorage.removeItem("metroPaspatur");
    localStorage.removeItem("perdaPaspatur");
    localStorage.removeItem("lucroPaspatur");
    localStorage.removeItem("descricaoPaspatur");
    localStorage.removeItem("dimensoesPaspatur");
    localStorage.removeItem("codigoPaspatur");

    localStorage.removeItem("larguraEsquerda");
    localStorage.removeItem("larguraDireita");
    localStorage.removeItem("larguraSuperior");
    localStorage.removeItem("larguraInferior");

    if (localStorage.getItem("valorPerfil")) {
      localStorage.setItem(
        "valorPerfil",
        localStorage.getItem("valorPerfilAntigo") || ""
      );
    }

    if (localStorage.getItem("valorVidro")) {
      localStorage.setItem(
        "valorVidro",
        localStorage.getItem("valorVidroAntigo") || ""
      );
    }

    if (localStorage.getItem("valorFoam")) {
      localStorage.setItem(
        "valorFoam",
        localStorage.getItem("valorFoamAntigo") || ""
      );
    }

    if (localStorage.getItem("valorColagem")) {
      localStorage.setItem(
        "valorColagem",
        localStorage.getItem("valorColagemAntigo") || ""
      );
    }

    if (localStorage.getItem("valorImpressao")) {
      localStorage.setItem(
        "valorImpressao",
        localStorage.getItem("valorImpressaoAntigo") || ""
      );
    }

    setLarguraDireita("");
    setLarguraEsquerda("");
    setLarguraSuperior("");
    setLarguraInferior("");
    // Chama setPreco(0)
    setPreco(0);
    setSelectedOptionCodigoPaspatur("");
  }

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
      <ToastContainer />
      <div className={styles.Container} onClick={handleOpenMenuDiv}>
        <SideMenuBudget activeRoute={router.pathname}></SideMenuBudget>

        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>O pedido inclui paspatur?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor do paspatur</p>
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
            Informe abaixo se paspatur será utilizado no pedido
          </p>

          <div className={styles.InputContainer}>
            {/* <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Paspatur</p>
              <select
                id="paspatur"
                className={styles.SelectField}
                value={selectedOptionPaspatur}
                onChange={handleSelectChangePaspatur}
              >
                <option value="" disabled selected>
                  Inclui paspatur?
                </option>
                <option value="SIM" selected={selectedOptionPaspatur === "SIM"}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionPaspatur === "NÃO"}>
                  NÃO
                </option>
              </select>
            </div> */}

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <select
                id="codigoPaspatur"
                className={styles.SelectField}
                value={selectedOptionCodigoPaspatur}
                onChange={handleSelectChangeCodigoPaspatur}
              >
                <option value="" disabled selected>
                  Selecione um código
                </option>
                {produtos.map((produto) => (
                  <option
                    key={produto.codigo}
                    value={produto.codigo}
                    selected={selectedOptionCodigoPaspatur === produto.codigo}
                  >
                    {produto.codigo} - {produto.descricao}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>.</p>

              <button
                className={styles.removeProduct}
                onClick={handleRemoveProduct}
              >
                Remover
              </button>
            </div>
          </div>

          <div className={styles.PreviewContainer}>
            <div className={styles.InputFieldPreview}>
              <p className={styles.FieldLabel}>Largura esquerda</p>
              <input
                id="larguraSuperior"
                type="text"
                className={styles.FieldPreview}
                placeholder=""
                value={larguraSuperior}
                onChange={handleInputChangeSuperior}
              />
            </div>

            <div className={styles.PreviewImgContainer}>
              <div className={styles.InputFieldPreview}>
                <p className={styles.FieldLabel}>Largura superior</p>
                <input
                  id="larguraEsquerda"
                  type="text"
                  className={styles.FieldPreview}
                  placeholder=""
                  value={larguraEsquerda}
                  onChange={handleInputChangeEsquerda}
                />
              </div>

              <img src="./molduraSize.png" className={styles.PreviewImg} />

              <div className={styles.InputFieldPreview}>
                <p className={styles.FieldLabel}>Largura direita</p>
                <input
                  id="larguraDireita"
                  type="text"
                  className={styles.FieldPreview}
                  placeholder=""
                  value={larguraDireita}
                  onChange={handleInputChangeDireita}
                />
              </div>
            </div>

            <div className={styles.InputFieldPreview}>
              <p className={styles.FieldLabel}>Largura direita</p>
              <input
                id="larguraInferior"
                type="text"
                className={styles.FieldPreview}
                placeholder=""
                value={larguraInferior}
                onChange={handleInputChangeInferior}
              />
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
