import Head from 'next/head';
import styles from '../../styles/Header.Budgets.module.scss';
import SearchInput from '../InputSearch';

export default function HeaderRequests() {
  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>
      <div className={styles.HeaderContainer}>
      
        <div className={styles.HeaderSearch}>
          <div className={styles.HeaderTextTitle}>
             <b>Orçamentos</b>
          </div>
          <div className={styles.HeaderContainerIcons}>
              <img src='./iconSino.png' className={styles.HeaderIcon} height={20} width={20} />
              <img src='./iconProfile.png' className={styles.HeaderIcon}  height={20} width={20} />
              <img src='./iconInterro.png' className={styles.HeaderIcon}  height={20} width={20} />
          </div>

        </div>         
        <div className={styles.HeaderTextContainer}>
            <div className={styles.HeaderTextDescription}>
              <p>Aqui voce encontra todos os orçamentos ainda não efetivados em pedidos</p>
            </div>
            
        </div>       
       
      </div>
    </>
  )
}