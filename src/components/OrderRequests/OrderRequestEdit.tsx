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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightElement,
  Spinner,
  Flex,
  Divider,
  Image,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { FiFileText, FiUsers } from 'react-icons/fi';
import { useState, useEffect, useRef, useMemo } from 'react';
import { OrderRequest } from '@/entities/orderRequest';
import { useUpdateOrderRequest } from '@/hooks/orderRequest';
import { useGetClients } from '@/hooks/client';
import { useGetProducts } from '@/hooks/product';
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
    Array<{ id: number; name: string; price: number; imageUrl?: string; quantity: number; weight: number }>
  >([]);
  const [debouncedProductSearch, setDebouncedProductSearch] = useState(productSearch);
  const [lastProductSearchTerm, setLastProductSearchTerm] = useState('');
  const productSearchRef = useRef<HTMLDivElement>(null);

  // Inicializar cliente seleccionado con el cliente actual del pedido
  useEffect(() => {
    if (orderRequest.client) {
      setSelectedClient({ id: orderRequest.client.id, name: orderRequest.client.name });
    }
  }, [orderRequest.client]);

  // Inicializar productos seleccionados con los productos del pedido
  useEffect(() => {
    if (orderRequest.productItems) {
      setSelectedProducts(
        orderRequest.productItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.unitPrice,
          imageUrl: item.product.imageUrl,
          quantity: item.quantity,
          weight: item.weight,
        })),
      );
    }
  }, [orderRequest.productItems]);

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

  const { data: clientsSearch = [], isLoading: isLoadingClientsSearch } = useGetClients(1, 10, actualClientFilters);

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

  // Funciones para manejar búsqueda de clientes
  const handleClientSearch = (value: string) => {
    setClientSearch(value);
    if (value.length >= 2) {
      setShowClientDropdown(true);
    } else {
      setShowClientDropdown(false);
    }
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient({ id: client.id, name: client.name });
    setClientSearch('');
    setShowClientDropdown(false);
  };

  const handleClearClientSearch = () => {
    setSelectedClient(null);
    setClientSearch('');
    setShowClientDropdown(false);
  };

  // Funciones para manejar búsqueda de productos
  const handleProductSearch = (value: string) => {
    setProductSearch(value);
    if (value.length >= 2) {
      setShowProductDropdown(true);
    } else {
      setShowProductDropdown(false);
    }
  };

  const handleProductSelect = (product: any) => {
    const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);
    if (!isAlreadySelected) {
      setSelectedProducts((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price || 0,
          imageUrl: product.imageUrl,
          quantity: 1,
          weight: 0,
        },
      ]);
    }
    setProductSearch('');
    setShowProductDropdown(false);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleProductQuantityChange = (productId: number, quantity: number) => {
    setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity } : p)));
  };

  const handleProductWeightChange = (productId: number, weight: number) => {
    setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, weight } : p)));
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
        weight: item.weight,
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
          <ModalCloseButton />

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
            >
              {(formik) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty: formik.dirty, resetForm: formik.resetForm });
                }, [formik.dirty, formik.resetForm]);

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

                        {/* Búsqueda de clientes */}
                        <Box position="relative" ref={clientSearchRef} minW="18.75rem">
                          {selectedClient ? (
                            <HStack
                              p="0.75rem"
                              bg={inputBg}
                              borderRadius="md"
                              border="1px solid"
                              borderColor={inputBorder}
                              spacing="0.5rem"
                              w="100%"
                            >
                              <Text fontSize="md" flex="1" noOfLines={1} fontWeight="medium">
                                {selectedClient.name}
                              </Text>
                              <IconButton
                                aria-label="Limpiar cliente"
                                icon={<Text fontSize="sm">✕</Text>}
                                size="sm"
                                variant="ghost"
                                onClick={handleClearClientSearch}
                                color={textColor}
                                _hover={{}}
                              />
                            </HStack>
                          ) : (
                            <Box>
                              <Flex
                                bg={inputBg}
                                borderRadius="md"
                                overflow="hidden"
                                borderWidth="1px"
                                borderColor={inputBorder}
                              >
                                <Select
                                  value={clientSearchType}
                                  onChange={(e) =>
                                    setClientSearchType(
                                      e.target.value as 'name' | 'rut' | 'razonSocial' | 'contactName',
                                    )
                                  }
                                  bg="transparent"
                                  border="none"
                                  color={textColor}
                                  w="auto"
                                  minW="7rem"
                                  borderRadius="none"
                                  _focus={{ boxShadow: 'none' }}
                                  maxW={{ base: '5rem', md: '100%' }}
                                >
                                  <option value="name">Nombre</option>
                                  <option value="rut">RUT</option>
                                  <option value="razonSocial">Razón social</option>
                                  <option value="contactName">Contacto</option>
                                </Select>

                                <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

                                <InputGroup flex="1">
                                  <Input
                                    placeholder="Buscar cliente..."
                                    value={clientSearch}
                                    onChange={(e) => handleClientSearch(e.target.value)}
                                    bg="transparent"
                                    border="none"
                                    borderRadius="none"
                                    _placeholder={{ color: textColor }}
                                    color={textColor}
                                    _focus={{ boxShadow: 'none' }}
                                    pl="1rem"
                                    onFocus={() => clientSearch && setShowClientDropdown(true)}
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

                              {/* Dropdown de resultados de clientes */}
                              {showClientDropdown && (
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
                                    const isTyping = clientSearch !== debouncedClientSearch && clientSearch.length >= 2;
                                    const isSearching =
                                      !isTyping && isLoadingClientsSearch && debouncedClientSearch.length >= 2;
                                    const searchCompleted =
                                      !isTyping &&
                                      !isSearching &&
                                      debouncedClientSearch.length >= 2 &&
                                      lastClientSearchTerm === debouncedClientSearch;

                                    if (isTyping || isSearching) {
                                      return (
                                        <Flex p={3} justify="center" align="center" gap={2}>
                                          <Spinner size="sm" />
                                          <Text fontSize="sm" color="gray.500">
                                            Buscando clientes...
                                          </Text>
                                        </Flex>
                                      );
                                    }

                                    if (searchCompleted && clientsSearch?.length > 0) {
                                      return (
                                        <VStack spacing={0}>
                                          {clientsSearch.map((client: any, index: number) => (
                                            <Box key={client.id} w="100%">
                                              <Box
                                                p="0.75rem"
                                                cursor="pointer"
                                                _hover={{ bg: hoverBg }}
                                                transition="background-color 0.2s ease"
                                                onClick={() => handleClientSelect(client)}
                                                w="100%"
                                              >
                                                <Box>
                                                  <Text fontSize="sm" fontWeight="medium">
                                                    {client.name}
                                                  </Text>
                                                  <Text fontSize="xs" color={textColor}>
                                                    {client.rut && `RUT: ${client.rut}`}
                                                    {client.contactName && ` - Contacto: ${client.contactName}`}
                                                  </Text>
                                                </Box>
                                              </Box>
                                              {index < clientsSearch.length - 1 && <Divider />}
                                            </Box>
                                          ))}
                                        </VStack>
                                      );
                                    }

                                    if (searchCompleted && clientsSearch?.length === 0) {
                                      return (
                                        <Text p={3} fontSize="sm" color="gray.500">
                                          No se encontraron clientes
                                        </Text>
                                      );
                                    }

                                    if (
                                      debouncedClientSearch.length >= 2 &&
                                      (!searchCompleted || isLoadingClientsSearch)
                                    ) {
                                      return (
                                        <Flex p={3} justify="center" align="center" gap={2}>
                                          <Spinner size="sm" />
                                          <Text fontSize="sm" color="gray.500">
                                            Buscando clientes...
                                          </Text>
                                        </Flex>
                                      );
                                    }

                                    return null;
                                  })()}
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>

                        {!selectedClient?.id && formik.submitCount > 0 && (
                          <FormErrorMessage>El cliente es requerido</FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" />
                            <Text>Observaciones</Text>
                          </HStack>
                        </FormLabel>
                        <Textarea
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          {...formik.getFieldProps('observations')}
                          placeholder="Observaciones del pedido..."
                          rows={3}
                        />
                      </FormControl>

                      <Box>
                        <Text fontWeight="bold" fontSize="lg" mb={3}>
                          Productos
                        </Text>

                        {/* Buscador de productos */}
                        <Box position="relative" ref={productSearchRef} mb={4}>
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
                              w="auto"
                              minW="7rem"
                              borderRadius="none"
                              _focus={{ boxShadow: 'none' }}
                              maxW={{ base: '5rem', md: '100%' }}
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
                                    <VStack spacing={0}>
                                      {productsSearch.map((product: any, index: number) => {
                                        const isSelected = selectedProducts.some((p) => p.id === product.id);
                                        return (
                                          <Box key={product.id} w="100%">
                                            <Box
                                              p="0.75rem"
                                              cursor="pointer"
                                              _hover={{ bg: hoverBg }}
                                              transition="background-color 0.2s ease"
                                              opacity={isSelected ? 0.5 : 1}
                                              onClick={() => !isSelected && handleProductSelect(product)}
                                              w="100%"
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
                                            </Box>
                                            {index < productsSearch.length - 1 && <Divider />}
                                          </Box>
                                        );
                                      })}
                                    </VStack>
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

                        {formik.errors.productItems && (
                          <Text color="red.500" fontSize="sm" mb={2}>
                            {formik.errors.productItems}
                          </Text>
                        )}

                        {/* Lista de productos seleccionados */}
                        {selectedProducts.length > 0 && (
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                              Productos seleccionados ({selectedProducts.length}):
                            </Text>
                            <VStack spacing="0.5rem" align="stretch">
                              {selectedProducts.map((product) => {
                                const subtotal = product.quantity * product.price;
                                return (
                                  <Box
                                    key={product.id}
                                    p="0.75rem 1.5rem"
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    borderRadius="md"
                                    bg={inputBg}
                                  >
                                    <Flex align="center" gap="1rem">
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
                                        <Text fontSize="sm" fontWeight="medium">
                                          {product.name}
                                        </Text>
                                        <Text fontSize="xs" color={textColor}>
                                          Precio: ${product.price.toFixed(2)}
                                        </Text>
                                      </Box>
                                      <VStack spacing="0.5rem" align="flex-end" minW="120px">
                                        <HStack spacing="0.5rem">
                                          <Text fontSize="xs" color={textColor} minW="50px">
                                            Cantidad:
                                          </Text>
                                          <NumberInput
                                            size="sm"
                                            min={1}
                                            value={product.quantity}
                                            onChange={(_, value) => handleProductQuantityChange(product.id, value || 1)}
                                            w="80px"
                                          >
                                            <NumberInputField textAlign="right" />
                                            <NumberInputStepper>
                                              <NumberIncrementStepper />
                                              <NumberDecrementStepper />
                                            </NumberInputStepper>
                                          </NumberInput>
                                        </HStack>
                                        <HStack spacing="0.5rem">
                                          <Text fontSize="xs" color={textColor} minW="50px">
                                            Peso (kg):
                                          </Text>
                                          <Input
                                            size="sm"
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={product.weight || ''}
                                            onChange={(e) =>
                                              handleProductWeightChange(product.id, parseFloat(e.target.value) || 0)
                                            }
                                            w="80px"
                                            bg={inputBg}
                                            border="1px solid"
                                            borderColor={inputBorder}
                                            textAlign="right"
                                          />
                                        </HStack>
                                      </VStack>
                                      <VStack spacing="0.25rem" align="flex-end" minW="80px">
                                        <Text fontSize="xs" color={textColor}>
                                          Subtotal:
                                        </Text>
                                        <Text fontSize="sm" fontWeight="bold">
                                          ${subtotal.toFixed(2)}
                                        </Text>
                                      </VStack>
                                      <IconButton
                                        aria-label="Eliminar producto"
                                        icon={<FaTrash />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleRemoveProduct(product.id)}
                                      />
                                    </Flex>
                                  </Box>
                                );
                              })}
                            </VStack>
                            <HStack justify="flex-end" mt={4}>
                              <Text fontWeight="bold" fontSize="lg">
                                Total: $
                                {selectedProducts
                                  .reduce((total, product) => total + product.quantity * product.price, 0)
                                  .toFixed(2)}
                              </Text>
                            </HStack>
                          </Box>
                        )}
                      </Box>
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
