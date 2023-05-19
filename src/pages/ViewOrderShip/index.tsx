import Head from 'next/head';
import styles from '../../styles/ViewOrderShip.module.scss';
import { useRouter } from 'next/router';

import HeaderOrder from '@/components/HeaderOrder';
import SideMenuHome from '@/components/SideMenuHome';
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';

export default function ViewOrderShip() {

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
                  <p className={styles.NavItem}>Dados do cliente</p>
                </Link>

                <Link href='ViewOrderShip'>
                  <div>
                    <p className={`${styles.NavItem} ${styles.active}`}>Endereço</p>
                    <div className={styles.NavItemBar}></div>
                  </div>
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
                    <p className={styles.FieldLabel}>CEP</p>
                    <input type="text" className={styles.FieldSmall} placeholder='99999-999' />
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Endereço *</p>
                    <input type="text" className={styles.FieldSave} placeholder='Rua X Num 9' />
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Número *</p>
                    <input type="text" className={styles.FieldSmall} placeholder='999' />
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Complemento</p>
                    <input type="text" className={styles.FieldSave} placeholder='Casa' />
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Bairro *</p>
                    <input type="text" className={styles.Field} placeholder='Lapa' />
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Cidade</p>
                    <input type="text" className={styles.Field} placeholder='São Paulo' />
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Estado *</p>
                    <input type="text" className={styles.Field} placeholder='São Paulo' />
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