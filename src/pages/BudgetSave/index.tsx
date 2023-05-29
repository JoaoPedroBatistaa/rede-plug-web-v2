import Head from 'next/head';
import styles from '../../styles/BudgetSave.module.scss';
import { useRouter } from 'next/router';

import HeaderBudget from '@/components/HeaderBudget';
import SideMenuBudget from '@/components/SideMenuBudget';
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';

import { db, addDoc, collection } from '../../../firebase';

export default function BudgetSave() {

  const router = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    localStorage.setItem(id, value);
  };

  const nomeCompleto = localStorage.getItem('nomeCompleto');
  const Telefone = localStorage.getItem('Telefone');
  const email = localStorage.getItem('email');
  const instalacao = localStorage.getItem('instalacao');
  const valorInstalacao = localStorage.getItem('valorInstalacao');
  const tipoEntrega = localStorage.getItem('tipoEntrega');
  const valorEntrega = localStorage.getItem('valorEntrega');
  const impressao = localStorage.getItem('impressao');
  const tipoImpressao = localStorage.getItem('tipoImpressao');
  const fileInput = localStorage.getItem('fileInput');
  const collage = localStorage.getItem('collage');
  const paspatur = localStorage.getItem('paspatur');
  const codigoPaspatur = localStorage.getItem('codigoPaspatur');
  const dimensoesPaspatur = localStorage.getItem('dimensoesPaspatur');
  const foam = localStorage.getItem('foam');
  const codigoFoam = localStorage.getItem('codigoFoam');
  const mdf = localStorage.getItem('mdf');
  const codigoMdf = localStorage.getItem('codigoMdf');
  const vidro = localStorage.getItem('vidro');
  const espessuraVidro = localStorage.getItem('espessuraVidro');
  const espelho = localStorage.getItem('espelho');
  const espessuraEspelho = localStorage.getItem('espessuraEspelho');
  const codigoPerfil = localStorage.getItem('codigoPerfil');
  const espessuraPerfil = localStorage.getItem('espessuraPerfil');
  const Tamanho = localStorage.getItem('Tamanho');

  const formatarData = (data: Date) => {
    const dia = data.getDate();
    const mes = data.getMonth() + 1; // Os meses começam do 0 em JavaScript
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  const dataCadastroInicial = new Date();
  const EntregaInicial = new Date();
  EntregaInicial.setDate(dataCadastroInicial.getDate() + 5);

  const dataCadastro = formatarData(dataCadastroInicial);
  const Entrega = formatarData(EntregaInicial);


  const handleSaveBudget = async () => {
    try {
      await addDoc(collection(db, 'Budget'), {
        nomeCompleto,
        Telefone,
        email,
        instalacao,
        valorInstalacao,
        tipoEntrega,
        valorEntrega,
        impressao,
        tipoImpressao,
        fileInput,
        collage,
        paspatur,
        codigoPaspatur,
        dimensoesPaspatur,
        foam,
        codigoFoam,
        mdf,
        codigoMdf,
        vidro,
        espessuraVidro,
        espelho,
        espessuraEspelho,
        codigoPerfil,
        espessuraPerfil,
        Tamanho,
        dataCadastro,
        Entrega
      });
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
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
            <p className={styles.BudgetTitle}>Salvar Orçamento</p>
          </div>


          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Nome completo</p>
              <input id='nomeCompleto' type="text" className={styles.FieldSave} placeholder='' onChange={handleInputChange} />
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Telefone</p>
              <input id='Telefone' type="tel" className={styles.FieldSave} placeholder='' onChange={handleInputChange} />
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Email</p>
              <input id='email' type="mail" className={styles.FieldSave} placeholder='' onChange={handleInputChange} />
            </div>
          </div>

          <div className={styles.linhaSave}></div>

          <div className={styles.ButtonsFinish}>
            <Link href='Budgets'>
              <button className={styles.CancelButton}>Cancelar</button>
            </Link>
            <Link href='BudgetFinish'>
              <button className={styles.SaveButton} onClick={handleSaveBudget}>Salvar Orçamento</button>
            </Link>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>© Total Maxx 2023, todos os direitos reservados</p>
          </div>

        </div>
      </div >
    </>
  )
}