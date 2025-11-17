import type { AppProps } from "next/app";
import Head from "next/head";

import "@/styles/globals.css";
import Header from "@/components/header";
import { AuthProvider } from "@/context/Auth";
import { LoadingProvider } from "@/context/Loading";
import { ErrorProvider } from "@/context/Error";
import { NotificationProvider } from "@/context/Notification";
import { ProductCartProvider } from "@/context/ProductCart";
import ProductCartDrawer from "@/components/productCartDrawer";
import ProductCartButton from "@/components/productCartButton";
import ProductOrderModal from "@/components/modals/productOrderModal";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title> Canastas Verdes </title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <AuthProvider>
        <LoadingProvider>
          <ErrorProvider>
            <NotificationProvider>
              <ProductCartProvider>
                <Header />
                <Component {...pageProps} />
                <ProductCartButton />
                <ProductCartDrawer />
                <ProductOrderModal />
              </ProductCartProvider>
            </NotificationProvider>
          </ErrorProvider>
        </LoadingProvider>
      </AuthProvider>
    </>
  );
}
