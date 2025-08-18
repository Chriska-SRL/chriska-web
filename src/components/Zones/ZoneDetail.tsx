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
  Checkbox,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
  Icon,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { FiEye, FiMapPin, FiFileText, FiCalendar } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { useEffect } from 'react';
import { Zone } from '@/entities/zone';
import { ZoneEdit } from './ZoneEdit';
import { ZoneImageUpload } from './ZoneImageUpload';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteZone } from '@/hooks/zone';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { Day, getDayLabel } from '@/enums/day.enum';

const allDays = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY];

// Mapeo para convertir días en español a inglés
const spanishToEnglishDayMap: Record<string, Day> = {
  Lunes: Day.MONDAY,
  Martes: Day.TUESDAY,
  Miércoles: Day.WEDNESDAY,
  Jueves: Day.THURSDAY,
  Viernes: Day.FRIDAY,
  Sábado: Day.SATURDAY,
};

const convertDaysToEnglish = (days: string[]): Day[] => {
  return days
    .map((day) => {
      // Si ya está en inglés, lo devolvemos tal como está
      if (Object.values(Day).includes(day as Day)) {
        return day as Day;
      }
      // Si está en español, lo convertimos
      return spanishToEnglishDayMap[day] || (day as Day);
    })
    .filter((day) => Object.values(Day).includes(day)); // Filtrar valores válidos
};

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
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const handleClose = () => {
    onClose();
    onModalClose?.();
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

  const renderDaysCheckboxesGrouped = (diasPedidos: string[], diasEntregas: string[]) => (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing="1rem" w="100%">
      <Box>
        <HStack spacing="0.5rem" mb="0.5rem">
          <Icon as={FiCalendar} boxSize="1rem" color={iconColor} />
          <Text color={labelColor} fontWeight="semibold">
            Días de pedidos
          </Text>
        </HStack>
        {allDays.map((day) => (
          <Checkbox
            key={`pedido-${day}`}
            isChecked={diasPedidos.includes(day)}
            pointerEvents="none"
            aria-disabled="true"
            mb="0.5rem"
            w="100%"
            pl="1.5rem"
          >
            {getDayLabel(day)}
          </Checkbox>
        ))}
      </Box>

      <Box>
        <HStack spacing="0.5rem" mb="0.5rem">
          <Icon as={FiCalendar} boxSize="1rem" color={iconColor} />
          <Text color={labelColor} fontWeight="semibold">
            Días de entrega
          </Text>
        </HStack>
        {allDays.map((day) => (
          <Checkbox
            key={`entrega-${day}`}
            isChecked={diasEntregas.includes(day)}
            pointerEvents="none"
            aria-disabled="true"
            mb="0.5rem"
            w="100%"
            pl="1.5rem"
          >
            {getDayLabel(day)}
          </Checkbox>
        ))}
      </Box>
    </SimpleGrid>
  );

  const diasPedidos = convertDaysToEnglish(zone.requestDays || []);
  const diasEntregas = convertDaysToEnglish(zone.deliveryDays || []);

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
            Detalle de la zona
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <ZoneImageUpload zone={zone} editable={false} />

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Nombre', zone.name, FiMapPin)}
                {detailField('Descripción', zone.description, FiFileText)}
              </SimpleGrid>

              <Divider />

              {renderDaysCheckboxesGrouped(diasPedidos, diasEntregas)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              {canDeleteZones && (
                <GenericDelete
                  item={{ id: zone.id, name: zone.name }}
                  useDeleteHook={useDeleteZone}
                  setItems={setZones}
                  onDeleted={handleClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditZones && (
                <Button
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    openEdit();
                    handleClose();
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

      {isEditOpen && <ZoneEdit isOpen={isEditOpen} onClose={closeEdit} zone={zone} setZones={setZones} />}
    </>
  );
};
