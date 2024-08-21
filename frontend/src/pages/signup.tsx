import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useProfileContext } from "@/contexts/ProfileContext";

const SignUp = () => {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  // const [user, setUser] = useState<User | null>(null) //自動ログイン機能
  const router = useRouter();
  const toast = useToast();
  const { setProfile } = useProfileContext();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      console.log("[Succeeded] Sign up");
      router.push("/profile");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const logout = async () => {
      await signOut(auth);
      setProfile({ role: "", nickname: "" });
    };
    logout();
  }, [setProfile]);

  //自動ログイン機能
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser)
  //     if (currentUser) {
  //       router.push('/profile')
  //     }
  //   })

  //   return () => {
  //     unsubscribe()
  //   }
  // }, [router])

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      w="100vw"
    >
      <Box
        bg="gray.300"
        p={10}
        pt={16}
        pb={16}
        mb={10}
        w={{ base: "80%", md: "2/6" }}
      >
        <Box p={5}>
          <VStack spacing={4} align="stretch">
            <Heading as="h1" size="xl">
              Sign Up
            </Heading>
            <Box as="form" onSubmit={handleSignUp} width="100%">
              <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  bg="gray.100"
                  type="email"
                  value={signUpEmail}
                  onChange={(event) => setSignUpEmail(event.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  bg="gray.100"
                  type="password"
                  value={signUpPassword}
                  onChange={(event) => setSignUpPassword(event.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                color="white"
                size="lg"
                width="100%"
                mt={6}
                _hover={{ bg: "teal.600" }}
              >
                Sign Up
              </Button>
            </Box>
            <Box textAlign="center" mt={4}>
              <NextLink href="/" passHref legacyBehavior>
                <a style={{ color: "teal" }}>Sign In</a>
              </NextLink>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignUp;
