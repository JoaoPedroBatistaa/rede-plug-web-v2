import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ViewOrderBudget.module.scss";

import HeaderOrder from "@/components/HeaderOrder";
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
  descricaoColagem: string;
  descricaoFoam: string;
  descricaoInstalacao: string;

  id: string;
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
  codigoImpressao: string;
  codigoFoam: string;
  codigoVidro: string;
  codigoColagem: string;
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
  valorImpressao: string;
  valorPerfil: string;
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
};

export default function ViewOrderBudget() {
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedId(localStorage.getItem("selectedId"));
    }
  }, []);

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  useEffect(() => {
    async function fetchData() {
      if (selectedId) {
        try {
          const docRef = doc(db, `Login/${userId}/Orders`, selectedId);
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
  }, [selectedId]);

  useEffect(() => {
    async function fetchData() {
      if (selectedId) {
        try {
          const docRef = doc(db, "Orders", selectedId);
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
  }, [selectedId]);

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

    // Carregar imagem
    const imageData = await loadImage("/LogoMenu.png");

    // Adicionar a imagem ao centro do cabeçalho
    let imgWidth = 50;
    let imgHeight = 30;
    let x = (doc.internal.pageSize.width - imgWidth) / 2;
    let y = 10;

    doc.addImage(imageData, "PNG", x, y, imgWidth, imgHeight);
    y = imgHeight + 20;

    doc.setFontSize(8);

    const calculateHeight = (text: string, width: number) => {
      let lines = doc.splitTextToSize(text, width - 4);
      return Math.max(lines.length * 3, 7); // Calcular a altura baseada no número de linhas, garantindo uma altura mínima de 7
    };

    let rectHeight = calculateHeight("Nome do cliente", 70);
    doc.rect(10, y, 70, rectHeight, "D");
    doc.setFont("helvetica", "bold");
    doc.text("Nome do cliente", 12, y + 5);
    doc.setFont("helvetica", "normal");
    doc.rect(85, y, 115, rectHeight, "D");
    doc.text(userData?.nomeCompleto || "", 87, y + 5);
    y += rectHeight + 2;

    rectHeight = calculateHeight("Número do orçamento", 70);
    doc.rect(10, y, 70, rectHeight, "D");
    doc.setFont("helvetica", "bold");
    doc.text("Número do pedido", 12, y + 5);
    doc.setFont("helvetica", "normal");
    doc.rect(85, y, 115, rectHeight, "D");
    doc.text(userData?.NumeroPedido.toString() || "", 87, y + 5);
    y += rectHeight + 2;

    rectHeight = calculateHeight("Data do orçamento", 70);
    doc.rect(10, y, 70, rectHeight, "D");
    doc.setFont("helvetica", "bold");
    doc.text("Data do pedido", 12, y + 5);
    doc.setFont("helvetica", "normal");
    doc.rect(85, y, 115, rectHeight, "D");
    doc.text(userData?.dataCadastro || "", 87, y + 5);
    y += rectHeight + 2;

    rectHeight = calculateHeight("Valor total", 70);
    doc.rect(10, y, 70, rectHeight, "D");
    doc.setFont("helvetica", "bold");
    doc.text("Valor total", 12, y + 5);
    doc.setFont("helvetica", "normal");
    doc.rect(85, y, 115, rectHeight, "D");
    let valor = `R$ ${parseFloat(userData?.valorTotal || "0").toFixed(2)}`;
    doc.text(valor, 87, y + 5);
    y += rectHeight + 10;

    // Processar os orçamentos individuais
    budgets.forEach((budget, index) => {
      y = formatSingleBudgetPDF(doc, budget, y, index);

      // Adicionar o texto final ao final de cada orçamento
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      const finalText =
        "Srs Clientes, não nos responsabilizamos por objetos e pedidos não retirados no prazo máximo de 90 dias! SEM EXCESSÕES!";

      const maxWidth = doc.internal.pageSize.width - 40; // Reduzindo a largura da página por 40 unidades para margens
      const lines = doc.splitTextToSize(finalText, maxWidth);

      const yStart = doc.internal.pageSize.height - 10 - lines.length * 7; // Considerando a altura de cada linha multiplicada pelo número de linhas

      for (let line of lines) {
        const lineWidth = doc.getTextWidth(line);
        const xCentered = (doc.internal.pageSize.width - lineWidth) / 2;
        doc.text(line, xCentered, yStart + lines.indexOf(line) * 7);
      }

      // Se não for o último orçamento, adiciona uma nova página
      if (index < budgets.length - 1) {
        doc.addPage();
        y = 20; // Reinicializa a posição y para o início da nova página
      }
    });

    doc.save(`${userData?.nomeCompleto || ""}_pedido.pdf`);
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
    y += 8;

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
        `R$ ${parseFloat(budget.valorPerfil || "0").toFixed(2)}`,
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
    if (budget.desconto) renderTwoItems("Desconto", `${budget.desconto}%`);
    if (budget.formaPagamento)
      renderTwoItems("Forma de pagamento", budget.formaPagamento);
    if (budget.dataVencimento)
      renderTwoItems("Prazo para entrega", formatDate(budget.dataVencimento));

    if (budget.observacoes) {
      renderTwoItems("Observação", budget.observacoes);
    }
    renderTwoItems(
      "Valor total",
      `R$ ${parseFloat(budget.valorTotal || "0").toFixed(2)}`
    );

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
    },
    index: number
  ) {
    let message = `Olá ${userData?.nomeCompleto}, segue o seu Pedido...\n\n`;

    message += `PEDIDO ${index + 1}\n`;
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
    message += budget.tipoEntrega ? `Entrega: ${budget.tipoEntrega}\n\n` : "";

    message += "\n\nPagamentos e prazos\n\n";
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
          <HeaderOrder></HeaderOrder>

          <div className={styles.OrderDataContainer}>
            <div className={styles.BudgetHead}>
              <div className={styles.Nav}>
                <Link href="ViewOrderData">
                  <p className={styles.NavItem}>Dados do cliente</p>
                </Link>

                <Link href="ViewOrderShip">
                  <p className={styles.NavItem}>Endereço</p>
                </Link>

                <Link href="ViewOrderBudget">
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
                      <p className={styles.ResTitle}>PEDIDO {index + 1}</p>

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
                              {parseFloat(budget.valorPerfil || "0").toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className={styles.OrderResValue}>
                          {budget.codigoPerfil && (
                            <p className={styles.ResValue}>
                              {budget.descricaoPerfil}
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
