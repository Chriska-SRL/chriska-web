'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  VStack,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
  Box,
  Flex,
  Spinner,
  Checkbox,
  Image,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FiFileText } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { ReturnRequest } from '@/entities/returnRequest';
import { useUpdateReturnRequest } from '@/hooks/returnRequest';
import { useGetDeliveryById } from '@/hooks/delivery';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { UnitType } from '@/enums/unitType.enum';

type ReturnRequestEditProps = {
  returnRequest: ReturnRequest;
  isOpen: boolean;
  onClose: () => void;
  setReturnRequests: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
};

const validationSchema = Yup.object({
  observations: Yup.string().max(500, 'Las observaciones no pueden exceder 500 caracteres'),
});

export const ReturnRequestEdit = ({ returnRequest, isOpen, onClose, setReturnRequests }: ReturnRequestEditProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const labelColor = useColorModeValue('gray.700', 'gray.200');

  const [returnRequestProps, setReturnRequestProps] = useState<Partial<ReturnRequest>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productQuantities, setProductQuantities] = useState<{ [productId: number]: number }>({});
  const [productWeights, setProductWeights] = useState<{ [productId: number]: number }>({});
  const [quantityInputs, setQuantityInputs] = useState<{ [productId: number]: string }>({});
  const [weightInputs, setWeightInputs] = useState<{ [productId: number]: string }>({});
  const [selectedProducts, setSelectedProducts] = useState<{ [productId: number]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);

  const { data, isLoading, fieldError } = useUpdateReturnRequest(returnRequestProps);
  const { data: deliveryData, isLoading: isLoadingDelivery } = useGetDeliveryById(returnRequest.delivery?.id);

  // Function to get original delivered quantity for a product
  const getOriginalDeliveredQuantity = (productId: number) => {
    if (!deliveryData?.productItems) return 0;
    const deliveredItem = deliveryData.productItems.find((item) => item.product.id === productId);
    return deliveredItem?.quantity || 0;
  };

  // Function to get original delivered weight for a product
  const getOriginalDeliveredWeight = (productId: number) => {
    if (!deliveryData?.productItems) return 0;
    const deliveredItem = deliveryData.productItems.find((item) => item.product.id === productId);
    return deliveredItem?.weight || 0;
  };

  // Handle individual product selection
  const handleProductSelect = (productId: number, checked: boolean) => {
    setSelectedProducts((prev) => {
      const newSelection = { ...prev, [productId]: checked };

      // Update selectAll based on new selection state
      if (returnRequest.productItems) {
        const allSelected = returnRequest.productItems.every((item) => newSelection[item.product.id]);
        setSelectAll(allSelected);
      }

      return newSelection;
    });
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (returnRequest.productItems) {
      const newSelection: { [productId: number]: boolean } = {};
      returnRequest.productItems.forEach((item) => {
        newSelection[item.product.id] = checked;
      });
      setSelectedProducts(newSelection);
    }
  };

  // Initialize product quantities, weights and selection state
  useEffect(() => {
    if (returnRequest.productItems && isOpen && deliveryData) {
      const quantities: { [productId: number]: number } = {};
      const weights: { [productId: number]: number } = {};
      const quantityInputsInit: { [productId: number]: string } = {};
      const weightInputsInit: { [productId: number]: string } = {};
      const selection: { [productId: number]: boolean } = {};
      returnRequest.productItems.forEach((item) => {
        quantities[item.product.id] = item.quantity;
        // Set initial weight to delivered weight for KILO products
        const deliveredWeight = getOriginalDeliveredWeight(item.product.id);
        weights[item.product.id] = item.product?.unitType === UnitType.KILO ? deliveredWeight || item.weight || 0 : 0;
        quantityInputsInit[item.product.id] = item.quantity.toString();
        weightInputsInit[item.product.id] = weights[item.product.id].toString();
        selection[item.product.id] = false; // All products start unselected
      });
      setProductQuantities(quantities);
      setProductWeights(weights);
      setQuantityInputs(quantityInputsInit);
      setWeightInputs(weightInputsInit);
      setSelectedProducts(selection);
      setSelectAll(false);
    }
  }, [returnRequest.productItems, isOpen, deliveryData]);

  const handleSubmit = (values: any) => {
    // Only include selected products in the submission
    const selectedProductItems = Object.entries(productQuantities)
      .filter(([productId]) => selectedProducts[parseInt(productId)])
      .map(([productId, quantity]) => ({
        productId: parseInt(productId),
        quantity,
        weight: productWeights[parseInt(productId)] || 0,
      }));

    const formData: any = {
      id: returnRequest.id,
      observations: values.observations,
      productItems: selectedProductItems,
    };

    setReturnRequestProps(formData);
  };

  // Handle successful update
  useEffect(() => {
    if (data && returnRequestProps) {
      setReturnRequests((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      setReturnRequestProps(undefined);
      onClose();
      toast({
        title: 'Devolución actualizada',
        description: 'La devolución ha sido actualizada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [data, returnRequestProps, setReturnRequests, onClose, toast]);

  // Handle errors
  useEffect(() => {
    if (fieldError && returnRequestProps) {
      const errorMessage = fieldError.error || 'Ha ocurrido un error inesperado';
      toast({
        title: 'Error al actualizar devolución',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setReturnRequestProps(undefined);
    }
  }, [fieldError, returnRequestProps, toast]);

  const handleClose = () => {
    onClose();
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
        size={{ base: 'xs', md: 'xl' }}
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
            Editar Devolución #{returnRequest.id}
          </ModalHeader>
          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                observations: returnRequest.observations || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ errors, touched, submitCount }) => {
                return (
                  <Form id="return-request-edit-form">
                    <VStack spacing="1rem" align="stretch">
                      {/* Productos de la entrega */}
                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} />
                            <Text>Productos de la entrega</Text>
                          </HStack>
                        </FormLabel>

                        {returnRequest.productItems && returnRequest.productItems.length > 0 ? (
                          <>
                            <HStack mb="0.57rem" justify="flex-start" align="center">
                              <Text fontSize="sm" fontWeight="medium">
                                Seleccionar todos
                              </Text>
                              <Checkbox
                                isChecked={selectAll}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                size="md"
                                colorScheme="blue"
                              />
                            </HStack>
                            <VStack spacing="0.5rem" align="stretch">
                              {returnRequest.productItems.map((item) => {
                                const currentReturnQuantity = productQuantities[item.product.id] || 0;
                                const currentReturnWeight = productWeights[item.product.id] || 0;
                                const originalDeliveredQuantity = getOriginalDeliveredQuantity(item.product.id);
                                const originalDeliveredWeight = getOriginalDeliveredWeight(item.product.id);
                                const maxQuantity = originalDeliveredQuantity || item.quantity;
                                const maxWeight = originalDeliveredWeight || item.weight || 0;
                                const isSelected = selectedProducts[item.product.id] || false;

                                return (
                                  <Box
                                    key={item.product.id}
                                    p={{ base: '1rem', md: '0.75rem' }}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    borderRadius="md"
                                    bg={inputBg}
                                    opacity={isSelected ? 1 : 0.6}
                                    transition="opacity 0.2s"
                                  >
                                    {/* Desktop Layout */}
                                    <VStack display={{ base: 'none', md: 'flex' }} spacing="0.75rem" align="stretch">
                                      {/* First row - image, name, price, checkbox */}
                                      <Flex align="center" gap="1rem">
                                        <Image
                                          src={
                                            item.product?.imageUrl ||
                                            'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                          }
                                          alt={item.product?.name || 'Producto'}
                                          boxSize="50px"
                                          objectFit="cover"
                                          borderRadius="md"
                                          flexShrink={0}
                                        />
                                        <Box flex="1">
                                          <Text fontSize="sm" fontWeight="medium" mb="0.25rem" noOfLines={1}>
                                            {item.product?.name || '-'}
                                          </Text>
                                          <Text fontSize="xs" color={textColor}>
                                            ${item.product?.price?.toFixed(2) || '-'}
                                          </Text>
                                        </Box>
                                        <Checkbox
                                          isChecked={isSelected}
                                          onChange={(e) => handleProductSelect(item.product.id, e.target.checked)}
                                          size="md"
                                          colorScheme="blue"
                                          alignSelf="flex-start"
                                        />
                                      </Flex>

                                      {/* Second row - quantities and weights */}
                                      <HStack spacing="0.5rem" justify="space-around">
                                        <VStack spacing="0.25rem" align="center" minW="100px">
                                          <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                            Cant. entregada
                                          </Text>
                                          {isLoadingDelivery ? (
                                            <Spinner size="sm" />
                                          ) : (
                                            <Text fontSize="sm" fontWeight="semibold">
                                              {originalDeliveredQuantity || '-'}
                                            </Text>
                                          )}
                                        </VStack>

                                        <VStack spacing="0.25rem" align="center" minW="120px">
                                          <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                            Cant. a devolver
                                          </Text>
                                          <HStack spacing={0}>
                                            <IconButton
                                              aria-label="Disminuir cantidad"
                                              icon={<Text fontSize="sm">−</Text>}
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                const decrement = item.product?.unitType === UnitType.KILO ? 0.5 : 1;
                                                const minimum = item.product?.unitType === UnitType.KILO ? 0.5 : 1;
                                                const newValue = Math.max(minimum, currentReturnQuantity - decrement);
                                                const rounded = parseFloat(newValue.toFixed(1));
                                                setProductQuantities((prev) => ({
                                                  ...prev,
                                                  [item.product.id]: rounded,
                                                }));
                                                setQuantityInputs((prev) => ({
                                                  ...prev,
                                                  [item.product.id]: rounded.toString(),
                                                }));
                                              }}
                                              borderRightRadius={0}
                                              isDisabled={!isSelected}
                                            />
                                            <Input
                                              size="sm"
                                              value={quantityInputs[item.product.id] ?? currentReturnQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const regex =
                                                  item.product?.unitType === UnitType.KILO ? /^\d*\.?\d*$/ : /^\d*$/;
                                                if (regex.test(value) || value === '') {
                                                  setQuantityInputs((prev) => ({ ...prev, [item.product.id]: value }));
                                                  const numValue =
                                                    item.product?.unitType === UnitType.KILO
                                                      ? parseFloat(value)
                                                      : parseInt(value, 10);
                                                  const minimum = item.product?.unitType === UnitType.KILO ? 0.5 : 1;
                                                  if (
                                                    !isNaN(numValue) &&
                                                    numValue >= minimum &&
                                                    numValue <= maxQuantity
                                                  ) {
                                                    setProductQuantities((prev) => ({
                                                      ...prev,
                                                      [item.product.id]: numValue,
                                                    }));
                                                  } else if (value === '' || value === '.') {
                                                    setProductQuantities((prev) => ({
                                                      ...prev,
                                                      [item.product.id]: minimum,
                                                    }));
                                                  }
                                                }
                                              }}
                                              w="3.5rem"
                                              p="0"
                                              textAlign="center"
                                              borderRadius={0}
                                              borderLeft="none"
                                              borderRight="none"
                                              isDisabled={!isSelected}
                                            />
                                            <IconButton
                                              aria-label="Aumentar cantidad"
                                              icon={<Text fontSize="sm">+</Text>}
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                const increment = item.product?.unitType === UnitType.KILO ? 0.5 : 1;
                                                const newValue = Math.min(
                                                  maxQuantity,
                                                  currentReturnQuantity + increment,
                                                );
                                                const rounded = parseFloat(newValue.toFixed(1));
                                                setProductQuantities((prev) => ({
                                                  ...prev,
                                                  [item.product.id]: rounded,
                                                }));
                                                setQuantityInputs((prev) => ({
                                                  ...prev,
                                                  [item.product.id]: rounded.toString(),
                                                }));
                                              }}
                                              borderLeftRadius={0}
                                              isDisabled={!isSelected}
                                            />
                                          </HStack>
                                        </VStack>

                                        <VStack spacing="0.25rem" align="center" minW="100px">
                                          <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                            Peso entregado (g)
                                          </Text>
                                          {isLoadingDelivery ? (
                                            <Spinner size="sm" />
                                          ) : (
                                            <Text fontSize="sm" fontWeight="semibold">
                                              {item.product?.unitType === UnitType.KILO
                                                ? originalDeliveredWeight || '-'
                                                : 'N/A'}
                                            </Text>
                                          )}
                                        </VStack>

                                        <VStack spacing="0.25rem" align="center" minW="120px">
                                          <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                            Peso a devolver (g)
                                          </Text>
                                          <Input
                                            size="sm"
                                            value={
                                              item.product?.unitType === UnitType.KILO
                                                ? (weightInputs[item.product.id] ?? currentReturnWeight)
                                                : 'N/A'
                                            }
                                            onChange={(e) => {
                                              if (item.product?.unitType === UnitType.KILO) {
                                                const value = e.target.value;
                                                const regex = /^\d*\.?\d*$/;
                                                if (regex.test(value) || value === '') {
                                                  setWeightInputs((prev) => ({ ...prev, [item.product.id]: value }));
                                                  const numValue = parseFloat(value);
                                                  if (!isNaN(numValue) && numValue > 0 && numValue <= maxWeight) {
                                                    setProductWeights((prev) => ({
                                                      ...prev,
                                                      [item.product.id]: numValue,
                                                    }));
                                                  } else if (value === '' || value === '.') {
                                                    const defaultWeight =
                                                      getOriginalDeliveredWeight(item.product.id) || 1;
                                                    setProductWeights((prev) => ({
                                                      ...prev,
                                                      [item.product.id]: defaultWeight,
                                                    }));
                                                  }
                                                }
                                              }
                                            }}
                                            w="80px"
                                            isDisabled={!isSelected || item.product?.unitType !== UnitType.KILO}
                                            textAlign="center"
                                            borderRadius="md"
                                          />
                                        </VStack>
                                      </HStack>
                                    </VStack>

                                    {/* Mobile Layout */}
                                    <VStack display={{ base: 'flex', md: 'none' }} spacing="0.75rem" align="stretch">
                                      {/* First row - image, name, price, checkbox */}
                                      <Flex align="center" gap="0.75rem">
                                        <Image
                                          src={
                                            item.product?.imageUrl ||
                                            'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                          }
                                          alt={item.product?.name || 'Producto'}
                                          boxSize="50px"
                                          objectFit="cover"
                                          borderRadius="md"
                                          flexShrink={0}
                                        />
                                        <Box flex="1">
                                          <Text fontSize="sm" fontWeight="medium" mb="0.25rem" noOfLines={1}>
                                            {item.product?.name || '-'}
                                          </Text>
                                          <Text fontSize="xs" color={textColor}>
                                            ${item.product?.price?.toFixed(2) || '-'}
                                          </Text>
                                        </Box>
                                        <Checkbox
                                          isChecked={isSelected}
                                          onChange={(e) => handleProductSelect(item.product.id, e.target.checked)}
                                          size="md"
                                          colorScheme="blue"
                                          alignSelf="flex-start"
                                        />
                                      </Flex>

                                      {/* Second row - quantities and weights */}
                                      <VStack spacing="0.5rem" align="stretch">
                                        {/* Delivered info */}
                                        <Flex justify="space-between" align="center">
                                          <VStack spacing="0.25rem" align="center" ml="0.625rem">
                                            <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                              Cant. entregada
                                            </Text>
                                            {isLoadingDelivery ? (
                                              <Spinner size="xs" />
                                            ) : (
                                              <Text fontSize="sm" fontWeight="semibold">
                                                {originalDeliveredQuantity || '-'}
                                              </Text>
                                            )}
                                          </VStack>

                                          <VStack spacing="0.25rem" align="center">
                                            <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                              Peso entregado (g)
                                            </Text>
                                            {isLoadingDelivery ? (
                                              <Spinner size="xs" />
                                            ) : (
                                              <Text fontSize="sm" fontWeight="semibold">
                                                {item.product?.unitType === UnitType.KILO
                                                  ? originalDeliveredWeight || '-'
                                                  : 'N/A'}
                                              </Text>
                                            )}
                                          </VStack>
                                        </Flex>

                                        {/* Return inputs */}
                                        <Flex justify="space-between" align="end">
                                          <VStack spacing="0.25rem" align="center">
                                            <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                              Cant. a devolver
                                            </Text>
                                            <HStack spacing={0}>
                                              <IconButton
                                                aria-label="Disminuir cantidad"
                                                icon={<Text fontSize="sm">−</Text>}
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                  const decrement = item.product?.unitType === UnitType.KILO ? 0.5 : 1;
                                                  const minimum = item.product?.unitType === UnitType.KILO ? 0.5 : 1;
                                                  const newValue = Math.max(minimum, currentReturnQuantity - decrement);
                                                  const rounded = parseFloat(newValue.toFixed(1));
                                                  setProductQuantities((prev) => ({
                                                    ...prev,
                                                    [item.product.id]: rounded,
                                                  }));
                                                  setQuantityInputs((prev) => ({
                                                    ...prev,
                                                    [item.product.id]: rounded.toString(),
                                                  }));
                                                }}
                                                borderRightRadius={0}
                                                isDisabled={!isSelected}
                                              />
                                              <Input
                                                size="sm"
                                                value={quantityInputs[item.product.id] ?? currentReturnQuantity}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  const regex =
                                                    item.product?.unitType === UnitType.KILO ? /^\d*\.?\d*$/ : /^\d*$/;
                                                  if (regex.test(value) || value === '') {
                                                    setQuantityInputs((prev) => ({
                                                      ...prev,
                                                      [item.product.id]: value,
                                                    }));
                                                    const numValue =
                                                      item.product?.unitType === UnitType.KILO
                                                        ? parseFloat(value)
                                                        : parseInt(value, 10);
                                                    const minimum = item.product?.unitType === UnitType.KILO ? 0.5 : 1;
                                                    if (
                                                      !isNaN(numValue) &&
                                                      numValue >= minimum &&
                                                      numValue <= maxQuantity
                                                    ) {
                                                      setProductQuantities((prev) => ({
                                                        ...prev,
                                                        [item.product.id]: numValue,
                                                      }));
                                                    } else if (value === '' || value === '.') {
                                                      setProductQuantities((prev) => ({
                                                        ...prev,
                                                        [item.product.id]: minimum,
                                                      }));
                                                    }
                                                  }
                                                }}
                                                w="3rem"
                                                p="0"
                                                textAlign="center"
                                                borderRadius={0}
                                                borderLeft="none"
                                                borderRight="none"
                                                isDisabled={!isSelected}
                                              />
                                              <IconButton
                                                aria-label="Aumentar cantidad"
                                                icon={<Text fontSize="sm">+</Text>}
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                  const increment = item.product?.unitType === UnitType.KILO ? 0.5 : 1;
                                                  const newValue = Math.min(
                                                    maxQuantity,
                                                    currentReturnQuantity + increment,
                                                  );
                                                  const rounded = parseFloat(newValue.toFixed(1));
                                                  setProductQuantities((prev) => ({
                                                    ...prev,
                                                    [item.product.id]: rounded,
                                                  }));
                                                  setQuantityInputs((prev) => ({
                                                    ...prev,
                                                    [item.product.id]: rounded.toString(),
                                                  }));
                                                }}
                                                borderLeftRadius={0}
                                                isDisabled={!isSelected}
                                              />
                                            </HStack>
                                          </VStack>

                                          <VStack spacing="0.25rem" align="center">
                                            <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                              Peso a devolver (g)
                                            </Text>
                                            <Input
                                              size="sm"
                                              value={
                                                item.product?.unitType === UnitType.KILO
                                                  ? (weightInputs[item.product.id] ?? currentReturnWeight)
                                                  : 'N/A'
                                              }
                                              onChange={(e) => {
                                                if (item.product?.unitType === UnitType.KILO) {
                                                  const value = e.target.value;
                                                  const regex = /^\d*\.?\d*$/;
                                                  if (regex.test(value) || value === '') {
                                                    setWeightInputs((prev) => ({ ...prev, [item.product.id]: value }));
                                                    const numValue = parseFloat(value);
                                                    if (!isNaN(numValue) && numValue > 0 && numValue <= maxWeight) {
                                                      setProductWeights((prev) => ({
                                                        ...prev,
                                                        [item.product.id]: numValue,
                                                      }));
                                                    } else if (value === '' || value === '.') {
                                                      const defaultWeight =
                                                        getOriginalDeliveredWeight(item.product.id) || 1;
                                                      setProductWeights((prev) => ({
                                                        ...prev,
                                                        [item.product.id]: defaultWeight,
                                                      }));
                                                    }
                                                  }
                                                }
                                              }}
                                              w="80px"
                                              isDisabled={!isSelected || item.product?.unitType !== UnitType.KILO}
                                              textAlign="center"
                                              borderRadius="md"
                                            />
                                          </VStack>
                                        </Flex>
                                      </VStack>
                                    </VStack>
                                  </Box>
                                );
                              })}
                            </VStack>
                          </>
                        ) : (
                          <Text fontSize="sm" color="gray.500" textAlign="center" p="2rem">
                            No hay productos en esta entrega
                          </Text>
                        )}
                      </FormControl>

                      {/* Observaciones */}
                      <Field name="observations">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
                            <FormLabel>
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} />
                                <Text>Observaciones</Text>
                              </HStack>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Motivo de la devolución, estado de los productos, etc."
                              rows={5}
                              bg={inputBg}
                              borderColor={inputBorder}
                              _hover={{ borderColor: inputBorder }}
                            />
                            <FormErrorMessage>{errors.observations}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </VStack>
                  </Form>
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
                form="return-request-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                leftIcon={<FaCheck />}
                isLoading={isLoading}
                loadingText="Actualizando..."
                size="sm"
              >
                Actualizar devolución
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
