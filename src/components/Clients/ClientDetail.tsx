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
  HStack,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
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
import { QualificationSelector } from '../QualificationSelector';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const handleClose = () => {
    onClose();
    onModalClose?.();
  };

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const accountSubtextColor = useColorModeValue('gray.600', 'gray.400');

  const detailField = (label: string, value: string | number | null | undefined, onClick?: () => void) => (
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
    const [current, total] = defaultQualification.split('/').map(Number);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(<Icon as={FaStar} key={i} color={i <= current ? '#FFD700' : '#E2E8F0'} boxSize="2.5rem" />);
    }

    return (
      <Box w="100%">
        <Text color={labelColor} mb="0.5rem">
          Calificación
        </Text>
        <Flex justifyContent="center" alignItems="center" w="100%" py="0.5rem">
          <HStack spacing="1rem">{stars}</HStack>
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
        size="lg"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg" maxH="90dvh" display="flex" flexDirection="column">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0" flexShrink={0}>
            Detalle del cliente
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            pb="0"
            flex="1"
            maxH="calc(90dvh - 200px)"
            overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <VStack spacing="0.75rem">
              {detailField('Nombre', client.name)}
              {detailField('RUT', client.rut)}
              {detailField('Razón Social', client.razonSocial)}
              {detailField('Dirección', client.address)}
              {detailField('Dirección en Maps', client.mapsAddress)}
              {detailField('Horario', client.schedule)}
              {detailField('Teléfono', client.phone)}
              {detailField('Persona de contacto', client.contactName)}
              {detailField('Correo electrónico', client.email)}
              {detailField('Zona', client.zone.name, () => {
                router.push(`/zonas?open=${client.zone.id}`);
              })}
              {detailField('Cajones prestados', client.loanedCrates)}
              {renderQualificationStars(client.qualification)}
              {client.bankAccounts && client.bankAccounts.length > 0 && (
                <Box w="100%">
                  <Text color={labelColor} mb="0.5rem">
                    Cuentas bancarias
                  </Text>
                  <VStack spacing="0.5rem" align="stretch">
                    {client.bankAccounts.map((account: BankAccount, index: number) => (
                      <Box
                        key={index}
                        px="1rem"
                        py="0.5rem"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="md"
                      >
                        <Text fontWeight="semibold" fontSize="sm">
                          {account.accountName}
                        </Text>
                        <Text fontSize="sm" color={accountSubtextColor}>
                          {account.bank} - {account.accountNumber}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
              {detailField('Observaciones', client.observations)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem" flexShrink={0}>
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              <Button
                bg="#4C88D8"
                color="white"
                _hover={{ backgroundColor: '#376bb0' }}
                width="100%"
                leftIcon={<FaPlus />}
                onClick={() => {
                  handleClose();
                  openEdit();
                }}
              >
                Crear orden
              </Button>
              <Button
                bg="#4C88D8"
                color="white"
                _hover={{ backgroundColor: '#376bb0' }}
                width="100%"
                leftIcon={<FaPlus />}
                onClick={() => {
                  handleClose();
                  openEdit();
                }}
              >
                Crear devolución
              </Button>
              {canEditClients && (
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
              {canDeleteClients && (
                <GenericDelete
                  item={{ id: client.id, name: client.name }}
                  useDeleteHook={useDeleteClient}
                  setItems={setClients}
                  onDeleted={handleClose}
                />
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && <ClientEdit isOpen={isEditOpen} onClose={closeEdit} client={client} setClients={setClients} />}
    </>
  );
};
