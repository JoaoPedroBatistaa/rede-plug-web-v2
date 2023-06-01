import Head from 'next/head';
import styles from '../../styles/BudgetFoam.module.scss';
import { useRouter } from 'next/router';

import HeaderBudget from '@/components/HeaderBudget';
import SideMenuBudget from '@/components/SideMenuBudget';
import { ChangeEvent, useEffect, useState } from 'react';

export default function BudgetFoam() {

  const router = useRouter();

  const [selectedOptionFoam, setSelectedOptionFoam] = useState('opcao1');
  const [selectedOptionCodigoFoam, setSelectedOptionCodigoFoam] = useState('opcao1');
  const [selectedOptionMdf, setSelectedOptionMdf] = useState('opcao1');
  const [selectedOptionCodigoMdf, setSelectedOptionCodigoMdf] = useState('opcao1');

  useEffect(() => {
    localStorage.setItem('foam', selectedOptionFoam);
    localStorage.setItem('codigoFoam', selectedOptionCodigoFoam);
    localStorage.setItem('mdf', selectedOptionMdf);
    localStorage.setItem('codigoMdf', selectedOptionCodigoMdf);
  }, [selectedOptionFoam, selectedOptionCodigoFoam, selectedOptionMdf, selectedOptionCodigoMdf]);

  const handleSelectChangeFoam = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionFoam(event.target.value);
  };

  const handleSelectChangeCodigoFoam = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionCodigoFoam(event.target.value);
  };

  const handleSelectChangeMdf = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionMdf(event.target.value);
  };

  const handleSelectChangeCodigoMdf = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionCodigoMdf(event.target.value);
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
            <p className={styles.BudgetTitle}>O pedido inclui foam / MDF?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R$942,00</p>
              </div>

              <button className={styles.FinishButton}>Finalizar Orçamento</button>
            </div>
          </div>

          <p className={styles.Notes}>Informe abaixo qual foam será utilizado no pedido</p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Foam</p>
              <select id='Foam' className={styles.SelectField} value={selectedOptionFoam} onChange={handleSelectChangeFoam}>
                <option value="SIM" selected={selectedOptionFoam === 'SIM'}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionFoam === 'NÃO'}>
                  NÃO
                </option>
              </select>
            </div>


            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Código</p>
              <select id='codigoFoam' className={styles.SelectField} value={selectedOptionCodigoFoam} onChange={handleSelectChangeCodigoFoam}>
                <option value="55022" selected={selectedOptionCodigoFoam === '55022'}>
                  55022
                </option>
                <option value="55023" selected={selectedOptionCodigoFoam === '55023'}>
                  55023
                </option>
                <option value="55024" selected={selectedOptionCodigoFoam === '55024'}>
                  55024
                </option>
              </select>
            </div>


          </div>


          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>MDF</p>
              <select id='mdf' className={styles.SelectField} value={selectedOptionMdf} onChange={handleSelectChangeMdf}>
                <option value="SIM" selected={selectedOptionMdf === 'SIM'}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionMdf === 'NÃO'}>
                  NÃO
                </option>
              </select>
            </div>


            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Largura do Espelho</p>
              <select id='codigoMdf' className={styles.SelectField} value={selectedOptionCodigoMdf} onChange={handleSelectChangeCodigoMdf}>
                <option value="55020" selected={selectedOptionCodigoMdf === '55020'}>
                  55020
                </option>
                <option value="55021" selected={selectedOptionCodigoMdf === '55021'}>
                  55021
                </option>
                <option value="55025" selected={selectedOptionCodigoMdf === '55025'}>
                  55025
                </option>
              </select>
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