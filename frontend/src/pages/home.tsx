import React, { useEffect, useState } from "react";
import { Button, Box, Flex, Text, VStack } from "@chakra-ui/react";
import ModalPost from "../components/modalPost";
import { IoChatboxEllipses } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { database, auth } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { GoCommentDiscussion } from "react-icons/go";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<
    {
      title: string;
      content: string;
      latestTime: string;
      replies: Record<
        string,
        {
          comment: string;
          role: string;
          nickname: string;
        }
      >;
      timestamp: string;
    }[]
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
        const dataArray = Object.entries(questions).map(
          ([timestamp, details]) => ({
            timestamp,
            ...details,
          }),
        );
        if (dataArray.length > 0) {
          const sortedDataArray = dataArray.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          );
          setQuestions(sortedDataArray);
        } else {
          setQuestions([]);
        }
      } else {
        setQuestions([]);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (question: {
    timestamp: string;
    title: string;
    content: string;
  }) => {
    router.push({
      pathname: "/detail",
      query: {
        documentId: auth.currentUser?.email,
        timestamp: question.timestamp,
        title: question.title,
        content: question.content,
      },
    });
  };

  const handleNewPost = (newQuestion: {
    title: string;
    content: string;
    timestamp: string;
    replies: Record<
      string,
      { comment: string; role: string; nickname: string }
    >;
    latestTime: string;
  }) => {
    setQuestions((prevQuestions) => [newQuestion, ...prevQuestions]);
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
          paddingBottom="8"
          fontSize={{ base: "md", md: "xl" }}
          fontWeight="bold"
          textAlign="center"
        >
          質問履歴
        </Text>
        <Flex direction="column" w="full" h="full" overflowY="auto">
          {questions.map((question, index) => (
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
                <Text fontSize="lg" fontWeight="bold" textAlign="center">
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
