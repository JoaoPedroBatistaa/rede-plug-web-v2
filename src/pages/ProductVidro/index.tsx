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
import { addVidroToLogin } from "../../../firebase"
import classnames from "classnames";
export default function ProductPaspatur() {
  const router = useRouter();
  const { openMenu, setOpenMenu } = useMenu();

  const [codigo, setCodigo] = useState<string | null>(null);
  const [descricao, setDescricao] = useState('');
  const [margemLucro, setMargemLucro] = useState<string | null>(null);
  const [valorMetro, setValorMetro] = useState<string | null>(null);
  const [valorPerda, setValorPerda] = useState<string | null>(null);


  const handleButtonFinish = async (event: any) => {
    event.preventDefault();

    const vidro = {
      codigo,
      descricao,
      margemLucro,
      valorMetro,
      valorPerda,
    };

    try {
      // Substitua 'id_do_login' pelo id do login onde você quer adicionar o paspatur
      await addVidroToLogin(vidro, '7Td7y9iffho4gBZljJ14');
      toast.success('Produto Cadastrado!');
    } catch (e) {
      toast.error('Erro ao cadastrar produto.');
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
                <span className={styles.buttonText}>Cadastrar Vidro</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as credencias do seu vidro
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <input
                id="codigo"
                type="number"
                className={styles.Field}
                placeholder=""
                onChange={e => setCodigo(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Margem de Lucro (%)</p>
              <input
                id="margemLucro"
                type="number"
                className={styles.Field}
                placeholder=""
                onChange={e => setMargemLucro(e.target.value)}
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
                onChange={e => setValorMetro(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Perda de Material (%)</p>
              <input
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={e => setValorPerda(e.target.value)}
                
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Descrição</p>
              <textarea className={styles.Field} 
              id="descricao" 
              name="" 
              onChange={e => setDescricao(e.target.value)}
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
