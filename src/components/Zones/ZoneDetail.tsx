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
  Checkbox,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { useEffect } from 'react';
import { Zone } from '@/entities/zone';
import { ZoneEdit } from './ZoneEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteZone } from '@/hooks/zone';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { Day } from '@/enums/day.enum';
import { ImageUpload } from '@/components/ImageUpload';

const allDays = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY];

type ZoneDetailProps = {
  zone: Zone;
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
};

export const ZoneDetail = ({ zone, setZones, forceOpen, onModalClose }: ZoneDetailProps) => {
  const canEditZones = useUserStore((s) => s.hasPermission(Permission.EDIT_ZONES));
  const canDeleteZones = useUserStore((s) => s.hasPermission(Permission.DELETE_ZONES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const handleClose = () => {
    onClose();
    onModalClose?.();
  };

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

  const renderDaysCheckboxesGrouped = (diasPedidos: string[], diasEntregas: string[]) => (
    <Box w="100%">
      <SimpleGrid columns={2} spacingX="2rem" alignItems="flex-start">
        <Box>
          <Text mb="0.5rem">Días de pedidos</Text>
          {allDays.map((day) => (
            <Checkbox
              key={`pedido-${day}`}
              isChecked={diasPedidos.includes(day)}
              pointerEvents="none"
              aria-disabled="true"
              mb="0.5rem"
              w="100%"
            >
              {day}
            </Checkbox>
          ))}
        </Box>

        <Box>
          <Text mb="0.5rem">Días de entrega</Text>
          {allDays.map((day) => (
            <Checkbox
              key={`entrega-${day}`}
              isChecked={diasEntregas.includes(day)}
              pointerEvents="none"
              aria-disabled="true"
              mb="0.5rem"
              w="100%"
            >
              {day}
            </Checkbox>
          ))}
        </Box>
      </SimpleGrid>
    </Box>
  );

  const handleImageChange = (newImageUrl: string | null) => {
    setZones((prevZones) => prevZones.map((z) => (z.id === zone.id ? { ...z, imageUrl: newImageUrl } : z)));
  };

  const diasPedidos = zone.requestDays || [];
  const diasEntregas = zone.deliveryDays || [];

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

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0">
            Detalle de la zona
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            pb="0"
            maxH="30rem"
            overflow="auto"
            sx={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <VStack spacing="0.75rem">
              {detailField('Nombre', zone.name)}
              {detailField('Descripción', zone.description)}
              {renderDaysCheckboxesGrouped(diasPedidos, diasEntregas)}

              <ImageUpload
                entityType="zones"
                entityId={zone.id}
                currentImageUrl={zone.imageUrl}
                onImageChange={handleImageChange}
              />
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              {canEditZones && (
                <Button
                  bg="#4C88D8"
                  color="white"
                  _hover={{ backgroundColor: '#376bb0' }}
                  width="100%"
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    handleClose();
                    openEdit();
                  }}
                >
                  Editar
                </Button>
              )}
              {canDeleteZones && (
                <GenericDelete
                  item={{ id: zone.id, name: zone.name }}
                  useDeleteHook={useDeleteZone}
                  setItems={setZones}
                  onDeleted={handleClose}
                />
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && <ZoneEdit isOpen={isEditOpen} onClose={closeEdit} zone={zone} setZones={setZones} />}
    </>
  );
};
