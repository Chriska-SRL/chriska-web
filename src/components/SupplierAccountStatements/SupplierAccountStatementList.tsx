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
import { FiCalendar, FiDollarSign, FiFileText, FiTrendingUp } from 'react-icons/fi';
import { SupplierAccountStatementDetail } from './SupplierAccountStatementDetail';
import { Pagination } from '@/components/Pagination';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getDocumentTypeLabel, getDocumentTypeColor } from '@/enums/documentType.enum';

type AccountStatementItem = {
  id: number;
  date: string;
  description: string;
  amount: number;
  balance: number;
  documentType: string;
};

type SupplierAccountStatementListProps = {
  items: AccountStatementItem[];
  isLoading: boolean;
  error?: string;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const SupplierAccountStatementList = ({
  items,
  isLoading,
  error,
  currentPage,
  pageSize,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
}: SupplierAccountStatementListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number) => {
    const isNegative = amount < 0;
    const formattedAmount = `$${Math.abs(amount).toFixed(2)}`;
    return isNegative ? `-${formattedAmount}` : formattedAmount;
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'green.500';
    if (amount < 0) return 'red.500';
    return textColor;
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

  if (!items?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron movimientos.
        </Text>
        <Text fontSize="sm" color={emptyTextColor}>
          Intenta con otros parámetros de fecha.
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
              {items.map((item, index) => (
                <Box
                  key={`${item.id}-${index}`}
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
                        #{item.id}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiCalendar} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Fecha</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {formatDate(item.date)}
                      </Text>
                    </HStack>

                    {item.description && (
                      <HStack justify="space-between">
                        <HStack spacing="0.5rem">
                          <Icon as={FiFileText} boxSize="0.875rem" color={iconColor} />
                          <Text color={textColor}>Concepto</Text>
                        </HStack>
                        <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                          {item.description}
                        </Text>
                      </HStack>
                    )}

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiFileText} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Método</Text>
                      </HStack>
                      <Badge
                        colorScheme={getDocumentTypeColor(item.documentType)}
                        variant="subtle"
                        size="sm"
                        px="0.75rem"
                        py="0.25rem"
                      >
                        {getDocumentTypeLabel(item.documentType)}
                      </Badge>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiDollarSign} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Importe</Text>
                      </HStack>
                      <Text fontWeight="bold" color={getAmountColor(item.amount)} noOfLines={1} maxW="10rem">
                        {formatAmount(item.amount)}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiTrendingUp} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Saldo</Text>
                      </HStack>
                      <Text fontWeight="bold" color={getAmountColor(item.balance)} noOfLines={1} maxW="10rem">
                        {formatAmount(item.balance)}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0.25rem" right="0.25rem">
                    <SupplierAccountStatementDetail item={item} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {items.length} registro{items.length !== 1 ? 's' : ''}
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
                  <Th textAlign="center" w="10rem">
                    Fecha
                  </Th>
                  <Th textAlign="center" w="20rem">
                    Concepto
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Método
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Importe
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Saldo
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((item, index) => (
                  <Tr
                    key={`${item.id}-${index}`}
                    h="3rem"
                    borderBottom="1px solid"
                    borderBottomColor={borderBottomColor}
                  >
                    <Td textAlign="center">#{item.id}</Td>
                    <Td textAlign="center">{formatDate(item.date)}</Td>
                    <Td textAlign="center" maxW="20rem">
                      <Text noOfLines={2}>{item.description || '-'}</Text>
                    </Td>
                    <Td textAlign="center">
                      <Badge
                        colorScheme={getDocumentTypeColor(item.documentType)}
                        variant="subtle"
                        size="sm"
                        px="0.75rem"
                        py="0.25rem"
                      >
                        {getDocumentTypeLabel(item.documentType)}
                      </Badge>
                    </Td>
                    <Td textAlign="center">
                      <Text fontWeight="bold" color={getAmountColor(item.amount)}>
                        {formatAmount(item.amount)}
                      </Text>
                    </Td>
                    <Td textAlign="center">
                      <Text fontWeight="bold" color={getAmountColor(item.balance)}>
                        {formatAmount(item.balance)}
                      </Text>
                    </Td>
                    <Td textAlign="center" pr="2rem">
                      <SupplierAccountStatementDetail item={item} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {items.length} registro{items.length !== 1 ? 's' : ''}
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
