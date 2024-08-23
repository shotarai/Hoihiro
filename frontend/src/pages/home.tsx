import React, { useEffect, useState } from "react";
import { Button, Box, Flex, Text, Image } from "@chakra-ui/react";
import ModalPost from "../components/modalPost";
import { IoChatboxEllipses } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { database, auth } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { GoCommentDiscussion } from "react-icons/go";
import { CgProfile } from "react-icons/cg";

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
      imageURL?: string;
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
            imageURL?: string;
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
    imageURL?: string;
  }) => {
    router.push({
      pathname: "/detail",
      query: {
        documentId: auth.currentUser?.email,
        timestamp: question.timestamp,
        title: question.title,
        content: question.content,
        ...(question.imageURL && { imageURL: question.imageURL }),
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
    <Flex direction="column" minH="100vh" overflow="hidden" mb={16}>
      {/* <Box position="fixed" top={20} right={4} zIndex={1000}>
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
      </Box> */}
      <Flex direction="column" flex="1" align="center" p={{ base: 4, md: 8 }}>
        <Text
          paddingTop="16"
          paddingBottom="4"
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
        >
          相談履歴
        </Text>
        <Flex direction="column" w="full" h="full" overflowY="auto">
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              <Flex
                justifyContent="space-between"
                w="100%"
                h="auto"
                borderWidth="1px"
                borderRadius="md"
                // boxShadow="md"
                // bg="gray.50"
                pr={2}
                pl={2}
                mb={2}
                _hover={{ bg: "teal.50", cursor: "pointer" }}
                onClick={() => handleCardClick(question)}
              >
                <Flex direction="column" justifyContent="center" pt={8}>
                  <Text fontSize="md" fontWeight="bold" textAlign="left">
                    {question.title.length > 18
                      ? question.title.slice(0, 17) + "…"
                      : question.title}
                  </Text>
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
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="normal"
                    >
                      更新時刻: {question.latestTime}
                    </Text>
                  </Flex>
                </Flex>
                {question.imageURL && (
                  <Flex alignItems="center">
                    <Image
                      src={question.imageURL}
                      alt="Uploaded Image"
                      borderRadius="md"
                      width="auto"
                      height="10vh"
                    />
                  </Flex>
                )}
              </Flex>
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
      <Box position="fixed" bottom={20} right={4} opacity="100%">
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
