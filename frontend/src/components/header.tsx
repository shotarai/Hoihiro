import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { FC } from "react";
import { useProfileContext } from "@/contexts/ProfileContext";
import HogoshaIcon from "../../public/hogosha.svg";
import HoikushiIcon from "../../public/hoikushi.svg";

const Header: FC = () => {
  const { profile } = useProfileContext();
  return (
    <Box
      as="header"
      w="100%"
      h="100px"
      bg="teal.500"
      color="white"
      px={4}
      py={2}
      position="fixed"
      top={0}
      left={0}
      zIndex={1000}
    >
      <Flex align="center">
        <Box width="80px" height="80px" mr={2}>
          {profile?.role === "保育士" ? (
            <HoikushiIcon width="100%" height="100%" />
          ) : (
            <HogoshaIcon width="100%" height="100%" />
          )}
        </Box>
        <Heading as="h1" size="lg">
          {profile?.nickname}
        </Heading>
        <Spacer />
        <Button variant="outline" colorScheme="white" size="lg">
          Login
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
