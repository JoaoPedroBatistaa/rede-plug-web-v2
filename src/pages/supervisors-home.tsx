import HeaderHome from "@/components/HeaderSupervisors";
import SideMenuHome from "@/components/SideMenuHome";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";
import styles from "../styles/Home.module.scss";

import { jsPDF } from "jspdf";

import dynamic from "next/dynamic";
const LoadingOverlay = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});

interface PostOption {
  label: string;
  value: string;
}

interface Task {
  id: string;
  route: string;
}

const taskTitles: Record<string, string> = {
  digital_point: "Ponto Digital",
  "caixa-surpresa": "Caixa Surpresa",
  uniformes: "Uniformes",
  atendimento: "Atendimento",
  "limpeza-pista": "Limpeza da Pista",
  "limpeza-bombas": "Limpeza das Bombas",
  "limpeza-testeiras": "Limpeza das Testeiras",
  "limpeza-banheiros": "Limpeza dos Banheiros",
  vestiario: "Vestiário",
  "troca-oleo": "Troca de Óleo",
  "pintura-posto": "Pintura do Posto",
  canaletas: "Canaletas",
  "iluminacao-pista": "Iluminação da Pista",
  "iluminacao-testeiras": "Iluminação das Testeiras",
  forro: "Forro",
  "placas-sinalizacao": "Placas de Sinalização",
  "identificacao-fornecedor": "Identificação de Fornecedores",
  "placas-faixa-preco": "Placas de Preço",
  extintores: "Extintores",
  aferidores: "Aferidores",
  regua: "Régua",
  compressor: "Compressor",
  calibrador: "Calibrador",
  "bocas-visita": "Bocas de Visita",
  "bocas-descarga-e-cadeados": "Bocas de Descarga e Cadeados",
  canetas: "Canetas",
  bicos: "Bicos",
  "bicos-parados": "Bicos Parados",
  mangueiras: "Mangueiras",
  "lacre-bombas": "Lacre das Bombas",
  "limpeza-samp": "Limpeza do SAMP",
  "passagem-bomba": "Passagem da Bomba",
  "calibragem-bombas": "Calibragem das Bombas",
  game: "Game",
  "teste-combustiveis-venda": "Teste de Combustíveis de Venda",
  "combustiveis-defesa": "Combustíveis de Defesa",
  "maquininhas-uso": "Maquininhas de Uso",
  "maquininhas-quebradas": "Maquininhas Quebradas",
  "maquininhas-reservas": "Maquininhas Reservas",
  "escala-trabalho": "Escala de Trabalho",
  "notas-fiscais": "Notas Fiscais",
  documentos: "Documentos",
};

export default function Home() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [postsAvailable, setPostsAvailable] = useState<PostOption[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<{
    firstShift: string | null;
    secondShift: string | null;
  }>({
    firstShift: null,
    secondShift: null,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [completedTasks, setCompletedTasks] = useState<{
    [key: string]: string[];
  }>({});

  const [reportEligibility, setReportEligibility] = useState<{
    [key: string]: boolean;
  }>({});

  const tasksOrder: Task[] = [
    { id: "digital_point", route: "/supervisors/point" },
    { id: "caixa-surpresa", route: "/supervisors/surprise-box" },
    { id: "uniformes", route: "/supervisors/uniforms" },
    { id: "atendimento", route: "/supervisors/service" },
    { id: "limpeza-pista", route: "/supervisors/track-cleaning" },
    { id: "limpeza-bombas", route: "/supervisors/bombs-cleaning" },
    { id: "limpeza-testeiras", route: "/supervisors/front-cleaning" },
    { id: "limpeza-banheiros", route: "/supervisors/bathroom-cleaning" },
    { id: "vestiario", route: "/supervisors/locker-room" },
    { id: "troca-oleo", route: "/supervisors/oil-change" },
    { id: "pintura-posto", route: "/supervisors/post-painting" },
    { id: "canaletas", route: "/supervisors/channels" },
    { id: "iluminacao-pista", route: "/supervisors/runway-lightning" },
    { id: "iluminacao-testeiras", route: "/supervisors/front-lightning" },
    { id: "forro", route: "/supervisors/lining" },
    { id: "placas-sinalizacao", route: "/supervisors/traffic-signs" },
    {
      id: "identificacao-fornecedor",
      route: "/supervisors/supplier-identification",
    },
    { id: "placas-faixa-preco", route: "/supervisors/price-signs" },
    { id: "extintores", route: "/supervisors/extinguishers" },
    { id: "aferidores", route: "/supervisors/gauges" },
    { id: "regua", route: "/supervisors/ruler" },
    { id: "compressor", route: "/supervisors/compressor" },
    { id: "calibrador", route: "/supervisors/calibrator" },
    { id: "bocas-visita", route: "/supervisors/manholes" },
    {
      id: "bocas-descarga-e-cadeados",
      route: "/supervisors/discharge-nozzles-and-padlocks",
    },
    { id: "canetas", route: "/supervisors/pens" },
    { id: "bicos", route: "/supervisors/nozzles" },
    { id: "bicos-parados", route: "/supervisors/nozzles-stopped" },
    { id: "mangueiras", route: "/supervisors/hoses" },
    { id: "lacre-bombas", route: "/supervisors/bomb-seal" },
    { id: "limpeza-samp", route: "/supervisors/samp-cleaning" },
    { id: "passagem-bomba", route: "/supervisors/bomb-passage" },
    { id: "calibragem-bombas", route: "/supervisors/pump-calibration" },
    { id: "game", route: "/supervisors/game" },
    { id: "teste-combustiveis-venda", route: "/supervisors/fuel-sell-test" },
    { id: "combustiveis-defesa", route: "/supervisors/turn" },
    { id: "maquininhas-uso", route: "/supervisors/use-machines" },
    { id: "maquininhas-reservas", route: "/supervisors/reserves-machines" },
    { id: "maquininhas-quebradas", route: "/supervisors/broken-machines" },
    { id: "escala-trabalho", route: "/supervisors/work-schedule" },
    { id: "notas-fiscais", route: "/supervisors/fiscal-notes" },
    { id: "documentos", route: "/supervisors/documents" },
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");

    setUserId(storedUserId);
    setUserName(storedUserName);

    if (!storedUserId) {
      router.push("/");
      return;
    }

    fetchCompletedTasksData(storedUserId, {
      setPostsAvailable,
      setReportEligibility,
      setCompletedTasks,
    });
  }, []);

  const fetchCompletedTasksData = async (
    userId: string,
    setStates: {
      setPostsAvailable: (posts: any[]) => void;
      setReportEligibility: (data: { [key: string]: boolean }) => void;
      setCompletedTasks: (data: { [key: string]: string[] }) => void;
    }
  ) => {
    try {
      const docRef = doc(db, "USERS", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const posts = userData.postsAvailable || [];
        setStates.setPostsAvailable(posts);

        const date = new Date().toISOString().split("T")[0];
        const shifts = ["firstShift", "secondShift"];

        const eligibility: { [key: string]: boolean } = {};
        const completedMap: { [key: string]: string[] } = {};

        for (const shift of shifts) {
          for (const post of posts) {
            const completed = await getCompletedTasks(shift, date, post.label);
            const key = `${post.label}_${shift}`;
            eligibility[key] = completed.length > 30;
            completedMap[key] = completed;
          }
        }

        console.log(completedMap);

        setStates.setReportEligibility(eligibility);
        setStates.setCompletedTasks(completedMap);
      }
    } catch (error) {
      console.error("Erro ao buscar postos disponíveis:", error);
    }
  };

  const getCompletedTasks = useCallback(
    async (shift: string, date: string, post: string) => {
      if (!userName) return [];

      console.log(date);

      const collectionRef = collection(db, "SUPERVISORS");
      const querySnapshot = await getDocs(
        query(
          collectionRef,
          where("date", "==", date),
          where("shift", "==", shift),
          where("supervisorName", "==", userName),
          where("postName", "==", post)
        )
      );

      return querySnapshot.docs.map((doc) => doc.data().id);
    },
    [userName]
  );

  const getNextTask = useCallback(
    async (shift: string, date: string, post: string) => {
      const completedTasks = await getCompletedTasks(shift, date, post);
      return (
        tasksOrder.find((task) => !completedTasks.includes(task.id))?.route ||
        tasksOrder[0].route
      );
    },
    [getCompletedTasks, tasksOrder]
  );

  const handleCardClick = async (
    shift: "firstShift" | "secondShift",
    post: PostOption
  ) => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const hour = now.getHours();

    const oppositeShift = shift === "firstShift" ? "secondShift" : "firstShift";

    const completedTasksOppositeShift = await getCompletedTasks(
      oppositeShift,
      date,
      post.label
    );
    if (completedTasksOppositeShift.length > 0) {
      alert("Este posto já foi selecionado no outro turno.");
      return;
    }

    if (
      (shift === "firstShift" && (hour < 8 || hour >= 14)) ||
      (shift === "secondShift" && (hour < 14 || hour >= 22))
    ) {
      alert("Fora do horário permitido para este turno.");
      return;
    }

    const nextTaskRoute = await getNextTask(shift, date, post.label);
    setSelectedPosts((prev) => ({ ...prev, [shift]: post.value }));
    router.push(
      `${nextTaskRoute}?post=${encodeURIComponent(post.label)}&shift=${shift}`
    );
  };

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

  const generateReport = async (post: string, shift: string) => {
    setIsLoading(true);

    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    const formattedShift =
      shift === "firstShift" ? "primeiroTurno" : "segundoTurno";
    const docPdf = new jsPDF();
    let y = 20;

    const checkPageEnd = () => {
      if (y > 270) {
        docPdf.addPage();
        y = 20;
      }
    };

    docPdf.setFontSize(16);
    docPdf.setFont("helvetica", "bold");
    docPdf.text(
      `Relatório do Supervisor - Posto ${post} - ${formattedShift} - ${formattedDate}`,
      10,
      y
    );
    y += 6; // espaço entre o texto e a linha

    // Linha horizontal de separação
    docPdf.setDrawColor(0); // cor preta
    docPdf.setLineWidth(0.5); // espessura da linha
    docPdf.line(10, y, 200, y); // linha de ponta a ponta

    y += 8; // espaço depois da linha antes das tarefas
    docPdf.setFont("helvetica", "normal");

    y += 10;

    const collectionRef = collection(db, "SUPERVISORS");
    const querySnapshot = await getDocs(
      query(
        collectionRef,
        where("date", "==", date),
        where("shift", "==", shift),
        where("supervisorName", "==", userName),
        where("postName", "==", post)
      )
    );

    const orderedDocs = querySnapshot.docs.sort((a, b) => {
      const orderA = tasksOrder.findIndex((t) => t.id === a.data().id);
      const orderB = tasksOrder.findIndex((t) => t.id === b.data().id);
      return orderA - orderB;
    });
    docPdf.setFontSize(12);

    const renderRow = (label: string, value: string) => {
      const labelWidth = 50;
      const rowHeight = 8;
      const fullWidth = 190;
      const x = 10;

      checkPageEnd();

      // Label
      docPdf.setFont("helvetica", "bold");
      docPdf.rect(x, y, labelWidth, rowHeight);
      docPdf.text(label, x + 2, y + 6);

      // Value
      docPdf.setFont("helvetica", "normal");
      docPdf.rect(x + labelWidth, y, fullWidth - labelWidth, rowHeight);
      docPdf.text(
        docPdf.splitTextToSize(value, fullWidth - labelWidth - 4),
        x + labelWidth + 2,
        y + 6
      );

      y += rowHeight;
    };

    const renderRowDoc = (label: string, value: string) => {
      const labelWidth = 80;
      const rowHeight = 8;
      const fullWidth = 190;
      const x = 10;

      checkPageEnd();

      // Label
      docPdf.setFont("helvetica", "bold");
      docPdf.rect(x, y, labelWidth, rowHeight);
      docPdf.text(label, x + 2, y + 6);

      // Value
      docPdf.setFont("helvetica", "normal");
      docPdf.rect(x + labelWidth, y, fullWidth - labelWidth, rowHeight);
      docPdf.text(
        docPdf.splitTextToSize(value, fullWidth - labelWidth - 4),
        x + labelWidth + 2,
        y + 6
      );

      y += rowHeight;
    };

    const renderRowObs = (label: string, value: string) => {
      const labelWidth = 50;
      const rowHeight = 16;
      const fullWidth = 190;
      const x = 10;

      checkPageEnd();

      // Label
      docPdf.setFont("helvetica", "bold");
      docPdf.rect(x, y, labelWidth, rowHeight);
      docPdf.text(label, x + 2, y + 6);

      // Value
      docPdf.setFont("helvetica", "normal");
      docPdf.rect(x + labelWidth, y, fullWidth - labelWidth, rowHeight);
      docPdf.text(
        docPdf.splitTextToSize(value, fullWidth - labelWidth - 4),
        x + labelWidth + 2,
        y + 6
      );

      y += rowHeight;
    };

    for (let index = 0; index < orderedDocs.length; index++) {
      const docSnap = orderedDocs[index];
      const data = docSnap.data();

      if (index > 0) {
        docPdf.addPage();
        y = 20;
      }

      const taskTitle = taskTitles[data.id] || "Tarefa Desconhecida";
      docPdf.setFontSize(14);
      docPdf.setFont("helvetica", "bold");
      docPdf.text(taskTitle, 10, y);
      y += 10;

      docPdf.setFontSize(12);
      docPdf.setFont("helvetica", "normal");

      const [year, month, day] = data.date.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      // Encura URL se houver imagem
      let shortUrl = "Sem mídia";
      if (data.images && data.images.length > 0 && data.images[0].imageUrl) {
        try {
          const response = await fetch("/api/shorten-url", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ originalURL: data.images[0].imageUrl }),
          });

          const result = await response.json();
          if (response.ok) {
            shortUrl = result.shortUrl;
          }
        } catch (error) {
          console.error("Erro ao encurtar URL:", error);
        }
      }

      // Tarefa: digital_point
      if (data.id === "digital_point") {
        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Mídia", shortUrl);
      }

      // Tarefa: limpeza-pista
      if (data.id === "limpeza-pista") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: limpeza-testeiras
      if (data.id === "limpeza-testeiras") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: regua
      if (data.id === "regua") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: aferidores
      if (data.id === "aferidores") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: compressor
      if (data.id === "compressor") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: iluminacao-testeiras
      if (data.id === "iluminacao-testeiras") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: canaletas
      if (data.id === "canaletas") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: vestiario
      if (data.id === "vestiario") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: pintura-posto
      if (data.id === "pintura-posto") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: iluminacao-pista
      if (data.id === "iluminacao-pista") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: iluminacao-pista
      if (data.id === "calibrador") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: limpeza-banheiros
      if (data.id === "limpeza-banheiros") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: troca-oleo
      if (data.id === "troca-oleo") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: limpeza-samp
      if (data.id === "limpeza-samp") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: forro
      if (data.id === "forro") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRow("Mídia", shortUrl);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: atendimento
      if (data.id === "atendimento") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: bicos-parados
      if (data.id === "bicos-parados") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: extintores
      if (data.id === "extintores") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: placas-faixa-preco
      if (data.id === "placas-faixa-preco") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: uniformes
      if (data.id === "uniformes") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: placas-sinalizacao
      if (data.id === "placas-sinalizacao") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: canetas
      if (data.id === "canetas") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: mangueiras
      if (data.id === "mangueiras") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: bicos
      if (data.id === "bicos") {
        const isOkText = data.isOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");
        renderRow("Está ok?", isOkText);
        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: limpeza-bombas
      if (data.id === "limpeza-bombas") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        const fullWidth = 190;
        const colX = [10, 40, 65, 132.5]; // posições X
        const colWidths = [30, 25, 67.5, 67.5];
        const rowHeight = 8;

        const renderPumpHeader = () => {
          const headers = ["Bomba", "Está ok?", "Mídia 1", "Mídia 2"];
          docPdf.setFont("helvetica", "bold");
          for (let i = 0; i < headers.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            docPdf.text(headers[i], colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        const renderPumpRow = (
          index: number,
          isOk: string,
          short1: string,
          short2: string
        ) => {
          const values = [`Bomba ${index + 1}`, isOk, short1, short2];
          docPdf.setFont("helvetica", "normal");
          for (let i = 0; i < values.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            const text = docPdf.splitTextToSize(values[i], colWidths[i] - 4);
            docPdf.text(text, colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        renderPumpHeader();

        if (Array.isArray(data.pumps)) {
          for (let i = 0; i < data.pumps.length; i++) {
            const bomba = data.pumps[i];
            const isOk = bomba.ok === "yes" ? "Sim" : "Não";

            let short1 = "Sem mídia";
            let short2 = "Sem mídia";

            if (bomba.image1?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image1.url }),
                });
                const result = await res.json();
                if (res.ok) short1 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 1:", e);
              }
            }

            if (bomba.image2?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image2.url }),
                });
                const result = await res.json();
                if (res.ok) short2 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 2:", e);
              }
            }

            renderPumpRow(i, isOk, short1, short2);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: identificacao-fornecedor
      if (data.id === "identificacao-fornecedor") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        const fullWidth = 190;
        const colX = [10, 40, 65, 132.5]; // posições X
        const colWidths = [30, 25, 67.5, 67.5];
        const rowHeight = 8;

        const renderPumpHeader = () => {
          const headers = ["Bomba", "Está ok?", "Mídia 1", "Mídia 2"];
          docPdf.setFont("helvetica", "bold");
          for (let i = 0; i < headers.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            docPdf.text(headers[i], colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        const renderPumpRow = (
          index: number,
          isOk: string,
          short1: string,
          short2: string
        ) => {
          const values = [`Bomba ${index + 1}`, isOk, short1, short2];
          docPdf.setFont("helvetica", "normal");
          for (let i = 0; i < values.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            const text = docPdf.splitTextToSize(values[i], colWidths[i] - 4);
            docPdf.text(text, colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        renderPumpHeader();

        if (Array.isArray(data.pumps)) {
          for (let i = 0; i < data.pumps.length; i++) {
            const bomba = data.pumps[i];
            const isOk = bomba.ok === "yes" ? "Sim" : "Não";

            let short1 = "Sem mídia";
            let short2 = "Sem mídia";

            if (bomba.image1?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image1.url }),
                });
                const result = await res.json();
                if (res.ok) short1 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 1:", e);
              }
            }

            if (bomba.image2?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image2.url }),
                });
                const result = await res.json();
                if (res.ok) short2 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 2:", e);
              }
            }

            renderPumpRow(i, isOk, short1, short2);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: lacre-bombas
      if (data.id === "lacre-bombas") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        const fullWidth = 190;
        const colX = [10, 40, 65, 132.5]; // posições X
        const colWidths = [30, 25, 67.5, 67.5];
        const rowHeight = 8;

        const renderPumpHeader = () => {
          const headers = ["Bomba", "Está ok?", "Mídia 1", "Mídia 2"];
          docPdf.setFont("helvetica", "bold");
          for (let i = 0; i < headers.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            docPdf.text(headers[i], colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        const renderPumpRow = (
          index: number,
          isOk: string,
          short1: string,
          short2: string
        ) => {
          const values = [`Bomba ${index + 1}`, isOk, short1, short2];
          docPdf.setFont("helvetica", "normal");
          for (let i = 0; i < values.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            const text = docPdf.splitTextToSize(values[i], colWidths[i] - 4);
            docPdf.text(text, colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        renderPumpHeader();

        if (Array.isArray(data.pumps)) {
          for (let i = 0; i < data.pumps.length; i++) {
            const bomba = data.pumps[i];
            const isOk = bomba.ok === "yes" ? "Sim" : "Não";

            let short1 = "Sem mídia";
            let short2 = "Sem mídia";

            if (bomba.image1?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image1.url }),
                });
                const result = await res.json();
                if (res.ok) short1 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 1:", e);
              }
            }

            if (bomba.image2?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image2.url }),
                });
                const result = await res.json();
                if (res.ok) short2 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 2:", e);
              }
            }

            renderPumpRow(i, isOk, short1, short2);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: bocas-descarga-e-cadeados
      if (data.id === "bocas-descarga-e-cadeados") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        const fullWidth = 190;
        const colX = [10, 40, 65, 132.5]; // posições X
        const colWidths = [30, 25, 135];
        const rowHeight = 8;

        const renderPumpHeader = () => {
          const headers = ["Tanque", "Está ok?", "Mídia"];
          docPdf.setFont("helvetica", "bold");
          for (let i = 0; i < headers.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            docPdf.text(headers[i], colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        const renderPumpRow = (index: number, isOk: string, short1: string) => {
          const values = [`Tanque ${index + 1}`, isOk, short1];
          docPdf.setFont("helvetica", "normal");
          for (let i = 0; i < values.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            const text = docPdf.splitTextToSize(values[i], colWidths[i] - 4);
            docPdf.text(text, colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        renderPumpHeader();

        if (Array.isArray(data.tanks)) {
          for (let i = 0; i < data.tanks.length; i++) {
            const bomba = data.tanks[i];
            const isOk = bomba.ok === "yes" ? "Sim" : "Não";

            let short1 = "Sem mídia";

            if (bomba.image1?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image1.url }),
                });
                const result = await res.json();
                if (res.ok) short1 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 1:", e);
              }
            }

            renderPumpRow(i, isOk, short1);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: passagem-bomba
      if (data.id === "passagem-bomba") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        const fullWidth = 190;
        const colX = [10, 40, 65, 132.5]; // posições X
        const colWidths = [30, 25, 135];
        const rowHeight = 8;

        const renderPumpHeader = () => {
          const headers = ["Bomba", "Está ok?", "Mídia"];
          docPdf.setFont("helvetica", "bold");
          for (let i = 0; i < headers.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            docPdf.text(headers[i], colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        const renderPumpRow = (index: number, isOk: string, short1: string) => {
          const values = [`Bomba ${index + 1}`, isOk, short1];
          docPdf.setFont("helvetica", "normal");
          for (let i = 0; i < values.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            const text = docPdf.splitTextToSize(values[i], colWidths[i] - 4);
            docPdf.text(text, colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        renderPumpHeader();

        if (Array.isArray(data.pumps)) {
          for (let i = 0; i < data.pumps.length; i++) {
            const bomba = data.pumps[i];
            const isOk = bomba.ok === "yes" ? "Sim" : "Não";

            let short1 = "Sem mídia";

            if (bomba.image1?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image1.url }),
                });
                const result = await res.json();
                if (res.ok) short1 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 1:", e);
              }
            }

            renderPumpRow(i, isOk, short1);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: calibragem-bombas
      if (data.id === "calibragem-bombas") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        const fullWidth = 190;
        const colX = [10, 40, 65, 132.5]; // posições X
        const colWidths = [30, 160];
        const rowHeight = 8;

        const renderPumpHeader = () => {
          const headers = ["Bico", "Mídia"];
          docPdf.setFont("helvetica", "bold");
          for (let i = 0; i < headers.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            docPdf.text(headers[i], colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        const renderPumpRow = (index: number, short1: string) => {
          const values = [`Bico ${index + 1}`, short1];
          docPdf.setFont("helvetica", "normal");
          for (let i = 0; i < values.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            const text = docPdf.splitTextToSize(values[i], colWidths[i] - 4);
            docPdf.text(text, colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        renderPumpHeader();

        if (Array.isArray(data.nozzles)) {
          for (let i = 0; i < data.nozzles.length; i++) {
            const bomba = data.nozzles[i];
            const isOk = bomba.ok === "yes" ? "Sim" : "Não";

            let short1 = "Sem mídia";

            if (bomba.image1?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image1.url }),
                });
                const result = await res.json();
                if (res.ok) short1 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 1:", e);
              }
            }

            renderPumpRow(i, short1);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: bocas-visita
      if (data.id === "bocas-visita") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        const fullWidth = 190;
        const colX = [10, 40, 65, 132.5]; // posições X
        const colWidths = [30, 25, 135];
        const rowHeight = 8;

        const renderPumpHeader = () => {
          const headers = ["Tanque", "Está ok?", "Mídia"];
          docPdf.setFont("helvetica", "bold");
          for (let i = 0; i < headers.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            docPdf.text(headers[i], colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        const renderPumpRow = (index: number, isOk: string, short1: string) => {
          const values = [`Tanque ${index + 1}`, isOk, short1];
          docPdf.setFont("helvetica", "normal");
          for (let i = 0; i < values.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            const text = docPdf.splitTextToSize(values[i], colWidths[i] - 4);
            docPdf.text(text, colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        renderPumpHeader();

        if (Array.isArray(data.tanks)) {
          for (let i = 0; i < data.tanks.length; i++) {
            const bomba = data.tanks[i];
            const isOk = bomba.ok === "yes" ? "Sim" : "Não";

            let short1 = "Sem mídia";

            if (bomba.image1?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bomba.image1.url }),
                });
                const result = await res.json();
                if (res.ok) short1 = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar imagem 1:", e);
              }
            }

            renderPumpRow(i, isOk, short1);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: caixa-supresa
      if (data.id === "caixa-surpresa") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        const formatCurrency = (value: number | string) =>
          // @ts-ignore
          `R$ ${parseFloat(value || 0).toFixed(2)}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        renderRow("Vendas ET", formatCurrency(data.etSales));
        renderRow("Vendas GC", formatCurrency(data.gcSales));
        renderRow("Vendas S10", formatCurrency(data.s10Sales));
        renderRow("Vendas GA", formatCurrency(data.gaSales));

        renderRow("Preço ET", formatCurrency(data.etPrice));
        renderRow("Preço GC", formatCurrency(data.gcPrice));
        renderRow("Preço S10", formatCurrency(data.s10Price));
        renderRow("Preço GA", formatCurrency(data.gaPrice));

        renderRow(
          "Litros Totais",
          `${parseFloat(data.totalLiters).toFixed(2)} L`
        );
        renderRow("Entradas Totais", formatCurrency(data.totalInput));

        // Despesas
        if (Array.isArray(data.expenses)) {
          for (let i = 0; i < data.expenses.length; i++) {
            const expense = data.expenses[i];
            renderRow(
              `Despesa ${i + 1}`,
              `${expense.expenseType} - ${formatCurrency(expense.expenseValue)}`
            );
          }
        }

        renderRow("Saídas Totais", formatCurrency(data.totalOutput));

        renderRow("Dinheiro", formatCurrency(data.cash));
        renderRow("PIX", formatCurrency(data.pix));
        renderRow("Débito", formatCurrency(data.debit));
        renderRow("Crédito", formatCurrency(data.credit));
        renderRow("Diferença", formatCurrency(data.difference));

        // Comprovante de aferição
        if (data.mediaUrl) {
          try {
            const res = await fetch("/api/shorten-url", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ originalURL: data.mediaUrl }),
            });
            const result = await res.json();
            if (res.ok) {
              renderRow("Comp. de aferição", result.shortUrl);
            }
          } catch (err) {
            console.error("Erro ao encurtar comprovante:", err);
          }
        }

        // Filipetas
        if (Array.isArray(data.images)) {
          for (let i = 0; i < data.images.length; i++) {
            const url = data.images[i];
            let shortUrl = "Erro ao encurtar";

            if (url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: url }),
                });
                const result = await res.json();
                if (res.ok) {
                  shortUrl = result.shortUrl;
                }
              } catch (err) {
                console.error(`Erro ao encurtar filipeta ${i + 1}:`, err);
              }
            }

            renderRow(`Filipeta ${i + 1}`, shortUrl);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: Game
      if (data.id === "game") {
        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        const fullWidth = 190;
        const colX = [10, 40, 75, 110, 145]; // posições X para cada coluna
        const colWidths = [30, 35, 35, 35, 55];
        const rowHeight = 8;

        const renderGameHeader = () => {
          const headers = [
            "Bico",
            "Está ok?",
            "Litros",
            "Porcentagem",
            "Mídia",
          ];
          docPdf.setFont("helvetica", "bold");
          for (let i = 0; i < headers.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            docPdf.text(headers[i], colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        const renderGameRow = (
          index: number,
          isOk: string,
          liters: string,
          percent: string,
          shortUrl: string
        ) => {
          const values = [
            `Bico ${index + 1}`,
            isOk,
            // @ts-ignore
            `${parseFloat(liters || 0).toFixed(3)} L`,
            // @ts-ignore
            `${parseFloat(percent || 0).toFixed(1)}%`,
            shortUrl,
          ];
          docPdf.setFont("helvetica", "normal");
          for (let i = 0; i < values.length; i++) {
            docPdf.rect(colX[i], y, colWidths[i], rowHeight);
            const text = docPdf.splitTextToSize(values[i], colWidths[i] - 4);
            docPdf.text(text, colX[i] + 2, y + 6);
          }
          y += rowHeight;
          checkPageEnd();
        };

        renderGameHeader();

        if (Array.isArray(data.nozzles)) {
          for (let i = 0; i < data.nozzles.length; i++) {
            const bico = data.nozzles[i];
            const isOk = bico.ok === "yes" ? "Sim" : "Não";
            const liters = bico.liters || "0";
            const percent = bico.percentage || "0";
            let shortUrl = "Sem mídia";

            if (bico.image1?.url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: bico.image1.url }),
                });
                const result = await res.json();
                if (res.ok) shortUrl = result.shortUrl;
              } catch (e) {
                console.error("Erro ao encurtar mídia do bico:", e);
              }
            }

            renderGameRow(i, isOk, liters, percent, shortUrl);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: teste-combustiveis-venda
      if (data.id === "teste-combustiveis-venda") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        const isEtanolOk = data.isEtanolOk === "yes" ? "Sim" : "Não";
        const isGasolinaOk = data.isGasolinaOk === "yes" ? "Sim" : "Não";

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        renderRow("Está ok? ET", isEtanolOk);
        renderRow("Peso ET", `${data.pesoEtanol || "—"} g`);
        renderRow("Temperatura ET", `${data.temperaturaEtanol || "—"} °C`);

        renderRow("Está ok? GC", isGasolinaOk);
        renderRow("Qualidade GC", `${data.qualidadeGasolina || "—"}%`);

        // Mídias
        if (Array.isArray(data.images)) {
          for (let i = 0; i < data.images.length; i++) {
            const item = data.images[i];
            const label = item.type === "Etanol" ? "Mídia ET" : "Mídia GC";
            let shortUrl = "Sem mídia";

            if (item.imageUrl) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: item.imageUrl }),
                });
                const result = await res.json();
                if (res.ok) shortUrl = result.shortUrl;
              } catch (e) {
                console.error(`Erro ao encurtar ${label.toLowerCase()}:`, e);
              }
            }

            renderRow(label, shortUrl);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: combustiveis-defesa
      if (data.id === "combustiveis-defesa") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        renderRow("Peso ET", `${data.etanolWeight || "—"} g`);
        renderRow("Temperatura ET", `${data.etanolTemperature || "—"} °C`);
        renderRow("Qualidade GC", `${data.gasolineQuality || "—"}%`);

        // Mídia ET
        if (data.etanolImageUrl) {
          try {
            const res = await fetch("/api/shorten-url", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ originalURL: data.etanolImageUrl }),
            });
            const result = await res.json();
            if (res.ok) renderRow("Mídia ET", result.shortUrl);
          } catch (e) {
            console.error("Erro ao encurtar mídia ET:", e);
          }
        }

        // Mídia GC
        if (data.gasolineImageUrl) {
          try {
            const res = await fetch("/api/shorten-url", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ originalURL: data.gasolineImageUrl }),
            });
            const result = await res.json();
            if (res.ok) renderRow("Mídia GC", result.shortUrl);
          } catch (e) {
            console.error("Erro ao encurtar mídia GC:", e);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: escala-trabalho
      if (data.id === "escala-trabalho") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        renderRow("Turno 1", `${data.qtdTurn1 || "0"} funcionário(s)`);
        renderRow("Turno 2", `${data.qtdTurn2 || "0"} funcionário(s)`);
        renderRow("Turno 3", `${data.qtdTurn3 || "0"} funcionário(s)`);
        renderRow(
          "Intermediário",
          `${data.qtdIntermediate || "0"} funcionário(s)`
        );

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: maquininhas-uso
      if (data.id === "maquininhas-uso") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        renderRow(
          "Maquininhas em uso",
          `${data.useMachines || "0"} unidade(s)`
        );
        renderRow(
          "Maquininhas travadas",
          `${data.stuckMachines || "0"} unidade(s)`
        );

        // Mídias
        if (Array.isArray(data.images)) {
          for (let i = 0; i < data.images.length; i++) {
            const url = data.images[i]?.imageUrl;
            let shortUrl = "Erro ao encurtar";

            if (url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: url }),
                });
                const result = await res.json();
                if (res.ok) {
                  shortUrl = result.shortUrl;
                }
              } catch (err) {
                console.error(`Erro ao encurtar imagem ${i + 1}:`, err);
              }
            }

            renderRow(`Mídia ${i + 1}`, shortUrl);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: maquininhas-reservas
      if (data.id === "maquininhas-reservas") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        renderRow("Maquininhas reservas", `${data.qtd || "0"} unidade(s)`);

        // Mídias
        if (Array.isArray(data.images)) {
          for (let i = 0; i < data.images.length; i++) {
            const url = data.images[i]?.imageUrl;
            let shortUrl = "Erro ao encurtar";

            if (url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: url }),
                });
                const result = await res.json();
                if (res.ok) {
                  shortUrl = result.shortUrl;
                }
              } catch (err) {
                console.error(`Erro ao encurtar imagem ${i + 1}:`, err);
              }
            }

            renderRow(`Mídia ${i + 1}`, shortUrl);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: maquininhas-quebradas
      if (data.id === "maquininhas-quebradas") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        if (Array.isArray(data.machinesData)) {
          for (let i = 0; i < data.machinesData.length; i++) {
            const machine = data.machinesData[i];
            renderRow(`Máquina ${i + 1} - Serial`, machine.serialNumber || "—");
            renderRow(
              `Máquina ${i + 1} - Protocolo`,
              machine.protocolNumber || "—"
            );
          }
        }

        // Mídias
        if (Array.isArray(data.images)) {
          for (let i = 0; i < data.images.length; i++) {
            const url = data.images[i]?.imageUrl;
            let shortUrl = "Erro ao encurtar";

            if (url) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: url }),
                });
                const result = await res.json();
                if (res.ok) {
                  shortUrl = result.shortUrl;
                }
              } catch (err) {
                console.error(`Erro ao encurtar imagem ${i + 1}:`, err);
              }
            }

            renderRow(`Mídia `, shortUrl);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Tarefa: documentos
      if (data.id === "documentos") {
        const [year, month, day] = data.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        renderRow("Data", formattedDate);
        renderRow("Horário", data.time || "—");
        renderRow("Supervisor", data.supervisorName || "—");

        // Verificações
        renderRowDoc(
          "Licença de Operação",
          data.isLicencaOperacaoOk === "yes" ? "Sim" : "Não"
        );
        renderRowDoc(
          "Alvará de Funcionamento",
          data.isAlvaraFuncionamentoOk === "yes" ? "Sim" : "Não"
        );
        renderRowDoc(
          "Alvará dos Bombeiros",
          data.isBombeirosOk === "yes" ? "Sim" : "Não"
        );
        renderRowDoc("EPAE", data.isEpaeOk === "yes" ? "Sim" : "Não");
        renderRowDoc("Brigada", data.isBrigadaOk === "yes" ? "Sim" : "Não");
        renderRowDoc(
          "Laudo do Compressor",
          data.isLaudoCompressorOk === "yes" ? "Sim" : "Não"
        );
        renderRowDoc(
          "Laudo de Estanqueidade",
          data.isLaudoEstanqueidadeOk === "yes" ? "Sim" : "Não"
        );
        renderRowDoc(
          "Laudo de Elétrica para Raio",
          data.isLaudoEletricaOk === "yes" ? "Sim" : "Não"
        );
        renderRowDoc(
          "Contrato Social",
          data.isContratoSocialOk === "yes" ? "Sim" : "Não"
        );
        renderRowDoc("Documentos ANP", data.isANPOk === "yes" ? "Sim" : "Não");

        // Mídias
        if (Array.isArray(data.images)) {
          for (let i = 0; i < data.images.length; i++) {
            const image = data.images[i];

            // Remove "Imagem do" e "Imagem da" e substitui por "Midia"
            const cleanedType =
              image.type?.replace(/^Imagem (do|da)\s*/i, "").trim() ||
              `Mídia ${i + 1}`;
            const typeLabel = `Midia ${cleanedType}`;

            let shortUrl = "Erro ao encurtar";

            if (image.imageUrl) {
              try {
                const res = await fetch("/api/shorten-url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ originalURL: image.imageUrl }),
                });
                const result = await res.json();
                if (res.ok) {
                  shortUrl = result.shortUrl;
                }
              } catch (err) {
                console.error(`Erro ao encurtar "${typeLabel}":`, err);
              }
            }

            renderRowDoc(typeLabel, shortUrl);
          }
        }

        renderRowObs("Observações", data.observations || "-");
      }

      // Fallback para tarefas ainda não tratadas
      if (
        data.id !== "digital_point" &&
        data.id !== "limpeza-pista" &&
        data.id !== "limpeza-testeiras" &&
        data.id !== "limpeza-pista" &&
        data.id !== "iluminacao-testeiras" &&
        data.id !== "canaletas" &&
        data.id !== "vestiario" &&
        data.id !== "pintura-posto" &&
        data.id !== "iluminacao-pista" &&
        data.id !== "limpeza-banheiros" &&
        data.id !== "troca-oleo" &&
        data.id !== "forro" &&
        data.id !== "atendimento" &&
        data.id !== "uniformes" &&
        data.id !== "placas-sinalizacao" &&
        data.id !== "limpeza-bombas" &&
        data.id !== "caixa-surpresa" &&
        data.id !== "extintores" &&
        data.id !== "placas-faixa-preco" &&
        data.id !== "regua" &&
        data.id !== "aferidores" &&
        data.id !== "compressor" &&
        data.id !== "calibrador" &&
        data.id !== "bicos-parados" &&
        data.id !== "lacre-bombas" &&
        data.id !== "bocas-visita" &&
        data.id !== "canetas" &&
        data.id !== "canetas" &&
        data.id !== "mangueiras" &&
        data.id !== "bicos" &&
        data.id !== "passagem-bomba" &&
        data.id !== "limpeza-samp" &&
        data.id !== "calibragem-bombas" &&
        data.id !== "game" &&
        data.id !== "teste-combustiveis-venda" &&
        data.id !== "combustiveis-defesa" &&
        data.id !== "maquininhas-quebradas" &&
        data.id !== "maquininhas-reservas" &&
        data.id !== "maquininhas-uso" &&
        data.id !== "escala-trabalho" &&
        data.id !== "documentos" &&
        data.id !== "identificacao-fornecedor" &&
        data.id !== "bocas-descarga-e-cadeados"
      ) {
        docPdf.text(JSON.stringify(data, null, 2), 10, y);
      }
    }

    docPdf.save(`relatorio-${post}-${formattedShift}-${date}.pdf`);

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Rede Postos</title>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome activeRoute={router.pathname} openMenu={openMenu} />
        <LoadingOverlay isLoading={isLoading} />

        <div className={styles.OrderContainer}>
          <HeaderHome />
          <div className={styles.CardsMenusContainer}>
            <div className={styles.CardsMenus}>
              {postsAvailable.length > 0 ? (
                ["firstShift", "secondShift"].map((shift) => (
                  <div key={shift} className={styles.CardsMenus}>
                    {postsAvailable.map((post) => (
                      <div
                        key={post.value}
                        className={styles.CardMenu}
                        onClick={() =>
                          handleCardClick(
                            shift as "firstShift" | "secondShift",
                            post
                          )
                        }
                      >
                        <span className={styles.CardMenuText}>{`${
                          post.label
                        } - ${
                          shift === "firstShift"
                            ? "Primeiro turno"
                            : "Segundo turno"
                        }`}</span>

                        {(completedTasks[`${post.label}_${shift}`]?.length ||
                          0) > 0 && (
                          <div
                            style={{
                              width: "100%",
                              height: "2rem",
                              display: "flex",
                              marginTop: "1.5rem",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${
                                  ((completedTasks[`${post.label}_${shift}`]
                                    ?.length || 0) /
                                    tasksOrder.length) *
                                  100
                                }%`,
                                backgroundColor: "#4caf50", // verde
                                height: "100%",
                                transition: "width 0.3s ease",
                              }}
                            />
                            <div
                              style={{
                                width: `${
                                  100 -
                                  ((completedTasks[`${post.label}_${shift}`]
                                    ?.length || 0) /
                                    tasksOrder.length) *
                                    100
                                }%`,
                                backgroundColor: "#f44336", // vermelho
                                height: "100%",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                        )}

                        {reportEligibility[`${post.label}_${shift}`] && (
                          <button
                            className={styles.editButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              generateReport(post.label, shift);
                            }}
                          >
                            Gerar Relatório
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className={styles.CardMenu}>
                  <span className={styles.CardMenuText}>
                    Sem postos disponíveis
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className={styles.Copy}>
            © Rede Postos 2024, todos os direitos reservados
          </p>
        </div>
      </div>
    </>
  );
}
