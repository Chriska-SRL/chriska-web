'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  HStack,
  Text,
  useColorModeValue,
  VStack,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import MapLocationPicker from './MapLocationPicker';
import { FiMapPin, FiCheck, FiX } from 'react-icons/fi';

type LocationPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
};

export const LocationPickerModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialLat = -34.9011,
  initialLng = -56.1645,
}: LocationPickerModalProps) => {
  const [selectedLat, setSelectedLat] = useState(initialLat);
  const [selectedLng, setSelectedLng] = useState(initialLng);

  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const handleConfirm = () => {
    onConfirm(selectedLat, selectedLng);
    onClose();
  };

  const handleClose = () => {
    // Resetear a valores iniciales si se cancela
    setSelectedLat(initialLat);
    setSelectedLng(initialLng);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl" isCentered>
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
          <HStack justify="center" spacing="0.5rem">
            <FiMapPin />
            <Text>Seleccionar ubicación</Text>
          </HStack>
        </ModalHeader>

        <ModalBody p="0" flex="1" overflow="hidden">
          <Box h="100%" w="100%" minH="400px">
            <MapLocationPicker
              onLocationSelect={handleLocationSelect}
              initialLat={selectedLat}
              initialLng={selectedLng}
            />
          </Box>
        </ModalBody>

        <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
          <HStack spacing="0.5rem">
            <Button variant="ghost" onClick={handleClose} size="sm">
              Cancelar
            </Button>
            <Button leftIcon={<FiCheck />} onClick={handleConfirm} colorScheme="blue" variant="outline" size="sm">
              Confirmar ubicación
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
