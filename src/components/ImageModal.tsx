'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  Image,
  Box,
  useDisclosure,
  IconButton,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMaximize2, FiX } from 'react-icons/fi';

type ImageModalProps = {
  src: string;
  alt: string;
  children: React.ReactNode;
  maxW?: string;
  maxH?: string;
};

export const ImageModal = ({ src, alt, children, maxW = '90vw', maxH = '90dvh' }: ImageModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.800');
  const modalBg = useColorModeValue('white', 'gray.800');
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  const iconHoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <>
      <Box
        onClick={onOpen}
        cursor="pointer"
        position="relative"
        display="inline-block"
        _hover={{
          '& .image-overlay': {
            opacity: 1,
          },
        }}
      >
        {children}

        <Flex
          className="image-overlay"
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.400"
          opacity="0"
          transition="opacity 0.2s"
          align="center"
          justify="center"
          borderRadius="inherit"
        >
          <IconButton
            aria-label="Ver imagen completa"
            icon={<FiMaximize2 />}
            size="sm"
            bg="whiteAlpha.900"
            color="gray.700"
            _hover={{ bg: 'white' }}
            pointerEvents="none"
          />
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg={overlayBg} />
        <ModalContent bg="transparent" boxShadow="none" m="0" onClick={onClose}>
          <Flex align="center" justify="center" h="100dvh" p="2rem" position="relative">
            <IconButton
              aria-label="Cerrar modal"
              icon={<FiX />}
              position="absolute"
              top="1rem"
              right="1rem"
              size="lg"
              bg={modalBg}
              color={iconColor}
              _hover={{ bg: iconHoverBg }}
              borderRadius="full"
              zIndex="2"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />

            <Image
              src={src}
              alt={alt}
              maxW={maxW}
              maxH={maxH}
              objectFit="contain"
              borderRadius="md"
              boxShadow="2xl"
              bg={modalBg}
              onClick={(e) => e.stopPropagation()}
            />
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};
