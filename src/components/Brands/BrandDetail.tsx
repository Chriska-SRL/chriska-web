'use brand';

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
import { Brand } from '@/entities/brand';
import { BrandEdit } from './BrandEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteBrand } from '@/hooks/brand';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

type BrandDetailProps = {
  brand: Brand;
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
};

export const BrandDetail = ({ brand, setBrands }: BrandDetailProps) => {
  const canEditBrands = useUserStore((s) => s.hasPermission(Permission.EDIT_PRODUCTS));
  const canDeleteBrands = useUserStore((s) => s.hasPermission(Permission.DELETE_PRODUCTS));

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

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Detalle de la marca
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="0" maxH="31rem" overflow="scroll" overflowX="hidden">
            <VStack spacing="0.75rem">
              {detailField('Nombre', brand.name)}
              {detailField('Descripción', brand.description)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              {canEditBrands && (
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
              {canDeleteBrands && (
                <GenericDelete
                  item={{ id: brand.id, name: brand.name }}
                  useDeleteHook={useDeleteBrand}
                  setItems={setBrands}
                  onDeleted={onClose}
                />
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && <BrandEdit isOpen={isEditOpen} onClose={closeEdit} brand={brand} setBrands={setBrands} />}
    </>
  );
};
