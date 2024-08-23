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
    <Box p={{ base: 4, md: 8 }} pt={20} pb={40} mb={18}>
      <Box
        borderWidth="1px"
        borderRadius="md"
        // boxShadow="md"
        p={4}
        mt={4}
        mb={4}
        // mr={4}
        // bg="gray.50"
      >
        <Heading size="lg" mb={4}>
          Q. {title}
        </Heading>
        <Text fontSize="lg">{content}</Text>
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
                  <HoikushiIcon height="3vh" />
                ) : (
                  <HogoshaIcon height="4vh" />
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
                h="auto"
                p={1}
                borderWidth="1px"
                borderRadius="md"
                // boxShadow="md"
                // bg="gray.50"
                mb={6}
                overflowY="auto"
              >
                <ReactMarkdown>{reply.comment}</ReactMarkdown>
              </Flex>
            ) : (
              <Flex
                direction="column"
                w="100%"
                h="auto"
                p={2}
                borderWidth="1px"
                borderRadius="md"
                // boxShadow="md"
                // bg="gray.50"
                mb={2}
                overflowY="auto"
              >
                <Text fontSize="sm" textAlign="left" flex="1">
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
            )}
          </React.Fragment>
        ))}
      </Flex>

      <Box position="fixed" bottom={20} right={4} opacity="100%">
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
