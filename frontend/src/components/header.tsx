import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { FC } from "react";
import { useProfileContext } from "@/contexts/ProfileContext";
import HogoshaIcon from "../../public/hogosha.svg";
import HoikushiIcon from "../../public/hoikushi.svg";
import { PiHouse } from "react-icons/pi";
import { useRouter } from "next/router";

const Header: FC = () => {
  const { profile } = useProfileContext();
  const router = useRouter();

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
        <Button
          colorScheme="white"
          size="md"
          onClick={() => router.push("/home")}
        >
          <Box as={PiHouse} boxSize="2.0em" />
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
