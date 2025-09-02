'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  VStack,
  Box,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  List,
  ListItem,
  HStack,
  Image,
  Spinner,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { FiCalendar, FiHash, FiTag, FiPackage, FiFileText } from 'react-icons/fi';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { StockMovement } from '@/entities/stockMovement';
import { useAddStockMovement } from '@/hooks/stockMovement';
import { useGetProducts, useGetProductById } from '@/hooks/product';
import { useUserStore } from '@/stores/useUserStore';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { StockMovementTypeOptions } from '@/enums/stockMovementType.enum';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type StockMovementAddProps = {
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  preselectedProductId?: number;
  onModalClose?: () => void;
};

type StockMovementAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  preselectedProductId?: number;
  onModalClose?: () => void;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const StockMovementAddModal = ({
  isOpen,
  onClose,
  setStockMovements,
  preselectedProductId,
  onModalClose,
}: StockMovementAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  // Verificar permiso para mostrar el campo de fecha
  const canSetCustomDate = useUserStore((s) => s.hasPermission(Permission.CREATE_PRODUCT_WITHDATE));

  // Hook para obtener el producto preseleccionado
  const { data: preselectedProduct } = useGetProductById(preselectedProductId);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError, mutate } = useAddStockMovement();

  // Estados para la búsqueda de productos
  const [productSearch, setProductSearch] = useState('');
  const [productSearchType, setProductSearchType] = useState<'name' | 'internalCode' | 'barcode'>('name');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: number; name: string } | null>(null);
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Usar el hook de debounce
  const debouncedProductSearch = useDebounce(productSearch, 500);

  const productFilters = React.useMemo(() => {
    if (!debouncedProductSearch || debouncedProductSearch.length < 2) return undefined;

    return {
      ...(productSearchType === 'name' && { name: debouncedProductSearch }),
      ...(productSearchType === 'internalCode' && { internalCode: debouncedProductSearch }),
      ...(productSearchType === 'barcode' && { barcode: debouncedProductSearch }),
    };
  }, [debouncedProductSearch, productSearchType]);

  // Solo hacer la llamada si tenemos filtros válidos
  const { data: products, isLoading: isLoadingProducts } = useGetProducts(1, 10, productFilters);

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingProducts && debouncedProductSearch && debouncedProductSearch.length >= 2) {
      setLastSearchTerm(debouncedProductSearch);
    }
  }, [isLoadingProducts, debouncedProductSearch]);

  // Efecto para preseleccionar el producto cuando se abre el modal
  useEffect(() => {
    if (isOpen && preselectedProduct) {
      setSelectedProduct({ id: preselectedProduct.id, name: preselectedProduct.name });
      setProductSearch(preselectedProduct.name);
    }
  }, [isOpen, preselectedProduct]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductSearch = useCallback(
    (value: string) => {
      setProductSearch(value);

      // Mostrar dropdown inmediatamente si hay contenido para mejor UX
      setShowProductDropdown(value.length >= 2);

      // Solo limpiar el ProductId si el usuario está escribiendo algo diferente
      if (selectedProduct && value !== selectedProduct.name) {
        setSelectedProduct(null);
      }
    },
    [selectedProduct],
  );

  const handleProductSelect = (product: { id: number; name: string }, setFieldValue: any) => {
    setSelectedProduct(product);
    setProductSearch(product.name);
    setShowProductDropdown(false);
    setFieldValue('productId', product.id.toString());
  };

  const handleClearProductSearch = (setFieldValue: any) => {
    setProductSearch('');
    setSelectedProduct(null);
    setShowProductDropdown(false);
    setFieldValue('productId', '');
  };

  const handleClose = () => {
    setProductSearch('');
    setSelectedProduct(null);
    setShowProductDropdown(false);
    setShowConfirmDialog(false);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
    onClose();
    onModalClose?.();
  };

  const handleOverlayClick = () => {
    if (formikInstance && formikInstance.dirty) {
      setShowConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    if (data) {
      toast({
        title: 'Movimiento creado',
        description: 'El movimiento se ha registrado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setStockMovements((prev) => [...prev, data]);
      setProductSearch('');
      setSelectedProduct(null);
      setShowProductDropdown(false);
      onClose();
      onModalClose?.();
    }
  }, [data, setStockMovements, toast, onClose]);

  useEffect(() => {
    if (fieldError) {
      toast({
        title: 'Error',
        description: fieldError.error,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } else if (error) {
      toast({
        title: 'Error inesperado',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, fieldError, toast]);

  const handleSubmit = async (values: {
    date: string;
    quantity: number;
    type: string;
    reason: string;
    productId: string;
  }) => {
    const movementData: any = {
      quantity: values.quantity,
      type: values.type,
      reason: values.reason,
      productId: Number(values.productId),
    };

    // Solo incluir la fecha si el usuario tiene permiso para establecerla
    if (canSetCustomDate) {
      movementData.date = values.date;
    }

    await mutate(movementData);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'lg' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleOverlayClick}
      >
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
            Nuevo movimiento
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                date: '',
                quantity: 0,
                type: '',
                reason: '',
                productId: preselectedProductId ? preselectedProductId.toString() : '',
              }}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, setFieldValue, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="stockmovement-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      {canSetCustomDate && (
                        <Field name="date" validate={canSetCustomDate ? validateEmpty : undefined}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.date && !!errors.date}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiCalendar} boxSize="1rem" />
                                  <Text>Fecha</Text>
                                  <Text color="red.500">*</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                type="date"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{errors.date}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      )}

                      <Field
                        name="quantity"
                        validate={(v: any) => (!v || v <= 0 ? 'Debe ser mayor a cero' : undefined)}
                      >
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.quantity && !!errors.quantity}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiHash} boxSize="1rem" />
                                <Text>Cantidad</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Ingrese la cantidad"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.quantity}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="type" validate={validate}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.type && !!errors.type}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiTag} boxSize="1rem" />
                                <Text>Tipo</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              {...field}
                              placeholder="Seleccionar un tipo"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            >
                              {StockMovementTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{errors.type}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiPackage} boxSize="1rem" />
                            <Text>Producto</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Box position="relative" ref={searchRef}>
                          <Input
                            as={Box}
                            display="flex"
                            bg={inputBg}
                            borderRadius="md"
                            overflow="hidden"
                            borderWidth="1px"
                            borderColor={inputBorder}
                            disabled={isLoading}
                            p={0}
                          >
                            <Select
                              value={productSearchType}
                              onChange={(e) =>
                                setProductSearchType(e.target.value as 'name' | 'internalCode' | 'barcode')
                              }
                              bg="transparent"
                              border="none"
                              w="auto"
                              minW={{ base: '4.5rem', md: '7.5rem' }}
                              maxW={{ base: '5rem', md: '8.5rem' }}
                              borderRadius="none"
                              _focus={{ boxShadow: 'none' }}
                              disabled={isLoading}
                              fontSize={{ base: 'sm', md: 'md' }}
                            >
                              <option value="name">Nombre</option>
                              <option value="internalCode">Cód. interno</option>
                              <option value="barcode">Cód. de barras</option>
                            </Select>

                            <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

                            <InputGroup flex="1">
                              <Input
                                placeholder="Buscar producto..."
                                value={productSearch}
                                onChange={(e) => handleProductSearch(e.target.value)}
                                bg="transparent"
                                border="none"
                                borderRadius="none"
                                _focus={{ boxShadow: 'none' }}
                                pl="1rem"
                                disabled={isLoading}
                                onFocus={() => productSearch && setShowProductDropdown(true)}
                              />
                              <InputRightElement>
                                {selectedProduct ? (
                                  <IconButton
                                    aria-label="Limpiar búsqueda"
                                    icon={<Text fontSize="sm">✕</Text>}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleClearProductSearch(setFieldValue)}
                                    _hover={{}}
                                  />
                                ) : (
                                  <IconButton
                                    aria-label="Buscar"
                                    icon={<AiOutlineSearch size="1.25rem" />}
                                    size="sm"
                                    variant="ghost"
                                    disabled={isLoading}
                                    _hover={{}}
                                  />
                                )}
                              </InputRightElement>
                            </InputGroup>
                          </Input>

                          {showProductDropdown && (
                            <Box
                              position="absolute"
                              top="100%"
                              left={0}
                              right={0}
                              mt={1}
                              bg={dropdownBg}
                              border="1px solid"
                              borderColor={dropdownBorder}
                              borderRadius="md"
                              boxShadow="lg"
                              maxH="300px"
                              overflowY="auto"
                              zIndex={20}
                            >
                              {(() => {
                                // Estados del dropdown:
                                // 1. Usuario está escribiendo (debounce en progreso)
                                const isTyping = productSearch !== debouncedProductSearch && productSearch.length >= 2;
                                // 2. Esperando resultados de la API
                                const isSearching =
                                  !isTyping && isLoadingProducts && debouncedProductSearch.length >= 2;
                                // 3. Mostrar resultados o mensaje de no encontrado (solo si la búsqueda está completa)
                                const searchCompleted =
                                  !isTyping &&
                                  !isSearching &&
                                  debouncedProductSearch.length >= 2 &&
                                  lastSearchTerm === debouncedProductSearch;

                                if (isTyping || isSearching) {
                                  return (
                                    <Flex p={3} justify="center" align="center" gap={2}>
                                      <Spinner size="sm" />
                                      <Text fontSize="sm" color="gray.500">
                                        Buscando productos...
                                      </Text>
                                    </Flex>
                                  );
                                }

                                if (searchCompleted && products?.length > 0) {
                                  return (
                                    <List>
                                      {products.map((product) => (
                                        <ListItem
                                          key={product.id}
                                          cursor="pointer"
                                          _hover={{ bg: hoverBg }}
                                          onClick={() =>
                                            handleProductSelect({ id: product.id, name: product.name }, setFieldValue)
                                          }
                                          transition="background-color 0.2s ease"
                                        >
                                          <HStack p={3} spacing={4} align="center">
                                            <Image
                                              src={
                                                product.imageUrl ||
                                                'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                              }
                                              alt={product.name}
                                              w="50px"
                                              h="50px"
                                              objectFit="cover"
                                              borderRadius="md"
                                              flexShrink={0}
                                            />
                                            <VStack align="flex-start" spacing={1} flex="1" minW={0}>
                                              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                                {product.name}
                                              </Text>
                                              {product.internalCode && (
                                                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                                  Cód. Interno: {product.internalCode}
                                                </Text>
                                              )}
                                              {product.barcode && (
                                                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                                  Cód. Barras: {product.barcode}
                                                </Text>
                                              )}
                                            </VStack>
                                          </HStack>
                                        </ListItem>
                                      ))}
                                    </List>
                                  );
                                }

                                if (searchCompleted && products?.length === 0) {
                                  return (
                                    <Text p={3} fontSize="sm" color="gray.500">
                                      No se encontraron productos
                                    </Text>
                                  );
                                }

                                // Mientras esperamos que se complete la búsqueda, mostrar loading
                                if (debouncedProductSearch.length >= 2 && (!searchCompleted || isLoadingProducts)) {
                                  return (
                                    <Flex p={3} justify="center" align="center" gap={2}>
                                      <Spinner size="sm" />
                                      <Text fontSize="sm" color="gray.500">
                                        Buscando productos...
                                      </Text>
                                    </Flex>
                                  );
                                }

                                return null;
                              })()}
                            </Box>
                          )}
                        </Box>
                        <Field name="productId" validate={validate} style={{ display: 'none' }} />
                      </FormControl>

                      <Field name="reason" validate={validateEmpty}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.reason && !!errors.reason}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Razón</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese la razón del movimiento"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              rows={4}
                            />
                            <FormErrorMessage>{errors.reason}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </VStack>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm">
                Cancelar
              </Button>
              <Button
                form="stockmovement-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear movimiento
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClose}
      />
    </>
  );
};

// Componente principal que controla la apertura del modal
export const StockMovementAdd = ({ setStockMovements, preselectedProductId, onModalClose }: StockMovementAddProps) => {
  const canCreateStockMovements = useUserStore((s) => s.hasPermission(Permission.CREATE_STOCK_MOVEMENTS));
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Abrir automáticamente el modal si hay un producto preseleccionado
  useEffect(() => {
    if (preselectedProductId && canCreateStockMovements) {
      onOpen();
    }
  }, [preselectedProductId, canCreateStockMovements, onOpen]);

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateStockMovements) return null;

  return (
    <>
      <Button bg={buttonBg} _hover={{ bg: buttonHover }} leftIcon={<FaPlus />} onClick={onOpen} px="1.5rem">
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && (
        <StockMovementAddModal
          isOpen={isOpen}
          onClose={onClose}
          setStockMovements={setStockMovements}
          preselectedProductId={preselectedProductId}
          onModalClose={onModalClose}
        />
      )}
    </>
  );
};
