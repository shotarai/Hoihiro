import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { ProfileProvider } from "@/contexts/ProfileContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ProfileProvider>
        <Component {...pageProps} />
      </ProfileProvider>
    </ChakraProvider>
  );
}

export default MyApp;
