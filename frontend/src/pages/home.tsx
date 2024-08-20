import React, { useState } from "react";
import { Button, Box, Flex} from "@chakra-ui/react";
import ModalPost from '../components/ModalPost';
import { PlusSquareIcon} from '@chakra-ui/icons'

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

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
