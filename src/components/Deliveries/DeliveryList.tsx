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
  useMediaQuery,
  VStack,
  useColorModeValue,
  HStack,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { Delivery } from '@/entities/delivery';
import { DeliveryDetail } from './DeliveryDetail';
import { FiCalendar, FiUser, FiUsers, FiDollarSign, FiPackage, FiTruck } from 'react-icons/fi';
import { Pagination } from '../Pagination';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusLabel, getStatusColor } from '@/enums/status.enum';

type DeliveryListProps = {
  deliveries: Delivery[];
  isLoading: boolean;
  error?: string;
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const DeliveryList = ({
  deliveries,
  isLoading,
  error,
  setDeliveries,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: DeliveryListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const hasNextPage = deliveries.length === pageSize;

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  const isValidDate = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    // Verificar si es una fecha válida y no es 01/01/0001
    return date.getFullYear() > 1900;
  };

  const calculateTotal = (delivery: Delivery) => {
    return (
      delivery.productItems?.reduce((total, item) => {
        const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
        return total + itemTotal;
      }, 0) || 0
    );
  };

  if (error)
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );

  if (isLoading)
    return (
      <Flex justify="center" align="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );

  if (!deliveries?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold">
          No se encontraron entregas.
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
              {deliveries.map((delivery, index) => (
                <Box
                  key={`${delivery.id}-${index}`}
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
                        Entrega #{delivery.id}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiUsers} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Cliente</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {delivery.client?.name || '-'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiUser} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Usuario</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {delivery.user?.name || '-'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiCalendar} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Fecha</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {formatDate(delivery.date)}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiTruck} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>F. Confirmación</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {isValidDate(delivery.confirmedDate) ? formatDate(delivery.confirmedDate) : 'No confirmado'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiPackage} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Estado</Text>
                      </HStack>
                      <Badge
                        colorScheme={getStatusColor(delivery.status)}
                        fontSize="0.75rem"
                        p="0.125rem 0.5rem"
                        borderRadius="0.375rem"
                      >
                        {getStatusLabel(delivery.status)}
                      </Badge>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiDollarSign} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Total</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        ${calculateTotal(delivery).toFixed(2)}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0rem" right="0.25rem">
                    <DeliveryDetail delivery={delivery} setDeliveries={setDeliveries} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {deliveries.length} entrega{deliveries.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
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
                    Cliente
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Usuario
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Fecha
                  </Th>
                  <Th textAlign="center" w="10rem">
                    F. Confirmación
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Estado
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Total
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {deliveries.map((delivery, index) => (
                  <Tr
                    key={`${delivery.id}-${index}`}
                    h="3rem"
                    borderBottom="1px solid"
                    borderBottomColor={borderBottomColor}
                  >
                    <Td textAlign="center">#{delivery.id}</Td>
                    <Td textAlign="center">{delivery.client?.name || '-'}</Td>
                    <Td textAlign="center">{delivery.user?.name || '-'}</Td>
                    <Td textAlign="center">{formatDate(delivery.date)}</Td>
                    <Td textAlign="center">
                      {isValidDate(delivery.confirmedDate) ? formatDate(delivery.confirmedDate) : 'No confirmado'}
                    </Td>
                    <Td textAlign="center">
                      <Badge
                        colorScheme={getStatusColor(delivery.status)}
                        fontSize="0.75rem"
                        p="0.25rem 0.75rem"
                        borderRadius="0.375rem"
                      >
                        {getStatusLabel(delivery.status)}
                      </Badge>
                    </Td>
                    <Td textAlign="center">${calculateTotal(delivery).toFixed(2)}</Td>
                    <Td textAlign="center" pr="2rem">
                      <DeliveryDetail delivery={delivery} setDeliveries={setDeliveries} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {deliveries.length} entrega{deliveries.length !== 1 ? 's' : ''}
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
