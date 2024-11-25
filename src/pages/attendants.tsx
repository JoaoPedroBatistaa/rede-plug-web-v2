import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";

import HeaderHome from "@/components/HeaderAttendants";
import SideMenuHome from "@/components/SideMenuHome";
import { ChangeEvent, useEffect, useState } from "react";

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

  // Função para exibir alerta se o horário for inválido
  const handleCardClick = async (
    startHour: number,
    endHour: number,
    // @ts-ignore
    routinePath: Url
  ) => {
    router.push(routinePath);
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
              {/* Turno 1 */}
              <div
                onClick={() =>
                  handleCardClick(14, 22, "/attendants/shift-1-routine")
                }
                className={styles.CardMenu}
              >
                <img src="/routine.svg" />
                <span className={styles.CardMenuText}>TURNO 1</span>
              </div>

              {/* Turno 2 */}
              <div
                onClick={() =>
                  handleCardClick(22, 6, "/attendants/shift-2-routine")
                }
                className={styles.CardMenu}
              >
                <img src="/routine.svg" />
                <span className={styles.CardMenuText}>TURNO 2</span>
              </div>

              {/* Turno 3 */}
              <div
                onClick={() =>
                  handleCardClick(6, 14, "/attendants/shift-3-routine")
                }
                className={styles.CardMenu}
              >
                <img src="/routine.svg" />
                <span className={styles.CardMenuText}>TURNO 3</span>
              </div>
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
