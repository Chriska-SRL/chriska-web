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
  Icon,
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Product } from '@/entities/product';
import { ProductEdit } from './ProductEdit';
import { ProductImageUpload } from './ProductImageUpload';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteProduct } from '@/hooks/product';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getUnitTypeLabel } from '@/enums/unitType.enum';
import { getTemperatureConditionLabel } from '@/enums/temperatureCondition';

type ProductDetailProps = {
  product: Product;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
};

export const ProductDetail = ({ product, setProducts, forceOpen, onModalClose }: ProductDetailProps) => {
  const canEditProducts = useUserStore((s) => s.hasPermission(Permission.EDIT_PRODUCTS));
  const canDeleteProducts = useUserStore((s) => s.hasPermission(Permission.DELETE_PRODUCTS));

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverBorderColor = useColorModeValue('gray.300', 'whiteAlpha.400');
  const supplierSubtextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const handleClose = () => {
    onClose();
    onModalClose?.();
  };

  const detailField = (label: string, value: string | number | null | undefined, onClick?: () => void) => (
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
                bg: hoverBg,
                borderColor: hoverBorderColor,
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
        <ModalContent mx="auto" borderRadius="lg" maxH="90dvh" display="flex" flexDirection="column">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0" flexShrink={0}>
            Detalle del producto
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            pb="0"
            flex="1"
            maxH="calc(90dvh - 200px)"
            overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <VStack spacing="0.75rem">
              <ProductImageUpload product={product} editable={false} />
              {detailField('Código interno', product.internalCode)}
              {detailField('Código de barras', product.barcode)}
              {detailField('Nombre', product.name)}
              {detailField('Precio', product.price)}
              {detailField('Unidad', getUnitTypeLabel(product.unitType))}
              {detailField('Descripción', product.description)}
              {detailField('Marca', product.brand.name, () => {
                handleClose();
                router.push(`/marcas?open=${product.brand.id}`);
              })}
              {detailField('Condición de temperatura', getTemperatureConditionLabel(product.temperatureCondition))}
              {detailField('Observaciones', product.observations)}
              {detailField('Categoría', product.subCategory.category.name, () => {
                handleClose();
                router.push(`/categorias?open=${product.subCategory.category.id}&type=category`);
              })}
              {detailField('Subcategoría', product.subCategory.name, () => {
                handleClose();
                router.push(`/categorias?open=${product.subCategory.id}&type=subcategory`);
              })}
              {product.shelve && (
                <>
                  {detailField('Depósito', product.shelve.warehouse.name, () => {
                    handleClose();
                    router.push(`/depositos?open=${product.shelve.warehouse.id}`);
                  })}
                  {detailField('Estantería', product.shelve.name)}
                </>
              )}
              {product.suppliers && product.suppliers.length > 0 && (
                <Box w="100%">
                  <Text color={labelColor} mb="0.5rem">
                    Proveedores
                  </Text>
                  <VStack spacing="0.5rem" align="stretch">
                    {product.suppliers.map((supplier) => (
                      <Box
                        key={supplier.id}
                        px="1rem"
                        py="0.5rem"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="md"
                        cursor="pointer"
                        _hover={{
                          bg: hoverBg,
                          borderColor: hoverBorderColor,
                        }}
                        onClick={() => {
                          handleClose();
                          router.push(`/proveedores?open=${supplier.id}`);
                        }}
                        transition="all 0.2s"
                        position="relative"
                      >
                        <Text>{supplier.name}</Text>
                        <Icon
                          as={FiEye}
                          position="absolute"
                          right="1rem"
                          top="50%"
                          transform="translateY(-50%)"
                          boxSize="1rem"
                        />
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem" flexShrink={0}>
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
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
                Registrar movimiento
              </Button>
              {canEditProducts && (
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
              {canDeleteProducts && (
                <GenericDelete
                  item={{ id: product.id, name: product.name }}
                  useDeleteHook={useDeleteProduct}
                  setItems={setProducts}
                  onDeleted={handleClose}
                />
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <ProductEdit isOpen={isEditOpen} onClose={closeEdit} product={product} setProducts={setProducts} />
      )}
    </>
  );
};
