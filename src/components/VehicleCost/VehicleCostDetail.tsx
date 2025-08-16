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
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiEye, FiCalendar, FiTag, FiDollarSign, FiFileText } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { VehicleCost } from '@/entities/vehicleCost';
import { VehicleCostEdit } from './VehicleCostEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteVehicleCost } from '@/hooks/vehicleCost';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { getVehicleCostTypeLabel } from '@/enums/vehicleCostType.enum';
import { formatPrice } from '@/utils/formatters/price';
import { formatDate } from '@/utils/formatters/date';

type VehicleCostDetailProps = {
  vehicleCost: VehicleCost;
  setVehicleCosts: React.Dispatch<React.SetStateAction<VehicleCost[]>>;
};

export const VehicleCostDetail = ({ vehicleCost, setVehicleCosts }: VehicleCostDetailProps) => {
  const canEditVehicleCosts = useUserStore((s) => s.hasPermission(Permission.EDIT_VEHICLES));
  const canDeleteVehicleCosts = useUserStore((s) => s.hasPermission(Permission.DELETE_VEHICLES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

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
        aria-label="Ver detalle"
        icon={<FiEye />}
        onClick={onOpen}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent maxH="90dvh" display="flex" flexDirection="column">
          <ModalHeader
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Detalle del costo
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {detailField('Fecha', formatDate(vehicleCost.date), FiCalendar)}
              {detailField('Tipo', getVehicleCostTypeLabel(vehicleCost.type), FiTag)}
              {detailField('Monto', formatPrice(vehicleCost.amount), FiDollarSign)}
              {detailField('Descripción', vehicleCost.description, FiFileText)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              {canDeleteVehicleCosts && (
                <GenericDelete
                  item={{
                    id: vehicleCost.id,
                    name: `${getVehicleCostTypeLabel(vehicleCost.type)} - ${formatPrice(vehicleCost.amount)}`,
                  }}
                  useDeleteHook={useDeleteVehicleCost}
                  setItems={setVehicleCosts}
                  onDeleted={onClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditVehicleCosts && (
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
        <VehicleCostEdit isOpen={isEditOpen} onClose={closeEdit} cost={vehicleCost} setCosts={setVehicleCosts} />
      )}
    </>
  );
};
