import Head from "next/head";
import styles from "../../styles/Home.Results.module.scss";
import { useRouter } from "next/router";

import SideMenuHome from "@/components/SideMenuHome";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import HeaderHome from "@/components/HeaderHome";
import HeaderHomeResult from "@/components/HeaderHomeResults";

export default function HomeResults() {
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState("opcao1");
  const [searchText, setSearchText] = useState("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome activeRoute={router.pathname}></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderHomeResult></HeaderHomeResult>
          <div className={styles.ResultContainer}>
            <div className={styles.ParamsContainer}>
              <div className={styles.Params}>
                <img
                  src="./settingsIcon.png"
                  className={styles.IconLeft}
                  width={15}
                  height={15}
                ></img>{" "}
                Parâmetros de Contratos
              </div>
              <div className={styles.ParamsItemResult}>
                <div>Cerca</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>Templates de relatório</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>SLA</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>EQUIPAMENTOS</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>LOCAIS</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>ÍNDICE DE REAJUSTE</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>PRAZO DE PAGAMENTO</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>ADITIVO DO CONTRATO</div>
              </div>
            </div>
            <div className={styles.ParamsContainer}>
              <div className={styles.Params}>
                <img
                  src="./contratcIcon.png"
                  className={styles.IconLeft}
                  width={15}
                  height={15}
                  id={styles.IconLeft}
                ></img>{" "}
                Contrato:
              </div>
              <div className={styles.ParamsItemResult}>
                <div>TIPO DE OPERAÇÃO</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>ADITIVO</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>EXPORTAÇÃO</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>CONTRATO</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>TABELA DE PREÇOS</div>
              </div>
              <div className={styles.ParamsItemResult}>
                <div>OPERAÇÃO</div>
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
