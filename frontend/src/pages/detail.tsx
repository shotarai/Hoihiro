import { useRouter } from "next/router";
import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { IoChatboxEllipses } from "react-icons/io5";
import ModalReply from "@/components/modalReply";
import { useEffect, useState } from "react";

const Detail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [replies, setReplies] = useState<
    { role: string; nickname: string; comment: string }[]
  >([]);
  const router = useRouter();
  const { title, content } = router.query;

  useEffect(() => {
    setReplies([
      { role: "保護者", nickname: "Alice", comment: "最初のコメントです。" },
      { role: "保育士", nickname: "Bob", comment: "二つ目のコメントです。" },
      {
        role: "保育士",
        nickname: "Charlie",
        comment: "三つ目のコメントです。",
      },
    ]);
  }, []);

  const handleNewPost = (newReply: {
    role: string;
    nickname: string;
    comment: string;
  }) => {
    setReplies((prevReplies) => [...prevReplies, newReply]);
    setIsOpen(false);
  };

  return (
    <Box p={20}>
      <Box
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        p={4}
        mb={8}
        bg="gray.50"
      >
        <Heading as="h1" mb={4}>
          Q. {title}
        </Heading>
        <Text fontSize="lg">{content}</Text>
      </Box>

      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="md" mb={4}>
          返信コメント
        </Heading>
        {replies.map((reply, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
            p={4}
            bg="white"
          >
            <Text fontWeight="bold">
              {reply.nickname} ({reply.role})
            </Text>
            <Text>{reply.comment}</Text>
          </Box>
        ))}
      </VStack>

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
      />
    </Box>
  );
};

export default Detail;
