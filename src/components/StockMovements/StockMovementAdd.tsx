'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
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
import { useGetProducts } from '@/hooks/product';
import { useUserStore } from '@/stores/useUserStore';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { StockMovementTypeOptions } from '@/enums/stockMovementType.enum';

type StockMovementAddProps = {
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
};

type StockMovementAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const StockMovementAddModal = ({ isOpen, onClose, setStockMovements }: StockMovementAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');

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
  const { data: products, isLoading: isLoadingProducts } = useGetProducts(1, 10, productFilters);

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
    setMovementProps(undefined);
    setProductSearch('');
    setSelectedProduct(null);
    setShowProductDropdown(false);
    onClose();
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
      setMovementProps(undefined);
      setStockMovements((prev) => [...prev, data]);
      setProductSearch('');
      setSelectedProduct(null);
      setShowProductDropdown(false);
      onClose();
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
    <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'lg' }} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxH="90vh" display="flex" flexDirection="column">
        <ModalHeader
          textAlign="center"
          fontSize="1.5rem"
          flexShrink={0}
          borderBottom="1px solid"
          borderColor={inputBorder}
        >
          Nuevo movimiento
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
          <Formik
            initialValues={{
              date: '',
              quantity: 0,
              type: '',
              reason: '',
              productId: '',
            }}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleSubmit, setFieldValue }) => (
              <form id="stockmovement-add-form" onSubmit={handleSubmit}>
                <VStack spacing="1rem" align="stretch">
                  <Field name="date" validate={validateEmpty}>
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiCalendar} boxSize="1rem" />
                            <Text>Fecha</Text>
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
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="quantity" validate={(v: any) => (!v || v <= 0 ? 'Debe ser mayor a cero' : undefined)}>
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiHash} boxSize="1rem" />
                            <Text>Cantidad</Text>
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
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="type" validate={validate}>
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiTag} boxSize="1rem" />
                            <Text>Tipo</Text>
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
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <FormControl>
                    <FormLabel fontWeight="semibold">
                      <HStack spacing="0.5rem">
                        <Icon as={FiPackage} boxSize="1rem" />
                        <Text>Producto</Text>
                      </HStack>
                    </FormLabel>
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
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" />
                            <Text>Razón</Text>
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
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </VStack>
              </form>
            )}
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
  );
};

// Componente principal que controla la apertura del modal
export const StockMovementAdd = ({ setStockMovements }: StockMovementAddProps) => {
  const canCreateStockMovements = useUserStore((s) => s.hasPermission(Permission.CREATE_STOCK_MOVEMENTS));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateStockMovements) return null;

  return (
    <>
      <Button bg={buttonBg} _hover={{ bg: buttonHover }} leftIcon={<FaPlus />} onClick={onOpen} px="1.5rem">
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <StockMovementAddModal isOpen={isOpen} onClose={onClose} setStockMovements={setStockMovements} />}
    </>
  );
};
