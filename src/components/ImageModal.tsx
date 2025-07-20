'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
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
  children: React.ReactNode; // El elemento que actúa como trigger (la imagen pequeña)
  maxW?: string;
  maxH?: string;
};

export const ImageModal = ({ src, alt, children, maxW = '90vw', maxH = '90vh' }: ImageModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.800');
  const modalBg = useColorModeValue('white', 'gray.800');
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  const iconHoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <>
      {/* Trigger - el elemento que al hacer click abre el modal */}
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

        {/* Overlay con icono de expandir que aparece al hover */}
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

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg={overlayBg} />
        <ModalContent
          bg="transparent"
          boxShadow="none"
          m="0"
          onClick={onClose} // Cerrar al hacer click fuera de la imagen
        >
          <Flex align="center" justify="center" h="100vh" p="2rem" position="relative">
            {/* Botón de cerrar */}
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

            {/* Imagen en grande */}
            <Image
              src={src}
              alt={alt}
              maxW={maxW}
              maxH={maxH}
              objectFit="contain"
              borderRadius="md"
              boxShadow="2xl"
              bg={modalBg}
              onClick={(e) => e.stopPropagation()} // Prevenir que se cierre al hacer click en la imagen
            />
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};
