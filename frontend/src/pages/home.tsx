import React, { useEffect, useState } from "react";
import { Button, Box, Flex, Text, VStack } from "@chakra-ui/react";
import ModalPost from "../components/modalPost";
import { IoChatboxEllipses } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { database, auth } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<
    { title: string; content: string; timestamp: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const currentUserEmail = auth.currentUser?.email
        ? auth.currentUser.email
        : "";
      const dataRef = doc(database, "users", currentUserEmail);
      const docSnap = await getDoc(dataRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const questions: Record<string, { title: string; content: string }> =
          data.data.questions;
        const dataArray = Object.entries(questions).map(
          ([timestamp, details]) => ({
            timestamp,
            ...details,
          }),
        );
        if (dataArray.length > 0) {
          setQuestions(dataArray);
        } else {
          setQuestions([]);
        }
      } else {
        setQuestions([]);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (question: { title: string; content: string }) => {
    router.push({
      pathname: "/detail",
      query: {
        title: question.title,
        content: question.content,
      },
    });
  };

  const handleNewPost = (newQuestion: {
    title: string;
    content: string;
    timestamp: string;
  }) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    setIsOpen(false);
  };

  return (
    <Flex direction="column" minH="100vh" overflow="hidden">
      <Box position="fixed" top={20} right={4} zIndex={1000}>
        <Button
          colorScheme="blue"
          size={{ base: "sm", md: "md" }}
          rightIcon={<FiUsers />}
          onClick={() => {
            router.push("/allPosts");
          }}
        >
          みんなの質問
        </Button>
      </Box>
      <Flex direction="column" flex="1" align="center" p={{ base: 4, md: 8 }}>
        <Text
          paddingTop="16"
          fontSize={{ base: "md", md: "xl" }}
          fontWeight="bold"
          textAlign="center"
        >
          質問履歴
        </Text>
        <VStack spacing={4} mt={4} w="full" maxH="60vh" overflowY="auto" px={4}>
          {questions.map((question) => (
            <Box
              key={question.timestamp}
              w="70%"
              p={4}
              borderWidth="2px"
              borderRadius="md"
              boxShadow="md"
              bg="gray.50"
              _hover={{ bg: "teal.50", cursor: "pointer" }}
              onClick={() => handleCardClick(question)}
            >
              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="bold"
                textAlign="center"
              >
                {question.title}
              </Text>
            </Box>
          ))}
        </VStack>
      </Flex>
      <Box position="fixed" bottom={4} right={4} opacity="80%">
        <Button
          onClick={() => setIsOpen(true)}
          colorScheme="teal"
          size="lg"
          rightIcon={<IoChatboxEllipses />}
        >
          相談する
        </Button>
      </Box>
      <ModalPost
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onPost={handleNewPost}
      />
    </Flex>
  );
};

export default Home;
