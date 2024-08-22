import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, Flex, Image } from "@chakra-ui/react";
import { IoChatboxEllipses } from "react-icons/io5";
import ModalReply from "@/components/modalReply";
import ImageModal from "@/components/modalImage";
import { useRouter } from "next/router";
import { database } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import HogoshaIcon from "../../public/hogosha.svg";
import HoikushiIcon from "../../public/hoikushi.svg";
import ReactMarkdown from "react-markdown";

const Detail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // モーダル用のステート
  const [selectedImageURL, setSelectedImageURL] = useState<string | null>(null);
  const [replies, setReplies] = useState<
    { role: string; nickname: string; comment: string; imageURL?: string }[]
  >([]);
  const router = useRouter();
  const { timestamp, title, content, documentId, imageURL } = router.query;
  const safeTimestamp: string = Array.isArray(timestamp)
    ? timestamp[0]
    : timestamp || "";
  const safeDocumentId: string = Array.isArray(documentId)
    ? documentId[0]
    : documentId || "";
  const safeImageURL: string | undefined = Array.isArray(imageURL)
    ? imageURL[0]
    : imageURL || undefined;

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
  }, [safeDocumentId, safeImageURL, safeTimestamp]);

  const handleNewPost = (newReply: {
    role: string;
    nickname: string;
    comment: string;
  }) => {
    setReplies((prevReplies) => [newReply, ...prevReplies]);
    setIsOpen(false);
  };

  const handleImageClick = (url: string) => {
    if (url) {
      setSelectedImageURL(url);
      setModalOpen(true);
    }
  };

  return (
    <Box pt={20} pr="5" pl="5">
      <Box
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        p={4}
        mt={4}
        mb={4}
        bg="gray.50"
      >
        <Heading mb={4}>Q. {title}</Heading>
        <Text fontSize="lg" mb={4}>
          {content}
        </Text>
        {safeImageURL && (
          <Flex justifyContent="center" mt={2}>
            <Image
              src={safeImageURL}
              alt="Uploaded Image"
              borderRadius="md"
              width="20vw"
              height="auto"
              onClick={() => handleImageClick(safeImageURL)}
              cursor="pointer"
            />
          </Flex>
        )}
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
            {reply.role === "AI" ? (
              <Flex
                direction="column"
                w="100%"
                h="10vh"
                p={1}
                borderWidth="2px"
                borderRadius="md"
                boxShadow="md"
                bg="gray.50"
                mb={6}
                overflowY="auto"
              >
                <ReactMarkdown>{reply.comment}</ReactMarkdown>
              </Flex>
            ) : (
              <Flex direction="column" w="100%" p={1} mb={6}>
                <Flex
                  borderWidth="2px"
                  borderRadius="md"
                  boxShadow="md"
                  bg="gray.50"
                  overflowY="auto"
                  justifyContent="space-between"
                  height="20vw"
                  pr={4}
                  pl={4}
                  pt={2}
                >
                  <Text fontSize="lg" textAlign="left" flex="1">
                    {reply.comment}
                  </Text>
                  {reply.imageURL && (
                    <Flex justifyContent="flex-end" alignItems="center" ml={2}>
                      <Image
                        src={reply.imageURL}
                        alt="Uploaded Reply Image"
                        borderRadius="md"
                        width="auto"
                        height="20vw"
                        onClick={() => handleImageClick(reply.imageURL || "")}
                        cursor="pointer"
                      />
                    </Flex>
                  )}
                </Flex>
              </Flex>
            )}
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
        documentId={safeDocumentId}
      />

      {selectedImageURL && (
        <ImageModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          imageURL={selectedImageURL}
        />
      )}
    </Box>
  );
};

export default Detail;
