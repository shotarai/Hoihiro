import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { database } from "../../firebaseConfig";
import { collection, doc, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { GoCommentDiscussion } from "react-icons/go";

const AllPosts = () => {
  const router = useRouter();

  const [questionsList, setQuestionsList] = useState<
    {
      title: string;
      content: string;
      timestamp: string;
      latestTime: string;
      replies: Record<
        string,
        { comment: string; role: string; nickname: string }
      >;
      documentId: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      const querySnapshot = await getDocs(collection(database, "users"));

      const allQuestions: {
        documentId: string;
        title: string;
        content: string;
        timestamp: string;
        latestTime: string;
        replies: Record<
          string,
          { comment: string; role: string; nickname: string }
        >;
      }[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const questions: Record<
          string,
          {
            title: string;
            content: string;
            latestTime: string;
            replies: Record<
              string,
              { comment: string; role: string; nickname: string }
            >;
          }
        > = data.data?.questions;

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

      const sortedQuestionsList = allQuestions.sort(
        (a, b) =>
          new Date(b.latestTime).getTime() - new Date(a.latestTime).getTime(),
      );
      setQuestionsList(sortedQuestionsList);
    };

    fetchAllQuestions();
  }, []);

  const handleCardClick = (question: {
    timestamp: string;
    title: string;
    content: string;
    latestTime: string;
    replies: Record<
      string,
      { comment: string; role: string; nickname: string }
    >;
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
    <Flex direction="column" p={{ base: 4, md: 8 }}>
      <Text fontSize="2xl" pt="16" pb="8" fontWeight="bold" textAlign="center">
        みんなの質問
      </Text>
      <Flex direction="column" w="full" h="full" overflowY="auto">
        {questionsList.map((question, index) => (
          <React.Fragment key={index}>
            <Flex
              direction="column"
              justifyContent="center"
              w="100%"
              h="8vh"
              p={1}
              borderWidth="2px"
              borderRadius="md"
              boxShadow="md"
              bg="gray.50"
              _hover={{ bg: "teal.50", cursor: "pointer" }}
              onClick={() => handleCardClick(question)}
            >
              <Text fontSize="lg" fontWeight="bold" textAlign="left">
                {question.title}
              </Text>
            </Flex>
            <Flex
              mb={6}
              mt={2}
              ml={2}
              justifyContent="flex-start"
              alignItems="center"
            >
              <Flex mr={4} textAlign="left" alignItems="center">
                <GoCommentDiscussion />
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="normal"
                  ml={1}
                >
                  {question.replies
                    ? Object.entries(question.replies).length
                    : 0}
                </Text>
              </Flex>
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="normal">
                更新時刻: {question.latestTime}
              </Text>
            </Flex>
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  );
};

export default AllPosts;
