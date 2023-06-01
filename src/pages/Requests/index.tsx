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
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedOption, setSelectedOption] = useState('opcao1');

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };
  const handleOpenFilter = () => {
    setOpenFilter(!openFilter);
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
                <div className={styles.ListMenu}>
                  <div className={styles.ListMenuFilter} onClick={handleOpenFilter}>
                    <img src='./Filter.png' ></img>  <span className={styles.ListMenuFilterText}>Filtros</span>
                  </div>
                  <SearchInputList></SearchInputList>
                </div>
                <div className={styles.ListMenuRight}>
                  <Link href='/BudgetSize'>
                    <button className={styles.ListMenuButton}>
                      Novo Pedido
                    </button>
                  </Link>
                </div>
              </div>
              <div
                className={`${
                  openFilter
                    ? styles.containerFilter
                    : styles.containerFilterClose
                }`}
              >
                <div className={styles.listFilter}>
                  <h2>ORDENAR POR:</h2>
                  <div>
                    <input
                      type="radio"
                      id="nomeCrescente"
                      name="ordenarPor"
                     
                    />
                    <label htmlFor="nomeCrescente">Nome crescente</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="nomeDecrescente"
                      name="ordenarPor"
                    />
                    <label htmlFor="nomeDecrescente">Nome decrescente</label>
                  </div>
                  <div>
                    <input type="radio" id="maiorValor" name="ordenarPor" />
                    <label htmlFor="maiorValor">Maior Valor</label>
                  </div>
                  <div>
                    <input type="radio" id="dataVencimento" name="ordenarPor" />
                    <label htmlFor="dataVencimento">Data de vencimento</label>
                  </div>
                  <div>
                    <input type="radio" id="dataCadastro" name="ordenarPor" />
                    <label htmlFor="dataCadastro">Data de cadastro</label>
                  </div>
                  <span className={styles.sublinado}></span>
                  <h2>SITUAÇÃO</h2>
                  <div>
                    <input type="radio" id="todos" name="situacao" />
                    <label htmlFor="todos">Todos</label>
                  </div>
                  <div>
                    <input type="radio" id="ativos" name="situacao" />
                    <label htmlFor="ativos">Ativos</label>
                  </div>
                  <div>
                    <input type="radio" id="inativos" name="situacao" />
                    <label htmlFor="inativos">Inativos</label>
                  </div>
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