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
  HStack,
  Icon,
  SimpleGrid,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import {
  FiInfo,
  FiUser,
  FiHash,
  FiMapPin,
  FiClock,
  FiPhone,
  FiMail,
  FiFileText,
  FiStar,
  FiBox,
  FiCreditCard,
  FiUsers,
  FiMap,
} from 'react-icons/fi';
import { FaEdit, FaStar } from 'react-icons/fa';
import { Client } from '@/entities/client';
import { BankAccount } from '@/entities/bankAccount';
import { ClientEdit } from './ClientEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteClient } from '@/hooks/client';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa6';
import { useEffect, useCallback, useState } from 'react';
import MapPreview from '../MapPreview';
import { MapViewModal } from '../MapViewModal';

type ClientDetailProps = {
  client: Client;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
};

export const ClientDetail = ({ client, setClients, forceOpen, onModalClose }: ClientDetailProps) => {
  const canEditClients = useUserStore((s) => s.hasPermission(Permission.EDIT_CLIENTS));
  const canDeleteClients = useUserStore((s) => s.hasPermission(Permission.DELETE_CLIENTS));

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isMapOpen, onOpen: openMap, onClose: closeMap } = useDisclosure();

  // Estados de carga para navegación
  const [isNavigatingToOrders, setIsNavigatingToOrders] = useState(false);

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const handleClose = useCallback(() => {
    // No permitir cerrar si se está navegando
    if (isNavigatingToOrders) {
      return;
    }
    onClose();
    onModalClose?.();
  }, [onClose, onModalClose, isNavigatingToOrders]);

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const handleNavigateToOrders = async () => {
    setIsNavigatingToOrders(true);
    await router.push(`/pedidos?client=${client.id}&add=true`);
    // El estado se mantendrá hasta que el componente se desmonte
  };

  const detailField = (label: string, value: string | number | null | undefined, icon?: any, onClick?: () => void) => (
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
        cursor={onClick ? 'pointer' : 'default'}
        _hover={
          onClick
            ? {
                bg: useColorModeValue('gray.200', 'whiteAlpha.200'),
                borderColor: useColorModeValue('gray.300', 'whiteAlpha.400'),
              }
            : {}
        }
        onClick={onClick}
        transition="all 0.2s"
        position="relative"
      >
        {value ?? '—'}
        {onClick && (
          <Icon as={FiInfo} position="absolute" right="1rem" top="50%" transform="translateY(-50%)" boxSize="1rem" />
        )}
      </Box>
    </Box>
  );

  const renderQualificationStars = (qualification?: string) => {
    const defaultQualification = qualification || '4/5';
    const [current] = defaultQualification.split('/').map(Number);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(<Icon as={FaStar} key={i} color={i <= current ? '#FFD700' : '#E2E8F0'} boxSize="2.25rem" />);
    }

    return (
      <Box w="100%">
        <HStack mb="0.5rem" spacing="0.5rem">
          <Icon as={FiStar} boxSize="1rem" color={iconColor} />
          <Text color={labelColor} fontWeight="semibold">
            Calificación
          </Text>
        </HStack>
        <Flex justifyContent="center" alignItems="center" py="0.25rem">
          <HStack spacing="0.75rem">{stars}</HStack>
        </Flex>
      </Box>
    );
  };

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

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'xl' }}
        isCentered
        closeOnOverlayClick={!isNavigatingToOrders}
        closeOnEsc={!isNavigatingToOrders}
      >
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
            Detalle del cliente
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {/* Fila 1: Nombre - RUT */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Nombre', client.name, FiUser)}
                {detailField('RUT', client.rut, FiHash)}
              </SimpleGrid>

              {/* Fila 2: Razón Social - Zona */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Razón Social', client.razonSocial, FiUsers)}
                {detailField('Zona', client.zone.name, FiMapPin, () => {
                  router.push(`/zonas?open=${client.zone.id}`);
                })}
              </SimpleGrid>

              {/* Fila 3: Dirección (completo) */}
              {detailField('Dirección', client.address, FiMapPin)}

              {/* Fila 4: Persona de contacto - Teléfono */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Persona de contacto', client.contactName, FiUser)}
                {detailField('Teléfono', client.phone, FiPhone)}
              </SimpleGrid>

              {/* Fila 5: Email (completo) */}
              {detailField('Correo electrónico', client.email, FiMail)}

              {/* Fila 6: Ubicación con preview del mapa */}
              <Box w="100%">
                <HStack mb="0.5rem" spacing="0.5rem">
                  <Icon as={FiMap} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Ubicación
                  </Text>
                </HStack>
                <VStack spacing="0.5rem" align="stretch">
                  <Box bg={inputBg} border="1px solid" borderColor={inputBorder} borderRadius="md" p="0.5rem">
                    <MapPreview
                      lat={client.location.latitude}
                      lng={client.location.longitude}
                      height="15rem"
                      onClick={openMap}
                    />
                  </Box>
                </VStack>
              </Box>

              {/* Fila 7: Horario (completo) */}
              {detailField('Horario', client.schedule, FiClock)}

              {/* Fila 8: Cajones prestados - Calificación */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Cajones prestados', client.loanedCrates, FiBox)}
                {renderQualificationStars(client.qualification)}
              </SimpleGrid>

              {client.bankAccounts && client.bankAccounts.length > 0 && (
                <Box>
                  <HStack mb="0.5rem" spacing="0.5rem">
                    <Icon as={FiCreditCard} boxSize="1rem" color={iconColor} />
                    <Text fontSize="lg" fontWeight="bold" color={labelColor}>
                      Cuentas bancarias
                    </Text>
                  </HStack>
                  <Box
                    px="1rem"
                    py="0.75rem"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={inputBorder}
                    borderRadius="md"
                    maxH="200px"
                    overflowY="auto"
                  >
                    <VStack spacing="0.5rem" align="stretch">
                      {client.bankAccounts.map((account: BankAccount, index: number) => (
                        <Box key={index} p="0.5rem" bg="whiteAlpha.50" borderRadius="md">
                          <Text fontSize="sm" fontWeight="medium">
                            {account.accountName}
                          </Text>
                          <Text fontSize="xs" color={iconColor}>
                            {account.bank} - {account.accountNumber}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              )}

              {detailField('Observaciones', client.observations, FiFileText)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem" w="100%" justify="flex-end">
              <Button variant="ghost" size="sm" onClick={handleClose} disabled={isNavigatingToOrders}>
                Cerrar
              </Button>
              <Button
                leftIcon={isNavigatingToOrders ? <Spinner size="xs" /> : <FaPlus />}
                onClick={handleNavigateToOrders}
                colorScheme="green"
                variant="outline"
                size="sm"
                isLoading={isNavigatingToOrders}
                loadingText="Redirigiendo..."
              >
                Crear pedido
              </Button>
              {canDeleteClients && (
                <GenericDelete
                  item={{ id: client.id, name: client.name }}
                  useDeleteHook={useDeleteClient}
                  setItems={setClients}
                  onDeleted={handleClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditClients && (
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

      <ClientEdit isOpen={isEditOpen} onClose={closeEdit} client={client} setClients={setClients} />

      <MapViewModal
        isOpen={isMapOpen}
        onClose={closeMap}
        lat={client.location.latitude}
        lng={client.location.longitude}
        title={`Ubicación de ${client.name}`}
      />
    </>
  );
};
