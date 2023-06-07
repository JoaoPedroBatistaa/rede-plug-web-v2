import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { MenuProvider } from "../components/Context/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MenuProvider>
      <Component {...pageProps} />
    </MenuProvider>
  );
}
