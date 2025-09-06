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
  useToast,
  VStack,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
  Textarea,
  Box,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Divider,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { FiUsers, FiCalendar, FiFileText, FiEdit, FiShoppingCart } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { useEffect, useState, useRef, Fragment, useMemo, useCallback } from 'react';
import { Purchase } from '@/entities/purchase';
import { useUpdatePurchase } from '@/hooks/purchase';
import { useGetSuppliers } from '@/hooks/supplier';
import { useGetProducts } from '@/hooks/product';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type PurchaseEditProps = {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase;
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
};

export const PurchaseEdit = ({ isOpen, onClose, purchase, setPurchases }: PurchaseEditProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const borderDropdown = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgDropdown = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  // Estados para la búsqueda de proveedores
  const [supplierSearch, setSupplierSearch] = useState(purchase.supplier?.name || '');
  const [supplierSearchType, setSupplierSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<{ id: number; name: string } | null>(
    purchase.supplier ? { id: purchase.supplier.id, name: purchase.supplier.name } : null,
  );
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState('');
  const supplierSearchRef = useRef<HTMLDivElement>(null);

  // Estados para productos seleccionados - Inicializar con los productos existentes
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{
      id: number;
      name: string;
      quantity: number;
      weight: number;
      unitPrice: number;
      discount: number;
    }>
  >(
    purchase.productItems?.map((item) => ({
      id: item.product?.id || 0,
      name: item.product?.name || '',
      quantity: item.quantity,
      weight: item.weight || 0,
      unitPrice: item.unitPrice,
      discount: item.discount,
    })) || [],
  );

  // Estados para búsqueda de productos
  const [productSearch, setProductSearch] = useState('');
  const [productSearchType, setProductSearchType] = useState<'name' | 'internalCode'>('name');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [debouncedProductSearch, setDebouncedProductSearch] = useState('');
  const productSearchRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, fieldError, mutate } = useUpdatePurchase();

  // Configuración de búsqueda de proveedores
  const supplierFilterValue = useMemo(() => {
    if (debouncedSupplierSearch.length >= 2 && supplierSearchType === 'name') {
      return debouncedSupplierSearch;
    }
    return undefined;
  }, [debouncedSupplierSearch, supplierSearchType]);

  const { data: suppliersSearch = [], isLoading: isLoadingSuppliers } = useGetSuppliers(1, 10, supplierFilterValue);

  // Variables para controlar el estado de búsqueda de proveedores
  const isTypingSuppliers = supplierSearch !== debouncedSupplierSearch && supplierSearch.length >= 2;
  const isSearchingSuppliers = !isTypingSuppliers && isLoadingSuppliers && debouncedSupplierSearch.length >= 2;
  const searchCompleted = !isTypingSuppliers && !isSearchingSuppliers && debouncedSupplierSearch.length >= 2;

  // Configuración de búsqueda de productos
  const productSearchParams = useMemo(() => {
    if (debouncedProductSearch.length >= 2 && selectedSupplier) {
      return { [productSearchType]: debouncedProductSearch };
    }
    return {};
  }, [debouncedProductSearch, productSearchType, selectedSupplier]);

  const { data: productsSearch, isLoading: isLoadingProducts } = useGetProducts(1, 10, productSearchParams);

  // Variables para controlar el estado de búsqueda de productos
  const isTypingProducts = productSearch !== debouncedProductSearch && productSearch.length >= 2;
  const isSearchingProducts =
    !isTypingProducts && isLoadingProducts && debouncedProductSearch.length >= 2 && selectedSupplier;
  const productSearchCompleted =
    !isTypingProducts && !isSearchingProducts && debouncedProductSearch.length >= 2 && selectedSupplier;

  // Debounce para búsqueda de proveedores
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSupplierSearch(supplierSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [supplierSearch]);

  // Debounce para búsqueda de productos
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (supplierSearchRef.current && !supplierSearchRef.current.contains(event.target as Node)) {
        setShowSupplierDropdown(false);
      }
      if (productSearchRef.current && !productSearchRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    setShowConfirmDialog(false);
    setSupplierSearch(purchase.supplier?.name || '');
    setSelectedSupplier(purchase.supplier ? { id: purchase.supplier.id, name: purchase.supplier.name } : null);
    setSelectedProducts(
      purchase.productItems?.map((item) => ({
        id: item.product?.id || 0,
        name: item.product?.name || '',
        quantity: item.quantity,
        weight: item.weight || 0,
        unitPrice: item.unitPrice,
        discount: item.discount,
      })) || [],
    );
    setProductSearch('');
    setShowSupplierDropdown(false);
    setShowProductDropdown(false);
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

  const handleSupplierSelect = (supplier: { id: number; name: string }) => {
    setSelectedSupplier(supplier);
    setSupplierSearch(supplier.name);
    setShowSupplierDropdown(false);
    // Limpiar productos si se cambia el proveedor
    if (supplier.id !== selectedSupplier?.id) {
      setSelectedProducts([]);
    }
  };

  const handleProductSelect = useCallback((product: any) => {
    const newProduct = {
      id: product.id,
      name: product.name,
      quantity: 1,
      weight: 0,
      unitPrice: product.price || 0,
      discount: 0,
    };
    setSelectedProducts((prev) => [...prev, newProduct]);
    setProductSearch('');
    setShowProductDropdown(false);
  }, []);

  const handleRemoveProduct = useCallback((productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const handleProductFieldChange = useCallback((productId: number, field: string, value: any) => {
    setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, [field]: value } : p)));
  }, []);

  // Calcular el total
  const totalAmount = selectedProducts.reduce((total, product) => {
    return total + product.quantity * product.unitPrice * (1 - product.discount / 100);
  }, 0);

  useEffect(() => {
    if (data) {
      toast({
        title: 'Factura actualizada',
        description: 'La factura ha sido actualizada correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setPurchases((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      handleClose();
    }
  }, [data, setPurchases, toast]);

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

  const handleSubmit = async (values: any) => {
    if (!selectedSupplier) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar un proveedor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (selectedProducts.length === 0) {
      toast({
        title: 'Error',
        description: 'Debe agregar al menos un producto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedPurchase = {
      id: purchase.id,
      supplierId: selectedSupplier.id,
      invoiceNumber: values.invoiceNumber,
      date: values.date,
      observations: values.observations,
      productItems: selectedProducts.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        weight: product.weight,
        unitPrice: product.unitPrice,
        discount: product.discount,
      })),
    };
    await mutate(updatedPurchase);
  };

  const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.invoiceNumber) {
      errors.invoiceNumber = 'El número de factura es requerido';
    }

    if (!values.date) {
      errors.date = 'La fecha es requerida';
    }

    return errors;
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
            Editar factura #{purchase.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                supplierId: '',
                invoiceNumber: purchase.invoiceNumber || '',
                date: purchase.date || new Date().toISOString(),
                observations: purchase.observations || '',
              }}
              onSubmit={handleSubmit}
              validate={validateForm}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="purchase-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Field name="supplierId">
                        {() => (
                          <FormControl>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiUsers} boxSize="1rem" />
                                <Text>Proveedor</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>

                            {/* Búsqueda de proveedores */}
                            <Box position="relative" ref={supplierSearchRef}>
                              <Flex
                                bg={inputBg}
                                borderRadius="md"
                                overflow="hidden"
                                border="1px solid"
                                borderColor={inputBorder}
                              >
                                <Select
                                  value={supplierSearchType}
                                  onChange={(e) => setSupplierSearchType(e.target.value as any)}
                                  bg="transparent"
                                  border="none"
                                  w="auto"
                                  minW="7rem"
                                  borderRadius="none"
                                  _focus={{ boxShadow: 'none' }}
                                  disabled={isLoading}
                                >
                                  <option value="name">Nombre</option>
                                  <option value="rut">RUT</option>
                                  <option value="razonSocial">Razón social</option>
                                  <option value="contactName">Contacto</option>
                                </Select>

                                <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

                                <InputGroup flex="1">
                                  <Input
                                    placeholder="Buscar proveedor..."
                                    value={supplierSearch}
                                    onChange={(e) => {
                                      setSupplierSearch(e.target.value);
                                      setSelectedSupplier(null);
                                      if (e.target.value.length >= 2) {
                                        setShowSupplierDropdown(true);
                                      }
                                    }}
                                    onFocus={() => {
                                      if (supplierSearch.length >= 2) {
                                        setShowSupplierDropdown(true);
                                      }
                                    }}
                                    bg="transparent"
                                    border="none"
                                    borderRadius="none"
                                    _placeholder={{ color: textColor }}
                                    color={textColor}
                                    _focus={{ boxShadow: 'none' }}
                                    pl="1rem"
                                    disabled={isLoading}
                                  />
                                  <InputRightElement>
                                    <IconButton
                                      aria-label="Buscar"
                                      icon={<AiOutlineSearch size="1.25rem" />}
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        if (supplierSearch.length >= 2) {
                                          setShowSupplierDropdown(true);
                                        }
                                      }}
                                      disabled={isLoading}
                                    />
                                  </InputRightElement>
                                </InputGroup>
                              </Flex>

                              {showSupplierDropdown && (
                                <Box
                                  position="absolute"
                                  top="100%"
                                  left={0}
                                  right={0}
                                  mt="0.25rem"
                                  maxH="12rem"
                                  overflowY="auto"
                                  bg={bgDropdown}
                                  border="1px solid"
                                  borderColor={borderDropdown}
                                  borderRadius="md"
                                  boxShadow="lg"
                                  zIndex={10}
                                >
                                  {(() => {
                                    if (isTypingSuppliers || isSearchingSuppliers) {
                                      return (
                                        <Flex justify="center" align="center" p="1rem" gap="0.5rem">
                                          <Spinner size="sm" />
                                          <Text fontSize="sm" color={textColor}>
                                            Buscando proveedores...
                                          </Text>
                                        </Flex>
                                      );
                                    }

                                    if (searchCompleted && suppliersSearch && suppliersSearch.length > 0) {
                                      return (
                                        <List>
                                          {suppliersSearch.map((supplier, index) => (
                                            <Fragment key={supplier.id}>
                                              <ListItem
                                                p="0.75rem"
                                                cursor="pointer"
                                                _hover={{ bg: hoverBg }}
                                                onClick={() => handleSupplierSelect(supplier)}
                                              >
                                                <Text fontSize="sm" fontWeight="medium">
                                                  {supplier.name}
                                                </Text>
                                                <Text fontSize="xs" color={textColor}>
                                                  {supplier.rut && `RUT: ${supplier.rut}`}
                                                  {supplier.contactName && ` - Contacto: ${supplier.contactName}`}
                                                </Text>
                                              </ListItem>
                                              {index < suppliersSearch.length - 1 && <Divider />}
                                            </Fragment>
                                          ))}
                                        </List>
                                      );
                                    }

                                    if (searchCompleted && suppliersSearch && suppliersSearch.length === 0) {
                                      return (
                                        <Text p="1rem" fontSize="sm" color={textColor} textAlign="center">
                                          No se encontraron proveedores
                                        </Text>
                                      );
                                    }

                                    if (supplierSearch.length < 2) {
                                      return (
                                        <Text p="1rem" fontSize="sm" color={textColor} textAlign="center">
                                          Escribe al menos 2 caracteres para buscar
                                        </Text>
                                      );
                                    }

                                    return null;
                                  })()}
                                </Box>
                              )}
                            </Box>

                            {submitCount > 0 && !selectedSupplier && (
                              <Text color="red.500" fontSize="sm" mt="0.25rem">
                                Debe seleccionar un proveedor
                              </Text>
                            )}
                          </FormControl>
                        )}
                      </Field>

                      <Field name="date">
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

                      <Field name="invoiceNumber">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.invoiceNumber && !!errors.invoiceNumber}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Número de factura</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el número de factura"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.invoiceNumber}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      {/* Sección de productos */}
                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiShoppingCart} boxSize="1rem" />
                            <Text>Productos</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>

                        {/* Mostrar mensaje si no hay proveedor seleccionado */}
                        {!selectedSupplier ? (
                          <Flex
                            justifyContent="center"
                            alignItems="center"
                            h="2.5rem"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            borderRadius="md"
                          >
                            <Text fontSize="sm" color={textColor}>
                              Seleccione un proveedor para agregar productos
                            </Text>
                          </Flex>
                        ) : (
                          <>
                            {/* Búsqueda de productos */}
                            <Box position="relative" ref={productSearchRef}>
                              <Flex
                                bg={inputBg}
                                borderRadius="md"
                                overflow="hidden"
                                border="1px solid"
                                borderColor={inputBorder}
                              >
                                <Select
                                  value={productSearchType}
                                  onChange={(e) => setProductSearchType(e.target.value as any)}
                                  bg="transparent"
                                  border="none"
                                  w="auto"
                                  minW="7rem"
                                  borderRadius="none"
                                  _focus={{ boxShadow: 'none' }}
                                  disabled={isLoading}
                                >
                                  <option value="name">Nombre</option>
                                  <option value="internalCode">Código</option>
                                </Select>

                                <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

                                <InputGroup flex="1">
                                  <Input
                                    placeholder="Buscar producto..."
                                    value={productSearch}
                                    onChange={(e) => {
                                      setProductSearch(e.target.value);
                                      if (e.target.value.length >= 2) {
                                        setShowProductDropdown(true);
                                      }
                                    }}
                                    onFocus={() => {
                                      if (productSearch.length >= 2) {
                                        setShowProductDropdown(true);
                                      }
                                    }}
                                    bg="transparent"
                                    border="none"
                                    borderRadius="none"
                                    color={textColor}
                                    _focus={{ boxShadow: 'none' }}
                                    pl="1rem"
                                    disabled={isLoading}
                                  />
                                  <InputRightElement>
                                    <IconButton
                                      aria-label="Buscar"
                                      icon={<AiOutlineSearch size="1.25rem" />}
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        if (productSearch.length >= 2) {
                                          setShowProductDropdown(true);
                                        }
                                      }}
                                      disabled={isLoading}
                                    />
                                  </InputRightElement>
                                </InputGroup>
                              </Flex>

                              {showProductDropdown && (
                                <Box
                                  position="absolute"
                                  top="100%"
                                  left={0}
                                  right={0}
                                  mt="0.25rem"
                                  maxH="12rem"
                                  overflowY="auto"
                                  bg={bgDropdown}
                                  border="1px solid"
                                  borderColor={borderDropdown}
                                  borderRadius="md"
                                  boxShadow="lg"
                                  zIndex={10}
                                >
                                  {(() => {
                                    if (isTypingProducts || isSearchingProducts) {
                                      return (
                                        <Flex justify="center" align="center" p="1rem" gap="0.5rem">
                                          <Spinner size="sm" />
                                          <Text fontSize="sm" color={textColor}>
                                            Buscando productos...
                                          </Text>
                                        </Flex>
                                      );
                                    }

                                    if (productSearchCompleted && productsSearch && productsSearch.length > 0) {
                                      return (
                                        <List>
                                          {productsSearch.map((product, index) => {
                                            const isSelected = selectedProducts.some((p) => p.id === product.id);
                                            return (
                                              <Fragment key={product.id}>
                                                <ListItem
                                                  p="0.75rem"
                                                  cursor="pointer"
                                                  _hover={{ bg: hoverBg }}
                                                  opacity={isSelected ? 0.5 : 1}
                                                  onClick={() => !isSelected && handleProductSelect(product)}
                                                >
                                                  <Text fontSize="sm" fontWeight="medium">
                                                    {product.name}
                                                  </Text>
                                                  <Text fontSize="xs" color={textColor}>
                                                    Precio: ${product.price || 0}
                                                    {product.internalCode && ` - Cód: ${product.internalCode}`}
                                                  </Text>
                                                  {isSelected && (
                                                    <Text fontSize="xs" color="green.500">
                                                      Seleccionado
                                                    </Text>
                                                  )}
                                                </ListItem>
                                                {index < productsSearch.length - 1 && <Divider />}
                                              </Fragment>
                                            );
                                          })}
                                        </List>
                                      );
                                    }

                                    if (productSearchCompleted && productsSearch && productsSearch.length === 0) {
                                      return (
                                        <Text p="1rem" fontSize="sm" color={textColor} textAlign="center">
                                          No se encontraron productos
                                        </Text>
                                      );
                                    }

                                    if (productSearch.length < 2) {
                                      return (
                                        <Text p="1rem" fontSize="sm" color={textColor} textAlign="center">
                                          Escribe al menos 2 caracteres para buscar
                                        </Text>
                                      );
                                    }

                                    return null;
                                  })()}
                                </Box>
                              )}
                            </Box>

                            {submitCount > 0 && selectedProducts.length === 0 && (
                              <Text color="red.500" fontSize="sm" mt="0.5rem">
                                Debe agregar al menos un producto
                              </Text>
                            )}

                            {/* Lista de productos seleccionados */}
                            {selectedProducts.length > 0 && (
                              <Box mt="1rem">
                                <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                                  Productos seleccionados ({selectedProducts.length}):
                                </Text>
                                <VStack spacing="0.5rem" align="stretch">
                                  {selectedProducts.map((product) => {
                                    const subtotal =
                                      product.quantity * product.unitPrice * (1 - product.discount / 100);
                                    return (
                                      <Box
                                        key={product.id}
                                        p={{ base: '1rem', md: '0.75rem' }}
                                        border="1px solid"
                                        borderColor={inputBorder}
                                        borderRadius="md"
                                        bg={inputBg}
                                      >
                                        {/* Desktop Layout - Dos filas */}
                                        <Box display={{ base: 'none', md: 'block' }}>
                                          {/* Primera fila: Imagen, Nombre y Botón eliminar */}
                                          <Flex align="center" gap="1rem" mb="0.75rem">
                                            {/* Imagen */}
                                            <Image
                                              src={'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                                              alt={product.name}
                                              boxSize="50px"
                                              objectFit="cover"
                                              borderRadius="md"
                                              flexShrink={0}
                                            />

                                            {/* Nombre */}
                                            <Box flex="1">
                                              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                                {product.name}
                                              </Text>
                                            </Box>

                                            {/* Delete Button */}
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

                                          {/* Segunda fila: Inputs y Subtotal */}
                                          <Flex align="center" justify="space-around">
                                            {/* Quantity Input */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Cantidad
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.quantity}
                                                min={1}
                                                max={9999}
                                                onChange={(valueString) => {
                                                  const value = parseInt(valueString) || 1;
                                                  handleProductFieldChange(product.id, 'quantity', value);
                                                }}
                                                w="5rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>

                                            {/* Weight Input */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Peso (g)
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.weight}
                                                min={0}
                                                precision={0}
                                                step={1}
                                                onChange={(valueString) => {
                                                  const value = parseInt(valueString) || 0;
                                                  handleProductFieldChange(product.id, 'weight', value);
                                                }}
                                                w="5rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>

                                            {/* Unit Price Input */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Precio
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.unitPrice}
                                                min={0}
                                                precision={2}
                                                step={0.01}
                                                onChange={(valueString) => {
                                                  const value = parseFloat(valueString) || 0;
                                                  handleProductFieldChange(product.id, 'unitPrice', value);
                                                }}
                                                w="6rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>

                                            {/* Discount Input */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Descuento %
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.discount}
                                                min={0}
                                                max={100}
                                                precision={1}
                                                step={0.1}
                                                onChange={(valueString) => {
                                                  const value = parseFloat(valueString) || 0;
                                                  handleProductFieldChange(product.id, 'discount', value);
                                                }}
                                                w="4rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>

                                            {/* Subtotal */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Subtotal
                                              </Text>
                                              <Text fontSize="md" fontWeight="bold" textAlign="center">
                                                ${subtotal.toFixed(2)}
                                              </Text>
                                            </VStack>
                                          </Flex>
                                        </Box>

                                        {/* Mobile Layout - Tres filas */}
                                        <Box display={{ base: 'block', md: 'none' }} position="relative">
                                          {/* Delete button - absolute position top right */}
                                          <IconButton
                                            aria-label="Eliminar producto"
                                            icon={<FaTrash />}
                                            size="sm"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => handleRemoveProduct(product.id)}
                                            position="absolute"
                                            top="-0.5rem"
                                            right="-0.5rem"
                                            zIndex={1}
                                          />

                                          {/* Primera fila: Image + Name */}
                                          <Flex align="center" gap="0.75rem" mb="0.75rem" pr="3rem">
                                            <Image
                                              src={'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                                              alt={product.name}
                                              boxSize="50px"
                                              objectFit="cover"
                                              borderRadius="md"
                                              flexShrink={0}
                                            />
                                            <Box flex="1">
                                              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                                {product.name}
                                              </Text>
                                            </Box>
                                          </Flex>

                                          {/* Segunda fila: Cantidad y Peso */}
                                          <Flex justify="space-between" align="center" mb="0.75rem">
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor}>
                                                Cantidad
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.quantity}
                                                min={1}
                                                max={9999}
                                                onChange={(valueString) => {
                                                  const value = parseInt(valueString) || 1;
                                                  handleProductFieldChange(product.id, 'quantity', value);
                                                }}
                                                w="5rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor}>
                                                Peso (g)
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.weight}
                                                min={0}
                                                precision={0}
                                                step={1}
                                                onChange={(valueString) => {
                                                  const value = parseInt(valueString) || 0;
                                                  handleProductFieldChange(product.id, 'weight', value);
                                                }}
                                                w="5rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>
                                          </Flex>

                                          {/* Tercera fila: Precio, Descuento y Subtotal */}
                                          <VStack spacing="0.75rem" align="stretch">
                                            <Flex justify="space-between" align="center">
                                              <VStack spacing="0.25rem" align="center">
                                                <Text fontSize="xs" color={textColor}>
                                                  Precio
                                                </Text>
                                                <NumberInput
                                                  size="sm"
                                                  value={product.unitPrice}
                                                  min={0}
                                                  precision={2}
                                                  step={0.01}
                                                  onChange={(valueString) => {
                                                    const value = parseFloat(valueString) || 0;
                                                    handleProductFieldChange(product.id, 'unitPrice', value);
                                                  }}
                                                  w="6rem"
                                                >
                                                  <NumberInputField />
                                                  <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                  </NumberInputStepper>
                                                </NumberInput>
                                              </VStack>
                                              <VStack spacing="0.25rem" align="center">
                                                <Text fontSize="xs" color={textColor}>
                                                  Descuento %
                                                </Text>
                                                <NumberInput
                                                  size="sm"
                                                  value={product.discount}
                                                  min={0}
                                                  max={100}
                                                  precision={1}
                                                  step={0.1}
                                                  onChange={(valueString) => {
                                                    const value = parseFloat(valueString) || 0;
                                                    handleProductFieldChange(product.id, 'discount', value);
                                                  }}
                                                  w="4rem"
                                                >
                                                  <NumberInputField />
                                                  <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                  </NumberInputStepper>
                                                </NumberInput>
                                              </VStack>
                                            </Flex>

                                            <Box textAlign="center">
                                              <Text fontSize="sm" color={textColor}>
                                                Subtotal
                                              </Text>
                                              <Text fontSize="md" fontWeight="bold">
                                                ${subtotal.toFixed(2)}
                                              </Text>
                                            </Box>
                                          </VStack>
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
                                      ${totalAmount.toFixed(2)}
                                    </Text>
                                  </HStack>
                                </Box>
                              </Box>
                            )}
                          </>
                        )}
                      </FormControl>

                      {/* Campo de observaciones al final */}
                      <Field name="observations">
                        {({ field }: any) => (
                          <FormControl>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiEdit} boxSize="1rem" />
                                <Text>Observaciones</Text>
                              </HStack>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese observaciones adicionales (opcional)"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              rows={3}
                            />
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
                form="purchase-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Actualizando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Actualizar factura
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
