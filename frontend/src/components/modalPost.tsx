import React, { useCallback, useState } from "react";
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
  Image,
} from "@chakra-ui/react";
import { auth, database, storage } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { FiSend } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
    imageURL?: string;
  }) => void;
};

const ModalPost = (props: ModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "image/HEIC": [".HEIC"],
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
    setTitle("");
    setContent("");
    setError("");
  };

  const handleClose = () => {
    props.onClose();
    clearText();
    setShowImageUpload(false);
    setFile(undefined);
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

      const response = await sendResponseChatKeywordGet(content);

      const newReply = {
        role: "AI",
        nickname: "Gemini AI",
        comment: response.data,
      };

      const newData = {
        title: title,
        content: content,
        latestTime: time,
        ...(imageURL && { imageURL: imageURL }),
        replies: { [time]: newReply },
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
          ...(imageURL && { imageURL: imageURL }),
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
      onClose={handleClose}
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
            onClick={handleClose}
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
              <HStack>
                <Text fontSize="md">内容</Text>
                <Button
                  onClick={() => setShowImageUpload(true)}
                  colorScheme="teal"
                  variant="outline"
                  size="sm"
                >
                  画像を追加
                </Button>
              </HStack>
              <Textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
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
                    height="8vh"
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
                      mr={3}
                      isDisabled={!file}
                      onClick={handleUploadImage}
                      colorScheme="teal"
                    >
                      アップロード
                    </Button>
                    <Button mr={3} variant="ghost" onClick={handleCancelUpload}>
                      キャンセル
                    </Button>
                  </HStack>
                </>
              )}
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
              // isLoading={isLoading}
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
