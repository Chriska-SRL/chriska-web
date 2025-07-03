'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useColorModeValue,
  Box,
  Button,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { StockMovement } from '@/entities/stockMovement';

type StockMovementDetailProps = {
  isOpen: boolean;
  onClose: () => void;
  movement: StockMovement | null;
};

export const StockMovementDetail = ({ isOpen, onClose, movement }: StockMovementDetailProps) => {
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  if (!movement) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
          Detalle movimiento
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            date: movement.date,
            quantity: movement.quantity,
            type: movement.type,
            reason: movement.reason,
            productId: movement.product.id,
            warehouseId: movement.shelve.warehouse.id,
            shelveId: movement.shelve.id,
            userId: movement.user.name,
          }}
          onSubmit={() => {}}
        >
          {({ values }) => (
            <form>
              <ModalBody pb="0" maxH="70vh" overflowY="auto">
                <VStack spacing="0.75rem">
                  <FormControl>
                    <FormLabel>Fecha</FormLabel>
                    <Field
                      as={Input}
                      name="date"
                      type="date"
                      value={values.date.split('T')[0]}
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Cantidad</FormLabel>
                    <Field
                      as={Input}
                      name="quantity"
                      type="number"
                      value={values.quantity}
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tipo</FormLabel>
                    <Field as={Select} name="type" value={values.type} bg={inputBg} borderColor={inputBorder} disabled>
                      <option value="Ingreso">Ingreso</option>
                      <option value="Egreso">Egreso</option>
                    </Field>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Razón</FormLabel>
                    <Field
                      as={Textarea}
                      name="reason"
                      value={values.reason}
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Producto</FormLabel>
                    <Field
                      as={Input}
                      name="productId"
                      value={`${movement.product.name}`}
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Depósito</FormLabel>
                    <Field
                      as={Input}
                      name="warehouseId"
                      value={`${movement.shelve.warehouse.name}`}
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Estantería</FormLabel>
                    <Field
                      as={Input}
                      name="shelveId"
                      value={`${movement.shelve.name} `}
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Usuario</FormLabel>
                    <Field
                      as={Input}
                      name="userId"
                      value={movement.user.name}
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter pb="1.5rem">
                <Box mt="0.5rem" w="100%">
                  <Button
                    bg="gray.500"
                    color="white"
                    width="100%"
                    _hover={{ bg: 'gray.600' }}
                    onClick={onClose}
                    py="1.375rem"
                  >
                    Cerrar
                  </Button>
                </Box>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
