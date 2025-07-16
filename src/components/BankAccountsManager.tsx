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
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { BankAccount } from '@/entities/bankAccount';

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
  const [formData, setFormData] = useState<BankAccountFormData>({
    bank: '',
    number: '',
    name: '',
  });

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const labelColor = useColorModeValue('black', 'white');

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setFormData({ bank: '', number: '', name: '' });
    onOpen();
  };

  const handleOpenEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      bank: account.bank,
      number: account.number,
      name: account.name,
    });
    onOpen();
  };

  const handleSave = () => {
    if (!formData.bank.trim() || !formData.number.trim() || !formData.name.trim()) {
      return; // Basic validation
    }

    if (editingAccount) {
      // Edit existing account
      const updatedAccounts = bankAccounts.map((account) =>
        account.id === editingAccount.id ? { ...account, ...formData } : account,
      );
      onChange(updatedAccounts);
    } else {
      // Add new account
      const newAccount: BankAccount = {
        id: Date.now(), // Temporary ID for new accounts
        ...formData,
      };
      onChange([...bankAccounts, newAccount]);
    }

    onClose();
  };

  const handleDelete = (accountId: number) => {
    const updatedAccounts = bankAccounts.filter((account) => account.id !== accountId);
    onChange(updatedAccounts);
  };

  return (
    <Box w="100%">
      <FormLabel color={labelColor} mb="0.5rem">
        Cuentas bancarias
      </FormLabel>

      <Box
        minH="2.75rem"
        maxH="12rem"
        overflowY="auto"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        bg={inputBg}
        p="0.5rem"
      >
        {bankAccounts.length > 0 ? (
          <VStack spacing="0.5rem" align="stretch">
            {bankAccounts.map((account) => (
              <Box
                key={account.id}
                p="0.75rem"
                bg={useColorModeValue('white', 'whiteAlpha.50')}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
                borderRadius="md"
              >
                <HStack justify="space-between" align="start">
                  <Box flex="1">
                    <Text fontWeight="semibold" fontSize="sm" mb="0.25rem">
                      {account.bank}
                    </Text>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} mb="0.25rem">
                      Nº: {account.number}
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
                      onClick={() => handleOpenEdit(account)}
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
              </Box>
            ))}
          </VStack>
        ) : (
          <Text color={useColorModeValue('gray.500', 'gray.400')} textAlign="center" py="1rem">
            No hay cuentas bancarias agregadas
          </Text>
        )}
      </Box>

      <Button leftIcon={<FaPlus />} onClick={handleOpenAdd} size="sm" mt="0.5rem" variant="outline" w="100%">
        Agregar cuenta bancaria
      </Button>

      {/* Modal para agregar/editar */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingAccount ? 'Editar cuenta bancaria' : 'Agregar cuenta bancaria'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="1rem">
              <FormControl>
                <FormLabel>Banco</FormLabel>
                <Input
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  placeholder="Ej: Banco República"
                  bg={inputBg}
                  borderColor={borderColor}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Número de cuenta</FormLabel>
                <Input
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="Ej: 1234567890"
                  bg={inputBg}
                  borderColor={borderColor}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Nombre del titular</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: María Sánchez"
                  bg={inputBg}
                  borderColor={borderColor}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              bg="#4C88D8"
              color="white"
              _hover={{ backgroundColor: '#376bb0' }}
              onClick={handleSave}
              disabled={!formData.bank.trim() || !formData.number.trim() || !formData.name.trim()}
            >
              {editingAccount ? 'Guardar cambios' : 'Agregar cuenta'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
