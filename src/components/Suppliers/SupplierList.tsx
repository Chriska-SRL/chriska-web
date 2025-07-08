'use client';

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Box,
  Text,
  Spinner,
  Flex,
  useDisclosure,
  VStack,
  useMediaQuery,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { Supplier } from '@/entities/supplier';
import { SupplierEdit } from './SupplierEdit';
import { PermissionId } from '@/entities/permissions/permissionId';
import { useUserStore } from '@/stores/useUserStore';
import { SupplierDetail } from './SupplierDetail';

type SupplierListProps = {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  isLoading: boolean;
  error?: string;
};

export const SupplierList = ({ suppliers, setSuppliers, isLoading, error }: SupplierListProps) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleEditClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    onOpen();
  };

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los proveedores: {error}</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron proveedores registrados.
        </Text>
        <Text fontSize="sm" color={textColor}>
          Intente agregando un nuevo proveedor.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {isMobile ? (
        <Flex direction="column" h="25rem" justifyContent="space-between">
          <Box overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {suppliers.map((supplier) => (
                <Box
                  key={supplier.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">{supplier.name}</Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    RUT: {supplier.rut}
                  </Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    Razón social: {supplier.razonSocial}
                  </Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    Teléfono: {supplier.phone}
                  </Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    Contacto: {supplier.contactName}
                  </Text>
                  <SupplierDetail supplier={supplier} setSuppliers={setSuppliers} />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {suppliers.length} proveedores</Text>
          </Box>
        </Flex>
      ) : (
        <>
          <TableContainer
            overflowY="scroll"
            border="1px solid"
            borderRadius="0.5rem"
            borderColor={borderColor}
            h="100%"
          >
            <Table variant="unstyled">
              <Thead position="sticky" top="0" bg={tableHeadBg} zIndex="1">
                <Tr>
                  <Th textAlign="center" w="14rem">
                    Nombre
                  </Th>
                  <Th textAlign="center" w="12rem">
                    RUT
                  </Th>
                  <Th textAlign="center" w="14rem">
                    Razón Social
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Teléfono
                  </Th>
                  <Th textAlign="center" w="14rem">
                    Contacto
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {suppliers.map((supplier) => (
                  <Tr key={supplier.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{supplier.name}</Td>
                    <Td textAlign="center">{supplier.rut}</Td>
                    <Td textAlign="center">{supplier.razonSocial}</Td>
                    <Td textAlign="center">{supplier.phone}</Td>
                    <Td textAlign="center">{supplier.contactName}</Td>
                    <Td textAlign="center" pr="2rem">
                      <SupplierDetail supplier={supplier} setSuppliers={setSuppliers} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {suppliers.length} proveedores</Text>
          </Box>
        </>
      )}
      <SupplierEdit isOpen={isOpen} onClose={onClose} supplier={selectedSupplier} setSuppliers={setSuppliers} />
    </>
  );
};
