import Head from 'next/head';
import styles from '../../styles/ViewOrderData.module.scss';
import { useRouter } from 'next/router';

import HeaderOrder from '@/components/HeaderOrder';
import SideMenuHome from '@/components/SideMenuHome';
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';

export default function ViewOrderData() {

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


      <div className={styles.Container}>
        <SideMenuHome activeRoute={router.pathname} ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderOrder></HeaderOrder>

          <div className={styles.OrderDataContainer}>

            <div className={styles.BudgetHead}>
              <div className={styles.Nav}>
                <Link href='ViewOrderData'>
                  <div>
                    <p className={`${styles.NavItem} ${styles.active}`}>Dados do cliente</p>
                    <div className={styles.NavItemBar}></div>
                  </div>
                </Link>

                <Link href='ViewOrderShip'>
                  <p className={styles.NavItem}>Endereço</p>
                </Link>

                <Link href='ViewOrderBudget'>
                  <p className={styles.NavItem}>Orçamento</p>
                </Link>

              </div>

              <div className={styles.BudgetHeadO}>
                <p className={styles.OrderTotalValue}>Valor total:</p>
                <p className={styles.OrderValue}>R$1350,00</p>
              </div>
            </div>

            <div className={styles.linhaOrder}></div>

            <div className={styles.BudgetData}>

              <div className={styles.PessoalData}>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Tipo de pessoa</p>
                    <select className={styles.SelectFieldPerson} value={selectedOption}
                      onChange={handleSelectChange}>
                      <option value="opcao1" selected={selectedOption === 'opcao1'}>
                        FÍSICA
                      </option>
                      <option value="opcao2" selected={selectedOption === 'opcao2'}>
                        JURÍDICA
                      </option>
                    </select>
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>CPF</p>
                    <input type="text" className={styles.FieldSave} placeholder='111111111-11' />
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Nome completo</p>
                    <input type="text" className={styles.FieldSave} placeholder='JOSÉ ALBERTO SANTIAGO' />
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Email</p>
                    <input type="mail" className={styles.FieldSave} placeholder='josealberto@gmail.com' />
                  </div>
                </div>


                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Telefone</p>
                    <input type="tel" className={styles.FieldSave} placeholder='(61) 99999-9999' />
                  </div>
                </div>

              </div>

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