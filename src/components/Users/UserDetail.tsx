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
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiEye, FiMail, FiUser, FiShield, FiActivity } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { User } from '@/entities/user';
import { UserEdit } from './UserEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteUser } from '@/hooks/user';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

type UserDetailProps = {
  user: User;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export const UserDetail = ({ user, setUsers }: UserDetailProps) => {
  const canEditUsers = useUserStore((s) => s.hasPermission(Permission.EDIT_USERS));
  const canDeleteUsers = useUserStore((s) => s.hasPermission(Permission.DELETE_USERS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

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

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
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
            Detalle del usuario
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {detailField('Nombre de usuario', user.username, FiMail)}
              {detailField('Nombre completo', user.name, FiUser)}
              {detailField('Rol', user.role?.name, FiShield)}
              {detailField('Estado', user.isEnabled ? 'Activo' : 'Inactivo', FiActivity)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              {canDeleteUsers && (
                <GenericDelete
                  item={{ id: user.id, name: user.name }}
                  useDeleteHook={useDeleteUser}
                  setItems={setUsers}
                  onDeleted={onClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditUsers && (
                <Button
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    openEdit();
                    onClose();
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

      {isEditOpen && <UserEdit isOpen={isEditOpen} onClose={closeEdit} user={user} setUsers={setUsers} />}
    </>
  );
};
