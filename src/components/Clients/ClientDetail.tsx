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
  Divider,
  Flex,
} from '@chakra-ui/react';
import {
  FiEye,
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
import { useEffect, useCallback } from 'react';

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

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const handleClose = useCallback(() => {
    onClose();
    onModalClose?.();
  }, [onClose, onModalClose]);

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

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
          <Icon as={FiEye} position="absolute" right="1rem" top="50%" transform="translateY(-50%)" boxSize="1rem" />
        )}
      </Box>
    </Box>
  );

  const renderQualificationStars = (qualification?: string) => {
    const defaultQualification = qualification || '4/5';
    const [current] = defaultQualification.split('/').map(Number);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(<Icon as={FaStar} key={i} color={i <= current ? '#FFD700' : '#E2E8F0'} boxSize="1.25rem" />);
    }

    return (
      <Box w="100%">
        <HStack mb="0.5rem" spacing="0.5rem">
          <Icon as={FiStar} boxSize="1rem" color={iconColor} />
          <Text color={labelColor} fontWeight="semibold">
            Calificación
          </Text>
        </HStack>
        <Flex
          px="1rem"
          py="0.5rem"
          bg={inputBg}
          border="1px solid"
          borderColor={inputBorder}
          borderRadius="md"
          minH="2.75rem"
          justifyContent="center"
          alignItems="center"
          transition="all 0.2s"
        >
          <HStack spacing="0.25rem">{stars}</HStack>
        </Flex>
      </Box>
    );
  };

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
            Detalle del cliente
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Nombre', client.name, FiUser)}
                {detailField('RUT', client.rut, FiHash)}
              </SimpleGrid>

              {detailField('Razón Social', client.razonSocial, FiUsers)}
              {detailField('Dirección', client.address, FiMapPin)}

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Teléfono', client.phone, FiPhone)}
                {detailField('Correo electrónico', client.email, FiMail)}
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Persona de contacto', client.contactName, FiUser)}
                {renderQualificationStars(client.qualification)}
              </SimpleGrid>

              {detailField('Dirección en Maps', client.mapsAddress, FiMap)}
              {detailField('Horario', client.schedule, FiClock)}

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Zona', client.zone.name, FiMapPin, () => {
                  router.push(`/zonas?open=${client.zone.id}`);
                })}
                {detailField('Cajones prestados', client.loanedCrates, FiBox)}
              </SimpleGrid>

              <Divider />

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

              <Divider />

              {detailField('Observaciones', client.observations, FiFileText)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <VStack spacing="0.5rem" w="100%">
              <HStack spacing="0.5rem" w="100%">
                <Button
                  flex="1"
                  leftIcon={<FaPlus />}
                  onClick={() => {
                    handleClose();
                  }}
                  colorScheme="green"
                  variant="outline"
                  size="sm"
                >
                  Crear orden
                </Button>
                <Button
                  flex="1"
                  leftIcon={<FaPlus />}
                  onClick={() => {
                    handleClose();
                  }}
                  colorScheme="orange"
                  variant="outline"
                  size="sm"
                >
                  Crear devolución
                </Button>
              </HStack>
              <HStack spacing="0.5rem" w="100%">
                <Button variant="ghost" size="sm" onClick={handleClose} flex="1">
                  Cerrar
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
                    flex="1"
                  >
                    Editar
                  </Button>
                )}
              </HStack>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ClientEdit isOpen={isEditOpen} onClose={closeEdit} client={client} setClients={setClients} />
    </>
  );
};
