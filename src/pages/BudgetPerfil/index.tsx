import Head from 'next/head';
import styles from '../../styles/BudgetPerfil.module.scss';
import { useRouter } from 'next/router';

import HeaderBudget from '@/components/HeaderBudget';
import SideMenuBudget from '@/components/SideMenuBudget';
import { ChangeEvent, useEffect, useState } from 'react';

export default function BudgetPerfil() {

  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState('opcao1');
  const [espessura, setEspessura] = useState('');

  // Salva as informações no localStorage sempre que são alteradas
  useEffect(() => {
    localStorage.setItem('codigoPerfil', selectedOption);
    localStorage.setItem('espessuraPerfil', espessura);
  }, [selectedOption, espessura]);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleEspessuraChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEspessura(event.target.value);
  };

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <HeaderBudget></HeaderBudget>
      <div className={styles.Container}>
        <SideMenuBudget activeRoute={router.pathname} ></SideMenuBudget>

        <div className={styles.BudgetContainer}>

          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Qual perfil será utilizado?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R$650,00</p>
              </div>

              <button className={styles.FinishButton}>Finalizar Orçamento</button>
            </div>
          </div>

          <p className={styles.Notes}>Informe abaixo qual perfil será utilizado no pedido</p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <select id='codigo' className={styles.SelectField} value={selectedOption}
                onChange={handleSelectChange}>
                <option value="4401" selected={selectedOption === '4401'}>
                  4401
                </option>
                <option value="4402" selected={selectedOption === '4402'}>
                  4402
                </option>
                <option value="4403" selected={selectedOption === '4403'}>
                  4403
                </option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Largura do perfil</p>
              <input id='espessura' type="text" className={styles.Field} placeholder='' value={espessura} onChange={handleEspessuraChange} />
            </div>
          </div>

          <p className={styles.Preview}>PREVIEW</p>

          <div className={styles.PreviewContainer}>
            <div className={styles.PreviewImgContainer}>
              <img src="./molduraPerfil.png" className={styles.PreviewImg} />
            </div>

            <p className={styles.PreviewSize}>{espessura} CM</p>


          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>© Total Maxx 2023, todos os direitos reservados</p>
          </div>

        </div>
      </div>
    </>
  )
}