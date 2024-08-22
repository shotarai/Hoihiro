import React, { useState } from "react";
import {
  Button,
  Box,
  Stack,
  Text,
  Input,
  Textarea,
  HStack,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  IconButton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { auth } from "../../firebaseConfig";
import { database } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { FiSend } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";
import { sendResponseChatKeywordGet } from "@/gen/default/default";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  onPost: (newQuestion: {
    title: string;
    content: string;
    timestamp: string;
    replies: Record<
      string,
      { comment: string; role: string; nickname: string }
    >;
    latestTime: string;
  }) => void;
};

const ModalPost = (props: ModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearText = () => {
    setTitle("");
    setContent("");
    setError("");
  };

  const postQuestion = async () => {
    if (!title && !content) {
      setError("タイトルと相談内容を入力してください");
      return;
    }
    if (!content) {
      setError("相談内容を入力してください");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const currentDate: Date = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");
      const time = `${year}/${month}/${day}/${hours}:${minutes}:${seconds}`;

      // const response = await sendResponseChatKeywordGet(content);

      // const newReply = {
      //   role: "AI",
      //   nickname: "Gemini AI",
      //   comment: response.data,
      // };

      const newData = {
        title: title,
        content: content,
        latestTime: time,
        // replies: { [time]: newReply },
      };
      const currentUserEmail = auth.currentUser?.email
        ? auth.currentUser.email
        : "";
      const dataRef = doc(database, "users", currentUserEmail);
      const maxRetries = 3;
      let attempts = 0;
      let success = false;

      while (attempts < maxRetries && !success) {
        try {
          await setDoc(
            dataRef,
            {
              data: { questions: { [time]: newData } },
            },
            { merge: true },
          );
          success = true;
        } catch (error) {
          attempts += 1;
          if (attempts >= maxRetries) {
            console.error(
              "Failed to save answer after multiple attempts:",
              error,
            );
            throw new Error("投稿に失敗しました。再試行してください。");
          } else {
            console.log(`Retrying to save answer... (Attempt ${attempts})`);
          }
        }
      }

      if (success) {
        const newQuestion = {
          title,
          content,
          timestamp: time,
          latestTime: time,
          replies: {},
        };
        props.onPost(newQuestion);
        clearText();
      }
    } catch (error: any) {
      setError(error.message || "投稿中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={props.open}
      onClose={props.onClose}
      isCentered
      size={{ base: "sm", md: "2xl" }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          投稿内容
          <IconButton
            aria-label="Close modal"
            icon={<FiXCircle size={24} />}
            onClick={() => {
              props.onClose();
              clearText();
            }}
            position="absolute"
            top="10px"
            right="10px"
            background="transparent"
            _hover={{ background: "transparent" }}
          />
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Stack spacing="10px">
              <Text fontSize="md">タイトル</Text>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <Text fontSize="md">内容</Text>
              <Textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </Stack>
          )}
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <HStack width="100%">
            <Box w="100%" />
            <Button
              onClick={postQuestion}
              colorScheme="teal"
              rightIcon={<FiSend size={20} />}
              isLoading={isLoading}
              loadingText="投稿中"
            >
              投稿
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalPost;
