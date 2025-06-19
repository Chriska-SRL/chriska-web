'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Flex,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';

type TemporaryPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  password: string | null;
};

export const TemporaryPasswordModal = ({ isOpen, onClose, password }: TemporaryPasswordModalProps) => {
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(password || '');
    toast({
      title: 'Contraseña copiada',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="1.75rem">
          Contraseña temporal
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0" pb="1.5rem">
          <VStack spacing="1rem">
            <Text fontSize="1rem" textAlign="center">
              Esta es la contraseña que deberá usar el usuario para iniciar sesión por primera vez.
              <br />
              Asegúrese de guardarla en un lugar seguro.
            </Text>
            <Flex justifyContent="space-between" alignItems="center" w="100%" gap="1rem">
              <Flex
                justifyContent="center"
                alignItems="center"
                bg="gray.100"
                h="2.5rem"
                borderRadius="md"
                w="100%"
                textAlign="center"
                fontWeight="bold"
                fontSize="1.2rem"
                wordBreak="break-all"
                color="black"
              >
                {password}
              </Flex>
              <IconButton
                colorScheme="blue"
                aria-label="Copiar contraseña"
                icon={<FaCopy />}
                w="2.5rem"
                h="2.5rem"
                bg="blue.500"
                _hover={{ bg: 'blue.600' }}
                onClick={handleCopy}
              />
            </Flex>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
