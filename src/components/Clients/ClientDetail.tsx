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

type ClientDetailProps = {
  client: Client;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
};

export const ClientDetail = ({ client, setClients }: ClientDetailProps) => {
  const canEditClients = useUserStore((s) => s.hasPermission(Permission.EDIT_CLIENTS));
  const canDeleteClients = useUserStore((s) => s.hasPermission(Permission.DELETE_CLIENTS));

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  const detailFieldClickable = (label: string, value: string | number | null | undefined, onClick?: () => void) => (
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

    const dividerColor = useColorModeValue('gray.300', 'whiteAlpha.200');

    return (
      <Box w="100%">
        <Text color={labelColor} mb="0.5rem">
          Cuentas bancarias
        </Text>
        <Box
          px="1rem"
          py={defaultBankAccounts.length === 1 ? '0.75rem' : '0'}
          bg={inputBg}
          border="1px solid"
          borderColor={inputBorder}
          borderRadius="md"
          minH="2.75rem"
        >
          {defaultBankAccounts.length > 0 ? (
            <VStack spacing="0" align="stretch" divider={<Box h="1px" bg={dividerColor} />}>
              {defaultBankAccounts.map((account, index) => (
                <Flex key={account.id} flexDir="column" py={defaultBankAccounts.length === 1 ? '0' : '0.75rem'}>
                  <Text fontWeight="semibold" fontSize="sm">
                    {account.bank}
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    Nº de cuenta: {account.number}
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    Nombre: {account.name}
                  </Text>
                </Flex>
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
        <ModalContent mx="auto" borderRadius="lg" maxH="90%" overflow="auto">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0">
            Detalle del cliente
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            pb="0"
            // maxH="30rem"
            // overflow="auto"
            sx={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <VStack spacing="0.75rem">
              {detailFieldClickable('Nombre', client.name)}
              {detailFieldClickable('RUT', client.rut)}
              {detailFieldClickable('Razón Social', client.razonSocial)}
              {detailFieldClickable('Dirección', client.address)}
              {detailFieldClickable('Dirección en Maps', client.mapsAddress)}
              {detailFieldClickable('Horario', client.schedule)}
              {detailFieldClickable('Teléfono', client.phone)}
              {detailFieldClickable('Persona de contacto', client.contactName)}
              {detailFieldClickable('Correo electrónico', client.email)}
              {renderBankAccounts(client.bankAccounts)}
              {detailFieldClickable('Cajones prestados', client.loanedCrates)}
              {/* {detailFieldClickable('Zona', client.zone.name)} */}
              {detailFieldClickable('Zona', client.zone.name, () => {
                router.push(`/zonas?open=${client.zone.id}`);
              })}
              {renderQualificationStars(client.qualification)}
              {detailFieldClickable('Observaciones', client.observations)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              <Button
                bg="#4C88D8"
                color="white"
                _hover={{ backgroundColor: '#376bb0' }}
                width="100%"
                leftIcon={<FaPlus />}
                onClick={() => {
                  onClose();
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
                  onClose();
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
