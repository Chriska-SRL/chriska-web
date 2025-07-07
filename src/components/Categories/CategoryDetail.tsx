'use category';

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
import { Category } from '@/entities/category';
import { CategoryEdit } from './CategoryEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteCategory } from '@/hooks/category';
import { PermissionId } from '@/entities/permissions/permissionId';
import { useUserStore } from '@/stores/useUserStore';

type CategoryDetailProps = {
  category: Category;
  setCategorys: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const CategoryDetail = ({ category, setCategorys }: CategoryDetailProps) => {
  const canEditCategorys = useUserStore((s) => s.hasPermission(PermissionId.EDIT_CLIENTS));
  const canDeleteCategorys = useUserStore((s) => s.hasPermission(PermissionId.DELETE_CLIENTS));

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

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Detalle de categoría
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="0" maxH="31rem" overflow="sccategoríal">
            <VStack spacing="0.75rem">
              {detailField('Nombre', category.name)}
              {detailField('Descripción', category.description)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" gap="0.75rem" w="100%">
              {canDeleteCategorys && (
                <GenericDelete
                  item={{ id: category.id, name: category.name }}
                  useDeleteHook={useDeleteCategory}
                  setItems={setCategorys}
                  onDeleted={onClose}
                />
              )}
              {canEditCategorys && (
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
                  Editar categoría
                </Button>
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* {isEditOpen && (
        <CategoryEdit isOpen={isEditOpen} onClose={closeEdit} category={category} setCategorys={setCategorys} />
      )} */}
    </>
  );
};
