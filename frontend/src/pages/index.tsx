import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { database, auth } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
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
  Alert,
  AlertIcon,
  VStack,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useProfileContext } from "@/contexts/ProfileContext";

const SignIn = () => {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setProfile } = useProfileContext();
  // const [user, setUser] = useState<User | null>(null); //自動ログイン機能
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      console.log("[Succeeded] Sign in");
      const dataRef = doc(database, "users", signInEmail);
      const docSnap = await getDoc(dataRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const role = data.data.role;
        const nickname = data.data.nickname;
        if (role || nickname) {
          setProfile({ role, nickname });
          router.push("/home");
        } else {
          router.push("/profile");
        }
      } else {
        router.push("/profile");
      }
    } catch (error) {
      setError(
        "ログインに失敗しました。正しいメールアドレスとパスワードを入力してください。",
      );
      console.error(error);
    }
  };

  useEffect(() => {
    const logout = async () => {
      await signOut(auth);
      setProfile({ role: "", nickname: "" });
    };
    logout();
  }, [setProfile]);

  // 自動ログイン機能
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     if (currentUser) {
  //       router.push("/home");
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [router]);

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
              ログイン
            </Heading>
            <Box as="form" onSubmit={handleSubmit} width="100%">
              <FormControl id="email" isRequired>
                <FormLabel>メールアドレス</FormLabel>
                <Input
                  bg="gray.100"
                  type="email"
                  value={signInEmail}
                  onChange={(event) => setSignInEmail(event.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired mt={4}>
                <FormLabel>パスワード</FormLabel>
                <Input
                  bg="gray.100"
                  type="password"
                  value={signInPassword}
                  onChange={(event) => setSignInPassword(event.target.value)}
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
                確定
              </Button>
            </Box>
            {error && (
              <Alert status="error" mt={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            <Box textAlign="center" mt={4}>
              <NextLink href="/signup" passHref legacyBehavior>
                <a style={{ color: "teal" }}>新規登録</a>
              </NextLink>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignIn;
