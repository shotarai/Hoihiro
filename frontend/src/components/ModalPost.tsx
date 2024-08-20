import React, { useEffect, useRef, useState } from "react";
import { Button, Box, VStack, Flex, Stack, Text, Link, Input, Textarea, HStack, Alert,
  AlertIcon} from "@chakra-ui/react";
import { sendResponseChatKeywordGet } from "@/gen/default/default";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { auth } from "../../firebaseConfig";
import ReactMarkdown from "react-markdown";
import { ChatTextarea } from "@/components/chatTextArea";
import { BeatLoader } from "react-spinners";
import { FiSend } from "react-icons/fi";
import { database} from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ArrowBackIcon, ArrowUpIcon} from '@chakra-ui/icons'



export type ModalProps = {
    open: boolean;
    onBack: () => void;
    onPost: () => void;
  };

const ModalPost = (props: ModalProps) => {

  const clearText = () => {
    setTitle("");
    setContent("");
  };

  const postQuestion = async () => {
    if (!title) {
      setError("タイトルを入力してください");
      return;
    }
    if (!content) {
      setError("相談内容を入力してください");
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
    setCurrentTime(`${year}/${month}/${day}/${hours}:${minutes}:${seconds}`);
    const time = `${year}/${month}/${day}/${hours}:${minutes}:${seconds}`;

    props.onPost();

    const newData = {
      title: title,
      content: content,
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
            data: { questions: {[time]: newData}},
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
    clearText();
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const modalContent = {
    background: "white",
    padding: "10px",
    borderRadius: "3px",
    width: '80%',
    hight: '80%',
  };
  
  const overlay: React.CSSProperties= {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
    return props.open ? (
      <Flex
      direction="column"
      pos="relative"
      bg="#ffffff"
      height="100svh"
      overflow="hidden"
      >
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent}>
            <Stack spacing='10px'>
                <Text fontSize='md'>タイトル</Text>
                <Input 
                  value={title}
                  onChange={(e) => {setTitle(e.target.value)}}
                />
                <Text fontSize='md'>内容</Text>
                <Textarea
                  value={content}
                  onChange={(e) => {setContent(e.target.value)}}
                 />
                <HStack>
                  <Button 
                    onClick={() => {props.onBack(); clearText(); setError(null);}}
                  >
                    <ArrowBackIcon></ArrowBackIcon>
                    戻る
                  </Button>
                  <Box w='100%'>
                  </Box>
                  <Button 
                    onClick={() => { postQuestion();}}
                    
                  >
                    投稿
                    <ArrowUpIcon></ArrowUpIcon>
                  </Button>
                </HStack>
            </Stack>
            {error && (
              <Alert status="error" mt={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
          </div>
        </div>
        
      </Flex>

      ) : (
        <></>
      );
};

export default ModalPost;
