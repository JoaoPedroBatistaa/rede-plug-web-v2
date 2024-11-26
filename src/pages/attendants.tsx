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

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  // Função para obter o horário atual em UTC-3
  const getCurrentTimeInTimezone = () => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    return {
      hour: (utcHour - 3 + 24) % 24,
      minutes: utcMinutes,
    };
  };

  // Função para verificar se o horário é permitido
  const isAllowedTimeForRoutine = (
    startHour: number,
    startMinutes: number,
    endHour: number,
    endMinutes: number
  ) => {
    const { hour, minutes } = getCurrentTimeInTimezone();

    const currentTimeInMinutes = hour * 60 + minutes;
    const startTimeInMinutes = startHour * 60 + startMinutes;
    const endTimeInMinutes = endHour * 60 + endMinutes;

    if (startTimeInMinutes < endTimeInMinutes) {
      // Horário contínuo (ex.: 14:00 às 15:30)
      return (
        currentTimeInMinutes >= startTimeInMinutes &&
        currentTimeInMinutes < endTimeInMinutes
      );
    } else {
      // Horário passando pela meia-noite (ex.: 22:00 às 23:30)
      return (
        currentTimeInMinutes >= startTimeInMinutes ||
        currentTimeInMinutes < endTimeInMinutes
      );
    }
  };

  // Função para tratar cliques nos cards
  const handleCardClick = async (
    startHour: number,
    startMinutes: number,
    endHour: number,
    endMinutes: number,
    routinePath: string,
    allowedTime: string
  ) => {
    if (isAllowedTimeForRoutine(startHour, startMinutes, endHour, endMinutes)) {
      router.push(routinePath);
    } else {
      alert(
        `O horário permitido para este turno é das ${allowedTime}. Por favor, tente novamente dentro do horário.`
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
              {/* Turno 1 */}
              <div
                onClick={() =>
                  handleCardClick(
                    14,
                    0,
                    15,
                    30,
                    "/attendants/shift-1-routine",
                    "13:45 às 15:30"
                  )
                }
                className={styles.CardMenu}
              >
                <img src="/routine.svg" />
                <span className={styles.CardMenuText}>TURNO 1</span>
              </div>

              {/* Turno 2 */}
              <div
                onClick={() =>
                  handleCardClick(
                    22,
                    0,
                    23,
                    30,
                    "/attendants/shift-2-routine",
                    "21:45 às 23:30"
                  )
                }
                className={styles.CardMenu}
              >
                <img src="/routine.svg" />
                <span className={styles.CardMenuText}>TURNO 2</span>
              </div>

              {/* Turno 3 */}
              <div
                onClick={() =>
                  handleCardClick(
                    6,
                    0,
                    7,
                    30,
                    "/attendants/shift-3-routine",
                    "05:45 às 07:30"
                  )
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
