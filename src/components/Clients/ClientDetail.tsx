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
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Client } from '@/entities/client';
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
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Detalle del cliente
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="0" maxH="31rem" overflow="scroll" overflowX="hidden">
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
              {detailField('Banco', client.bank)}
              {detailField('Cuenta bancaria', client.bankAccount)}
              {detailField('Cajones prestados', client.loanedCrates)}
              {detailField('Zona', client.zone.name)}
              {detailField('Observaciones', client.observations)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              {canDeleteClients && (
                <GenericDelete
                  item={{ id: client.id, name: client.name }}
                  useDeleteHook={useDeleteClient}
                  setItems={setClients}
                  onDeleted={onClose}
                />
              )}
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
                  Editar cliente
                </Button>
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && <ClientEdit isOpen={isEditOpen} onClose={closeEdit} client={client} setClients={setClients} />}
    </>
  );
};
