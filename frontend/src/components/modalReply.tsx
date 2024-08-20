import React, { useState } from "react";
import {
  Button,
  Box,
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
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";
import { useProfileContext } from "@/contexts/ProfileContext";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  onPost: (newReply: {
    role: string;
    nickname: string;
    comment: string;
  }) => void;
};

const ModalReply = (props: ModalProps) => {
  const { profile } = useProfileContext();
  const clearText = () => {
    setComment("");
  };

  const postReply = () => {
    if (!comment) {
      setError("コメントを入力してください");
      return;
    }

    setError(null);

    const newReply = {
      role: profile.role,
      nickname: profile.nickname,
      comment: comment,
    };
    props.onPost(newReply);
    clearText();
  };

  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

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
          返信内容
          <IconButton
            aria-label="Close modal"
            icon={<FiXCircle size={24} />}
            onClick={props.onClose}
            position="absolute"
            top="10px"
            right="10px"
            background="transparent"
            _hover={{ background: "transparent" }}
          />
        </ModalHeader>
        <ModalBody>
          <Textarea
            h="40vh"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="返信を入力してください"
          />
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
              onClick={postReply}
              colorScheme="blue"
              rightIcon={<FiSend size={20} />}
            >
              返信
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalReply;
