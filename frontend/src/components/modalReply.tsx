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
import { auth } from "../../firebaseConfig";
import { database } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  onPost: (newReply: {
    role: string;
    nickname: string;
    comment: string;
  }) => void;
  timestamp: string;
};

const ModalReply = (props: ModalProps) => {
  const { profile } = useProfileContext();
  const clearText = () => {
    setComment("");
  };

  const postReply = async () => {
    if (!comment) {
      setError("コメントを入力してください");
      return;
    }

    setError(null);

    const currentDate: Date = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const time = `${year}/${month}/${day}/${hours}:${minutes}:${seconds}`;

    const newReply = {
      role: profile.role,
      nickname: profile.nickname,
      comment: comment,
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
            data: {
              questions: {
                [props.timestamp]: {
                  replies: { [time]: newReply },
                  latestTime: time,
                },
              },
            },
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
        } else {
          console.log(`Retrying to save answer... (Attempt ${attempts})`);
        }
        return;
      }
    }
    if (success) {
      props.onPost(newReply);
      props.onClose();
    }
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
