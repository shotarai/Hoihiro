import React, { useEffect, useRef, useState } from "react";
import { Button, Box, VStack, Flex, Stack, Text, Link } from "@chakra-ui/react";
import { sendResponseChatKeywordGet } from "@/gen/default/default";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { auth } from "../firebaseConfig";
import ReactMarkdown from "react-markdown";
import { ChatTextarea } from "@/components/chatTextArea";
import { BeatLoader } from "react-spinners";
import { FiSend } from "react-icons/fi";

type GeminiAgent = "user" | "assistant";

interface GeminiMessage {
  role: GeminiAgent;
  content: string;
}

const ChatScreen = () => {
  let messages: GeminiMessage[] = [];
  let allMessages: GeminiMessage[] = [];

  const [messageArray, setMessageArray] = useState([] as GeminiMessage[]);
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const inputRef = useRef(null);

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
    <Flex
      direction="column"
      pos="relative"
      bg="#F5E6D3"
      height="100svh"
      overflow="hidden"
    >
      <Flex justify="center">
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          AIチャットに災害について質問してみよう！
        </Text>
        <Link href="/select">
          <Text
            pl="10"
            color="teal"
            fontSize="xl"
            fontWeight="bold"
            textAlign="center"
            _hover={{ textDecoration: "underline" }}
          >
            ← 戻る
          </Text>
        </Link>
      </Flex>
      <Box overflowY="auto">
        <VStack
          bg="bg.canvas"
          align="start"
          w="100%"
          maxW="3xl"
          marginX="auto"
          px="4"
          mt="10"
          mb="40"
        >
          {messageArray.map(({ role, content }, index) => (
            <Box
              key={`chat-box-${index}`}
              style={{
                borderRadius: "5px",
                padding: "10px 16px",
                marginBottom: "16px",
                maxWidth: role === "user" ? "80%" : "100%",
                backgroundColor:
                  role === "user" ? "var(--chakra-colors-teal-500)" : "#ecf1f1",
                color: role === "user" ? "#ffffff" : "inherit",
                alignSelf: role === "user" ? "flex-end" : "initial",
              }}
            >
              <Box style={{ padding: "16px 16px" }}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </Box>
            </Box>
          ))}
          {message && (
            <Box
              style={{
                borderRadius: "5px",
                padding: "10px 16px",
                marginBottom: "16px",
                backgroundColor: "#bacaca",
                maxWidth: "100%",
              }}
            >
              <ReactMarkdown>{message}</ReactMarkdown>
            </Box>
          )}
        </VStack>
      </Box>

      <Box
        pos="absolute"
        bottom="0"
        insetX="0"
        bgGradient="linear(to-t, bg.canvas 90%, rgba(0,0,0,0))"
        pt="6"
        pb="4"
        mr="3"
        ml="3"
      >
        <Stack maxW="3xl" mx="auto">
          <Box as="form" pos="relative" pb="1">
            <ChatTextarea
              rows={1}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              id="text-area"
            />
            <Box pos="absolute" top="2" right="0" zIndex="2">
              <Button
                onClick={sendMessage}
                size="sm"
                variant="text"
                colorScheme="gray"
                isDisabled={prompt === "" || params.id === null || loading}
                isLoading={loading}
                spinner={<BeatLoader size={4} />}
              >
                <FiSend />
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default ChatScreen;
