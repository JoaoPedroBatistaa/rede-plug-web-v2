import Head from 'next/head';
import styles from '../../styles/Requests.module.scss';
import { useRouter } from 'next/router';


import SideMenuHome from '@/components/SideMenuHome';
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import HeaderHome from '@/components/HeaderHome';
import HeaderRequests from '@/components/HeaderRequests';
import SearchInput from '@/components/InputSearch';
import SearchInputList from '@/components/InputSearchList';
import GridComponent from '@/components/GridRequests';
import Table from '@/components/Table';

export default function Requests() {

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
          <HeaderRequests></HeaderRequests>
          <div className={styles.MainContainer}>
              <div className={styles.ListContainer}>
                <div className={styles.ListMenu}>
                  <div  className={styles.ListMenu}>
                    <div className={styles.ListMenuFilter}>
                        <img src='./Filter.png' ></img>  <span className={styles.ListMenuFilterText}>Filtros</span>
                    </div>
                    <SearchInputList></SearchInputList>
                   </div>
                  <div  className={styles.ListMenuRight}>
                        <button className={styles.ListMenuButton}>
                          Novo Pedido
                        </button>
                   </div>
                </div>
                <div className={styles.MarginTop}></div>
                {/* <GridComponent/> */}
                <Table />
               
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