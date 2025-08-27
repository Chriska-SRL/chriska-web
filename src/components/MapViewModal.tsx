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
} from '@chakra-ui/react';
import MapViewer from './MapViewer';
import { FiMapPin, FiX } from 'react-icons/fi';

type MapViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  title?: string;
};

export const MapViewModal = ({ isOpen, onClose, lat, lng, title = 'Ubicación en el mapa' }: MapViewModalProps) => {
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
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
            <Text>{title}</Text>
          </HStack>
        </ModalHeader>

        <ModalBody p="0" flex="1" overflow="hidden">
          <MapViewer lat={lat} lng={lng} height="500px" />
        </ModalBody>

        <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
          <HStack spacing="0.5rem">
            <Button variant="ghost" onClick={onClose} size="sm" leftIcon={<FiX />}>
              Cerrar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
