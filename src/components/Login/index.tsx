
import Head from 'next/head';
import styles from '../../styles/Login.module.css';

export default function Login() {
  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
        `}</style>
      </Head>

      <div className={styles.Container}>
        <div className={styles.ImageContainer}>
          <img className={styles.logo} src="/logo.png" alt="logo" />
          <div className={styles.Social}>
            <img src="/facebook.png" alt="aaa" />
            <img src="instagram.png" alt="aaa" />
            <img src="twitter.png" alt="aa" />
          </div>
        </div>
        <div className={styles.LoginContainer}>
          <div className={styles.Login}>
            <p className={styles.title}>Login</p>
            <p className={styles.subtitle}>Informe seu acesso para entrar</p>

            <p className={styles.label}>Email</p>
            <input className={styles.field} type="email" />

            <p className={styles.label}>Senha</p>
            <input className={styles.field} type="text" />

            <a className={styles.forget} href="">Esqueci minha senha</a>

            <button className={styles.button}>Entrar</button>

            <div className={styles.linha}></div>


            <div className={styles.sign}>
              <p className={styles.signNew}>Ainda não tem uma conta? </p>
              <a className={styles.create} href="">Criar</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
