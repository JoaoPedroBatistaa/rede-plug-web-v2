import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/Header.Home.module.scss";
import { useMenu } from "../Context/context";

export default function HeaderHome() {
  const router = useRouter();
  const postName = router.query.post;
  const managerName = router.query.supervisorName;
  const date = router.query.date;

  const [searchText, setSearchText] = useState("");

  const { openMenu, setOpenMenu } = useMenu();

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    console.log(openMenu);
  };

  const nome =
    typeof window !== "undefined" ? localStorage.getItem("userName") : null;

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const day = date.getDate() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Adicionando zeros à esquerda para manter o formato dd/mm/aaaa
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>
      <div className={styles.HeaderContainer}>
        <div className={styles.HeaderSearch}>
          <div className={styles.menuSamduba} onClick={handleOpenMenu}>
            {" "}
            <img src="/menuSamduba.svg" height={20} width={26} alt="" />
          </div>

          {/* <Link href="/HomeResults">
            <SearchInput></SearchInput>
          </Link> */}
          <div className={styles.HeaderContainerIcons}>
            <img
              src="/iconSino.png"
              className={styles.HeaderIcon}
              height={20}
              width={20}
            />
            <img
              src="/iconProfile.png"
              className={styles.HeaderIcon}
              height={20}
              width={20}
            />
            <img
              src="/iconInterro.png"
              className={styles.HeaderIcon}
              height={20}
              width={20}
              id={styles.HeaderIcon}
            />
          </div>
        </div>
        <div className={styles.HeaderTextContainer}>
          <div className={styles.HeaderTextTitle}>
            Relatórios -- Posto: {postName} -- Supervisor: {managerName} --
            Data:{" "}
            {
              // @ts-ignore
              formatDate(date)
            }{" "}
            -- Tarefas
          </div>
        </div>
        <div className={styles.HeaderTextContainer}>
          <div className={styles.HeaderTextDescription}>
            <p>
              Aqui você pode realizar ações de forma rápida e fácil ou buscar
              por outras funcionalidades que esteja precisando{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
