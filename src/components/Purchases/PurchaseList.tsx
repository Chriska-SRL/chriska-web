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
  Badge,
} from '@chakra-ui/react';
import { FiCalendar, FiUsers, FiFileText, FiEdit } from 'react-icons/fi';
import { Purchase } from '@/entities/purchase';
import { PurchaseDetail } from './PurchaseDetail';
import { Pagination } from '@/components/Pagination';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusLabel, getStatusColor } from '@/enums/status.enum';

type PurchaseListProps = {
  purchases: Purchase[];
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
  isLoading: boolean;
  error?: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const PurchaseList = ({
  purchases,
  setPurchases,
  isLoading,
  error,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PurchaseListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const hasNextPage = purchases.length === pageSize;

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

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

  if (!purchases?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron facturas.
        </Text>
        <Text fontSize="sm" color={emptyTextColor}>
          Intenta con otros parámetros.
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
              {purchases.map((purchase, index) => (
                <Box
                  key={`${purchase.id}-${index}`}
                  p="1rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <HStack spacing="0.75rem" mb="0.5rem" pr="2.5rem">
                    <VStack align="start" spacing="0.125rem" flex="1" minW="0">
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3" wordBreak="break-word">
                        #{purchase.id}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiUsers} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Proveedor</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {purchase.supplier?.name || '-'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiCalendar} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Fecha</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {formatDate(purchase.date)}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiFileText} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Número de factura</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {purchase.invoiceNumber || '-'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiEdit} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Estado</Text>
                      </HStack>
                      <Badge colorScheme={getStatusColor(purchase.status)} variant="subtle" size="sm">
                        {getStatusLabel(purchase.status)}
                      </Badge>
                    </HStack>

                    {purchase.observations && (
                      <HStack justify="space-between">
                        <HStack spacing="0.5rem">
                          <Icon as={FiEdit} boxSize="0.875rem" color={iconColor} />
                          <Text color={textColor}>Observaciones</Text>
                        </HStack>
                        <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                          {purchase.observations}
                        </Text>
                      </HStack>
                    )}
                  </VStack>

                  <Box position="absolute" top="0.25rem" right="0.25rem">
                    <PurchaseDetail purchase={purchase} setPurchases={setPurchases} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {purchases.length} factura{purchases.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={false}
            />
          </Flex>
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
                  <Th textAlign="center" w="8rem">
                    ID
                  </Th>
                  <Th textAlign="center" w="15rem">
                    Proveedor
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Fecha
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Número de factura
                  </Th>
                  <Th textAlign="center" w="8rem">
                    Estado
                  </Th>
                  <Th textAlign="center" w="15rem">
                    Observaciones
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {purchases.map((purchase, index) => (
                  <Tr
                    key={`${purchase.id}-${index}`}
                    h="3rem"
                    borderBottom="1px solid"
                    borderBottomColor={borderBottomColor}
                  >
                    <Td textAlign="center">#{purchase.id}</Td>
                    <Td textAlign="center">{purchase.supplier?.name || '-'}</Td>
                    <Td textAlign="center">{formatDate(purchase.date)}</Td>
                    <Td textAlign="center">{purchase.invoiceNumber || '-'}</Td>
                    <Td textAlign="center">
                      <Badge colorScheme={getStatusColor(purchase.status)} variant="subtle" size="sm">
                        {getStatusLabel(purchase.status)}
                      </Badge>
                    </Td>
                    <Td textAlign="center" maxW="15rem">
                      <Text noOfLines={2}>{purchase.observations || '-'}</Text>
                    </Td>
                    <Td textAlign="center" pr="2rem">
                      <PurchaseDetail purchase={purchase} setPurchases={setPurchases} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {purchases.length} factura{purchases.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={false}
            />
          </Flex>
        </>
      )}
    </>
  );
};
