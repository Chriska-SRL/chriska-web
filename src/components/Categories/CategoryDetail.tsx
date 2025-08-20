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
import { FiEye, FiTag, FiFileText } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Category } from '@/entities/category';
import { CategoryEdit } from './CategoryEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteCategory } from '@/hooks/category';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useEffect, useCallback } from 'react';

type CategoryDetailProps = {
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
};

export const CategoryDetail = ({ category, setCategories, forceOpen, onModalClose }: CategoryDetailProps) => {
  const canEditCategories = useUserStore((s) => s.hasPermission(Permission.EDIT_CATEGORIES));
  const canDeleteCategories = useUserStore((s) => s.hasPermission(Permission.DELETE_CATEGORIES));

  if (!category) return null;

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

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'md' }} isCentered>
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
            Detalle de la categoría
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {detailField('Nombre', category?.name, FiTag)}
              {detailField('Descripción', category?.description, FiFileText)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Cerrar
              </Button>
              {canDeleteCategories && (
                <GenericDelete
                  item={{ id: category?.id || 0, name: category?.name || '' }}
                  useDeleteHook={useDeleteCategory}
                  setItems={setCategories}
                  onDeleted={handleClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditCategories && (
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

      <CategoryEdit isOpen={isEditOpen} onClose={closeEdit} category={category} setCategories={setCategories} />
    </>
  );
};
