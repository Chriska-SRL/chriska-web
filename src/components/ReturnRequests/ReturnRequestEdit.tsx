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
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FiFileText } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import {
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ReturnRequest } from '@/entities/returnRequest';
import { useUpdateReturnRequest } from '@/hooks/returnRequest';
import { useGetDeliveryById } from '@/hooks/delivery';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

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

  const { data, isLoading, fieldError } = useUpdateReturnRequest(returnRequestProps);
  const { data: deliveryData, isLoading: isLoadingDelivery } = useGetDeliveryById(returnRequest.delivery?.id);

  // Function to get original delivered quantity for a product
  const getOriginalDeliveredQuantity = (productId: number) => {
    if (!deliveryData?.productItems) return 0;
    const deliveredItem = deliveryData.productItems.find((item) => item.product.id === productId);
    return deliveredItem?.quantity || 0;
  };

  // Initialize product quantities with current return request quantities or 0
  useEffect(() => {
    if (returnRequest.productItems && isOpen) {
      const quantities: { [productId: number]: number } = {};
      returnRequest.productItems.forEach((item) => {
        quantities[item.product.id] = item.quantity;
      });
      setProductQuantities(quantities);
    }
  }, [returnRequest.productItems, isOpen]);

  const handleSubmit = (values: any) => {
    const formData: any = {
      id: returnRequest.id,
      observations: values.observations,
      productItems: Object.entries(productQuantities).map(([productId, quantity]) => ({
        productId: parseInt(productId),
        quantity,
      })),
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
                        <Text fontSize="sm" color={textColor} mb="1rem">
                          Selecciona la cantidad a devolver de cada producto
                        </Text>

                        {returnRequest.productItems && returnRequest.productItems.length > 0 ? (
                          <VStack spacing="0.5rem" align="stretch">
                            {returnRequest.productItems.map((item) => {
                              const currentReturnQuantity = productQuantities[item.product.id] || 0;
                              const originalDeliveredQuantity = getOriginalDeliveredQuantity(item.product.id);
                              const maxQuantity = originalDeliveredQuantity || item.quantity;

                              return (
                                <Box
                                  key={item.product.id}
                                  p={{ base: '1rem', md: '0.75rem' }}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  borderRadius="md"
                                  bg={inputBg}
                                >
                                  {/* Desktop Layout */}
                                  <Flex display={{ base: 'none', md: 'flex' }} align="center" gap="1rem">
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
                                        Código: {item.product?.internalCode || '-'}
                                      </Text>
                                    </Box>

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
                                      <NumberInput
                                        size="sm"
                                        value={currentReturnQuantity}
                                        onChange={(_, valueAsNumber) => {
                                          const quantity = isNaN(valueAsNumber)
                                            ? 0
                                            : Math.max(0, Math.min(maxQuantity, valueAsNumber));
                                          setProductQuantities((prev) => ({
                                            ...prev,
                                            [item.product.id]: quantity,
                                          }));
                                        }}
                                        min={0}
                                        max={maxQuantity}
                                        step={0.1}
                                        precision={1}
                                        w="80px"
                                      >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                          <NumberIncrementStepper />
                                          <NumberDecrementStepper />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </VStack>
                                  </Flex>

                                  {/* Mobile Layout */}
                                  <Box display={{ base: 'block', md: 'none' }}>
                                    <Flex align="center" gap="0.75rem" mb="0.75rem">
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
                                          Código: {item.product?.internalCode || '-'}
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex justify="space-between" align="center">
                                      <VStack spacing="0.25rem" align="start">
                                        {isLoadingDelivery ? (
                                          <HStack spacing="0.5rem">
                                            <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                              Cant. entregada:
                                            </Text>
                                            <Spinner size="xs" />
                                          </HStack>
                                        ) : (
                                          <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                            Cant. entregada:{' '}
                                            <Text as="span" fontWeight="semibold">
                                              {originalDeliveredQuantity || '-'}
                                            </Text>
                                          </Text>
                                        )}
                                      </VStack>

                                      <VStack spacing="0.25rem" align="end">
                                        <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                          Cant. a devolver
                                        </Text>
                                        <NumberInput
                                          size="sm"
                                          value={currentReturnQuantity}
                                          onChange={(_, valueAsNumber) => {
                                            const quantity = isNaN(valueAsNumber)
                                              ? 0
                                              : Math.max(0, Math.min(maxQuantity, valueAsNumber));
                                            setProductQuantities((prev) => ({
                                              ...prev,
                                              [item.product.id]: quantity,
                                            }));
                                          }}
                                          min={0}
                                          max={maxQuantity}
                                          step={0.1}
                                          precision={1}
                                          w="80px"
                                        >
                                          <NumberInputField />
                                          <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                          </NumberInputStepper>
                                        </NumberInput>
                                      </VStack>
                                    </Flex>
                                  </Box>
                                </Box>
                              );
                            })}
                          </VStack>
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
