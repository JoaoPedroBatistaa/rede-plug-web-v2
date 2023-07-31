import Head from "next/head";
import styles from "../../styles/ProductFoam.module.scss";
import { useRouter } from "next/router";

import HeaderNewProduct from "@/components/HeaderNewProduct";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MouseEvent } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useMenu } from "../../components/Context/context";
import { getColagemById, updateColagemInLogin } from "../../../firebase"
import classnames from "classnames";

export default function UpdateFoam() {
  const router = useRouter();
  const { openMenu, setOpenMenu } = useMenu();

  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  let userId: string | null;
  if (typeof window !== 'undefined') {
    userId = window.localStorage.getItem('userId');
  }


  // State to hold the current foam
  const [foam, setFoam] = useState<any | null>(null);

  // fetch the foam data on component mount using the id from router
  useEffect(() => {
    if (id && userId) {
      getColagemById(id, userId).then(fetchedFoam => setFoam(fetchedFoam));
    } else {
      toast.error('Erro: ID de usuário não encontrado. Faça o login novamente.');
    }
  }, [id]);

  // update the state when input fields change
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFoam({
      ...foam,
      [event.target.id]: event.target.value,
    });
  };

  const handleButtonFinish = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!userId || !id) {
      toast.error('Erro: ID de usuário ou ID de produto não encontrado.');
      return;
    }

    try {
      await updateColagemInLogin(foam, id, userId);
      toast.success('Produto Atualizado!');
    } catch (e) {
      toast.error('Erro ao atualizar produto.');
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
            <p className={styles.BudgetTitle}>Atualizar Foam</p>
            <div className={styles.BudgetHeadS}>

              <button
                className={styles.FinishButton}
                onClick={handleButtonFinish}
              >
                <span className={styles.buttonText}>Atualizar Foam</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as novas credenciais do seu Foam
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <input
                id="codigo"
                type="number"
                className={styles.Field}
                placeholder=""
                value={foam?.codigo || ''}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Margem de Lucro (%)</p>
              <input
                id="margemLucro"
                type="number"
                className={styles.Field}
                placeholder=""
                value={foam?.margemLucro || ''}
                onChange={handleChange}
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
                value={foam?.valorMetro || ''}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Perda de Material (%)</p>
              <input
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.valorPerda || ''}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Descrição</p>
              <textarea
                className={styles.Field}
                id="descricao"
                value={foam?.descricao || ''}
                onChange={handleChange}
              >
              </textarea>
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
