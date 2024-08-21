import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { database } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { GoCommentDiscussion } from "react-icons/go";

const AllPosts = () => {
  const router = useRouter();

  const [questionsList, setQuestionsList] = useState<
    { title: string; content: string; timestamp: string; latestTime: string; replies: Record<string, {comment: string; role: string; nickname: string}>}[]>([]);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      const querySnapshot = await getDocs(collection(database, "users"));

      const allQuestions: {
        title: string;
        content: string;
        timestamp: string;
        latestTime: string;
        replies: Record<string, {comment: string; role: string; nickname: string}>;
      }[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const questions: Record<string, { title: string; content: string; latestTime: string; replies: Record<string, {comment: string; role: string; nickname: string}>}> =
          data.data?.questions;

        if (questions) {
          const dataArray = Object.entries(questions).map(
            ([timestamp, details]) => ({
              timestamp,
              ...details,
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
    latestTime: string;
    replies: Record<string, {comment: string; role: string; nickname: string}>;
  }) => {
    router.push({
      pathname: "/detail",
      query: {
        timestamp: question.timestamp,
        title: question.title,
        content: question.content,
        latestTime: question.latestTime,
        replies: JSON.stringify(question.replies),
      },
    });
  };

  const sortedQuestionsList = questionsList.sort((a,b) => new Date(b.latestTime).getTime() - new Date(a.latestTime).getTime());

  return (
    <Flex direction="column" minH="100vh" p={{ base: 4, md: 8 }}>
      <Text fontSize="2xl" pt="16" fontWeight="bold" textAlign="center" mb={4}>
        みんなの質問
      </Text>
      <VStack spacing={4} w="full" maxH="70vh" overflowY="auto">
        {sortedQuestionsList.map((question, index) => (
          <Box
            key={index}
            w="100%"
            p={1}
            borderWidth="2px"
            borderRadius="md"
            boxShadow="md"
            bg="gray.50"
            _hover={{ bg: "teal.50", cursor: "pointer" }}
            onClick={() => handleCardClick(question)}
          >
            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              {question.title}
            </Text>
            <HStack>
              <GoCommentDiscussion />
              <Text fontSize="xs" fontWeight="nomal" textAlign="center">
                {Object.entries(question.replies).length}
              </Text>
              <Text fontSize="xs" fontWeight="nomal" textAlign="center">
                {question.latestTime}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Flex>
  );
};

export default AllPosts;
