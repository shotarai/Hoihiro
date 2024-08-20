import React, { useEffect, useRef, useState } from "react";
import { Button, Box, VStack, Flex, Stack, Text, Link } from "@chakra-ui/react";
import { sendResponseChatKeywordGet } from "@/gen/default/default";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { auth } from "../../firebaseConfig";
import ReactMarkdown from "react-markdown";
import { ChatTextarea } from "@/components/chatTextArea";
import { BeatLoader } from "react-spinners";
import { FiSend } from "react-icons/fi";
import ModalPost from '../components/ModalPost';
import { Modal } from "@chakra-ui/react";
import { PlusSquareIcon} from '@chakra-ui/icons'

type GeminiAgent = "user" | "assistant";

interface GeminiMessage {
  role: GeminiAgent;
  content: string;
}

const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.85)"
  },
  content: {
    position: "absolute",
    top: "5rem",
    left: "5rem",
    right: "5rem",
    bottom: "5rem",
    backgroundColor: "paleturquoise",
    borderRadius: "1rem",
    padding: "1.5rem"
  }
};

const Home = () => {
  let messages: GeminiMessage[] = [];
  let allMessages: GeminiMessage[] = [];

  const [messageArray, setMessageArray] = useState([] as GeminiMessage[]);
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (prompt === "" || auth.currentUser === null) {
      return;
    }
    setLoading(true);

    messages = [...messages, { role: "user", content: prompt }];

    setMessageArray((prev) => [...prev, { role: "user", content: prompt }]);
    allMessages = [...allMessages, { role: "user", content: prompt }];
    setPrompt("");

    const textarea = document.getElementById(
      "text-area",
    ) as HTMLTextAreaElement;
    textarea.style.height = "auto";
    const res1 = await sendResponseChatKeywordGet(prompt);
    if (!res1.data) {
      return;
    }
    setMessage(res1.data);
    messages = [...messages, { role: "assistant", content: res1.data }];
    setMessageArray((prev) => [
      ...prev,
      { role: "assistant", content: res1.data },
    ]);
    allMessages = [...allMessages, { role: "assistant", content: res1.data }];
    setMessage("");
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key === "Process" || e.keyCode === 229) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement | null)?.focus();
    }
  }, []);

  return (
    <div>
      <Flex
        direction="column"
        pos="relative"
        bg="#ffffff"
        height="100svh"
        overflow="hidden"
      >
        
        <Box position="fixed" bottom="4" right="4">
        <Button 
          onClick={() => setIsOpen(true)}
          colorScheme='teal' 
          size='lg'
        >
          相談する
          <PlusSquareIcon></PlusSquareIcon>
        </Button>
        
        </Box>
      </Flex>
      <ModalPost
      open={isOpen}
      onBack={() => setIsOpen(false)}
      onPost={() => setIsOpen(false)}
    />
  </div>

  );
};

export default Home;
