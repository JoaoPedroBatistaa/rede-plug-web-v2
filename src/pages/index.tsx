
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Login from './Login';
import BudgetSize from './BudgetSize';
import ViewOrderData from './ViewOrderData';
import ViewBudgetData from './ViewBudgetData';
import ViewOrderBudget from './ViewOrderBudget';

import App from './_app';

export default function Home() {
  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
        `}</style>
      </Head>

      <Login></Login>
    </>
  )
}
