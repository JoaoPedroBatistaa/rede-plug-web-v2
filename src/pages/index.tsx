
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Login from '../components/Login';

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
