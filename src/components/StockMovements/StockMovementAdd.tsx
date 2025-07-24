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
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { StockMovement } from '@/entities/stockMovement';
import { useAddStockMovement } from '@/hooks/stockMovement';
import { useGetWarehouses } from '@/hooks/warehouse';
import { useGetProducts } from '@/hooks/product';
import { useUserStore } from '@/stores/useUserStore';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';

type StockMovementAddProps = {
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
};

export const StockMovementAdd = ({ setStockMovements }: StockMovementAddProps) => {
  const canCreateStockMovements = useUserStore((s) => s.hasPermission(Permission.CREATE_STOCK_MOVEMENTS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [movementProps, setMovementProps] = useState<Partial<StockMovement>>();
  const { data, isLoading, error, fieldError } = useAddStockMovement(movementProps as any);

  const user = useUserStore((s) => s.user);

  const { data: warehouses } = useGetWarehouses();
  const { data: products } = useGetProducts();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number>();
  const [selectedShelves, setSelectedShelves] = useState<{ id: number; name: string }[]>([]);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

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

  useEffect(() => {
    if (selectedWarehouseId && warehouses) {
      const warehouse = warehouses.find((w) => w.id === selectedWarehouseId);
      if (warehouse) {
        setSelectedShelves(warehouse.shelves);
      }
    } else {
      setSelectedShelves([]);
    }
  }, [selectedWarehouseId, warehouses]);

  const handleSubmit = (values: {
    date: string;
    quantity: number;
    type: string;
    reason: string;
    productId: string;
    warehouseId: string;
    shelveId: string;
  }) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Usuario no identificado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setMovementProps({
      date: values.date,
      quantity: values.quantity,
      type: values.type,
      reason: values.reason,
      productId: Number(values.productId),
      shelveId: Number(values.shelveId),
      userId: user.userId,
    } as any);
  };

  return (
    <>
      {canCreateStockMovements && (
        <Button bg={buttonBg} _hover={{ bg: buttonHover }} leftIcon={<FaPlus />} onClick={onOpen} px="1.5rem">
          Nuevo
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
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
              warehouseId: '',
              shelveId: '',
            }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount, values, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0" maxH="70vh" overflowY="auto">
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
                        <option value="Ingreso">Ingreso</option>
                        <option value="Egreso">Egreso</option>
                      </Field>
                      <FormErrorMessage>{errors.type}</FormErrorMessage>
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

                    <FormControl isInvalid={submitCount > 0 && touched.productId && !!errors.productId}>
                      <FormLabel>Producto</FormLabel>
                      <Field
                        as={Select}
                        name="productId"
                        placeholder="Seleccionar un producto"
                        bg={inputBg}
                        borderColor={inputBorder}
                        validate={validate}
                        disabled={isLoading}
                      >
                        {products?.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </Field>
                      <FormErrorMessage>{errors.productId}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.warehouseId && !!errors.warehouseId}>
                      <FormLabel>Depósito</FormLabel>
                      <Field
                        as={Select}
                        name="warehouseId"
                        placeholder="Seleccionar un depósito"
                        bg={inputBg}
                        borderColor={inputBorder}
                        validate={validate}
                        onChange={(e: any) => {
                          setFieldValue('warehouseId', e.target.value);
                          setSelectedWarehouseId(Number(e.target.value));
                          setFieldValue('shelveId', '');
                        }}
                        disabled={isLoading}
                      >
                        {warehouses?.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </Field>
                      <FormErrorMessage>{errors.warehouseId}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.shelveId && !!errors.shelveId}>
                      <FormLabel>Estantería</FormLabel>
                      <Field
                        as={Select}
                        name="shelveId"
                        placeholder="Seleccionar estantería"
                        bg={inputBg}
                        borderColor={inputBorder}
                        validate={validate}
                        disabled={!selectedWarehouseId || isLoading}
                      >
                        {selectedShelves.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </Field>
                      <FormErrorMessage>{errors.shelveId}</FormErrorMessage>
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
