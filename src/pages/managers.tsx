import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";

import HeaderHome from "@/components/HeaderHome";
import SideMenuHome from "@/components/SideMenuHome";
import { collection, getDocs, query, where } from "firebase/firestore"; // Importa as funções necessárias do Firestore
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { db } from "../../firebase"; // Assume que o Firestore está configurado em firebaseConfig

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/");
    }
  }, []);

  const [openMenu, setOpenMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState("opcao1");
  const [searchText, setSearchText] = useState("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  // Função para obter o horário atual em UTC-3
  const getCurrentHourInTimezone = () => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    return (utcHour - 3 + 24) % 24;
  };

  // Função para verificar se o horário é permitido
  const isAllowedTimeForRoutine = (startHour: number, endHour: number) => {
    const currentHour = getCurrentHourInTimezone();
    if (startHour < endHour) {
      return currentHour >= startHour && currentHour < endHour;
    } else {
      return currentHour >= startHour || currentHour < endHour;
    }
  };

  // Função para obter a data de hoje no formato YYYY-MM-DD
  const getTodayDateFormatted = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Ajusta para 2 dígitos
    const day = String(now.getDate()).padStart(2, "0"); // Ajusta para 2 dígitos
    return `${year}-${month}-${day}`;
  };

  // Função para verificar o ponto digital no Firestore
  const checkDigitalPoint = async () => {
    const userName = localStorage.getItem("userName");
    const userPost = localStorage.getItem("userPost");
    const today = getTodayDateFormatted(); // Obtém a data no formato YYYY-MM-DD

    const q = query(
      collection(db, "MANAGERS"),
      where("id", "==", "digital_point"),
      where("date", "==", today),
      where("managerName", "==", userName),
      where("postName", "==", userPost)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // Função isolada para verificar o ponto de entrada
  const handlePointEntryClick = async () => {
    if (await checkDigitalPoint()) {
      alert("Ponto de entrada já registrado para hoje.");
    } else {
      router.push("/managers/point");
    }
  };

  // Função para exibir alerta se o horário for inválido ou se o ponto digital não foi feito
  const handleCardClick = async (
    startHour: number,
    endHour: number,
    routinePath: Url
  ) => {
    if (await checkDigitalPoint()) {
      if (isAllowedTimeForRoutine(startHour, endHour)) {
        router.push(routinePath);
      } else {
        alert(
          "Você só pode acessar essa rotina estando dentro do horário do turno."
        );
      }
    } else {
      alert(
        "A tarefa de ponto precisa ser concluída hoje para acessar esta rotina."
      );
    }
  };

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        `}</style>

        <title>Rede Postos</title>
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
              <div
                onClick={handlePointEntryClick} // Função isolada para o ponto de entrada
                className={styles.CardMenu}
              >
                <img src="./routine-point.svg" />
                <span className={styles.CardMenuText}>PONTO DE ENTRADA</span>
              </div>

              <div
                onClick={() => handleCardClick(6, 14, "/manager-six-routine")}
                className={styles.CardMenu}
              >
                <img src="./routine-6.svg" />
                <span className={styles.CardMenuText}>ROTINA 6H</span>
              </div>

              <div
                onClick={() =>
                  handleCardClick(14, 17, "/manager-fourteen-routine")
                }
                className={styles.CardMenu}
              >
                <img src="./routine-14.svg" />
                <span className={styles.CardMenuText}>ROTINA 14H</span>
              </div>

              <div
                onClick={() =>
                  handleCardClick(17, 22, "/manager-seventeen-routine")
                }
                className={styles.CardMenu}
              >
                <img src="./routine-17.svg" />
                <span className={styles.CardMenuText}>ROTINA 17</span>
              </div>

              <div
                onClick={() =>
                  handleCardClick(22, 6, "/manager-twenty-two-routine")
                }
                className={styles.CardMenu}
              >
                <img src="./routine-22.svg" />
                <span className={styles.CardMenuText}>ROTINA 22H</span>
              </div>

              <Link href={"/new-discharge"}>
                <div className={styles.CardMenu}>
                  <img src="./discharge.svg" />
                  <span className={styles.CardMenuText}>NOVA DESCARGA</span>
                </div>
              </Link>
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Rede Postos 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
