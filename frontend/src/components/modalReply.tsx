import React, { useCallback, useState } from "react";
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
  Image,
  Text,
  Flex,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";
import { useProfileContext } from "@/contexts/ProfileContext";
import { database, storage } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useDropzone } from "react-dropzone";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  onPost: (newReply: {
    role: string;
    nickname: string;
    comment: string;
  }) => void;
  timestamp: string;
  documentId: string;
};

const ModalReply = (props: ModalProps) => {
  const { profile } = useProfileContext();
  const [file, setFile] = useState<File>();
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
  });

  const handleUploadImage = async () => {
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setImageURL(downloadURL);
      console.log("Image uploaded and URL saved:", downloadURL);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleCancelUpload = () => {
    setFile(undefined);
  };

  const clearText = () => {
    setComment("");
  };

  const handleClose = () => {
    props.onClose();
    clearText();
    setShowImageUpload(false);
    setFile(undefined);
    setImageURL(null);
    setError(null);
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
      ...(imageURL && { imageURL: imageURL }),
    };

    const dataRef = doc(database, "users", props.documentId);
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
      handleClose();
    }
  };

  return (
    <Modal
      isOpen={props.open}
      onClose={handleClose}
      isCentered
      size={{ base: "sm", md: "2xl" }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex>
              <Text pr={4}>返信内容</Text>
              <Button
                onClick={() => setShowImageUpload(true)}
                colorScheme="teal"
                variant="outline"
                size="sm"
              >
                画像を追加
              </Button>
            </Flex>
            <IconButton
              aria-label="Close modal"
              icon={<FiXCircle size={24} />}
              onClick={handleClose}
              background="transparent"
              _hover={{ background: "transparent" }}
            />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Textarea
            h="40vh"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="返信を入力してください"
          />
          {showImageUpload && (
            <>
              <Text mb="4" mt="4">
                画像を下のボックスにドラッグ＆ドロップするか、
                <br />
                クリックしてアップロードしてください。
                <br />
                （サポートされている形式：.jpeg .jpg .png）
              </Text>
              <Box
                {...getRootProps()}
                height="320px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                borderWidth={2}
                borderColor="gray.300"
                overflow="hidden"
                cursor="pointer"
              >
                <input {...getInputProps()} />
                {file ? (
                  <>
                    <Box mb="5" maxW="100%" maxH="80%">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Uploaded Image"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "auto", height: "100%" }}
                      />
                    </Box>
                  </>
                ) : (
                  <Text>ファイルが選択されていません。</Text>
                )}
              </Box>
              <HStack mt={4}>
                <Button
                  colorScheme="teal"
                  mr={3}
                  isDisabled={!file}
                  onClick={handleUploadImage}
                >
                  アップロード
                </Button>
                <Button mr={3} variant="ghost" onClick={handleCancelUpload}>
                  キャンセル
                </Button>
              </HStack>
            </>
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
