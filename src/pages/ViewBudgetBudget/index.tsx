import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ViewOrderBudget.module.scss";

import HeaderViewBudget from "@/components/HeaderViewBudget";
import SideMenuHome from "@/components/SideMenuHome";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

import { db, doc, getDoc } from "../../../firebase";

import jsPDF from "jspdf";

type BudgetType = {
  descricaoImpressao: string;
  descricaoPerfil: string;
  descricaoVidro: string;
  descricaoPaspatur: string;
  descricaoMontagem: string;
  descricaoColagem: string;
  descricaoFoam: string;
  descricaoInstalacao: string;

  id: string;
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
  codigoImpressao: string;
  codigoFoam: string;
  codigoVidro: string;
  codigoMontagem: string;
  codigoColagem: string;
  dimensoesPaspatur: string;
  collage: string;
  instalacao: string;
  montagem: string;
  valorInstalacao: string;
  valorMontagem: string;
  tipoEntrega: string;
  formaPagamento: string;
  observacao: string;
  dataCadastro: string;
  valorTotal: string;
  obs: string;
  valorImpressao: string;
  valorPerfil: string;
  valorPerfilUm: string;
  valorPerfilDois: string;
  valorPaspatur: string;
  valorVidro: string;
  dataVencimento: string;
  valorFoam: string;
  valorColagem: string;
  maoDeObraExtra: string;
  observacoes: string;
}[];

type UserDataType = {
  valorTotal: string;
  budgets: BudgetType;

  Telefone: string;
  nomeCompleto: string;
  NumeroPedido: string;
  dataCadastro: string;
  desconto: string;
};

export default function ViewBudgetBudget() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const [openMenu, setOpenMenu] = useState(false); // Inicializa o estado openMenu

  const [selectedOption, setSelectedOption] = useState("opcao1");
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

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  useEffect(() => {
    async function fetchData() {
      if (selectedBudgetId) {
        try {
          const docRef = doc(db, `Login/${userId}/Budget`, selectedBudgetId);
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

  const budgets = userData?.budgets || [];

  function formatDate(date: any) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Aqui nós adicionamos 1 ao dia atual.
    const dia = newDate.getDate().toString().padStart(2, "0");
    const mes = (newDate.getMonth() + 1).toString().padStart(2, "0"); //+1 pois no getMonth Janeiro começa com zero.
    const ano = newDate.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // ENVIAR POR WHATSAPP

  function loadImage(url: any): Promise<string> {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  }

  async function createPDF(budgets: any[]) {
    const doc = new jsPDF();

    const imageData = await loadImage("/LogoMenu.png");

    let imgWidth = 35;
    let imgHeight = 21;
    let x = 10;
    let y = 10;

    doc.addImage(imageData, "PNG", x, y, imgWidth, imgHeight);
    y = imgHeight + 20;

    doc.setFontSize(8);

    const calculateHeight = (text: string, width: number) => {
      let lines = doc.splitTextToSize(text, width - 4);
      return Math.max(lines.length * 3, 7);
    };

    let rectHeight = calculateHeight(
      userData?.NumeroPedido.toString() || "",
      65
    );
    const calculateWidth = (text: string) => {
      let textWidth = doc.getTextWidth(text) + 10;
      return Math.min(textWidth, 60);
    };

    const checkPageEnd = (y: number): number => {
      const bottomMargin = 40;
      if (y > doc.internal.pageSize.height - bottomMargin) {
        doc.addPage();
        return 20;
      }
      return y;
    };

    let rightStartX = doc.internal.pageSize.width - 90;

    let rectWidth = calculateWidth("Número do orçamento");
    doc.rect(rightStartX, 10, rectWidth, rectHeight, "D");
    doc.setFont("helvetica", "bold");
    doc.text("Número do orçamento", rightStartX + 2, 10 + 5);
    doc.setFont("helvetica", "normal");
    doc.rect(rightStartX + rectWidth + 2, 10, rectWidth, rectHeight, "D");
    doc.setFontSize(12);

    doc.text(
      userData?.NumeroPedido.toString() || "",
      rightStartX + rectWidth + 4,
      10 + 5
    );
    doc.setFontSize(8);

    y = 10 + rectHeight + 2.5;

    doc.rect(rightStartX, y, rectWidth, rectHeight, "D");
    doc.setFont("helvetica", "bold");
    doc.text("Data do orçamento", rightStartX + 2, y + 5);
    doc.setFont("helvetica", "normal");
    doc.rect(rightStartX + rectWidth + 2, y, rectWidth, rectHeight, "D");
    doc.text(userData?.dataCadastro || "", rightStartX + rectWidth + 4, y + 5);
    y += rectHeight + 10;

    rectHeight = calculateHeight("Valor total", 70);
    doc.rect(10, y, 70, rectHeight, "D");
    doc.setFont("helvetica", "bold");
    doc.text("Nome do cliente", 12, y + 5);
    doc.setFont("helvetica", "normal");
    doc.rect(82, y, 115, rectHeight, "D");
    doc.text(userData?.nomeCompleto || "", 87, y + 5);
    y += rectHeight + 10;

    budgets.forEach((budget, index) => {
      y = formatSingleBudgetPDF(doc, budget, y, index);
      y = checkPageEnd(y);

      // if (index === budgets.length - 1) {
      //   doc.setFontSize(8);
      //   doc.setFont("helvetica", "bold");
      //   const finalText = "Orçamento válido por 30 dias";
      //   const textWidth = doc.getTextWidth(finalText);
      //   const xCentered = (doc.internal.pageSize.width - textWidth) / 2;
      //   y = checkPageEnd(y + 20);
      //   doc.text(finalText, xCentered, y);
      //   y += 10;
      // }
    });

    y = checkPageEnd(y + 30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total do orçamento", doc.internal.pageSize.width / 2, y, {
      align: "center",
    });
    y += 5;
    doc.setFontSize(10);

    // rectHeight = calculateHeight("Sub total", 70);
    // y = checkPageEnd(y + rectHeight + 2);
    // doc.rect(10, y, 70, rectHeight, "D");
    // doc.setFont("helvetica", "bold");
    // doc.text("Sub total", 12, y + 5);
    // doc.setFont("helvetica", "normal");
    // doc.rect(82, y, 115, rectHeight, "D");
    // let desconto = parseFloat(userData?.desconto || "0") / 100;
    // let subTotal = parseFloat(userData?.valorTotal || "0") / (1 - desconto);

    // doc.text(`R$ ${subTotal.toFixed(2)}`, 87, y + 5);
    // y += 1;

    // rectHeight = calculateHeight("Desconto", 70);
    // y = checkPageEnd(y + rectHeight);
    // doc.rect(10, y, 70, rectHeight, "D");
    // doc.setFont("helvetica", "bold");
    // doc.text("Desconto", 12, y + 5);
    // doc.setFont("helvetica", "normal");
    // doc.rect(82, y, 115, rectHeight, "D");
    // doc.text(`${desconto * 100}%`, 87, y + 5);
    // y += rectHeight; // Só adicione a altura do retângulo

    rectHeight = calculateHeight("Valor total", 70);
    y = checkPageEnd(y + rectHeight);
    doc.rect(10, y, 70, rectHeight, "D");
    doc.setFont("helvetica", "bold");
    doc.text("Valor total", 12, y + 5);
    doc.setFont("helvetica", "normal");
    doc.rect(82, y, 115, rectHeight, "D");
    let valorTotal = parseFloat(userData?.valorTotal || "0");
    doc.text(`R$ ${valorTotal.toFixed(2)}`, 87, y + 5);
    y += rectHeight + 20; // Só adicione a altura do retângulo

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const finalText = "Orçamento válido por 30 dias";
    const textWidth = doc.getTextWidth(finalText);
    const xCentered = (doc.internal.pageSize.width - textWidth) / 2;
    y = checkPageEnd(y + 20);
    doc.text(finalText, xCentered, y);
    y += 10;

    doc.save(`${userData?.nomeCompleto || ""}_orcamento.pdf`);
  }

  function formatSingleBudgetPDF(
    doc: any,
    budget: any,
    y: number,
    index: number
  ): number {
    doc.setFontSize(10);
    doc.setDrawColor(0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    let title = `Item ${index + 1}`;
    let titleWidth = doc.getTextWidth(title);
    let xTitle = (210 - titleWidth) / 2;

    doc.text(title, xTitle, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const maxWidth = 45; // Largura máxima dos retângulos

    // Função auxiliar para renderizar um item do orçamento em múltiplos retângulos
    const renderMultipleItems = (items: string[]) => {
      let x = 10;
      let maxHeight = 7; // Altura inicial do retângulo ajustada

      // Determina a altura máxima necessária para os retângulos nesta linha
      items.forEach((item) => {
        let lines = doc.splitTextToSize(item, maxWidth - 4);
        let height = Math.max(lines.length * 3, maxHeight); // Calcula a altura usando a lógica similar a do renderTwoItems
        maxHeight = height > maxHeight ? height : maxHeight;
      });

      items.forEach((item, index) => {
        let lines = doc.splitTextToSize(item, maxWidth - 4);
        doc.rect(x, y, maxWidth, maxHeight, "D");
        if (index === 0) {
          doc.setFont("helvetica", "bold");
        }
        doc.text(lines, x + 2, y + 5);
        if (index === 0) {
          doc.setFont("helvetica", "normal");
        }
        x += maxWidth + 2;
      });
      y += maxHeight + 2; // Espaço adicional entre linhas
    };

    const renderTwoItems = (firstItem: string, secondItem: string) => {
      const firstWidth = 45;
      const gap = 2;
      const secondWidth = 186 - firstWidth - gap;
      const minHeight = 7;

      let linesFirst = doc.splitTextToSize(firstItem, firstWidth - 4);
      let linesSecond = doc.splitTextToSize(secondItem, secondWidth - 4);

      let heightFirst = Math.max(linesFirst.length * 3, minHeight);
      let heightSecond = Math.max(linesSecond.length * 3, minHeight);

      let maxHeight = Math.max(heightFirst, heightSecond);

      doc.setFont("helvetica", "bold");
      doc.rect(10, y, firstWidth, maxHeight, "D");
      doc.text(linesFirst, 12, y + 5);

      doc.setFont("helvetica", "normal");
      doc.rect(10 + firstWidth + gap, y, secondWidth, maxHeight, "D");
      doc.text(linesSecond, 12 + firstWidth + gap, y + 5);

      y += maxHeight + 2; // Espaço adicional entre linhas
    };

    if (budget.Tamanho) renderTwoItems("Tamanho", budget.Tamanho);
    if (budget.codigoImpressao)
      renderMultipleItems([
        "Impressão",
        budget.codigoImpressao,
        budget.descricaoImpressao,
        `R$ ${parseFloat(budget.valorImpressao || "0").toFixed(2)}`,
      ]);
    if (budget.codigoPerfil)
      renderMultipleItems([
        "Perfil",
        budget.codigoPerfil,
        budget.descricaoPerfil,
        `R$ ${parseFloat(budget.valorPerfilUm || "0").toFixed(2)}`,
      ]);
    if (budget.codigoPerfilDois)
      renderMultipleItems([
        "Perfil Dois",
        budget.codigoPerfilDois,
        budget.descricaoPerfilDois || "",
        `R$ ${parseFloat(budget.valorPerfilDois || "0").toFixed(2)}`,
      ]);
    if (budget.codigoVidro)
      renderMultipleItems([
        "Vidro",
        budget.codigoVidro,
        budget.descricaoVidro,
        `R$ ${parseFloat(budget.valorVidro || "0").toFixed(2)}`,
      ]);
    if (budget.codigoFoam)
      renderMultipleItems([
        "Foam",
        budget.codigoFoam,
        budget.descricaoFoam,
        `R$ ${parseFloat(budget.valorFoam || "0").toFixed(2)}`,
      ]);
    if (budget.codigoPaspatur)
      renderMultipleItems([
        "Paspatur",
        budget.codigoPaspatur,
        budget.descricaoPaspatur,
        `R$ ${parseFloat(budget.valorPaspatur || "0").toFixed(2)}`,
      ]);
    if (budget.dimensoesPaspatur)
      renderMultipleItems(["Dimensões do Paspatur", budget.dimensoesPaspatur]);
    if (budget.codigoColagem)
      renderMultipleItems([
        "Colagem",
        budget.codigoColagem,
        budget.descricaoColagem,
        `R$ ${parseFloat(budget.valorColagem || "0").toFixed(2)}`,
      ]);
    if (budget.instalacao)
      renderMultipleItems([
        "Diversos",
        budget.descricaoInstalacao,
        `R$ ${parseFloat(budget.valorInstalacao || "0").toFixed(2)}`,
      ]);
    if (budget.codigoMontagem)
      renderMultipleItems([
        "Montagem",
        budget.codigoMontagem,
        budget.descricaoMontagem,
        `R$ ${parseFloat(budget.valorMontagem || "0").toFixed(2)}`,
      ]);
    if (budget.tipoEntrega)
      renderMultipleItems(["Entrega", budget.tipoEntrega]);

    y += 5;

    doc.setFont("helvetica", "bold");
    let textWidth = doc.getTextWidth("Pagamentos e prazos");
    let x = (210 - textWidth) / 2;

    doc.text("Pagamentos e prazos", x, y);
    y += 5;

    doc.setFont("helvetica", "normal");

    if (budget.maoDeObraExtra)
      renderTwoItems("Mão de obra externa", budget.maoDeObraExtra);
    // if (budget.desconto) renderTwoItems("Desconto", `${budget.desconto}%`);
    if (budget.formaPagamento)
      renderTwoItems("Forma de pagamento", budget.formaPagamento);
    if (budget.dataVencimento)
      renderTwoItems("Prazo para entrega", formatDate(budget.dataVencimento));

    if (budget.observacoes) {
      renderTwoItems("Observação", budget.observacoes);
    }
    renderTwoItems(
      "Valor do item",
      `R$ ${parseFloat(budget.valorTotal || "0").toFixed(2)}`
    );

    if (index !== budgets.length - 1) {
      y += 10;
    }

    return y; // Retorna a próxima posição y
  }

  function formatSingleBudget(
    budget: {
      descricaoInstalacao: any;
      descricaoColagem: any;
      descricaoPaspatur: any;
      descricaoFoam: any;
      descricaoVidro: any;
      descricaoPerfil: any;
      descricaoImpressao: any;
      Tamanho: any;
      codigoImpressao: any;
      valorImpressao: any;
      codigoPerfil: any;
      valorPerfil: any;
      codigoVidro: any;
      valorVidro: any;
      codigoFoam: any;
      valorFoam: any;
      codigoPaspatur: any;
      valorPaspatur: any;
      codigoColagem: any;
      valorColagem: any;
      instalacao: any;
      valorInstalacao: any;
      tipoEntrega: any;
      maoDeObraExtra: any;
      formaPagamento: any;
      dataVencimento: any;
      observacoes: any;
      valorTotal: any;
      dimensoesPaspatur: any;
      montagem: any;
      codigoMontagem: any;
      valorMontagem: any;
      descricaoMontagem: any;
    },
    index: number
  ) {
    let message = `Olá ${userData?.nomeCompleto}, segue o seu Orçamento...\n\n`;

    message += `ORÇAMENTO ${index + 1}\n`;
    message += `VALOR TOTAL: R$ ${parseFloat(budget.valorTotal || "0").toFixed(
      2
    )}\n\n`;
    message += `Tamanho: ${budget.Tamanho}\n`;
    message += budget.codigoImpressao
      ? `Impressão: ${budget.codigoImpressao} - ${
          budget.descricaoImpressao
        } - R$ ${parseFloat(budget.valorImpressao || "0").toFixed(2)}\n`
      : "";
    message += budget.codigoPerfil
      ? `Perfil: ${budget.codigoPerfil} - ${
          budget.descricaoPerfil
        } - R$ ${parseFloat(budget.valorPerfil || "0").toFixed(2)}\n`
      : "";
    message += budget.codigoVidro
      ? `Vidro: ${budget.codigoVidro} - ${
          budget.descricaoVidro
        } - R$ ${parseFloat(budget.valorVidro || "0").toFixed(2)}\n`
      : "";
    message += budget.codigoFoam
      ? `Foam: ${budget.codigoFoam} - ${budget.descricaoFoam} - R$ ${parseFloat(
          budget.valorFoam || "0"
        ).toFixed(2)}\n`
      : "";
    message += budget.codigoPaspatur
      ? `Paspatur: ${budget.codigoPaspatur} - ${
          budget.descricaoPaspatur
        } - R$ ${parseFloat(budget.valorPaspatur || "0").toFixed(2)}\n`
      : "";
    message += budget.dimensoesPaspatur
      ? `Dimensões do Paspatur: ${budget.dimensoesPaspatur}`
      : "";
    message += budget.codigoColagem
      ? `Colagem: ${budget.codigoColagem} - ${
          budget.descricaoColagem
        } - R$ ${parseFloat(budget.valorColagem || "0").toFixed(2)}\n`
      : "";
    message += budget.instalacao
      ? `Diversos: - ${budget.descricaoInstalacao} - ${budget.valorInstalacao}\n`
      : "";
    message += budget.montagem
      ? `Montagem: - ${budget.descricaoMontagem} - R$ ${parseFloat(
          budget.valorMontagem || "0"
        ).toFixed(2)}\n`
      : "";
    message += budget.tipoEntrega ? `Entrega: ${budget.tipoEntrega}\n\n` : "";

    message += "Pagamentos e prazos\n\n";
    message += budget.maoDeObraExtra
      ? `Mão de obra externa: ${budget.maoDeObraExtra}\n`
      : "";
    message += budget.formaPagamento
      ? `Forma de pagamento: ${budget.formaPagamento}\n`
      : "";
    message += budget.dataVencimento
      ? `Prazo para entrega: ${formatDate(budget.dataVencimento)}\n\n`
      : "";

    message += `Observação: ${budget.observacoes}\n\n`;
    message += `Valor total: R$ ${parseFloat(budget.valorTotal || "0").toFixed(
      2
    )}\n\n`;

    return message;
  }

  function formatBudgets(budgets: any[]) {
    let message = "";

    budgets.forEach((budget, index) => {
      message += formatSingleBudget(budget, index);
    });

    // Codificar a mensagem para uso em uma URL
    return encodeURIComponent(message);
  }

  function formatPhoneNumber(phoneNumber: string | undefined) {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);

    if (match) {
      return match[1] + match[2] + match[3];
    }

    return null;
  }

  const Telefone = userData?.Telefone;
  console.log(Telefone);

  const formattedPhone = "55" + formatPhoneNumber(Telefone);

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${formatBudgets(
    budgets
  )}`;
  console.log(whatsappUrl);

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome
          activeRoute={router.pathname}
          openMenu={openMenu}
        ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderViewBudget></HeaderViewBudget>

          <div className={styles.OrderDataContainer}>
            <div className={styles.BudgetHead}>
              <div className={styles.Nav}>
                <Link href="ViewBudgetData">
                  <p className={styles.NavItem}>Dados do cliente</p>
                </Link>

                <Link href="ViewBudgetBudget">
                  <div>
                    <p className={`${styles.NavItem} ${styles.active}`}>
                      Orçamento
                    </p>
                    <div className={styles.NavItemBar}></div>
                  </div>
                </Link>
              </div>

              <div className={styles.BudgetHeadO}>
                <p className={styles.OrderTotalValue}>Valor total:</p>
                <p className={styles.OrderValue}>
                  R$ {parseFloat(userData?.valorTotal || "0").toFixed(2)}
                </p>
              </div>
            </div>

            <div className={styles.linhaOrder}></div>

            <div className={styles.OrderData}>
              <div className={styles.Budgets}>
                {budgets.map((budget, index) => (
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
                              1{budget.codigoPerfilDois} - R${" "}
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
                          {budget.codigoMontagem && (
                            <p className={styles.ResValue}>
                              {budget.descricaoMontagem} - R${" "}
                              {parseFloat(budget.valorMontagem || "0").toFixed(
                                2
                              )}
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

                        <div>
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
                        </div>

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

              <div className={styles.Cta}>
                <div
                  className={styles.WhatsButton}
                  onClick={() => window.open(whatsappUrl, "_blank")}
                >
                  <img className={styles.WhatsImg} src="./Wpp.png" alt="" />
                  <p className={styles.WhatsText}>ENVIAR POR WHATSAPP</p>
                </div>

                <div
                  className={styles.PdfButton}
                  onClick={() => createPDF(budgets)}
                >
                  <img className={styles.WhatsImg} src="./PdfIcon.png" alt="" />
                  <p className={styles.PdfText}>GERAR PDF</p>
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
