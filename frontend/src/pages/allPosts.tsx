import React, { useEffect, useState } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { database } from "../../firebaseConfig";
import { collection, doc, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";

const AllPosts = () => {
  const router = useRouter();

  const [questionsList, setQuestionsList] = useState<
    { title: string; content: string; timestamp: string; documentId: string }[]
  >([]);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      const querySnapshot = await getDocs(collection(database, "users"));

      const allQuestions: {
        documentId: string;
        title: string;
        content: string;
        timestamp: string;
      }[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const questions: Record<string, { title: string; content: string }> =
          data.data?.questions;

        if (questions) {
          const dataArray = Object.entries(questions).map(
            ([timestamp, details]) => ({
              timestamp,
              ...details,
              documentId: doc.id,
            }),
          );
          allQuestions.push(...dataArray);
        }
      });

      setQuestionsList(allQuestions);
    };

    fetchAllQuestions();
  }, []);

  const handleCardClick = (question: {
    timestamp: string;
    title: string;
    content: string;
    documentId: string;
  }) => {
    router.push({
      pathname: "/detail",
      query: {
        timestamp: question.timestamp,
        title: question.title,
        content: question.content,
        documentId: question.documentId,
      },
    });
  };

  return (
    <Flex direction="column" minH="100vh" p={{ base: 4, md: 8 }}>
      <Text fontSize="2xl" pt="16" fontWeight="bold" textAlign="center" mb={4}>
        みんなの質問
      </Text>
      <VStack spacing={4} w="full" maxH="70vh" overflowY="auto">
        {questionsList.map((question, index) => (
          <Box
            key={index}
            w="70%"
            p={4}
            borderWidth="2px"
            borderRadius="md"
            boxShadow="md"
            bg="gray.50"
            _hover={{ bg: "teal.50", cursor: "pointer" }}
            onClick={() => handleCardClick(question)}
          >
            <Text fontSize="md" fontWeight="bold" textAlign="center">
              {question.title}
            </Text>
          </Box>
        ))}
      </VStack>
    </Flex>
  );
};

export default AllPosts;
