'use client';

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Text,
  Spinner,
  Flex,
  VStack,
  useMediaQuery,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Supplier } from '@/entities/supplier';
import { SupplierDetail } from './SupplierDetail';
import { FiFileText, FiUser, FiPhone, FiBriefcase } from 'react-icons/fi';

type SupplierListProps = {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  isLoading: boolean;
  error?: string;
};

export const SupplierList = ({ suppliers, setSuppliers, isLoading, error }: SupplierListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!suppliers?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron proveedores.
        </Text>
        <Text fontSize="sm" color={emptyTextColor}>
          Intenta agregando un nuevo proveedor.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {isMobile ? (
        <>
          <Box overflowY="auto" h="calc(100% - 3.5rem)">
            <VStack spacing="1rem" align="stretch">
              {suppliers.map((supplier) => (
                <Box
                  key={supplier.id}
                  p="1rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <HStack spacing="0.75rem" mb="0.75rem" pr="2.5rem">
                    <VStack align="start" spacing="0.125rem" flex="1" minW="0">
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3" wordBreak="break-word">
                        {supplier.name}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiFileText} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>RUT</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {supplier.rut}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiBriefcase} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Razón social</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {supplier.razonSocial}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiPhone} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Teléfono</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {supplier.phone || 'N/A'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiUser} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Contacto</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {supplier.contactName || 'N/A'}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0.25rem" right="0.5rem">
                    <SupplierDetail supplier={supplier} setSuppliers={setSuppliers} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box h="3.5rem" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {suppliers.length} proveedores
            </Text>
          </Box>
        </>
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
                  <Th textAlign="center">Nombre</Th>
                  <Th textAlign="center">RUT</Th>
                  <Th textAlign="center">Razón Social</Th>
                  <Th textAlign="center">Teléfono</Th>
                  <Th textAlign="center">Contacto</Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {suppliers.map((supplier) => (
                  <Tr key={supplier.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{supplier.name}</Td>
                    <Td textAlign="center">{supplier.rut}</Td>
                    <Td textAlign="center">{supplier.razonSocial}</Td>
                    <Td textAlign="center">{supplier.phone || 'N/A'}</Td>
                    <Td textAlign="center">{supplier.contactName || 'N/A'}</Td>
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
    </>
  );
};
