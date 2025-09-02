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
  FormErrorMessage,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  VStack,
  Box,
  useColorModeValue,
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
  Select,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { FaCheck, FaTrash, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { FiPackage, FiUsers, FiFileText } from 'react-icons/fi';
import { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Order } from '@/entities/order';
import { getOrderRequestById } from '@/services/orderRequest';
import { useUpdateOrder } from '@/hooks/order';
import { useGetProducts } from '@/hooks/product';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { UnitType } from '@/enums/unitType.enum';
import type { OrderRequest } from '@/entities/orderRequest';

type OrderPrepareProps = {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onOrderPrepared?: (order: Order) => void;
};

export const OrderPrepare = ({ order, isOpen, onClose, setOrders, onOrderPrepared }: OrderPrepareProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const labelColor = useColorModeValue('black', 'white');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  // Estados para la búsqueda de productos
  const [productSearch, setProductSearch] = useState('');
  const [productSearchType, setProductSearchType] = useState<'name' | 'internalCode' | 'barcode'>('name');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{
      id: number;
      name: string;
      imageUrl?: string;
      unitType?: string;
      requestedQuantity: number;
      actualQuantity: number;
      weight?: number;
      stock?: number;
      availableStock?: number;
      isOriginalFromOrder: boolean;
      originalRequestedQuantity?: number;
    }>
  >([]);
  const [debouncedProductSearch, setDebouncedProductSearch] = useState(productSearch);
  const [lastProductSearchTerm, setLastProductSearchTerm] = useState('');
  const [quantityInputs, setQuantityInputs] = useState<{ [key: number]: string }>({});
  const [weightInputs, setWeightInputs] = useState<{ [key: number]: string }>({});
  const [orderRequestData, setOrderRequestData] = useState<OrderRequest | null>(null);
  const [isLoadingOrderRequest, setIsLoadingOrderRequest] = useState(false);
  const [isInitializingProducts, setIsInitializingProducts] = useState(true);
  const productSearchRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fieldError, mutate } = useUpdateOrder();

  const detailField = (label: string, value: string | number | null | undefined, icon?: any, textColor?: string) => (
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
        minH="2.75rem"
        maxH="10rem"
        overflowY="auto"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        transition="all 0.2s"
        color={textColor}
      >
        {value ?? '—'}
      </Box>
    </Box>
  );

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

  // Debounce para búsqueda de productos
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [productSearch]);

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingProductsSearch && debouncedProductSearch && debouncedProductSearch.length >= 2) {
      setLastProductSearchTerm(debouncedProductSearch);
    }
  }, [isLoadingProductsSearch, debouncedProductSearch]);

  // Cargar datos de orderRequest cuando se abre el modal
  useEffect(() => {
    if (!isOpen || !order.orderRequest?.id) {
      return;
    }

    const fetchOrderRequest = async () => {
      setIsLoadingOrderRequest(true);
      try {
        const orderRequestData = await getOrderRequestById(order.orderRequest!.id);
        setOrderRequestData(orderRequestData);
      } catch (error) {
        console.error('Error loading orderRequest:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información del pedido original',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setIsLoadingOrderRequest(false);
      }
    };

    fetchOrderRequest();
  }, [isOpen, order.orderRequest?.id, toast]);

  // Inicializar productos seleccionados con los productos de la orden
  useEffect(() => {
    if (order.productItems && selectedProducts.length === 0 && orderRequestData) {
      // Usar los descuentos que ya vienen en los items de la orden
      const initialProducts = order.productItems.map((item) => {
        // Buscar la cantidad solicitada en el orderRequest original
        const requestedItem = orderRequestData?.productItems?.find((reqItem) => reqItem.product.id === item.product.id);
        const requestedQuantity = requestedItem?.quantity || 0;

        // Verificar si este producto estaba en el pedido original
        const wasInOriginalOrder = !!requestedItem;

        return {
          id: item.product.id,
          name: item.product.name,
          imageUrl: item.product.imageUrl,
          unitType: item.product.unitType,
          requestedQuantity: requestedQuantity,
          actualQuantity: item.quantity,
          weight: item.product.unitType === UnitType.KILO ? item.weight || 0 : undefined,
          stock: item.product.stock,
          availableStock: item.product.availableStock,
          isOriginalFromOrder: wasInOriginalOrder,
          originalRequestedQuantity: wasInOriginalOrder ? requestedQuantity : undefined,
        };
      });
      setSelectedProducts(initialProducts);
      setIsInitializingProducts(false);
    }
  }, [order.productItems, selectedProducts.length, orderRequestData]);

  const handleClose = () => {
    setShowConfirmDialog(false);
    setIsInitializingProducts(true);
    setSelectedProducts([]);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
    onClose();
  };

  const handleOverlayClick = () => {
    if (formikInstance && formikInstance.dirty) {
      setShowConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  // Función para manejar búsqueda de productos
  const handleProductSearch = (value: string) => {
    setProductSearch(value);
    if (value.length >= 2) {
      setShowProductDropdown(true);
    } else {
      setShowProductDropdown(false);
    }
  };

  const handleProductSelect = async (product: any) => {
    const exists = selectedProducts.find((p) => p.id === product.id);
    if (!exists) {
      // Verificar si este producto estaba en el pedido original (orderRequest)
      const originalItem = orderRequestData?.productItems?.find((reqItem) => reqItem.product.id === product.id);

      if (originalItem) {
        // Es un producto del pedido original que se está re-agregando
        setSelectedProducts((prev) => [
          ...prev,
          {
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            unitType: product.unitType,
            requestedQuantity: originalItem.quantity,
            actualQuantity: originalItem.quantity,
            weight:
              product.unitType === UnitType.KILO ? originalItem.weight || product.estimatedWeight || 0 : undefined,
            stock: product.stock,
            availableStock: product.availableStock,
            isOriginalFromOrder: true,
            originalRequestedQuantity: originalItem.quantity,
          },
        ]);
      } else {
        // Es un producto nuevo
        const newProduct = {
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          unitType: product.unitType,
          requestedQuantity: 0,
          actualQuantity: 1,
          weight: product.unitType === UnitType.KILO ? product.estimatedWeight || 0 : undefined,
          stock: product.stock,
          availableStock: product.availableStock,
          isOriginalFromOrder: false,
          originalRequestedQuantity: undefined,
        };

        setSelectedProducts((prev) => [...prev, newProduct]);
      }

      setProductSearch('');
      setShowProductDropdown(false);
    } else {
      setProductSearch('');
      setShowProductDropdown(false);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleQuantityChange = (productId: number, actualQuantity: number) => {
    setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, actualQuantity } : p)));
  };

  const handleWeightChange = (productId: number, weight: number) => {
    setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, weight } : p)));
  };

  // Función para validar si la cantidad excede el stock disponible
  const isQuantityExceedsStock = (product: any): boolean => {
    return product.actualQuantity > (product.availableStock || 0);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productSearchRef.current && !productSearchRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (data) {
      toast({
        title: 'Orden preparada',
        description: 'La orden ha sido preparada exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setOrders((prev) => prev.map((o) => (o.id === data.id ? data : o)));
      onClose();
      // Notificar al padre que la orden fue preparada
      if (onOrderPrepared) {
        onOrderPrepared(data);
      }
    }
  }, [data, setOrders, toast, onClose, onOrderPrepared]);

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

  const initialValues = {
    crates: order.crates || 1,
    observations: order.observations || '',
  };

  const validateForm = (values: typeof initialValues) => {
    const errors: { crates?: string; products?: string; stock?: string } = {};

    if (!values.crates || values.crates <= 0) {
      errors.crates = 'Los cajones deben ser mayor a 0';
    }

    if (selectedProducts.length === 0) {
      errors.products = 'Debe tener al menos un producto en la lista';
    }

    // Validar stock disponible
    const hasStockErrors = selectedProducts.some((product) => isQuantityExceedsStock(product));
    if (hasStockErrors) {
      errors.stock = 'Algunos productos exceden el stock disponible';
    }

    return errors;
  };

  const handleSubmit = async (values: typeof initialValues) => {
    // Validación manual adicional para asegurar que funcione
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      // No continuar si hay errores
      return;
    }

    // Preparar los datos del producto con las cantidades reales
    const productItems = selectedProducts.map((product) => ({
      productId: product.id,
      quantity: product.actualQuantity,
      weight: product.unitType === UnitType.KILO ? (product.weight ?? 0) : undefined,
    }));

    const orderData: any = {
      id: order.id,
      crates: values.crates,
      observations: values.observations,
      productItems,
      // Aquí podrías cambiar el status a "PROCESSING" o similar
    };

    await mutate(orderData);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'xl' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleOverlayClick}
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
            Preparar Orden #{order.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={initialValues}
              validate={validateForm}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {(formik) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty: formik.dirty, resetForm: formik.resetForm });
                }, [formik.dirty, formik.resetForm]);

                return (
                  <form id="order-prepare-form" onSubmit={formik.handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      {/* Información de la orden */}
                      <Box>{detailField('Cliente', order.client?.name, FiUsers)}</Box>

                      <Divider />

                      {/* Agregar productos */}
                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiPackage} boxSize="1rem" />
                            <Text>Agregar productos</Text>
                          </HStack>
                        </FormLabel>

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
                                                  <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                                    {product.name}
                                                  </Text>
                                                  <Text fontSize="xs" color={textColor}>
                                                    Precio: ${product.price || 0}
                                                    {product.internalCode && ` - Cód: ${product.internalCode}`}
                                                  </Text>
                                                </Box>
                                                {isSelected && (
                                                  <Text fontSize="xs" color="green.500">
                                                    Ya agregado
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

                                return null;
                              })()}
                            </Box>
                          )}
                        </Box>
                      </FormControl>

                      <Divider />

                      {/* Lista de productos */}
                      <FormControl isInvalid={!!(formik.errors as any).products || !!(formik.errors as any).stock}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiPackage} boxSize="1rem" />
                            <Text>Productos a preparar ({selectedProducts.length})</Text>
                          </HStack>
                        </FormLabel>
                        {(formik.errors as any).products && (
                          <FormErrorMessage mb="0.5rem">{(formik.errors as any).products}</FormErrorMessage>
                        )}
                        {(formik.errors as any).stock && (
                          <FormErrorMessage mb="0.5rem">{(formik.errors as any).stock}</FormErrorMessage>
                        )}

                        {isInitializingProducts ? (
                          <Box
                            p="2rem"
                            textAlign="center"
                            border="1px solid"
                            borderColor={inputBorder}
                            borderRadius="md"
                            bg={inputBg}
                          >
                            <Spinner size="md" mb="1rem" />
                            <Text color={textColor}>Cargando productos...</Text>
                          </Box>
                        ) : selectedProducts.length > 0 ? (
                          <>
                            <VStack spacing="0.5rem" align="stretch">
                              {selectedProducts.map((product) => (
                                <Box
                                  key={product.id}
                                  p={{ base: '1rem', md: '0.75rem' }}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  borderRadius="md"
                                  bg={inputBg}
                                >
                                  {/* Desktop Layout */}
                                  <Box display={{ base: 'none', md: 'block' }}>
                                    {/* Una sola fila desktop: [Imagen + Nombre/Cant.solicitada] + Cant.real + Peso + Botón eliminar */}
                                    <Flex gap="1.5rem" align="center">
                                      <HStack spacing="0.75rem" flex="1">
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
                                          <HStack spacing="0.5rem" align="center" mb="0.25rem">
                                            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                              {product.name}
                                            </Text>
                                            {!product.isOriginalFromOrder && (
                                              <Badge size="sm" colorScheme="blue" variant="subtle">
                                                <HStack spacing="0.25rem" align="center">
                                                  <Icon as={FaPlus} boxSize="0.625rem" />
                                                  <Text fontSize="xs">Nuevo</Text>
                                                </HStack>
                                              </Badge>
                                            )}
                                          </HStack>
                                          <HStack spacing="0.5rem" align="center">
                                            <Text fontSize="xs" color={textColor} fontWeight="medium">
                                              Cant. solicitada:
                                            </Text>
                                            {isLoadingOrderRequest ? (
                                              <Spinner size="xs" />
                                            ) : (
                                              <Text fontSize="sm" fontWeight="semibold">
                                                {product.requestedQuantity}
                                              </Text>
                                            )}
                                          </HStack>
                                        </Box>
                                      </HStack>

                                      <VStack spacing="0.25rem" align="center">
                                        <HStack spacing="0.25rem">
                                          <Text fontSize="xs" color={textColor} fontWeight="medium">
                                            Cant. real
                                          </Text>
                                          {isQuantityExceedsStock(product) && (
                                            <Tooltip
                                              label={`Stock total: ${product.stock || 0} | Stock disponible: ${product.availableStock || 0}`}
                                              placement="top"
                                              hasArrow
                                              bg="red.500"
                                              color="white"
                                            >
                                              <Icon as={FaExclamationTriangle} color="red.500" boxSize="0.75rem" />
                                            </Tooltip>
                                          )}
                                        </HStack>
                                        <HStack spacing={0}>
                                          <IconButton
                                            aria-label="Disminuir cantidad"
                                            icon={<Text fontSize="sm">−</Text>}
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              const newValue =
                                                product.unitType === UnitType.KILO
                                                  ? Math.max(0.5, product.actualQuantity - 0.5)
                                                  : Math.max(1, product.actualQuantity - 1);
                                              const rounded = parseFloat(newValue.toFixed(1));
                                              handleQuantityChange(product.id, rounded);
                                              setQuantityInputs((prev) => ({
                                                ...prev,
                                                [product.id]: rounded.toString(),
                                              }));
                                            }}
                                            borderRightRadius={0}
                                          />
                                          <Input
                                            size="sm"
                                            p="0"
                                            value={quantityInputs[product.id] ?? product.actualQuantity}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const regex =
                                                product.unitType === UnitType.KILO ? /^\d*\.?\d*$/ : /^\d*$/;
                                              if (regex.test(value) || value === '') {
                                                setQuantityInputs((prev) => ({ ...prev, [product.id]: value }));
                                                const numValue =
                                                  product.unitType === UnitType.KILO
                                                    ? parseFloat(value)
                                                    : parseInt(value, 10);
                                                if (!isNaN(numValue) && numValue >= 0) {
                                                  handleQuantityChange(product.id, numValue);
                                                } else if (value === '' || value === '.') {
                                                  handleQuantityChange(product.id, 0);
                                                }
                                              }
                                            }}
                                            onBlur={(e) => {
                                              const value =
                                                product.unitType === UnitType.KILO
                                                  ? parseFloat(e.target.value)
                                                  : parseInt(e.target.value, 10);
                                              if (isNaN(value) || value <= 0) {
                                                handleQuantityChange(product.id, 1);
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
                                              const newValue =
                                                product.unitType === UnitType.KILO
                                                  ? product.actualQuantity + 0.5
                                                  : product.actualQuantity + 1;
                                              const rounded = parseFloat(newValue.toFixed(1));
                                              handleQuantityChange(product.id, rounded);
                                              setQuantityInputs((prev) => ({
                                                ...prev,
                                                [product.id]: rounded.toString(),
                                              }));
                                            }}
                                            borderLeftRadius={0}
                                          />
                                        </HStack>
                                      </VStack>

                                      <VStack spacing="0.25rem" align="center">
                                        <Text fontSize="xs" color={textColor} fontWeight="medium">
                                          Peso (g)
                                        </Text>
                                        <Input
                                          size="sm"
                                          value={
                                            product.unitType === UnitType.KILO
                                              ? (weightInputs[product.id] ?? product.weight ?? '')
                                              : 'N/A'
                                          }
                                          onChange={(e) => {
                                            if (product.unitType === UnitType.KILO) {
                                              const value = e.target.value;
                                              const regex = /^\d*\.?\d*$/;
                                              if (regex.test(value) || value === '') {
                                                setWeightInputs((prev) => ({ ...prev, [product.id]: value }));
                                                const numValue = parseFloat(value);
                                                if (!isNaN(numValue) && numValue >= 0) {
                                                  handleWeightChange(product.id, numValue);
                                                } else if (value === '' || value === '.') {
                                                  handleWeightChange(product.id, 0);
                                                }
                                              }
                                            }
                                          }}
                                          onBlur={(e) => {
                                            if (product.unitType === UnitType.KILO) {
                                              const value = parseFloat(e.target.value);
                                              if (isNaN(value) || value <= 0) {
                                                handleWeightChange(product.id, 0);
                                                setWeightInputs((prev) => ({ ...prev, [product.id]: '0' }));
                                              } else {
                                                setWeightInputs((prev) => ({
                                                  ...prev,
                                                  [product.id]: value.toString(),
                                                }));
                                              }
                                            }
                                          }}
                                          isDisabled={product.unitType !== UnitType.KILO}
                                          w="4rem"
                                          textAlign="center"
                                          borderRadius="md"
                                          bg={product.unitType === UnitType.KILO ? 'transparent' : inputBg}
                                        />
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

                                  {/* Mobile Layout */}
                                  <Box display={{ base: 'block', md: 'none' }}>
                                    {/* Fila superior: Imagen + Nombre + Precio + Botón eliminar */}
                                    <Flex align="flex-start" gap="0.75rem" mb="0.75rem">
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
                                        <VStack spacing="0.25rem" align="flex-start" mb="0.25rem">
                                          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                            {product.name}
                                          </Text>
                                          {!product.isOriginalFromOrder && (
                                            <Badge size="sm" colorScheme="blue" variant="subtle">
                                              <HStack spacing="0.25rem" align="center">
                                                <Icon as={FaPlus} boxSize="0.625rem" />
                                                <Text fontSize="xs">Nuevo</Text>
                                              </HStack>
                                            </Badge>
                                          )}
                                        </VStack>
                                        <HStack spacing="0.5rem" align="center">
                                          <Text fontSize="xs" color={textColor} fontWeight="medium">
                                            Cant. solicitada:
                                          </Text>
                                          {isLoadingOrderRequest ? (
                                            <Spinner size="xs" />
                                          ) : (
                                            <Text fontSize="sm" fontWeight="semibold">
                                              {product.requestedQuantity}
                                            </Text>
                                          )}
                                        </HStack>
                                      </Box>
                                      <IconButton
                                        aria-label="Eliminar producto"
                                        icon={<FaTrash />}
                                        size="xs"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleRemoveProduct(product.id)}
                                        flexShrink={0}
                                      />
                                    </Flex>

                                    {/* Fila inferior: Cantidad real + Peso */}
                                    <Flex justify="space-between" align="center">
                                      <VStack spacing="0.25rem" align="center">
                                        <HStack spacing="0.25rem">
                                          <Text fontSize="xs" color={textColor} fontWeight="medium">
                                            Cant. real
                                          </Text>
                                          {isQuantityExceedsStock(product) && (
                                            <Tooltip
                                              label={`Stock total: ${product.stock || 0} | Stock disponible: ${product.availableStock || 0}`}
                                              placement="top"
                                              hasArrow
                                              bg="red.500"
                                              color="white"
                                            >
                                              <Icon as={FaExclamationTriangle} color="red.500" boxSize="0.75rem" />
                                            </Tooltip>
                                          )}
                                        </HStack>
                                        <HStack spacing={0}>
                                          <IconButton
                                            aria-label="Disminuir cantidad"
                                            icon={<Text fontSize="sm">−</Text>}
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              const newValue =
                                                product.unitType === UnitType.KILO
                                                  ? Math.max(0.5, product.actualQuantity - 0.5)
                                                  : Math.max(1, product.actualQuantity - 1);
                                              const rounded = parseFloat(newValue.toFixed(1));
                                              handleQuantityChange(product.id, rounded);
                                              setQuantityInputs((prev) => ({
                                                ...prev,
                                                [product.id]: rounded.toString(),
                                              }));
                                            }}
                                            borderRightRadius={0}
                                          />
                                          <Input
                                            size="sm"
                                            value={quantityInputs[product.id] ?? product.actualQuantity}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const regex =
                                                product.unitType === UnitType.KILO ? /^\d*\.?\d*$/ : /^\d*$/;
                                              if (regex.test(value) || value === '') {
                                                setQuantityInputs((prev) => ({ ...prev, [product.id]: value }));
                                                const numValue =
                                                  product.unitType === UnitType.KILO
                                                    ? parseFloat(value)
                                                    : parseInt(value, 10);
                                                if (!isNaN(numValue) && numValue >= 0) {
                                                  handleQuantityChange(product.id, numValue);
                                                } else if (value === '' || value === '.') {
                                                  handleQuantityChange(product.id, 0);
                                                }
                                              }
                                            }}
                                            onBlur={(e) => {
                                              const value =
                                                product.unitType === UnitType.KILO
                                                  ? parseFloat(e.target.value)
                                                  : parseInt(e.target.value, 10);
                                              if (isNaN(value) || value <= 0) {
                                                handleQuantityChange(product.id, 1);
                                                setQuantityInputs((prev) => ({ ...prev, [product.id]: '1' }));
                                              } else {
                                                setQuantityInputs((prev) => ({
                                                  ...prev,
                                                  [product.id]: value.toString(),
                                                }));
                                              }
                                            }}
                                            w="3.5rem"
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
                                              const newValue =
                                                product.unitType === UnitType.KILO
                                                  ? product.actualQuantity + 0.5
                                                  : product.actualQuantity + 1;
                                              const rounded = parseFloat(newValue.toFixed(1));
                                              handleQuantityChange(product.id, rounded);
                                              setQuantityInputs((prev) => ({
                                                ...prev,
                                                [product.id]: rounded.toString(),
                                              }));
                                            }}
                                            borderLeftRadius={0}
                                          />
                                        </HStack>
                                      </VStack>
                                      <VStack spacing="0.25rem" align="center">
                                        <Text fontSize="xs" color={textColor} fontWeight="medium">
                                          Peso (g)
                                        </Text>
                                        <Input
                                          size="sm"
                                          value={
                                            product.unitType === UnitType.KILO
                                              ? (weightInputs[product.id] ?? product.weight ?? '')
                                              : 'N/A'
                                          }
                                          onChange={(e) => {
                                            if (product.unitType === UnitType.KILO) {
                                              const value = e.target.value;
                                              const regex = /^\d*\.?\d*$/;
                                              if (regex.test(value) || value === '') {
                                                setWeightInputs((prev) => ({ ...prev, [product.id]: value }));
                                                const numValue = parseFloat(value);
                                                if (!isNaN(numValue) && numValue >= 0) {
                                                  handleWeightChange(product.id, numValue);
                                                } else if (value === '' || value === '.') {
                                                  handleWeightChange(product.id, 0);
                                                }
                                              }
                                            }
                                          }}
                                          onBlur={(e) => {
                                            if (product.unitType === UnitType.KILO) {
                                              const value = parseFloat(e.target.value);
                                              if (isNaN(value) || value <= 0) {
                                                handleWeightChange(product.id, 0);
                                                setWeightInputs((prev) => ({ ...prev, [product.id]: '0' }));
                                              } else {
                                                setWeightInputs((prev) => ({
                                                  ...prev,
                                                  [product.id]: value.toString(),
                                                }));
                                              }
                                            }
                                          }}
                                          isDisabled={product.unitType !== UnitType.KILO}
                                          w="5rem"
                                          textAlign="center"
                                          borderRadius="md"
                                          bg={product.unitType === UnitType.KILO ? 'transparent' : inputBg}
                                        />
                                      </VStack>
                                    </Flex>
                                  </Box>
                                </Box>
                              ))}
                            </VStack>
                          </>
                        ) : (
                          <Box
                            p="2rem"
                            textAlign="center"
                            border="1px solid"
                            borderColor={inputBorder}
                            borderRadius="md"
                            bg={inputBg}
                          >
                            <Text color={textColor}>No hay productos para preparar</Text>
                          </Box>
                        )}
                      </FormControl>

                      {/* Cajones */}
                      <FormControl isInvalid={!!formik.errors.crates && formik.touched.crates}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiPackage} boxSize="1rem" />
                            <Text>Cajones a utilizar</Text>
                          </HStack>
                        </FormLabel>
                        <NumberInput
                          value={formik.values.crates}
                          onChange={(_, valueAsNumber) => {
                            const newValue = isNaN(valueAsNumber) ? 0 : valueAsNumber;
                            formik.setFieldValue('crates', newValue);
                            formik.setFieldTouched('crates', true);
                          }}
                          onBlur={() => formik.setFieldTouched('crates', true)}
                          min={1}
                        >
                          <NumberInputField placeholder="Número de cajones" bg={inputBg} borderColor={inputBorder} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>{formik.errors.crates}</FormErrorMessage>
                      </FormControl>

                      {/* Observaciones */}
                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" />
                            <Text>Observaciones</Text>
                          </HStack>
                        </FormLabel>
                        <Textarea
                          bg={inputBg}
                          borderColor={inputBorder}
                          {...formik.getFieldProps('observations')}
                          placeholder="Observaciones de la preparación..."
                          rows={4}
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
              <Button variant="ghost" onClick={handleOverlayClick} disabled={isLoading} size="sm">
                Cancelar
              </Button>
              <Button
                form="order-prepare-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                leftIcon={<FaCheck />}
                isLoading={isLoading}
                loadingText="Preparando..."
                size="sm"
              >
                Completar
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
