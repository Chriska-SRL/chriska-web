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
import { Vehicle } from '@/entities/vehicle';
import { VehicleEdit } from './VehicleEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteVehicle } from '@/hooks/vehicle';
import { PermissionId } from '@/entities/permissions/permissionId';
import { useUserStore } from '@/stores/useUserStore';

type VehicleDetailProps = {
  vehicle: Vehicle;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
};

export const VehicleDetail = ({ vehicle, setVehicles }: VehicleDetailProps) => {
  const canEditVehicles = useUserStore((s) => s.hasPermission(PermissionId.EDIT_VEHICLES));
  const canDeleteVehicles = useUserStore((s) => s.hasPermission(PermissionId.DELETE_VEHICLES));

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
            Detalle del vehículo
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="0" maxH="31rem" overflow="scroll" overflowX="hidden">
            <VStack spacing="0.75rem">
              {detailField('Nombre', vehicle.plate)}
              {detailField('Marca', vehicle.brand)}
              {detailField('Modelo', vehicle.model)}
              {detailField('Capacidad de cajones', vehicle.crateCapacity)}
            </VStack>
          </ModalBody>
          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              {canDeleteVehicles && (
                <GenericDelete
                  item={{ id: vehicle.id, name: vehicle.plate }}
                  useDeleteHook={useDeleteVehicle}
                  setItems={setVehicles}
                  onDeleted={onClose}
                />
              )}
              {canEditVehicles && (
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
                  Editar vehículo
                </Button>
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <VehicleEdit isOpen={isEditOpen} onClose={closeEdit} vehicle={vehicle} setVehicles={setVehicles} />
      )}
    </>
  );
};
