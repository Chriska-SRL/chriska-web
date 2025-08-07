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
import { Category } from '@/entities/category';

import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteSubCategory } from '@/hooks/subcategory';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { SubCategory } from '@/entities/subcategory';
import { SubCategoryEdit } from './SubCategoryEdit';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const handleClose = () => {
    onClose();
    onModalClose?.();
  };

  const onDeleted = () => {
    onClose();
    if (onSubcategoryDeleted) {
      onSubcategoryDeleted();
    } else {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === subcategory.category.id
            ? {
                ...cat,
                subCategories: cat.subCategories.filter((sub) => sub.id !== subcategory.id),
              }
            : cat,
        ),
      );
    }
  };

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

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0">
            Detalle de la subcategoría
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
              {detailField('Nombre', subcategory.name)}
              {detailField('Descripción', subcategory.description)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              {canEditCategories && (
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
              {canDeleteCategories && (
                <GenericDelete
                  item={{ id: subcategory.id, name: subcategory.name }}
                  useDeleteHook={useDeleteSubCategory}
                  setItems={() => {}}
                  onDeleted={onDeleted}
                />
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <SubCategoryEdit
          isOpen={isEditOpen}
          onClose={closeEdit}
          subcategory={subcategory}
          setCategories={setCategories}
        />
      )}
    </>
  );
};
