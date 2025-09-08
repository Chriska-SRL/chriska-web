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
  SimpleGrid,
  Divider,
  Flex,
  Stack,
} from '@chakra-ui/react';
import {
  FiInfo,
  FiHash,
  FiPackage,
  FiDollarSign,
  FiGrid,
  FiFileText,
  FiTag,
  FiThermometer,
  FiBox,
  FiTruck,
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

  const detailField = (
    label: string,
    value: string | number | null | undefined,
    icon?: any,
    expandable?: boolean,
    onClick?: () => void,
  ) => (
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
        h={expandable ? undefined : '2.5rem'}
        minH={expandable ? '2.5rem' : undefined}
        maxH={expandable ? '10rem' : undefined}
        overflowY={expandable ? 'auto' : 'hidden'}
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
        display={expandable ? undefined : 'flex'}
        alignItems={expandable ? undefined : 'center'}
      >
        {value && value !== '' ? value : '—'}
        {onClick && (
          <Icon as={FiInfo} position="absolute" right="1rem" top="50%" transform="translateY(-50%)" boxSize="1rem" />
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        aria-label="Ver detalle"
        icon={<FiInfo />}
        onClick={onOpen}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'full', md: 'xl' }} isCentered>
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

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <Flex direction={{ base: 'column', md: 'row' }} gap="1rem" align="start">
                <Box flexShrink={0} w={{ base: '100%', md: '10.5rem' }}>
                  <Box w="100%" aspectRatio="1" borderRadius="md">
                    <ProductImageUpload product={product} editable={false} />
                  </Box>
                </Box>

                <VStack spacing="1.5rem" align="stretch" flex="1" justify="start" w={{ base: '100%', md: 'auto' }}>
                  {detailField('Código interno', product.internalCode, FiPackage)}
                  {detailField('Código de barras', product.barcode, FiHash)}
                </VStack>
              </Flex>

              {detailField('Nombre', product.name, FiTag)}

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing="0.75rem">
                {detailField('Precio', `$${product.price}`, FiDollarSign)}
                {detailField('Unidad', getUnitTypeLabel(product.unitType), FiGrid)}
                {detailField('Peso estimado', product.estimatedWeight ? `${product.estimatedWeight}g` : '—', FiBox)}
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Marca', product.brand.name, FiTag, false, () => {
                  handleClose();
                  router.push(`/marcas?open=${product.brand.id}`);
                })}
                {detailField(
                  'Condición de temperatura',
                  getTemperatureConditionLabel(product.temperatureCondition),
                  FiThermometer,
                )}
              </SimpleGrid>

              {detailField('Descripción', product.description, FiFileText, true)}

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Stock total', product.stock?.toString() || '0', FiBox)}
                {detailField('Stock disponible', product.availableStock?.toString() || '0', FiBox)}
              </SimpleGrid>

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Categoría', product.subCategory.category.name, FiGrid, false, () => {
                  handleClose();
                  router.push(`/categorias?open=${product.subCategory.category.id}&type=category`);
                })}
                {detailField('Subcategoría', product.subCategory.name, FiGrid, false, () => {
                  handleClose();
                  router.push(`/categorias?open=${product.subCategory.id}&type=subcategory`);
                })}
              </SimpleGrid>

              {product.shelve && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                  {detailField('Depósito', product.shelve.warehouse.name, FiBox, false, () => {
                    handleClose();
                    router.push(`/depositos?open=${product.shelve.warehouse.id}`);
                  })}
                  {detailField('Estantería', product.shelve.name, FiBox)}
                </SimpleGrid>
              )}

              <Divider />

              <Box>
                <HStack mb="0.5rem" spacing="0.5rem">
                  <Icon as={FiTruck} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Proveedores
                  </Text>
                </HStack>
                {product.suppliers && product.suppliers.length > 0 ? (
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
                        minH="3.5rem"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        cursor="pointer"
                        _hover={{
                          bg: hoverBg,
                        }}
                        onClick={() => {
                          handleClose();
                          router.push(`/proveedores?open=${supplier.id}`);
                        }}
                        transition="all 0.2s"
                      >
                        <VStack align="start" flex="1" spacing="0">
                          <Text fontSize="sm" fontWeight="medium">
                            {supplier.name}
                          </Text>
                          <Text fontSize="xs" color={iconColor}>
                            {supplier.contactName} - {supplier.phone}
                          </Text>
                        </VStack>
                        <Icon as={FiInfo} boxSize="0.875rem" color={iconColor} />
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Box
                    px="1rem"
                    py="0.75rem"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={inputBorder}
                    borderRadius="md"
                    textAlign="center"
                  >
                    <Text fontSize="sm" color={iconColor}>
                      No hay proveedores asociados a este producto
                    </Text>
                  </Box>
                )}
              </Box>

              <Divider />

              {detailField('Observaciones', product.observations, FiFileText, true)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <Stack
              direction={{ base: 'column-reverse', md: 'row' }}
              spacing="0.5rem"
              w="100%"
              align="stretch"
              justify={{ base: 'stretch', md: 'flex-end' }}
            >
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Cerrar
              </Button>
              <Button
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
                Registrar movimiento
              </Button>
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
                >
                  Editar
                </Button>
              )}
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <ProductEdit isOpen={isEditOpen} onClose={closeEdit} product={product} setProducts={setProducts} />
      )}
    </>
  );
};
