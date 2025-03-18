import HeaderHome from "@/components/HeaderSupervisors";
import SideMenuHome from "@/components/SideMenuHome";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import styles from "../styles/Home.module.scss";

interface PostOption {
  label: string;
  value: string;
}

interface Task {
  id: string;
  route: string;
}

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

  const tasksOrder: Task[] = [
    { id: "digital_point", route: "/supervisors/point" },
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
    { id: "maquininhas-quebradas", route: "/supervisors/broken-machines" },
    { id: "escala-trabalho", route: "/supervisors/work-schedule" },
    { id: "notas-fiscais", route: "/supervisors/fiscal-notes" },
    { id: "documentos", route: "/supervisors/documents" },
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    if (!storedUserId) {
      router.push("/");
      return;
    }

    const fetchPosts = async () => {
      try {
        const docRef = doc(db, "USERS", storedUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setPostsAvailable(userData.postsAvailable || []);
        }
      } catch (error) {
        console.error("Erro ao buscar postos disponíveis:", error);
      }
    };

    fetchPosts();
  }, [router]);

  const handleCardClick = async (
    shift: "firstShift" | "secondShift",
    post: PostOption
  ) => {
    const now = new Date();
    const hour = now.getHours();

    if (
      (shift === "firstShift" && (hour < 8 || hour >= 14)) ||
      (shift === "secondShift" && (hour < 14 || hour >= 22))
    ) {
      alert("Fora do horário permitido para este turno.");
      return;
    }

    if (
      (shift === "firstShift" && selectedPosts.secondShift === post.value) ||
      (shift === "secondShift" && selectedPosts.firstShift === post.value)
    ) {
      alert("O mesmo posto não pode ser selecionado para ambos os turnos.");
      return;
    }

    const nextTaskRoute = tasksOrder[0].route;
    setSelectedPosts((prev) => ({ ...prev, [shift]: post.value }));

    router.push(
      `${nextTaskRoute}?post=${encodeURIComponent(post.label)}&shift=${shift}`
    );
  };

  return (
    <>
      <Head>
        <title>Rede Postos</title>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome activeRoute={router.pathname} openMenu={openMenu} />
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
