import HeaderHome from "@/components/HeaderReportsSupervisorTasks";
import SideMenuHome from "@/components/SideMenuHome";
import { collection, getDocs, query, where } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const { post, supervisorName, date } = router.query;

  const [openMenu, setOpenMenu] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskLinks, setTaskLinks] = useState({});

  useEffect(() => {
    let isComponentMounted = true;

    const fetchTasks = async () => {
      if (supervisorName && date) {
        try {
          const q = query(
            collection(db, "SUPERVISORS"),
            where("supervisorName", "==", supervisorName),
            where("date", "==", date),
            where("postName", "==", post)
          );
          const querySnapshot = await getDocs(q);

          // @ts-ignore
          const tasksData = [];
          querySnapshot.forEach((doc) => {
            const taskData = doc.data();
            const taskWithDocId = { ...taskData, docId: doc.id }; // Adiciona o docId à tarefa
            tasksData.push(taskWithDocId);
          });

          // @ts-ignore
          setTasks(tasksData);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    const taskLinksData = {
      uniformes: {
        id: "uniformes",
        name: "Uniformes",
        link: "/supervisors/uniforms",
      },
      atendimento: {
        id: "atendimento",
        name: "Atendimento",
        link: "/supervisors/service",
      },
      "limpeza-pista": {
        id: "limpeza-pista",
        name: "Limpeza e organização da pista",
        link: "/supervisors/track-cleaning",
      },
      "limpeza-bombas": {
        id: "limpeza-bombas",
        name: "Limpeza das bombas",
        link: "/supervisors/bombs-cleaning",
      },
      "limpeza-testeiras": {
        id: "limpeza-testeiras",
        name: "Limpeza testeira",
        link: "/supervisors/front-cleaning",
      },
      "limpeza-banheiros": {
        id: "limpeza-banheiros",
        name: "Limpeza e organização dos banheiros",
        link: "/supervisors/bathroom-cleaning",
      },
      vestiario: {
        id: "vestiario",
        name: "Limpeza do vestiário",
        link: "/supervisors/locker-room",
      },
      "troca-oleo": {
        id: "troca-oleo",
        name: "Limpeza da troca de óleo",
        link: "/supervisors/oil-change",
      },
      "pintura-posto": {
        id: "pintura-posto",
        name: "Pintura do posto",
        link: "/supervisors/post-painting",
      },
      canaletas: {
        id: "canaletas",
        name: "Canaletas",
        link: "/supervisors/channels",
      },
      "iluminacao-pista": {
        id: "iluminacao-pista",
        name: "Iluminação da pista",
        link: "/supervisors/runway-lightning",
      },
      "iluminacao-testeiras": {
        id: "iluminacao-testeiras",
        name: "Iluminação das testeiras",
        link: "/supervisors/front-lightning",
      },
      "placas-sinalizacao": {
        id: "placas-sinalizacao",
        name: "Placas de sinalização",
        link: "/supervisors/traffic-signs",
      },
      "identificacao-fornecedor": {
        id: "identificacao-fornecedor",
        name: "Identificação de fornecedor",
        link: "/supervisors/supplier-identification",
      },
      "placas-faixa-preco": {
        id: "placas-faixa-preco",
        name: "Placas e faixa de preço",
        link: "/supervisors/price-signs",
      },
      extintores: {
        id: "extintores",
        name: "Extintores",
        link: "/supervisors/extinguishers",
      },
      aferidores: {
        id: "aferidores",
        name: "Aferidores",
        link: "/supervisors/gauges",
      },
      compressor: {
        id: "compressor",
        name: "Compressor",
        link: "/supervisors/compressor",
      },
      calibrador: {
        id: "calibrador",
        name: "Calibrador",
        link: "/supervisors/calibrator",
      },
      "bocas-visita": {
        id: "bocas-visita",
        name: "Bocas de visita",
        link: "/supervisors/manholes",
      },
      "bocas-descarga-e-cadeados": {
        id: "bocas-descarga-e-cadeados",
        name: "Bocas de descarga e cadeados",
        link: "/supervisors/discharge-nozzles-and-padlocks",
      },
      canetas: {
        id: "canetas",
        name: "Canetas",
        link: "/supervisors/pens",
      },
      bicos: {
        id: "bicos",
        name: "Bicos",
        link: "/supervisors/nozzles",
      },
      "bicos-parados": {
        id: "bicos-parados",
        name: "Bicos parados",
        link: "/supervisors/nozzles-stopped",
      },
      mangueiras: {
        id: "mangueiras",
        name: "Mangueiras",
        link: "/supervisors/hoses",
      },
      "lacre-bombas": {
        id: "lacre-bombas",
        name: "Lacre das bombas",
        link: "/supervisors/bomb-seal",
      },
      "passagem-bomba": {
        id: "passagem-bomba",
        name: "Passagem de bomba",
        link: "/supervisors/bomb-passage",
      },
      game: {
        id: "game",
        name: "Game",
        link: "/supervisors/game",
      },
      "teste-combustiveis-venda": {
        id: "teste-combustiveis-venda",
        name: "Teste dos combustíveis de venda",
        link: "/supervisors/fuel-sell-test",
      },
      "calibragem-bombas": {
        id: "calibragem-bombas",
        name: "Calibragem das bombas",
        link: "/supervisors/pump-calibration",
      },
      vira: {
        id: "vira",
        name: "Vira e teste dos combustíveis de defesa",
        link: "/supervisors/turn",
      },
      "maquininhas-uso": {
        id: "maquininhas-uso",
        name: "Maquininhas em uso",
        link: "/supervisors/use-machines",
      },
      "maquininhas-reservas": {
        id: "maquininhas-reservas",
        name: "Maquininhas reservas",
        link: "/supervisors/reserve-machines",
      },
      "escala-trabalho": {
        id: "escala-trabalho",
        name: "Escala de trabalho",
        link: "/supervisors/work-schedule",
      },
      "notas-fiscais": {
        id: "notas-fiscais",
        name: "Notas fiscais",
        link: "/supervisors/fiscal-notes",
      },
      documentos: {
        id: "documentos",
        name: "Documentos",
        link: "/supervisors/documents",
      },
    };

    setTaskLinks(taskLinksData);

    fetchTasks();

    return () => {
      isComponentMounted = false;
    };
  }, [supervisorName, date]);

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
        <title>Rede Plug</title>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome
          activeRoute={router.pathname}
          openMenu={openMenu}
        ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderHome></HeaderHome>
          <div className={styles.CardsMenusContainer}>
            <div className={styles.CardsMenus}>
              {Object.values(taskLinks).map((taskLink) => {
                const taskIndex = tasks.findIndex(
                  // @ts-ignore
                  (task) => task.id === taskLink.id
                );
                const isTaskExist = taskIndex !== -1;
                const task = isTaskExist ? tasks[taskIndex] : null;
                return (
                  <div
                    key={
                      // @ts-ignore
                      taskLink.id
                    }
                    className={`${styles.CardMenuDate} ${
                      isTaskExist ? styles.GreenText : styles.RedText
                    }`}
                  >
                    {isTaskExist ? (
                      <a
                        // @ts-ignore
                        href={`${taskLink.link}?docId=${task.docId}`} // Passa o docId como query
                        className={`${styles.CardMenuTextDate} ${
                          isTaskExist ? styles.GreenText : styles.RedText
                        }`}
                      >
                        {
                          // @ts-ignore
                          taskLink.name
                        }
                      </a>
                    ) : (
                      <span
                        className={`${styles.CardMenuTextDate} ${
                          isTaskExist ? styles.GreenText : styles.RedText
                        }`}
                      >
                        {
                          // @ts-ignore
                          taskLink.name
                        }
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.Copyrigt}>
            <p className={styles.Copy}>
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
