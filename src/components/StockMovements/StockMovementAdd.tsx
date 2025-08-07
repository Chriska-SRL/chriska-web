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
  Progress,
  Box,
  ModalCloseButton,
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
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { StockMovement } from '@/entities/stockMovement';
import { useAddStockMovement } from '@/hooks/stockMovement';
import { useGetProducts } from '@/hooks/product';
import { useUserStore } from '@/stores/useUserStore';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { StockMovementTypeOptions } from '@/enums/stockMovementType.enum';

type StockMovementAddProps = {
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
};

export const StockMovementAdd = ({ setStockMovements }: StockMovementAddProps) => {
  const canCreateStockMovements = useUserStore((s) => s.hasPermission(Permission.CREATE_STOCK_MOVEMENTS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [movementProps, setMovementProps] = useState<Partial<StockMovement>>();
  const { data, isLoading, error, fieldError } = useAddStockMovement(movementProps as any);

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
  const shouldFetchProducts = productFilters !== undefined;
  const { data: products, isLoading: isLoadingProducts } = useGetProducts(
    1, 
    10, 
    shouldFetchProducts ? productFilters : undefined
  );

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingProducts && debouncedProductSearch && debouncedProductSearch.length >= 2) {
      setLastSearchTerm(debouncedProductSearch);
    }
  }, [isLoadingProducts, debouncedProductSearch]);

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
    [selectedProduct]
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

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Movimiento creado',
        description: 'El movimiento se ha registrado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setMovementProps(undefined);
      setStockMovements((prev) => [...prev, data]);
      // Limpiar la búsqueda de productos al cerrar
      setProductSearch('');
      setSelectedProduct(null);
      setShowProductDropdown(false);
      onClose();
    }
  }, [data]);

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
  }, [error, fieldError]);


  const handleSubmit = (values: {
    date: string;
    quantity: number;
    type: string;
    reason: string;
    productId: string;
  }) => {
    setMovementProps({
      date: values.date,
      quantity: values.quantity,
      type: values.type,
      reason: values.reason,
      productId: Number(values.productId),
    } as any);
  };

  return (
    <>
      {canCreateStockMovements && (
        <Button bg={buttonBg} _hover={{ bg: buttonHover }} leftIcon={<FaPlus />} onClick={onOpen} px="1.5rem">
          Nuevo
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nuevo movimiento
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              date: '',
              quantity: 0,
              type: '',
              reason: '',
              productId: '',
            }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0" maxH="70dvh" overflowY="auto">
                  <VStack spacing="0.75rem">
                    <FormControl isInvalid={submitCount > 0 && touched.date && !!errors.date}>
                      <FormLabel>Fecha</FormLabel>
                      <Field
                        as={Input}
                        name="date"
                        type="date"
                        bg={inputBg}
                        borderColor={inputBorder}
                        validate={validateEmpty}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.date}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.quantity && !!errors.quantity}>
                      <FormLabel>Cantidad</FormLabel>
                      <Field
                        as={Input}
                        name="quantity"
                        type="number"
                        bg={inputBg}
                        borderColor={inputBorder}
                        validate={(v: any) => (!v || v <= 0 ? 'Debe ser mayor a cero' : undefined)}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.quantity}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.type && !!errors.type}>
                      <FormLabel>Tipo</FormLabel>
                      <Field
                        as={Select}
                        name="type"
                        placeholder="Seleccionar un tipo"
                        bg={inputBg}
                        borderColor={inputBorder}
                        validate={validate}
                        disabled={isLoading}
                      >
                        {StockMovementTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      <FormErrorMessage>{errors.type}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.productId && !!errors.productId}>
                      <FormLabel>Producto</FormLabel>
                      <Box position="relative" ref={searchRef}>
                        <Box
                          display="flex"
                          bg={isLoading ? disabledColor : inputBg}
                          borderRadius="md"
                          overflow="hidden"
                          borderWidth="1px"
                          borderColor={isLoading ? disabledColor : inputBorder}
                        >
                          <Select
                            value={productSearchType}
                            onChange={(e) => setProductSearchType(e.target.value as 'name' | 'internalCode' | 'barcode')}
                            bg="transparent"
                            border="none"
                            color={textColor}
                            w="auto"
                            minW="5rem"
                            maxW="6rem"
                            borderRadius="none"
                            _focus={{ boxShadow: 'none' }}
                            disabled={isLoading}
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
                              _placeholder={{ color: textColor }}
                              color={textColor}
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
                                  color={textColor}
                                  _hover={{}}
                                />
                              ) : (
                                <IconButton
                                  aria-label="Buscar"
                                  icon={<AiOutlineSearch size="1.25rem" />}
                                  size="sm"
                                  variant="ghost"
                                  disabled={isLoading}
                                  color={textColor}
                                  _hover={{}}
                                />
                              )}
                            </InputRightElement>
                          </InputGroup>
                        </Box>
                        
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
                              const isSearching = !isTyping && isLoadingProducts && debouncedProductSearch.length >= 2;
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
                                        onClick={() => handleProductSelect({ id: product.id, name: product.name }, setFieldValue)}
                                        transition="background-color 0.2s ease"
                                      >
                                        <HStack p={3} spacing={4} align="center">
                                          <Image
                                            src={product.imageUrl || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
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
                      <FormErrorMessage>{errors.productId}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.reason && !!errors.reason}>
                      <FormLabel>Razón</FormLabel>
                      <Field
                        as={Textarea}
                        name="reason"
                        bg={inputBg}
                        borderColor={inputBorder}
                        validate={validateEmpty}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.reason}</FormErrorMessage>
                    </FormControl>

                  </VStack>
                </ModalBody>

                <ModalFooter pb="1.5rem">
                  <Box mt="0.5rem" w="100%">
                    <Progress
                      h={isLoading ? '4px' : '1px'}
                      mb="1.5rem"
                      size="xs"
                      isIndeterminate={isLoading}
                      colorScheme="blue"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      bg={submitBg}
                      color="white"
                      _hover={{ backgroundColor: submitHover }}
                      width="100%"
                      leftIcon={<FaCheck />}
                      py="1.375rem"
                    >
                      Confirmar
                    </Button>
                  </Box>
                </ModalFooter>
              </form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
