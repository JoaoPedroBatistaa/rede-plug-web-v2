import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head"; // Importe o componente Head
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MenuProvider } from "../components/Context/context";

export default function App({ Component, pageProps }: AppProps) {
  const SafeComponent: any = Component;
  return (
    <MenuProvider>
      <Head>
        <title>Rede Plug</title>
        <link rel="icon" href="/fav.png" />
      </Head>
      <SafeComponent {...pageProps} />
      <ToastContainer />
    </MenuProvider>
  );
}
