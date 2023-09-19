import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductImpressao.module.scss";

import HeaderNewProduct from "@/components/HeaderNewProduct";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getInstalacaoById, updateInstalacaoInLogin } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

export default function UpdateImpressao() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const { openMenu, setOpenMenu } = useMenu();

  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  const [impressao, setImpressao] = useState<any | null>(null);

  useEffect(() => {
    if (id && userId) {
      getInstalacaoById(id, userId).then((fetchedImpressao) =>
        setImpressao(fetchedImpressao)
      );
    } else {
      toast.error(
        "Erro: ID de usuário não encontrado. Faça o login novamente."
      );
    }
  }, [id]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let newValue = event.target.value;

    // Se o ID for "codigo", substituímos a vírgula por um ponto
    if (event.target.id === "valorMetro") {
      newValue = newValue.replace(/,/g, ".");
    }

    setImpressao({
      ...impressao,
      [event.target.id]: newValue,
    });
  };

  const handleButtonFinish = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!userId || !id) {
      toast.error("Erro: ID de usuário ou ID de produto não encontrado.");
      return;
    }

    try {
      await updateInstalacaoInLogin(impressao, id, userId);
      toast.success("Produto Atualizado!");
    } catch (e) {
      toast.error("Erro ao atualizar produto.");
    }

    setTimeout(() => {
      router.push("/Products");
    }, 500);
  };

  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 100);
  };

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <HeaderNewProduct></HeaderNewProduct>
      <ToastContainer />
      <div className={styles.Container} onClick={handleOpenMenuDiv}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Diversos</p>
            <div className={styles.BudgetHeadS}>
              <button
                className={styles.FinishButton}
                onClick={handleButtonFinish}
              >
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Atualizar Diversos</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>Atualize as credencias da sua Diversos</p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <input
                id="codigo"
                type="number"
                className={styles.Field}
                placeholder=""
                onChange={handleChange}
                value={impressao?.codigo}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Margem de Lucro (%)</p>
              <input
                id="margemLucro"
                type="number"
                className={styles.Field}
                placeholder=""
                onChange={handleChange}
                value={impressao?.margemLucro}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor do Metro</p>
              <input
                id="valorMetro"
                type="number"
                className={styles.Field}
                placeholder=""
                onChange={handleChange}
                value={impressao?.valorMetro}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Perda de Material (%)</p>
              <input
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={handleChange}
                value={impressao?.valorPerda}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Descrição</p>
              <textarea
                className={styles.Field}
                id="descricao"
                name=""
                onChange={handleChange}
                value={impressao?.descricao}
              ></textarea>
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
