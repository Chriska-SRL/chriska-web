import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Flex,
  FormErrorMessage,
  Progress,
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { useState } from 'react';
import { Formik, Field } from 'formik';
import { BankAccount } from '@/entities/bankAccount';
import { validateEmpty } from '@/utils/validations/validateEmpty';

type BankAccountsManagerProps = {
  bankAccounts: BankAccount[];
  onChange: (accounts: BankAccount[]) => void;
};

type BankAccountFormData = {
  bank: string;
  number: string;
  name: string;
};

export const BankAccountsManager = ({ bankAccounts, onChange }: BankAccountsManagerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const labelColor = useColorModeValue('black', 'white');
  const dividerColor = useColorModeValue('gray.300', 'whiteAlpha.200');

  const handleAdd = () => {
    setEditingAccount(null);
    onOpen();
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    onOpen();
  };

  const handleDelete = (accountId: number) => {
    const updatedAccounts = bankAccounts.filter((account) => account.id !== accountId);
    onChange(updatedAccounts);
  };

  //Cambiar cuando este la API
  const handleSubmit = async (values: BankAccountFormData) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingAccount) {
      const updatedAccounts = bankAccounts.map((account) =>
        account.id === editingAccount.id ? { ...account, ...values } : account,
      );
      onChange(updatedAccounts);
    } else {
      const newAccount: BankAccount = {
        id: Date.now(),
        ...values,
      };
      onChange([...bankAccounts, newAccount]);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Box w="100%">
      <Text color={labelColor} mb="0.5rem">
        Cuentas bancarias
      </Text>

      <Box
        px="1rem"
        py={bankAccounts.length > 1 ? '0' : '0.75rem'}
        bg={inputBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
      >
        {bankAccounts.length > 0 ? (
          <VStack spacing="0" align="stretch" divider={<Box h="1px" bg={dividerColor} />}>
            {bankAccounts.map((account) => (
              <Flex
                key={account.id}
                flexDir="column"
                py={bankAccounts.length === 1 ? '0' : '0.75rem'}
                position="relative"
              >
                <HStack justify="space-between" align="start">
                  <Box flex="1">
                    <Text fontWeight="semibold" fontSize="sm">
                      {account.bank}
                    </Text>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                      Nº de cuenta: {account.number}
                    </Text>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                      Nombre: {account.name}
                    </Text>
                  </Box>
                  <HStack spacing="0.25rem">
                    <IconButton
                      aria-label="Editar cuenta"
                      icon={<FaEdit />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(account)}
                    />
                    <IconButton
                      aria-label="Eliminar cuenta"
                      icon={<FaTrash />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(account.id)}
                    />
                  </HStack>
                </HStack>
              </Flex>
            ))}
          </VStack>
        ) : (
          <Text>No hay cuentas bancarias asociadas</Text>
        )}
      </Box>

      <Button leftIcon={<FaPlus />} onClick={handleAdd} size="sm" mt="0.5rem" variant="outline" w="100%">
        Agregar cuenta bancaria
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            {editingAccount ? 'Editar cuenta bancaria' : 'Agregar cuenta bancaria'}
          </ModalHeader>
          <ModalCloseButton />

          <Formik
            initialValues={{
              bank: editingAccount?.bank ?? '',
              number: editingAccount?.number ?? '',
              name: editingAccount?.name ?? '',
            }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0" maxH="70vh" overflowY="auto">
                  <VStack spacing="0.75rem">
                    <FormControl isInvalid={submitCount > 0 && touched.bank && !!errors.bank}>
                      <FormLabel>Banco</FormLabel>
                      <Field
                        as={Input}
                        name="bank"
                        placeholder="Ej: Banco República"
                        bg={inputBg}
                        borderColor={borderColor}
                        h="2.75rem"
                        validate={validateEmpty}
                      />
                      <FormErrorMessage>{errors.bank}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.number && !!errors.number}>
                      <FormLabel>Número de cuenta</FormLabel>
                      <Field
                        as={Input}
                        name="number"
                        placeholder="Ej: 1234567890"
                        bg={inputBg}
                        borderColor={borderColor}
                        h="2.75rem"
                        validate={validateEmpty}
                      />
                      <FormErrorMessage>{errors.number}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                      <FormLabel>Nombre del titular</FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        placeholder="Ej: María Sánchez"
                        bg={inputBg}
                        borderColor={borderColor}
                        h="2.75rem"
                        validate={validateEmpty}
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>
                  </VStack>
                </ModalBody>

                <ModalFooter pb="1.5rem">
                  <Box mt="0.25rem" w="100%">
                    <Progress
                      h={isSubmitting ? '4px' : '1px'}
                      mb="1.25rem"
                      size="xs"
                      isIndeterminate={isSubmitting}
                      colorScheme="blue"
                    />
                    <Button
                      type="submit"
                      bg="#4C88D8"
                      color="white"
                      disabled={isSubmitting}
                      _hover={{ backgroundColor: '#376bb0' }}
                      width="100%"
                      leftIcon={<FaCheck />}
                      fontSize="1rem"
                    >
                      {editingAccount ? 'Guardar cambios' : 'Agregar cuenta'}
                    </Button>
                  </Box>
                </ModalFooter>
              </form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </Box>
  );
};
