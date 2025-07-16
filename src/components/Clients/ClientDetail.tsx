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

type ClientDetailProps = {
  client: Client;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
};

export const ClientDetail = ({ client, setClients }: ClientDetailProps) => {
  const canEditClients = useUserStore((s) => s.hasPermission(Permission.EDIT_CLIENTS));
  const canDeleteClients = useUserStore((s) => s.hasPermission(Permission.DELETE_CLIENTS));

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

  const renderQualificationStars = (qualification?: string) => {
    const defaultQualification = qualification || '4/5';
    const [current, total] = defaultQualification.split('/').map(Number);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(<FaStar key={i} color={i <= current ? '#FFD700' : '#E2E8F0'} size="2.5rem" />);
    }

    return (
      <Box w="100%">
        <Text color={labelColor} mb="0.5rem">
          Calificación
        </Text>
        <Flex justifyContent="center" alignItems="center" w="100%" py="0.5rem">
          <HStack spacing="1.5rem">{stars}</HStack>
        </Flex>
      </Box>
    );
  };

  const renderBankAccounts = (bankAccounts?: BankAccount[]) => {
    const defaultBankAccounts: BankAccount[] = bankAccounts || [
      { id: 1, bank: 'Banco República', number: '1234567890', name: 'Maria Sanchez' },
      { id: 2, bank: 'Banco Santander', number: '0987654321', name: 'Pedro Gutiérrez' },
    ];

    return (
      <Box w="100%">
        <Text color={labelColor} mb="0.5rem">
          Cuentas bancarias
        </Text>
        <Box minH="2.75rem" maxH="9rem" overflowY="auto">
          {defaultBankAccounts.length > 0 ? (
            <VStack spacing="0.75rem" align="stretch">
              {defaultBankAccounts.map((account) => (
                <Box
                  key={account.id}
                  p="0.75rem 1rem"
                  bg={useColorModeValue('white', 'whiteAlpha.50')}
                  border="1px solid"
                  borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
                  borderRadius="md"
                >
                  <Text fontWeight="semibold" fontSize="sm" mb="0.25rem">
                    {account.bank}
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} mb="0.25rem">
                    Nº de cuenta: {account.number}
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    Nombre: {account.name}
                  </Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>—</Text>
          )}
        </Box>
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

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0">
            Detalle del cliente
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
              {detailField('Nombre', client.name)}
              {detailField('RUT', client.rut)}
              {detailField('Razón Social', client.razonSocial)}
              {detailField('Dirección', client.address)}
              {detailField('Dirección en Maps', client.mapsAddress)}
              {detailField('Horario', client.schedule)}
              {detailField('Teléfono', client.phone)}
              {detailField('Persona de contacto', client.contactName)}
              {detailField('Correo electrónico', client.email)}
              {renderBankAccounts(client.bankAccounts)}
              {detailField('Cajones prestados', client.loanedCrates)}
              {detailField('Zona', client.zone.name)}
              {renderQualificationStars(client.qualification)}
              {detailField('Observaciones', client.observations)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              {canEditClients && (
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
                  Editar
                </Button>
              )}
              {canDeleteClients && (
                <GenericDelete
                  item={{ id: client.id, name: client.name }}
                  useDeleteHook={useDeleteClient}
                  setItems={setClients}
                  onDeleted={onClose}
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
