import { useRouter } from "next/router";
import { Box, Heading, Text, VStack, Button, Flex } from "@chakra-ui/react";
import { IoChatboxEllipses } from "react-icons/io5";
import ModalReply from "@/components/modalReply";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import HogoshaIcon from "../../public/hogosha.svg";
import HoikushiIcon from "../../public/hoikushi.svg";
import React from "react";

const Detail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [replies, setReplies] = useState<
    { role: string; nickname: string; comment: string }[]
  >([]);
  const router = useRouter();
  const { timestamp, title, content, documentId } = router.query;
  const safeTimestamp: string = Array.isArray(timestamp)
    ? timestamp[0]
    : timestamp || "";
  const safeDocumentId: string = Array.isArray(documentId)
    ? documentId[0]
    : documentId || "";

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = doc(database, "users", safeDocumentId);
      const docSnap = await getDoc(dataRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const questions: Record<
          string,
          { comment: string; role: string; nickname: string }
        > = data.data.questions[safeTimestamp].replies || {};
        const dataArray = Object.entries(questions).map(
          ([timestamp, details]) => ({
            timestamp,
            ...details,
          }),
        );
        if (dataArray.length > 0) {
          const sortedRepliesList = dataArray.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          );
          setReplies(sortedRepliesList);
        } else {
          setReplies([]);
        }
      } else {
        setReplies([]);
      }
    };
    fetchData();
  }, [safeDocumentId, safeTimestamp]);

  const handleNewPost = (newReply: {
    role: string;
    nickname: string;
    comment: string;
  }) => {
    setReplies((prevReplies) => [newReply, ...prevReplies]);
    setIsOpen(false);
  };

  return (
    <Box p={20}>
      <Box
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        p={4}
        mt={4}
        mb={8}
        bg="gray.50"
      >
        <Heading as="h1" mb={4}>
          Q. {title}
        </Heading>
        <Text fontSize="lg">{content}</Text>
      </Box>

      <Heading as="h2" size="md" mb={4}>
        返信コメント
      </Heading>

      <Flex direction="column" w="full" h="full" overflowY="auto">
        {replies.map((reply, index) => (
          <React.Fragment key={index}>
            <Flex justifyContent="flex-start" alignItems="center" mb="2">
              <Flex alignItems="center" mr="2">
                {reply.role === "保育士" ? (
                  <HoikushiIcon height="4vh" />
                ) : (
                  <HogoshaIcon height="6vh" />
                )}
                <Text fontWeight="bold" ml="2">
                  {reply.nickname}
                </Text>
              </Flex>
            </Flex>
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
              mb={6}
            >
              <Text fontSize="lg" fontWeight="bold" textAlign="center">
                {reply.comment}
              </Text>
            </Flex>
          </React.Fragment>
        ))}
      </Flex>

      <Box position="fixed" bottom={4} right={4} opacity="80%">
        <Button
          onClick={() => setIsOpen(true)}
          colorScheme="teal"
          size="lg"
          rightIcon={<IoChatboxEllipses />}
        >
          返信する
        </Button>
      </Box>
      <ModalReply
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onPost={handleNewPost}
        timestamp={safeTimestamp}
        documetId={safeDocumentId}
      />
    </Box>
  );
};

export default Detail;
