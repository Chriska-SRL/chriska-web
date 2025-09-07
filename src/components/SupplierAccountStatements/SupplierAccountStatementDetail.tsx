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
  Badge,
} from '@chakra-ui/react';
import { FiInfo, FiCalendar, FiDollarSign, FiFileText, FiTrendingUp } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getDocumentTypeLabel, getDocumentTypeColor } from '@/enums/documentType.enum';

type AccountStatementItem = {
  id: number;
  date: string;
  description: string;
  amount: number;
  balance: number;
  documentType: string;
};

type SupplierAccountStatementDetailProps = {
  item: AccountStatementItem;
};

export const SupplierAccountStatementDetail = ({ item }: SupplierAccountStatementDetailProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number) => {
    const isNegative = amount < 0;
    const formattedAmount = `$${Math.abs(amount).toFixed(2)}`;
    return isNegative ? `-${formattedAmount}` : formattedAmount;
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'green.500';
    if (amount < 0) return 'red.500';
    return textColor;
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
        color={textColor}
      >
        {value ?? '—'}
      </Box>
    </Box>
  );

  const detailFieldAmount = (label: string, amount: number, icon?: any) => (
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
        display="flex"
        alignItems="center"
        transition="all 0.2s"
      >
        <Text fontWeight="bold" color={getAmountColor(amount)}>
          {formatAmount(amount)}
        </Text>
      </Box>
    </Box>
  );

  const detailFieldType = (label: string, documentType: string, icon?: any) => (
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
        display="flex"
        alignItems="center"
        transition="all 0.2s"
      >
        <Badge colorScheme={getDocumentTypeColor(documentType)} variant="subtle" size="md" px="1rem" py="0.375rem">
          {getDocumentTypeLabel(documentType)}
        </Badge>
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        aria-label="Ver detalle"
        icon={<FiInfo />}
        onClick={onOpen}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxH="90vh" display="flex" flexDirection="column">
          <ModalHeader
            py="0.75rem"
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Detalle del Movimiento #{item.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {/* Fila 1: Fecha - Tipo */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Fecha', formatDate(item.date), FiCalendar)}
                {detailFieldType('Tipo de Documento', item.documentType, FiFileText)}
              </SimpleGrid>

              <Divider />

              {/* Descripción completa */}
              {detailField('Concepto', item.description, FiFileText)}

              <Divider />

              {/* Fila 2: Importe - Saldo */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailFieldAmount('Importe', item.amount, FiDollarSign)}
                {detailFieldAmount('Saldo', item.balance, FiTrendingUp)}
              </SimpleGrid>
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <Button variant="ghost" onClick={onClose} size="sm">
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
