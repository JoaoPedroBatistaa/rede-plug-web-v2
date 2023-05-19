import Head from 'next/head';
import styles from '../../styles/HeaderOrder.module.scss';

export default function HeaderBudget() {
  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div className={styles.HeaderContainer}>
        <p className={styles.NewBudget}>VISUALIZAR PEDIDO</p>
        <img src="./close.png" className={styles.Close} />
      </div>
    </>
  )
}