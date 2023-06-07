import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { MenuProvider } from "../components/Context/context";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



export default function App({ Component, pageProps }: AppProps) {
  return (
    <MenuProvider>
      <Component {...pageProps} />
      <ToastContainer />

    </MenuProvider>
  );
}
