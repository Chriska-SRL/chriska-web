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
import { FaEdit } from 'react-icons/fa';
import { VehicleCost } from '@/entities/vehicleCost';
import { VehicleCostEdit } from './VehicleCostEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteVehicleCost } from '@/hooks/vehicleCost';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

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

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Detalle del costo
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="0" maxH="31rem" overflow="scroll" overflowX="hidden">
            <VStack spacing="0.75rem">
              {detailField('Fecha', new Date(vehicleCost.date).toLocaleDateString('es-ES'))}
              {detailField('Tipo', vehicleCost.type)}
              {detailField('Monto', vehicleCost.amount)}
              {detailField('Descripción', vehicleCost.description)}
            </VStack>
          </ModalBody>
          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              {canDeleteVehicleCosts && (
                <GenericDelete
                  item={{ id: vehicleCost.id, name: vehicleCost.type }}
                  useDeleteHook={useDeleteVehicleCost}
                  setItems={setVehicleCosts}
                  onDeleted={onClose}
                />
              )}
              {canEditVehicleCosts && (
                <Button
                  bg="#4C88D8"
                  color="white"
                  _hover={{ backgroundColor: '#376bb0' }}
                  width="100%"
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    onClose();
                    openEdit();
                  }}
                >
                  Editar costo
                </Button>
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <VehicleCostEdit isOpen={isEditOpen} onClose={closeEdit} cost={vehicleCost} setCosts={setVehicleCosts} />
      )}
    </>
  );
};
