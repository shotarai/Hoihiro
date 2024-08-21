import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useProfileContext } from "@/contexts/ProfileContext";
import HogoshaIcon from "../../public/hogosha.svg";
import HoikushiIcon from "../../public/hoikushi.svg";
import { PiHouse } from "react-icons/pi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { BsChevronDoubleLeft } from "react-icons/bs";

const Header: FC = () => {
  const { profile } = useProfileContext();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    setCanGoBack(router.asPath !== "/");
  }, [router.asPath, setCanGoBack]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    }
  };

  return (
    <Box
      as="header"
      w="100%"
      h="8%"
      bg="teal.500"
      color="white"
      opacity={0.8}
      px={6}
      py={2}
      position="fixed"
      top={0}
      left={0}
      zIndex={1000}
    >
      <Flex align="center" w="100%" h="100%">
        <Box height="95%" mr={4}>
          {profile?.role === "保育士" ? (
            <HoikushiIcon width="100%" height="100%" />
          ) : (
            <HogoshaIcon width="100%" height="100%" />
          )}
        </Box>
        <Heading as="h2" size="md">
          {profile?.nickname ? `${profile.nickname} さん` : ""}
        </Heading>
        <Spacer />
        {canGoBack && (
          <Button colorScheme="white" size="md" onClick={handleBack}>
            <Box as={BsChevronDoubleLeft} boxSize="2.0em" />
          </Button>
        )}
        {isAuthenticated && (
          <Button
            colorScheme="white"
            size="md"
            onClick={() => router.push("/home")}
          >
            <Box as={PiHouse} boxSize="2.0em" />
          </Button>
        )}
        <Button colorScheme="white" size="md" onClick={handleLogout}>
          <Box as={RiLogoutBoxRLine} boxSize="2.0em" />
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
