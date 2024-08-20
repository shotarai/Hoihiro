import { useState } from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Radio,
    RadioGroup,
    Stack,
    VStack,
    Heading,
    Alert,
    AlertIcon,
  } from "@chakra-ui/react";
import { database, auth } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// ダミーデータの配列を作成します
const data = [
  { id: 1, title: 'First Item', timestamp: '2024/06/18/15:57:53', url: 'https://example.com/1' },
  { id: 2, title: 'Second Item', timestamp: '2024/05/18/15:57:53', url: 'https://example.com/2' },
  { id: 3, title: 'Third Item', timestamp: '2024/06/17/15:57:53', url: 'https://example.com/3' },
  { id: 4, title: 'forth Item', timestamp: '2022/06/17/15:57:53', url: 'https://example.com/4' },
  { id: 5, title: 'five Item', timestamp: '2024/03/17/15:57:53', url: 'https://example.com/5' },
  { id: 6, title: 'six Item', timestamp: '2024/06/09/15:57:53', url: 'https://example.com/6' },
  { id: 7, title: 'seven Item', timestamp: '2020/06/17/15:57:53', url: 'https://example.com/7' },
  { id: 8, title: 'eight Item', timestamp: '2020/04/17/15:57:53', url: 'https://example.com/8' },
];

const allPosts = () => {
    // タイムスタンプの新しい順にソートします
    const sortedData = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
    return (
        <Box p={5} maxW="400px" mx="auto">
          <Heading as="h1" mb={5}>Items List</Heading>
          <Box 
            // borderWidth="1px" 
            // borderRadius="lg" 
            overflowY="auto" 
            // maxH="400px" 
            p={3}
          >
            <VStack spacing={4} align="stretch">
              {sortedData.map(item => (
                <Button
                  key={item.id}
                  onClick={() => window.location.href = item.url}
                  width="100%"
                  height="40pt"
                  textAlign="left"
                  variant="solid"
                  colorScheme="teal"
                  size="lg"
                >
                  {item.title}
                </Button>
              ))}
            </VStack>
          </Box>
        </Box>
      );
  }

  export default allPosts;