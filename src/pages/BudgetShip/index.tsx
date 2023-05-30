import Head from 'next/head';
import styles from '../../styles/BudgetShip.module.scss';
import { useRouter } from 'next/router';

import HeaderBudget from '@/components/HeaderBudget';
import SideMenuBudget from '@/components/SideMenuBudget';
import { ChangeEvent, useEffect, useState } from 'react';

export default function BudgetShip() {

  const router = useRouter();

  // UseStates para instalação
  const [selectedOptionInstall, setSelectedOptionInstall] = useState('opcao1');
  const [selectedOptionDelivery, setSelectedOptionDelivery] = useState('opcao1');

  const handleSelectChangeInstall = (event: ChangeEvent<HTMLSelectElement>) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('instalacao', event.target.value);
    }
  };

  const handleSelectChangeDelivery = (event: ChangeEvent<HTMLSelectElement>) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tipoEntrega', event.target.value);
    }
  };

  const handleInputValueChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (typeof window !== 'undefined') {
      localStorage.setItem(target.id, target.value);
    }
  };

  useEffect(() => {
    const valorInstalacaoElement = document.getElementById('valorInstalacao') as HTMLInputElement;
    const valorEntregaElement = document.getElementById('valorEntrega') as HTMLInputElement;

    if (valorInstalacaoElement) {
      valorInstalacaoElement.addEventListener('input', handleInputValueChange);
    }

    if (valorEntregaElement) {
      valorEntregaElement.addEventListener('input', handleInputValueChange);
    }

    // Removendo os event listeners na desmontagem do componente
    return () => {
      if (valorInstalacaoElement) {
        valorInstalacaoElement.removeEventListener('input', handleInputValueChange);
      }

      if (valorEntregaElement) {
        valorEntregaElement.removeEventListener('input', handleInputValueChange);
      }
    };
  }, []);

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
            <p className={styles.BudgetTitle}>O pedido necessita de instalação ou frete?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R$1306,00</p>
              </div>

              <button className={styles.FinishButton}>Finalizar Orçamento</button>
            </div>
          </div>

          <p className={styles.Notes}>Informe abaixo se o pedido necessita de instalação ou frete</p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Necessita de instalação? *</p>
              <select id='instalacao' className={styles.SelectField} value={selectedOptionInstall} onChange={handleSelectChangeInstall}>
                <option value="SIM" selected={selectedOptionInstall === 'SIM'}>
                  SIM
                </option>
                <option value="NÃO" selected={selectedOptionInstall === 'NÃO'}>
                  NÃO
                </option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor da instalação</p>
              <p id='valorInstalacao' className={styles.FixedValue}>R$245,30</p>
            </div>


          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Tipo de entrega</p>
              <select id='Entrega' className={styles.SelectField} value={selectedOptionDelivery} onChange={handleSelectChangeDelivery}>
                <option value="SEDEX" selected={selectedOptionDelivery === 'SEDEX'}>
                  SEDEX
                </option>
                <option value="TRANSPORTADORA" selected={selectedOptionDelivery === 'TRANSPORTADORA'}>
                  TRANSPORTADORA
                </option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor da entrega</p>
              <p id='valorEntrega' className={styles.FixedValue}>R$245,30</p>
            </div>


          </div>


          <div className={styles.Copyright}>
            <p className={styles.Copy}>© Total Maxx 2023, todos os direitos reservados</p>
          </div>

        </div>
      </div >
    </>
  )
}