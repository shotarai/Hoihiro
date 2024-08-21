import { useRouter } from "next/router";
import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { IoChatboxEllipses } from "react-icons/io5";
import ModalReply from "@/components/modalReply";
import { useEffect, useState } from "react";

const Detail = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [replies, setReplies] = useState<
  //   { role: string; nickname: string; comment: string }[]
  // >([]);
  const router = useRouter();
  const { timestamp, title, content, replies} = router.query;
  const [parsedReplies, setParseReplies] = useState<Record<string, {comment: string; role: string; nickname: string}> | null>(null);

  const safeTimestamp: string = Array.isArray(timestamp)
    ? timestamp[0]
    : timestamp || "";

    useEffect(() => {
      if (replies) {
        setParseReplies(JSON.parse(replies as string)); // repliesをオブジェクトにパース
      } 
    }, [replies]);
  // useEffect(() => {
  //   setReplies([
  //     {
  //       role: "保護者",
  //       nickname: "Alice",
  //       comment: "最初のコメントです。",
  //     },
  //     {
  //       role: "保育士",
  //       nickname: "Bob",
  //       comment: "二つ目のコメントです。",
  //     },
  //     {
  //       role: "保育士",
  //       nickname: "Charlie",
  //       comment: "三つ目のコメントです。",
  //     },
  //   ]);
  // }, []);

  const handleNewPost = (newReply: {
    role: string;
    nickname: string;
    comment: string;
    timestamp: string;
  }) => {
    setParseReplies((prevReplies) => [newReply, ...prevReplies]);
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
        {parsedReplies.map((newReply, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
            p={4}
            bg="white"
          >
            <Text fontWeight="bold">
              {newReply.nickname} ({newReply.role})
            </Text>
            <Text>{newReply.comment}</Text>
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
        timestamp={safeTimestamp}
      />
    </Box>
  );
};

export default Detail;
