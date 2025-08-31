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
  Stack,
} from '@chakra-ui/react';
import { FiInfo, FiHash, FiTag, FiTruck, FiBox } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Vehicle } from '@/entities/vehicle';
import { VehicleEdit } from './VehicleEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteVehicle } from '@/hooks/vehicle';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

type VehicleDetailProps = {
  vehicle: Vehicle;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
};

export const VehicleDetail = ({ vehicle, setVehicles }: VehicleDetailProps) => {
  const canEditVehicles = useUserStore((s) => s.hasPermission(Permission.EDIT_VEHICLES));
  const canDeleteVehicles = useUserStore((s) => s.hasPermission(Permission.DELETE_VEHICLES));

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
        icon={<FiInfo />}
        onClick={onOpen}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'md' }} isCentered>
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
            Detalle del vehículo
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {detailField('Matrícula', vehicle.plate, FiHash)}
              {detailField('Marca', vehicle.brand, FiTag)}
              {detailField('Modelo', vehicle.model, FiTruck)}
              {detailField('Capacidad de cajones', vehicle.crateCapacity, FiBox)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <Stack
              direction={{ base: 'column-reverse', md: 'row' }}
              spacing="0.5rem"
              w="100%"
              align="stretch"
              justify={{ base: 'stretch', md: 'flex-end' }}
            >
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cerrar
              </Button>
              {canDeleteVehicles && (
                <GenericDelete
                  item={{ id: vehicle.id, name: vehicle.plate }}
                  useDeleteHook={useDeleteVehicle}
                  setItems={setVehicles}
                  onDeleted={onClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditVehicles && (
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
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <VehicleEdit isOpen={isEditOpen} onClose={closeEdit} vehicle={vehicle} setVehicles={setVehicles} />
      )}
    </>
  );
};
