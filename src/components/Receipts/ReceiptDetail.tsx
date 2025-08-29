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
  HStack,
  Badge,
} from '@chakra-ui/react';
import { FiInfo, FiUsers, FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Receipt } from '@/entities/receipt';
import { ReceiptEdit } from './ReceiptEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteReceipt } from '@/hooks/receipt';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { getPaymentMethodLabel, getPaymentMethodColor } from '@/enums/paymentMethod.enum';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type ReceiptDetailProps = {
  receipt: Receipt;
  setReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
};

export const ReceiptDetail = ({ receipt, setReceipts }: ReceiptDetailProps) => {
  const canEditReceipts = useUserStore((s) => s.hasPermission(Permission.EDIT_RECEIPTS));
  const canDeleteReceipts = useUserStore((s) => s.hasPermission(Permission.DELETE_RECEIPTS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return dateString;
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

  const paymentMethodField = (label: string, value: string, icon?: any) => (
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
      >
        <Badge colorScheme={getPaymentMethodColor(value)} fontSize="sm" p="0.25rem 0.75rem" borderRadius="md">
          {getPaymentMethodLabel(value)}
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
        size="sm"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
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
            Detalle del recibo #{receipt.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {detailField('Cliente', receipt.client?.name || 'Sin cliente asignado', FiUsers)}
              {detailField('Fecha', formatDate(receipt.date), FiCalendar)}
              {detailField('Monto', `$${receipt.amount?.toFixed(2) || '0.00'}`, FiDollarSign)}
              {paymentMethodField('Método de pago', receipt.paymentMethod, FiFileText)}
              {detailField('Notas', receipt.notes)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cerrar
              </Button>
              {canDeleteReceipts && (
                <GenericDelete
                  item={{ id: receipt.id, name: `recibo #${receipt.id}` }}
                  useDeleteHook={useDeleteReceipt}
                  setItems={setReceipts}
                  onDeleted={onClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditReceipts && (
                <Button
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    openEdit();
                    onClose();
                  }}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                >
                  Editar
                </Button>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <ReceiptEdit isOpen={isEditOpen} onClose={closeEdit} receipt={receipt} setReceipts={setReceipts} />
      )}
    </>
  );
};
