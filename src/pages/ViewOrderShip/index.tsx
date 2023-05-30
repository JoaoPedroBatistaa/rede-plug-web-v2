import Head from 'next/head';
import styles from '../../styles/ViewOrderShip.module.scss';
import { useRouter } from 'next/router';

import HeaderOrder from '@/components/HeaderOrder';
import SideMenuHome from '@/components/SideMenuHome';
import { ChangeEvent, useEffect, useState } from 'react';
import Link from 'next/link';

import { db, doc, getDoc } from '../../../firebase';

type UserDataType = {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export default function ViewOrderShip() {

  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState('opcao1');

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const [userData, setUserData] = useState<UserDataType | null>(null);

  const selectedId = localStorage.getItem('selectedId')

  useEffect(() => {
    async function fetchData() {
      if (selectedId) {
        try {
          const docRef = doc(db, 'Orders', selectedId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserDataType);
          } else {
            console.log("Nenhum documento encontrado!");
          }
        } catch (error) {
          console.error("Erro ao buscar documento:", error);
        }
      } else {
        console.log("Nenhum ID selecionado!");
      }
    }

    fetchData();
  }, [selectedId]);

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
                    <p className={styles.FixedDataSmall}>{userData?.cep}</p>
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Endereço *</p>
                    <p className={styles.FixedData}>{userData?.endereco}</p>
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Número *</p>
                    <p className={styles.FixedDataSmall}>{userData?.numero}</p>
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Complemento</p>
                    <p className={styles.FixedData}>{userData?.complemento}</p>
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Bairro *</p>
                    <p className={styles.FixedDataMedium}>{userData?.bairro}</p>
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Cidade</p>
                    <p className={styles.FixedDataMedium}>{userData?.cidade}</p>
                  </div>
                </div>

                <div className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Estado *</p>
                    <p className={styles.FixedDataMedium}>{userData?.estado}</p>
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