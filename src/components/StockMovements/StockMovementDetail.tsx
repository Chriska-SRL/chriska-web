'use client';

import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
  Box,
  Text,
  Button,
  useColorModeValue,
  useDisclosure,
  Icon,
  SimpleGrid,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { FiInfo, FiCalendar, FiHash, FiTag, FiFileText, FiPackage, FiUser } from 'react-icons/fi';
import { StockMovement } from '@/entities/stockMovement';
import { getStockMovementTypeLabel } from '@/enums/stockMovementType.enum';
import { useEffect, useCallback } from 'react';

type StockMovementDetailProps = {
  movement: StockMovement;
  setMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
};

export const StockMovementDetail = ({ movement, forceOpen, onModalClose }: StockMovementDetailProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const handleClose = useCallback(() => {
    onClose();
    onModalClose?.();
  }, [onClose, onModalClose]);

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('es-ES');
    } catch {
      return date;
    }
  };

  const detailField = (label: string, value: string | number | null | undefined, icon?: any) => (
    <Box w="100%">
      <HStack mb="0.5rem" spacing="0.5rem">
        {icon && <Icon as={icon} boxSize="1rem" color={iconColor} />}
        <Text color={labelColor} fontWeight="semibold">
          {label}
        </Text>
      </HStack>
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
        transition="all 0.2s"
      >
        {value ?? '—'}
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        aria-label="Ver detalles"
        icon={<FiInfo />}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'xl' }} isCentered>
        <ModalOverlay />
        <ModalContent maxH="90dvh" display="flex" flexDirection="column">
          <ModalHeader
            py="0.75rem"
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Detalle del movimiento
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Fecha', formatDate(movement.date), FiCalendar)}
                {detailField('Usuario', movement.user.name, FiUser)}
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Tipo', getStockMovementTypeLabel(movement.type), FiTag)}
                {detailField('Cantidad', movement.quantity, FiHash)}
              </SimpleGrid>

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing="0.75rem">
                {detailField('Producto', movement.product.name, FiPackage)}
                {detailField('Depósito', movement.product.shelve?.warehouse?.name || 'No especificado', FiPackage)}
                {detailField('Estantería', movement.product.shelve?.name || 'No especificada', FiPackage)}
              </SimpleGrid>

              <Divider />

              {detailField('Razón', movement.reason, FiFileText)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <Button variant="ghost" onClick={handleClose} size="sm">
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
