'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  Text,
  HStack,
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Flex,
  Divider,
  Image,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { FiFileText, FiUsers } from 'react-icons/fi';
import { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { OrderRequest } from '@/entities/orderRequest';
import { useUpdateOrderRequest } from '@/hooks/orderRequest';
import { useGetClients } from '@/hooks/client';
import { useGetProducts } from '@/hooks/product';
import { getBestDiscount } from '@/services/discount';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type OrderRequestEditProps = {
  orderRequest: OrderRequest;
  isOpen: boolean;
  onClose: () => void;
  setOrderRequests: React.Dispatch<React.SetStateAction<OrderRequest[]>>;
};

export const OrderRequestEdit = ({ orderRequest, isOpen, onClose, setOrderRequests }: OrderRequestEditProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const [orderRequestProps, setOrderRequestProps] = useState<Partial<OrderRequest>>();

  // Estados para la búsqueda de clientes
  const [clientSearch, setClientSearch] = useState('');
  const [clientSearchType, setClientSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const [debouncedClientSearch, setDebouncedClientSearch] = useState(clientSearch);
  const [lastClientSearchTerm, setLastClientSearchTerm] = useState('');
  const clientSearchRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fieldError } = useUpdateOrderRequest(orderRequestProps);

  // Estados para la búsqueda de productos
  const [productSearch, setProductSearch] = useState('');
  const [productSearchType, setProductSearchType] = useState<'name' | 'internalCode' | 'barcode'>('name');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{
      id: number;
      name: string;
      price: number;
      imageUrl?: string;
      quantity: number;
      discount?: number;
      discountId?: string;
      minQuantityForDiscount?: number;
      isLoadingDiscount?: boolean;
    }>
  >([]);
  const [quantityInputs, setQuantityInputs] = useState<{ [key: number]: string }>({});
  const [debouncedProductSearch, setDebouncedProductSearch] = useState(productSearch);
  const [lastProductSearchTerm, setLastProductSearchTerm] = useState('');
  const productSearchRef = useRef<HTMLDivElement>(null);

  // Inicializar cliente seleccionado con el cliente actual del pedido
  useEffect(() => {
    if (orderRequest.client) {
      setSelectedClient({ id: orderRequest.client.id, name: orderRequest.client.name });
    }
  }, [orderRequest.client]);

  // Limpiar productos cuando el componente se cierra
  useEffect(() => {
    if (!isOpen) {
      setSelectedProducts([]);
    }
  }, [isOpen]);

  // Inicializar productos seleccionados con los productos del pedido
  useEffect(() => {
    const initializeProducts = async () => {
      if (orderRequest.productItems && selectedClient) {
        // Primero agregar productos con estado de carga
        const initialProducts = orderRequest.productItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.unitPrice,
          imageUrl: item.product.imageUrl,
          quantity: item.quantity,
          discount: 0,
          minQuantityForDiscount: undefined,
          isLoadingDiscount: true,
        }));
        setSelectedProducts(initialProducts);

        // Luego obtener descuentos reales para cada producto
        for (const item of orderRequest.productItems) {
          try {
            const bestDiscount = await getBestDiscount(item.product.id, selectedClient.id);
            setSelectedProducts((prev) =>
              prev.map((p) =>
                p.id === item.product.id
                  ? {
                      ...p,
                      discount: bestDiscount?.percentage || 0,
                      discountId: bestDiscount?.id || undefined,
                      minQuantityForDiscount: bestDiscount?.productQuantity || undefined,
                      isLoadingDiscount: false,
                    }
                  : p,
              ),
            );
          } catch (error) {
            console.error('Error getting best discount for product', item.product.id, error);
            setSelectedProducts((prev) =>
              prev.map((p) =>
                p.id === item.product.id
                  ? {
                      ...p,
                      discount: 0,
                      isLoadingDiscount: false,
                    }
                  : p,
              ),
            );
          }
        }
      }
    };

    if (orderRequest.productItems && selectedClient && selectedProducts.length === 0) {
      initializeProducts();
    }
  }, [orderRequest.productItems, selectedClient, selectedProducts.length]);

  // Debounce para búsqueda de clientes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClientSearch(clientSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [clientSearch]);

  // Debounce para búsqueda de productos
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [productSearch]);

  // Filtros de búsqueda de clientes
  const clientFilters = useMemo(() => {
    if (!debouncedClientSearch || debouncedClientSearch.length < 2) return undefined;
    const filters: any = {};
    switch (clientSearchType) {
      case 'name':
        filters.name = debouncedClientSearch;
        break;
      case 'rut':
        filters.rut = debouncedClientSearch;
        break;
      case 'razonSocial':
        filters.razonSocial = debouncedClientSearch;
        break;
      case 'contactName':
        filters.contactName = debouncedClientSearch;
        break;
    }
    return filters;
  }, [debouncedClientSearch, clientSearchType]);

  const actualClientFilters = debouncedClientSearch && debouncedClientSearch.length >= 2 ? clientFilters : undefined;

  const { isLoading: isLoadingClientsSearch } = useGetClients(1, 10, actualClientFilters);

  // Filtros de búsqueda de productos
  const productFilters = useMemo(() => {
    if (!debouncedProductSearch || debouncedProductSearch.length < 2) return undefined;
    const filters: any = {};
    switch (productSearchType) {
      case 'name':
        filters.name = debouncedProductSearch;
        break;
      case 'internalCode':
        filters.internalCode = debouncedProductSearch;
        break;
      case 'barcode':
        filters.barcode = debouncedProductSearch;
        break;
    }
    return filters;
  }, [debouncedProductSearch, productSearchType]);

  const actualProductFilters =
    debouncedProductSearch && debouncedProductSearch.length >= 2 ? productFilters : undefined;

  const { data: productsSearch = [], isLoading: isLoadingProductsSearch } = useGetProducts(1, 10, actualProductFilters);

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingClientsSearch && debouncedClientSearch && debouncedClientSearch.length >= 2) {
      setLastClientSearchTerm(debouncedClientSearch);
    }
  }, [isLoadingClientsSearch, debouncedClientSearch]);

  useEffect(() => {
    if (!isLoadingProductsSearch && debouncedProductSearch && debouncedProductSearch.length >= 2) {
      setLastProductSearchTerm(debouncedProductSearch);
    }
  }, [isLoadingProductsSearch, debouncedProductSearch]);

  // Funciones para manejar búsqueda de productos
  const handleProductSearch = (value: string) => {
    setProductSearch(value);
    if (value.length >= 2) {
      setShowProductDropdown(true);
    } else {
      setShowProductDropdown(false);
    }
  };

  const handleProductSelect = async (product: any) => {
    const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);
    if (!isAlreadySelected && selectedClient) {
      // Agregar inmediatamente el producto con estado de carga
      setSelectedProducts((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price || 0,
          imageUrl: product.imageUrl,
          quantity: 1.0,
          discount: 0,
          isLoadingDiscount: true,
        },
      ]);

      setProductSearch('');
      setShowProductDropdown(false);

      try {
        // Obtener el mejor descuento para este producto y cliente
        const bestDiscount = await getBestDiscount(product.id, selectedClient.id);

        // Actualizar el producto con el descuento obtenido
        setSelectedProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  discount: bestDiscount?.percentage || 0,
                  discountId: bestDiscount?.id || undefined,
                  minQuantityForDiscount: bestDiscount?.productQuantity || undefined,
                  isLoadingDiscount: false,
                }
              : p,
          ),
        );
      } catch (error) {
        console.error('Error getting best discount:', error);
        // Si hay error, quitar el estado de carga y mantener sin descuento
        setSelectedProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  discount: 0,
                  isLoadingDiscount: false,
                }
              : p,
          ),
        );
      }
    } else {
      setProductSearch('');
      setShowProductDropdown(false);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleProductQuantityChange = (productId: number, quantity: number) => {
    setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity } : p)));
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
      if (productSearchRef.current && !productSearchRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (data) {
      setOrderRequests((prev) => prev.map((or) => (or.id === orderRequest.id ? data : or)));
      toast({
        title: 'Pedido actualizado',
        description: 'El pedido ha sido actualizado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setOrderRequestProps(undefined);
      onClose();
    }
  }, [data, setOrderRequests, toast, onClose, orderRequest.id]);

  useEffect(() => {
    if (fieldError) {
      toast({
        title: 'Error',
        description: fieldError.error,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }, [fieldError, toast]);

  const initialValues: Partial<OrderRequest> = {
    ...orderRequest,
    productItems: orderRequest.productItems || [],
  };

  const handleSubmit = async (values: Partial<OrderRequest>) => {
    const orderRequestData = {
      id: orderRequest.id,
      observations: values.observations,
      clientId: selectedClient?.id,
      productItems: selectedProducts.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    } as any;

    setOrderRequestProps(orderRequestData);
  };

  const handleClose = () => {
    if (formikInstance && formikInstance.dirty) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: '2xl' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleClose}
        scrollBehavior="inside"
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
            Editar pedido #{orderRequest.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validate={() => {
                const errors: any = {};

                if (!selectedClient?.id) {
                  errors.client = 'El cliente es requerido';
                }

                if (!selectedProducts || selectedProducts.length === 0) {
                  errors.productItems = 'Debe agregar al menos un producto';
                }

                return errors;
              }}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {(formik) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty: formik.dirty, resetForm: formik.resetForm });
                }, [formik.dirty, formik.resetForm]);

                // Revalidar cuando cambian los productos seleccionados o el cliente
                useEffect(() => {
                  if (formik.submitCount > 0) {
                    formik.validateForm();
                  }
                }, [selectedProducts.length, selectedClient?.id, formik.submitCount]);

                return (
                  <form id="order-request-edit-form" onSubmit={formik.handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <FormControl isInvalid={!selectedClient?.id && formik.submitCount > 0}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiUsers} boxSize="1rem" />
                            <Text>Cliente</Text>
                          </HStack>
                        </FormLabel>

                        {/* Cliente seleccionado (no editable) */}
                        <Box position="relative" ref={clientSearchRef} minW={{ base: '100%', md: '18.75rem' }}>
                          {selectedClient ? (
                            <Flex
                              h="40px"
                              px="0.75rem"
                              bg={inputBg}
                              borderRadius="md"
                              border="1px solid"
                              borderColor={inputBorder}
                              align="center"
                              justify="space-between"
                            >
                              <Text fontSize="sm" noOfLines={1} fontWeight="medium">
                                {selectedClient.name}
                              </Text>
                            </Flex>
                          ) : null}
                        </Box>

                        {!selectedClient?.id && formik.submitCount > 0 && (
                          <FormErrorMessage>El cliente es requerido</FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl
                        isInvalid={
                          !!(formik.errors.productItems && formik.submitCount > 0 && selectedProducts.length === 0)
                        }
                      >
                        <FormLabel fontWeight="semibold">Productos</FormLabel>

                        {/* Buscador de productos */}
                        <Box position="relative" ref={productSearchRef}>
                          <Flex
                            bg={inputBg}
                            borderRadius="md"
                            overflow="hidden"
                            borderWidth="1px"
                            borderColor={inputBorder}
                          >
                            <Select
                              value={productSearchType}
                              onChange={(e) =>
                                setProductSearchType(e.target.value as 'name' | 'internalCode' | 'barcode')
                              }
                              bg="transparent"
                              border="none"
                              color={textColor}
                              w={{ base: '6rem', md: 'auto' }}
                              minW={{ base: '6rem', md: '7rem' }}
                              borderRadius="none"
                              _focus={{ boxShadow: 'none' }}
                              fontSize={{ base: 'xs', md: 'sm' }}
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
                                onFocus={() => productSearch && setShowProductDropdown(true)}
                              />
                              <InputRightElement>
                                <IconButton
                                  aria-label="Buscar"
                                  icon={<AiOutlineSearch size="1.25rem" />}
                                  size="sm"
                                  variant="ghost"
                                  color={textColor}
                                  _hover={{}}
                                />
                              </InputRightElement>
                            </InputGroup>
                          </Flex>

                          {/* Dropdown de resultados de productos */}
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
                              maxH="400px"
                              overflowY="auto"
                              zIndex={20}
                            >
                              {(() => {
                                const isTyping = productSearch !== debouncedProductSearch && productSearch.length >= 2;
                                const isSearching =
                                  !isTyping && isLoadingProductsSearch && debouncedProductSearch.length >= 2;
                                const searchCompleted =
                                  !isTyping &&
                                  !isSearching &&
                                  debouncedProductSearch.length >= 2 &&
                                  lastProductSearchTerm === debouncedProductSearch;

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

                                if (searchCompleted && productsSearch?.length > 0) {
                                  return (
                                    <List spacing={0}>
                                      {productsSearch.map((product: any, index: number) => {
                                        const isSelected = selectedProducts.some((p) => p.id === product.id);
                                        return (
                                          <Fragment key={product.id}>
                                            <ListItem
                                              p="0.75rem"
                                              cursor="pointer"
                                              _hover={{ bg: hoverBg }}
                                              transition="background-color 0.2s ease"
                                              opacity={isSelected ? 0.5 : 1}
                                              onClick={() => !isSelected && handleProductSelect(product)}
                                            >
                                              <Flex align="center" gap="0.75rem">
                                                <Image
                                                  src={
                                                    product.imageUrl ||
                                                    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                                  }
                                                  alt={product.name}
                                                  boxSize="40px"
                                                  objectFit="cover"
                                                  borderRadius="md"
                                                  flexShrink={0}
                                                />
                                                <Box flex="1">
                                                  <Text fontSize="sm" fontWeight="medium">
                                                    {product.name}
                                                  </Text>
                                                  <Text fontSize="xs" color={textColor}>
                                                    Precio: ${product.price || 0}
                                                    {product.internalCode && ` - Cód: ${product.internalCode}`}
                                                  </Text>
                                                </Box>
                                                {isSelected && (
                                                  <Text fontSize="xs" color="green.500">
                                                    Seleccionado
                                                  </Text>
                                                )}
                                              </Flex>
                                            </ListItem>
                                            {index < productsSearch.length - 1 && <Divider />}
                                          </Fragment>
                                        );
                                      })}
                                    </List>
                                  );
                                }

                                if (searchCompleted && productsSearch?.length === 0) {
                                  return (
                                    <Text p={3} fontSize="sm" color="gray.500">
                                      No se encontraron productos
                                    </Text>
                                  );
                                }

                                if (
                                  debouncedProductSearch.length >= 2 &&
                                  (!searchCompleted || isLoadingProductsSearch)
                                ) {
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

                        <FormErrorMessage>{formik.errors.productItems}</FormErrorMessage>

                        {/* Lista de productos seleccionados */}
                        {selectedProducts.length > 0 && (
                          <Box mt="1rem">
                            <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                              Productos seleccionados ({selectedProducts.length}):
                            </Text>
                            <VStack spacing="0.5rem" align="stretch">
                              {selectedProducts.map((product) => {
                                // Only apply discount if minimum quantity is met
                                const discountToApply =
                                  product.minQuantityForDiscount && product.quantity >= product.minQuantityForDiscount
                                    ? product.discount || 0
                                    : 0;
                                const effectivePrice = product.price * (1 - discountToApply / 100);
                                const subtotal = product.quantity * effectivePrice;
                                return (
                                  <Box
                                    key={product.id}
                                    p={{ base: '1rem', md: '0.75rem' }}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    borderRadius="md"
                                    bg={inputBg}
                                  >
                                    {/* Desktop Layout - Una sola fila */}
                                    <Flex display={{ base: 'none', md: 'flex' }} align="center" gap="1rem">
                                      {/* Imagen */}
                                      <Image
                                        src={
                                          product.imageUrl ||
                                          'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                        }
                                        alt={product.name}
                                        boxSize="50px"
                                        objectFit="cover"
                                        borderRadius="md"
                                        flexShrink={0}
                                      />

                                      {/* Nombre y Precio */}
                                      <Box flex="1">
                                        <Text fontSize="sm" fontWeight="medium" mb="0.25rem">
                                          {product.name}
                                        </Text>
                                        <HStack spacing="0.5rem" align="center">
                                          {product.isLoadingDiscount ? (
                                            <>
                                              <Text fontSize="xs" color={textColor}>
                                                ${product.price.toFixed(2)}
                                              </Text>
                                              <Spinner size="xs" />
                                              <Text fontSize="xs" color="gray.500">
                                                Cargando...
                                              </Text>
                                            </>
                                          ) : product.discount && product.discount > 0 ? (
                                            <>
                                              {/* Always show original price, strikethrough only when minimum quantity met */}
                                              <Text
                                                fontSize="xs"
                                                color={textColor}
                                                textDecoration={discountToApply > 0 ? 'line-through' : 'none'}
                                              >
                                                ${product.price.toFixed(2)}
                                              </Text>
                                              <Text fontSize="sm" fontWeight="semibold" color="green.500">
                                                ${(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
                                              </Text>
                                              <Box
                                                bg="green.500"
                                                color="white"
                                                px="0.4rem"
                                                py="0.1rem"
                                                borderRadius="md"
                                                fontSize="xs"
                                                fontWeight="bold"
                                              >
                                                -{product.discount}%
                                              </Box>
                                            </>
                                          ) : (
                                            <Text fontSize="xs" color={textColor}>
                                              ${product.price.toFixed(2)}
                                            </Text>
                                          )}
                                        </HStack>
                                      </Box>

                                      {/* Controles de cantidad */}
                                      <VStack spacing="0.25rem" align="stretch">
                                        <HStack spacing={0}>
                                          <IconButton
                                            aria-label="Disminuir cantidad"
                                            icon={<Text fontSize="sm">−</Text>}
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              const newValue = Math.max(0.1, product.quantity - 0.1);
                                              const rounded = parseFloat(newValue.toFixed(1));
                                              handleProductQuantityChange(product.id, rounded);
                                              setQuantityInputs((prev) => ({
                                                ...prev,
                                                [product.id]: rounded.toString(),
                                              }));
                                            }}
                                            borderRightRadius={0}
                                          />
                                          <Input
                                            size="sm"
                                            value={quantityInputs[product.id] ?? product.quantity}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const regex = /^\d*\.?\d*$/;
                                              if (regex.test(value) || value === '') {
                                                setQuantityInputs((prev) => ({ ...prev, [product.id]: value }));
                                                const numValue = parseFloat(value);
                                                if (!isNaN(numValue) && numValue >= 0) {
                                                  handleProductQuantityChange(product.id, numValue);
                                                } else if (value === '' || value === '.') {
                                                  handleProductQuantityChange(product.id, 0);
                                                }
                                              }
                                            }}
                                            onBlur={(e) => {
                                              const value = parseFloat(e.target.value);
                                              if (isNaN(value) || value <= 0) {
                                                handleProductQuantityChange(product.id, 1);
                                                setQuantityInputs((prev) => ({ ...prev, [product.id]: '1' }));
                                              } else {
                                                setQuantityInputs((prev) => ({
                                                  ...prev,
                                                  [product.id]: value.toString(),
                                                }));
                                              }
                                            }}
                                            w="3rem"
                                            textAlign="center"
                                            borderRadius={0}
                                            borderLeft="none"
                                            borderRight="none"
                                          />
                                          <IconButton
                                            aria-label="Aumentar cantidad"
                                            icon={<Text fontSize="sm">+</Text>}
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              const newValue = product.quantity + 0.1;
                                              const rounded = parseFloat(newValue.toFixed(1));
                                              handleProductQuantityChange(product.id, rounded);
                                              setQuantityInputs((prev) => ({
                                                ...prev,
                                                [product.id]: rounded.toString(),
                                              }));
                                            }}
                                            borderLeftRadius={0}
                                          />
                                        </HStack>
                                        {product.minQuantityForDiscount && (
                                          <Text
                                            fontSize="xs"
                                            color={
                                              product.quantity >= product.minQuantityForDiscount
                                                ? 'green.500'
                                                : 'orange.500'
                                            }
                                            fontWeight="medium"
                                            textAlign="center"
                                          >
                                            {product.quantity >= product.minQuantityForDiscount ? (
                                              <>✓ Descuento aplicado</>
                                            ) : (
                                              <>Mín. {product.minQuantityForDiscount} para descuento</>
                                            )}
                                          </Text>
                                        )}
                                      </VStack>

                                      {/* Subtotal */}
                                      <Text fontSize="md" fontWeight="bold" minW="80px" textAlign="center">
                                        ${subtotal.toFixed(2)}
                                      </Text>

                                      {/* Botón eliminar */}
                                      <IconButton
                                        aria-label="Eliminar producto"
                                        icon={<FaTrash />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleRemoveProduct(product.id)}
                                        flexShrink={0}
                                      />
                                    </Flex>

                                    {/* Mobile Layout - Mantener como estaba */}
                                    <Box display={{ base: 'block', md: 'none' }}>
                                      {/* Fila superior: Imagen + Nombre/Precio */}
                                      <Flex align="center" gap="0.75rem" mb="0.75rem">
                                        <Image
                                          src={
                                            product.imageUrl ||
                                            'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                          }
                                          alt={product.name}
                                          boxSize="50px"
                                          objectFit="cover"
                                          borderRadius="md"
                                          flexShrink={0}
                                        />
                                        <Box flex="1">
                                          <Text fontSize="sm" fontWeight="medium" mb="0.25rem">
                                            {product.name}
                                          </Text>
                                          <HStack spacing="0.5rem" align="center">
                                            {product.isLoadingDiscount ? (
                                              <>
                                                <Text fontSize="xs" color={textColor}>
                                                  ${product.price.toFixed(2)}
                                                </Text>
                                                <Spinner size="xs" />
                                                <Text fontSize="xs" color="gray.500">
                                                  Cargando...
                                                </Text>
                                              </>
                                            ) : product.discount && product.discount > 0 ? (
                                              <>
                                                {/* Always show original price, strikethrough only when minimum quantity met */}
                                                <Text
                                                  fontSize="xs"
                                                  color={textColor}
                                                  textDecoration={discountToApply > 0 ? 'line-through' : 'none'}
                                                >
                                                  ${product.price.toFixed(2)}
                                                </Text>
                                                <Text fontSize="sm" fontWeight="semibold" color="green.500">
                                                  ${(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
                                                </Text>
                                                <Box
                                                  bg="green.500"
                                                  color="white"
                                                  px="0.4rem"
                                                  py="0.1rem"
                                                  borderRadius="md"
                                                  fontSize="xs"
                                                  fontWeight="bold"
                                                >
                                                  -{product.discount}%
                                                </Box>
                                              </>
                                            ) : (
                                              <Text fontSize="xs" color={textColor}>
                                                ${product.price.toFixed(2)}
                                              </Text>
                                            )}
                                          </HStack>
                                        </Box>
                                      </Flex>

                                      {/* Fila inferior: Botón eliminar | Controles cantidad | Subtotal */}
                                      <Flex justify="space-between" align="center">
                                        <IconButton
                                          aria-label="Eliminar producto"
                                          icon={<FaTrash />}
                                          size="sm"
                                          colorScheme="red"
                                          variant="ghost"
                                          onClick={() => handleRemoveProduct(product.id)}
                                        />
                                        <VStack spacing="0.25rem">
                                          <HStack spacing={0}>
                                            <IconButton
                                              aria-label="Disminuir cantidad"
                                              icon={<Text fontSize="sm">−</Text>}
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                const newValue = Math.max(0.1, product.quantity - 0.1);
                                                const rounded = parseFloat(newValue.toFixed(1));
                                                handleProductQuantityChange(product.id, rounded);
                                                setQuantityInputs((prev) => ({
                                                  ...prev,
                                                  [product.id]: rounded.toString(),
                                                }));
                                              }}
                                              borderRightRadius={0}
                                            />
                                            <Input
                                              size="sm"
                                              value={quantityInputs[product.id] ?? product.quantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const regex = /^\d*\.?\d*$/;
                                                if (regex.test(value) || value === '') {
                                                  setQuantityInputs((prev) => ({ ...prev, [product.id]: value }));
                                                  const numValue = parseFloat(value);
                                                  if (!isNaN(numValue) && numValue >= 0) {
                                                    handleProductQuantityChange(product.id, numValue);
                                                  } else if (value === '' || value === '.') {
                                                    handleProductQuantityChange(product.id, 0);
                                                  }
                                                }
                                              }}
                                              onBlur={(e) => {
                                                const value = parseFloat(e.target.value);
                                                if (isNaN(value) || value <= 0) {
                                                  handleProductQuantityChange(product.id, 1);
                                                  setQuantityInputs((prev) => ({ ...prev, [product.id]: '1' }));
                                                } else {
                                                  setQuantityInputs((prev) => ({
                                                    ...prev,
                                                    [product.id]: value.toString(),
                                                  }));
                                                }
                                              }}
                                              w="3rem"
                                              textAlign="center"
                                              borderRadius={0}
                                              borderLeft="none"
                                              borderRight="none"
                                            />
                                            <IconButton
                                              aria-label="Aumentar cantidad"
                                              icon={<Text fontSize="sm">+</Text>}
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                const newValue = product.quantity + 0.1;
                                                const rounded = parseFloat(newValue.toFixed(1));
                                                handleProductQuantityChange(product.id, rounded);
                                                setQuantityInputs((prev) => ({
                                                  ...prev,
                                                  [product.id]: rounded.toString(),
                                                }));
                                              }}
                                              borderLeftRadius={0}
                                            />
                                          </HStack>
                                          {product.minQuantityForDiscount && (
                                            <Text
                                              fontSize="xs"
                                              color={
                                                product.quantity >= product.minQuantityForDiscount
                                                  ? 'green.500'
                                                  : 'orange.500'
                                              }
                                              fontWeight="medium"
                                              textAlign="center"
                                            >
                                              {product.quantity >= product.minQuantityForDiscount ? (
                                                <>✓</>
                                              ) : (
                                                <>Mín. {product.minQuantityForDiscount}</>
                                              )}
                                            </Text>
                                          )}
                                        </VStack>
                                        <Box textAlign="right">
                                          <Text fontSize="md" fontWeight="bold">
                                            ${subtotal.toFixed(2)}
                                          </Text>
                                        </Box>
                                      </Flex>
                                    </Box>
                                  </Box>
                                );
                              })}
                            </VStack>

                            {/* Total */}
                            <Box>
                              <Divider mt="1rem" mb="0.5rem" />
                              <HStack justify="space-between">
                                <Text fontSize="md" fontWeight="semibold">
                                  Total:
                                </Text>
                                <Text fontSize="md" fontWeight="semibold">
                                  $
                                  {selectedProducts
                                    .reduce((total, product) => {
                                      // Only apply discount if minimum quantity is met
                                      const discountToApply =
                                        product.minQuantityForDiscount &&
                                        product.quantity >= product.minQuantityForDiscount
                                          ? product.discount || 0
                                          : 0;
                                      const effectivePrice = product.price * (1 - discountToApply / 100);
                                      return total + product.quantity * effectivePrice;
                                    }, 0)
                                    .toFixed(2)}
                                </Text>
                              </HStack>
                            </Box>
                          </Box>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} />
                            <Text>Observaciones</Text>
                          </HStack>
                        </FormLabel>
                        <Textarea
                          bg={inputBg}
                          borderColor={inputBorder}
                          {...formik.getFieldProps('observations')}
                          placeholder="Observaciones del pedido..."
                          rows={3}
                        />
                      </FormControl>
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
                form="order-request-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                leftIcon={<FaCheck />}
                isLoading={isLoading}
                loadingText="Actualizando..."
                size="sm"
              >
                Actualizar pedido
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmClose}
      />
    </>
  );
};
