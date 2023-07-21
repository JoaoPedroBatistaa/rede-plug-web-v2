import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { MenuProvider } from "../components/Context/context";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head'; // Importe o componente Head

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MenuProvider>
      <Head>
        <title>Total Maxx System</title>
        <link rel="icon" href="/fav.png" />

      </Head>
      <Component {...pageProps} />
      <ToastContainer />
    </MenuProvider>
  );
}
