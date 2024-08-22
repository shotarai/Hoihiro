import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  VStack,
  Heading,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { database, auth } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useProfileContext } from "@/contexts/ProfileContext";

const Profile = () => {
  const [role, setRole] = useState("保護者");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setProfile } = useProfileContext();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!nickname) {
      setError("ニックネームを入力してください");
      return;
    }
    setError(null);
    const newData = {
      role: role,
      nickname: nickname,
      questions: [],
    };
    const currentUserEmail = auth.currentUser?.email
      ? auth.currentUser.email
      : "";
    const dataRef = doc(database, "users", currentUserEmail);
    const maxRetries = 3;
    let attempts = 0;
    let success = false;

    while (attempts < maxRetries && !success) {
      try {
        await setDoc(
          dataRef,
          {
            data: newData,
          },
          { merge: true },
        );
        success = true;
      } catch (error) {
        attempts += 1;
        if (attempts >= maxRetries) {
          console.error(
            "Failed to save answer after multiple attempts:",
            error,
          );
        } else {
          console.log(`Retrying to save answer... (Attempt ${attempts})`);
        }
        return;
      }
    }
    setProfile({ role, nickname });
    router.push("/home");
  };

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
              プロフィール
            </Heading>
            <Box as="form" onSubmit={handleSubmit} width="100%">
              <FormControl as="fieldset" isRequired>
                <FormLabel as="legend">
                  あなたが所属する方を選択してください
                </FormLabel>
                <RadioGroup onChange={setRole} value={role}>
                  <Stack direction="row" spacing={5}>
                    <Radio value="保護者">保護者</Radio>
                    <Radio value="保育士">保育士</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl id="nickname" isRequired mt={4}>
                <FormLabel>ニックネーム</FormLabel>
                <Input
                  bg="gray.100"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
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
                登録
              </Button>
            </Box>
            {error && (
              <Alert status="error" mt={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default Profile;
