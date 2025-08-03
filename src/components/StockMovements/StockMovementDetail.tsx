'use client';

import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  Box,
  Text,
  Button,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import { StockMovement } from '@/entities/stockMovement';

type StockMovementDetailProps = {
  movement: StockMovement;
  setMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
};

export const StockMovementDetail = ({ movement, setMovements }: StockMovementDetailProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  const detailField = (label: string, value: string | number | null | undefined) => (
    <Box w="100%">
      <Text color={labelColor} mb="0.5rem">
        {label}
      </Text>
      <Box
        px="1rem"
        py="0.5rem"
        bg={inputBg}
        border="1px solid"
        borderColor={inputBorder}
        borderRadius="md"
        minH="2.75rem"
        maxH="10rem"
        overflowY="auto"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
      >
        {value ?? '—'}
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        aria-label="Ver detalle"
        icon={<FiEye />}
        onClick={onOpen}
        variant="ghost"
        size="lg"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Detalle del movimiento
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            pb="0"
            maxH="31rem"
            overflow="auto"
            sx={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <VStack spacing="0.75rem">
              {detailField('Fecha', movement.date.split('T')[0])}
              {detailField('Cantidad', movement.quantity)}
              {detailField('Tipo', movement.type)}
              {detailField('Razón', movement.reason)}
              {detailField('Producto', movement.product.name)}
              {detailField('Depósito', movement.shelve.warehouse.name)}
              {detailField('Estantería', movement.shelve.name)}
              {detailField('Usuario', movement.user.name)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box w="100%">
              <Button
                bg="gray.500"
                color="white"
                width="100%"
                _hover={{ bg: 'gray.600' }}
                onClick={onClose}
                py="1.375rem"
              >
                Cerrar
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
