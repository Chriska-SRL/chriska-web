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
import { User } from '@/entities/user';
import { UserEdit } from './UserEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteUser } from '@/hooks/user';
import { PermissionId } from '@/entities/permissions/permissionId';
import { useUserStore } from '@/stores/useUserStore';

type UserDetailProps = {
  user: User;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export const UserDetail = ({ user, setUsers }: UserDetailProps) => {
  const canEditUsers = useUserStore((s) => s.hasPermission(PermissionId.EDIT_USERS));
  const canDeleteUsers = useUserStore((s) => s.hasPermission(PermissionId.DELETE_USERS));

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
            Detalle del usuario
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="0" maxH="31rem" overflow="scroll" overflowX="hidden">
            <VStack spacing="0.75rem">
              {detailField('Nombre de usuario', user.username)}
              {detailField('Nombre', user.name)}
              {detailField('Rol', user.role?.name)}
              {detailField('Estado', user.isEnabled ? 'Activo' : 'Inactivo')}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              {canDeleteUsers && (
                <GenericDelete
                  item={{ id: user.id, name: user.name }}
                  useDeleteHook={useDeleteUser}
                  setItems={setUsers}
                  onDeleted={onClose}
                />
              )}
              {canEditUsers && (
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
                  Editar usuario
                </Button>
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && <UserEdit isOpen={isEditOpen} onClose={closeEdit} user={user} setUsers={setUsers} />}
    </>
  );
};
