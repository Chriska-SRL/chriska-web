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
import { FiEye, FiTag, FiFileText, FiGrid } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Category } from '@/entities/category';
import { useDeleteSubCategory } from '@/hooks/subcategory';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { SubCategory } from '@/entities/subcategory';
import { SubCategoryEdit } from './SubCategoryEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useEffect, useCallback } from 'react';

type SubCategoryDetailProps = {
  subcategory: SubCategory;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
  onSubcategoryDeleted?: () => void;
};

export const SubCategoryDetail = ({
  subcategory,
  setCategories,
  forceOpen,
  onModalClose,
  onSubcategoryDeleted,
}: SubCategoryDetailProps) => {
  const canEditCategories = useUserStore((s) => s.hasPermission(Permission.EDIT_CATEGORIES));
  const canDeleteCategories = useUserStore((s) => s.hasPermission(Permission.DELETE_CATEGORIES));

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

  const handleSubcategoryDeleted = useCallback(() => {
    if (onSubcategoryDeleted) {
      onSubcategoryDeleted();
    } else {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === subcategory.category?.id
            ? {
                ...cat,
                subCategories: cat.subCategories.filter((sub) => sub.id !== subcategory.id),
              }
            : cat,
        ),
      );
    }
    handleClose();
  }, [onSubcategoryDeleted, setCategories, subcategory.category?.id, subcategory.id, handleClose]);

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
        aria-label="Ver detalles"
        icon={<FiEye />}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
        onClick={onOpen}
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
            Detalle de la subcategoría
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {detailField('Categoría', subcategory.category?.name, FiGrid)}
              {detailField('Nombre', subcategory.name, FiTag)}
              {detailField('Descripción', subcategory.description, FiFileText)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              {canDeleteCategories && (
                <GenericDelete
                  item={{ id: subcategory.id, name: subcategory.name }}
                  useDeleteHook={useDeleteSubCategory}
                  setItems={() => {}}
                  onDeleted={handleSubcategoryDeleted}
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

      <SubCategoryEdit
        isOpen={isEditOpen}
        onClose={closeEdit}
        subcategory={subcategory}
        setCategories={setCategories}
      />
    </>
  );
};
