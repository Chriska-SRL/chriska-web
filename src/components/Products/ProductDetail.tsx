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
  HStack,
  SimpleGrid,
  Divider,
  Flex,
} from '@chakra-ui/react';
import {
  FiEye,
  FiHash,
  FiBarChart2,
  FiPackage,
  FiDollarSign,
  FiGrid,
  FiFileText,
  FiTag,
  FiThermometer,
  FiBox,
  FiTruck,
  FiImage,
} from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Product } from '@/entities/product';
import { ProductEdit } from './ProductEdit';
import { ProductImageUpload } from './ProductImageUpload';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteProduct } from '@/hooks/product';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useState } from 'react';
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
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverBorderColor = useColorModeValue('gray.300', 'whiteAlpha.400');
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

  const detailField = (label: string, value: string | number | null | undefined, icon?: any, onClick?: () => void) => (
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
        minH="2.5rem"
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
        size="md"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'xl' }} isCentered>
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
            Detalle del producto
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="1rem">
                <Box>
                  <HStack mb="0.5rem" spacing="0.5rem">
                    <Icon as={FiImage} boxSize="1rem" color={iconColor} />
                    <Text color={labelColor} fontWeight="semibold">
                      Imagen del producto
                    </Text>
                  </HStack>
                  <Flex justifyContent="center" alignItems="center" aspectRatio="1" borderRadius="md">
                    <ProductImageUpload product={product} editable={false} />
                  </Flex>
                </Box>

                <VStack spacing="2rem" align="stretch">
                  {detailField('Código interno', product.internalCode, FiHash)}
                  {detailField('Código de barras', product.barcode, FiBarChart2)}
                  {detailField('Nombre', product.name, FiPackage)}
                </VStack>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Precio', `$${product.price}`, FiDollarSign)}
                {detailField('Unidad', getUnitTypeLabel(product.unitType), FiGrid)}
              </SimpleGrid>

              {detailField('Descripción', product.description, FiFileText)}

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Marca', product.brand.name, FiTag, () => {
                  handleClose();
                  router.push(`/marcas?open=${product.brand.id}`);
                })}
                {detailField(
                  'Condición de temperatura',
                  getTemperatureConditionLabel(product.temperatureCondition),
                  FiThermometer,
                )}
              </SimpleGrid>

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Categoría', product.subCategory.category.name, FiGrid, () => {
                  handleClose();
                  router.push(`/categorias?open=${product.subCategory.category.id}&type=category`);
                })}
                {detailField('Subcategoría', product.subCategory.name, FiGrid, () => {
                  handleClose();
                  router.push(`/categorias?open=${product.subCategory.id}&type=subcategory`);
                })}
              </SimpleGrid>

              {product.shelve && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                  {detailField('Depósito', product.shelve.warehouse.name, FiBox, () => {
                    handleClose();
                    router.push(`/depositos?open=${product.shelve.warehouse.id}`);
                  })}
                  {detailField('Estantería', product.shelve.name, FiBox)}
                </SimpleGrid>
              )}

              <Divider />

              {product.suppliers && product.suppliers.length > 0 && (
                <Box>
                  <HStack mb="0.5rem" spacing="0.5rem">
                    <Icon as={FiTruck} boxSize="1rem" color={iconColor} />
                    <Text fontSize="lg" fontWeight="bold" color={labelColor}>
                      Proveedores
                    </Text>
                  </HStack>
                  <Box
                    px="1rem"
                    py="0.75rem"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={inputBorder}
                    borderRadius="md"
                    maxH="200px"
                    overflowY="auto"
                  >
                    <VStack spacing="0.5rem" align="stretch">
                      {product.suppliers.map((supplier) => (
                        <Box
                          key={supplier.id}
                          p="0.5rem"
                          bg="whiteAlpha.50"
                          borderRadius="md"
                          cursor="pointer"
                          _hover={{
                            bg: hoverBg,
                          }}
                          onClick={() => {
                            handleClose();
                            router.push(`/proveedores?open=${supplier.id}`);
                          }}
                          transition="all 0.2s"
                          position="relative"
                        >
                          <Text fontSize="sm" fontWeight="medium">
                            {supplier.name}
                          </Text>
                          <Icon
                            as={FiEye}
                            position="absolute"
                            right="0.5rem"
                            top="50%"
                            transform="translateY(-50%)"
                            boxSize="0.875rem"
                            color={iconColor}
                          />
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              )}

              <Divider />

              {detailField('Observaciones', product.observations, FiFileText)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <VStack spacing="0.5rem" w="100%">
              <Button
                w="100%"
                leftIcon={!isNavigating ? <FiBox /> : undefined}
                onClick={() => {
                  setIsNavigating(true);
                  handleClose();
                  router.push(`/movimientos-de-stock?product=${product.id}`);
                }}
                colorScheme="green"
                variant="outline"
                size="sm"
                isLoading={isNavigating}
                loadingText="Redirigiendo..."
                disabled={isNavigating}
              >
                Registrar movimiento de stock
              </Button>
              <HStack spacing="0.5rem" w="100%">
                {canDeleteProducts && (
                  <GenericDelete
                    item={{ id: product.id, name: product.name }}
                    useDeleteHook={useDeleteProduct}
                    setItems={setProducts}
                    onDeleted={handleClose}
                    size="sm"
                    variant="outline"
                  />
                )}
                {canEditProducts && (
                  <Button
                    leftIcon={<FaEdit />}
                    onClick={() => {
                      openEdit();
                      handleClose();
                    }}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    flex="1"
                  >
                    Editar
                  </Button>
                )}
              </HStack>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ProductEdit isOpen={isEditOpen} onClose={closeEdit} product={product} setProducts={setProducts} />
    </>
  );
};
