import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
} from "@chakra-ui/react";

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageURL: string;
};

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageURL,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={{ base: "xs", md: "xl" }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody justifyContent="center" alignContent="center">
          <Image
            src={imageURL}
            alt="Expanded Image"
            width="100%"
            height="auto"
            borderRadius="md"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
