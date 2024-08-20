import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { ProfileProvider } from "@/contexts/ProfileContext";
import Header from "../components/header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ProfileProvider>
        <Header />
        <Component {...pageProps} />
      </ProfileProvider>
    </ChakraProvider>
  );
}

export default MyApp;
