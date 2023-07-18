import Head from "next/head";
import styles from "../../styles/ProductVidro.module.scss";
import { useRouter } from "next/router";

import HeaderNewProduct from "@/components/HeaderNewProduct";
import SideMenuHome from "@/components/SideMenuBudget";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MouseEvent } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useMenu } from "../../components/Context/context";
import { getVidroById, updateVidroInLogin } from "../../../firebase"
import classnames from "classnames";

export default function ProductPaspatur() {
  const router = useRouter();
  const { openMenu, setOpenMenu } = useMenu();

  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  let userId: string | null;
  if (typeof window !== 'undefined') {
    userId = window.localStorage.getItem('userId');
  }

  const [vidro, setVidro] = useState<any | null>(null);

  useEffect(() => {
    if (id && userId) {
      getVidroById(id, userId).then(fetchedVidro => setVidro(fetchedVidro));
    } else {
      toast.error('Erro: ID de usuário não encontrado. Faça o login novamente.');
    }
  }, [id]);

  const handleButtonFinish = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!userId || !id) {
      toast.error('Erro: ID de usuário ou ID de produto não encontrado.');
      return;
    }

    try {
      await updateVidroInLogin(vidro, id, userId);
      toast.success('Produto Atualizado!');
    } catch (e) {
      toast.error('Erro ao atualizar produto.');
    }
    
    setTimeout(() => {
      router.push("/Products");
    }, 500);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVidro({
      ...vidro,
      [event.target.id]: event.target.value,
    });
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
            <p className={styles.BudgetTitle}>Vidro</p>
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
                <span className={styles.buttonText}>Atualizar Vidro</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as credenciais do seu vidro
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <input
                id="codigo"
                type="number"
                className={styles.Field}
                placeholder=""
                value={vidro?.codigo || ''}
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
                value={vidro?.margemLucro || ''}
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
                value={vidro?.valorMetro || ''}
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
                value={vidro?.valorPerda || ''}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Descrição</p>
              <textarea className={styles.Field} 
              id="descricao" 
              name="" 
              value={vidro?.descricao || ''}
              onChange={handleChange}
              >
              </textarea>
            </div>

          </div>

          <div className={styles.InputContainer}>
          
          {/* Aqui você pode adicionar outros campos específicos do vidro, se necessário */}
          
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
