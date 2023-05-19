import Head from 'next/head';
import styles from '../../styles/BudgetPaspatur.module.scss';
import { useRouter } from 'next/router';

import HeaderBudget from '@/components/HeaderBudget';
import SideMenuBudget from '@/components/SideMenuBudget';
import { ChangeEvent, useState } from 'react';

export default function BudgetPaspatur() {

  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState('opcao1');

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

      <HeaderBudget></HeaderBudget>
      <div className={styles.Container}>
        <SideMenuBudget activeRoute={router.pathname} ></SideMenuBudget>

        <div className={styles.BudgetContainer}>

          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>O pedido inclui paspatur?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R$996,00</p>
              </div>

              <button className={styles.FinishButton}>Finalizar Orçamento</button>
            </div>
          </div>

          <p className={styles.Notes}>Informe abaixo se paspatur será utilizado no pedido</p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Paspatur</p>
              <select className={styles.SelectField} value={selectedOption}
                onChange={handleSelectChange}>
                <option value="opcao1" selected={selectedOption === 'opcao1'}>
                  SIM
                </option>
                <option value="opcao2" selected={selectedOption === 'opcao2'}>
                  NÃO
                </option>
              </select>
            </div>


            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <select className={styles.SelectField} value={selectedOption}
                onChange={handleSelectChange}>
                <option value="opcao1" selected={selectedOption === 'opcao1'}>
                  55022
                </option>
                <option value="opcao2" selected={selectedOption === 'opcao2'}>
                  55023
                </option>
                <option value="opcao3" selected={selectedOption === 'opcao3'}>
                  55024
                </option>
              </select>
            </div>
          </div>

          <div className={styles.PreviewContainer}>
            <div className={styles.InputFieldPreview}>
              <p className={styles.FieldLabel}>Largura superior</p>
              <input type="text" className={styles.FieldPreview} placeholder='10' />
            </div>

            <div className={styles.PreviewImgContainer}>
              <div className={styles.InputFieldPreview}>
                <p className={styles.FieldLabel}>Largura esquerda</p>
                <input type="text" className={styles.FieldPreview} placeholder='15' />
              </div>

              <img src="./molduraSize.png" className={styles.PreviewImg} />

              <div className={styles.InputFieldPreview}>
                <p className={styles.FieldLabel}>Largura direita</p>
                <input type="text" className={styles.FieldPreview} placeholder='15' />
              </div>
            </div>

            <div className={styles.InputFieldPreview}>
              <p className={styles.FieldLabel}>Largura inferior</p>
              <input type="text" className={styles.FieldPreview} placeholder='10' />
            </div>
          </div>


          <div className={styles.Copyright}>
            <p className={styles.Copy}>© Total Maxx 2023, todos os direitos reservados</p>
          </div>

        </div>
      </div>
    </>
  )
}