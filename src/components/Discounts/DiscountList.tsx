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
  Icon,
  Badge,
} from '@chakra-ui/react';
import { Discount } from '@/entities/discount';
import { DiscountDetail } from './DiscountDetail';
import { FiPercent, FiCalendar, FiPackage, FiMapPin, FiTag, FiUsers, FiCheckCircle, FiGrid } from 'react-icons/fi';
import { Pagination } from '../Pagination';
import { format } from 'date-fns';
import { getDiscountStatusLabel } from '@/enums/discountStatus.enum';

type DiscountListProps = {
  discounts: Discount[];
  isLoading: boolean;
  error?: string;
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const DiscountList = ({
  discounts,
  isLoading,
  error,
  setDiscounts,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: DiscountListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

  const hasNextPage = discounts.length === pageSize;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'green';
      case 'Closed':
        return 'red';
      case 'Cancelled':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch {
      return date;
    }
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

  if (!discounts?.length)
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron descuentos.
        </Text>
        <Text fontSize="sm" color={emptyTextColor}>
          Intenta con otros parámetros.
        </Text>
      </Flex>
    );

  return (
    <>
      {isMobile ? (
        <>
          <Box overflowY="auto" h="calc(100% - 3.5rem)">
            <VStack spacing="1rem" align="stretch">
              {discounts.map((discount, index) => (
                <Box
                  key={`${discount.id}-${index}`}
                  p="1rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <VStack align="start" spacing="0.75rem">
                    {/* Atributos principales */}
                    <VStack spacing="0.5rem" align="stretch" w="100%">
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3">
                        {discount.description}
                      </Text>

                      <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                        <HStack justify="space-between">
                          <HStack spacing="0.5rem">
                            <Icon as={FiPercent} boxSize="0.875rem" color={iconColor} />
                            <Text color={textColor}>Porcentaje</Text>
                          </HStack>
                          <Text fontWeight="semibold">{discount.percentage}%</Text>
                        </HStack>

                        <HStack justify="space-between">
                          <HStack spacing="0.5rem">
                            <Icon as={FiCalendar} boxSize="0.875rem" color={iconColor} />
                            <Text color={textColor}>Vencimiento</Text>
                          </HStack>
                          <Text fontWeight="semibold">{formatDate(discount.expirationDate)}</Text>
                        </HStack>

                        <HStack justify="space-between">
                          <HStack spacing="0.5rem">
                            <Icon as={FiPackage} boxSize="0.875rem" color={iconColor} />
                            <Text color={textColor}>Cantidad</Text>
                          </HStack>
                          <Text fontWeight="semibold">{discount.productQuantity}</Text>
                        </HStack>

                        <HStack justify="space-between">
                          <HStack spacing="0.5rem">
                            <Icon as={FiCheckCircle} boxSize="0.875rem" color={iconColor} />
                            <Text color={textColor}>Estado</Text>
                          </HStack>
                          <Badge colorScheme={getStatusColor(discount.status)}>
                            {getDiscountStatusLabel(discount.status)}
                          </Badge>
                        </HStack>
                      </VStack>
                    </VStack>

                    {/* Divider más visible */}
                    <Box w="100%" h="1px" bg={dividerColor} />

                    {/* Atributos secundarios */}
                    <VStack spacing="0.25rem" align="stretch" fontSize="sm" w="100%">
                      {/* Mostrar solo los filtros específicos aplicados */}
                      {discount.brand && (
                        <HStack justify="space-between">
                          <HStack spacing="0.5rem">
                            <Icon as={FiTag} boxSize="0.875rem" color={iconColor} />
                            <Text color={textColor}>Marca</Text>
                          </HStack>
                          <Text fontWeight="semibold" noOfLines={1}>
                            {discount.brand.name}
                          </Text>
                        </HStack>
                      )}

                      {discount.subCategory && (
                        <HStack justify="space-between">
                          <HStack spacing="0.5rem">
                            <Icon as={FiGrid} boxSize="0.875rem" color={iconColor} />
                            <Text color={textColor}>Subcategoría</Text>
                          </HStack>
                          <Text fontWeight="semibold" noOfLines={1}>
                            {discount.subCategory.name}
                          </Text>
                        </HStack>
                      )}

                      {discount.zone && (
                        <HStack justify="space-between">
                          <HStack spacing="0.5rem">
                            <Icon as={FiMapPin} boxSize="0.875rem" color={iconColor} />
                            <Text color={textColor}>Zona</Text>
                          </HStack>
                          <Text fontWeight="semibold" noOfLines={1}>
                            {discount.zone.name}
                          </Text>
                        </HStack>
                      )}

                      {/* Solo mostrar productos/clientes cuando NO hay filtros específicos */}
                      {!discount.brand && !discount.subCategory && (
                        <HStack justify="space-between">
                          <HStack spacing="0.5rem">
                            <Icon as={FiPackage} boxSize="0.875rem" color={iconColor} />
                            <Text color={textColor}>Productos</Text>
                          </HStack>
                          <Text fontWeight="semibold">
                            {discount.products?.length ? discount.products.length : 'Todos'}
                          </Text>
                        </HStack>
                      )}

                      {!discount.zone && (
                        <HStack justify="space-between">
                          <HStack spacing="0.5rem">
                            <Icon as={FiUsers} boxSize="0.875rem" color={iconColor} />
                            <Text color={textColor}>Clientes</Text>
                          </HStack>
                          <Text fontWeight="semibold">
                            {discount.clients?.length ? discount.clients.length : 'Todos'}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </VStack>

                  <Box position="absolute" top="0.5rem" right="0.5rem">
                    <DiscountDetail discount={discount} setDiscounts={setDiscounts} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {discounts.length} descuento{discounts.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
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
                  <Th textAlign="center">Descripción</Th>
                  <Th textAlign="center">Porcentaje</Th>
                  <Th textAlign="center">Vencimiento</Th>
                  <Th textAlign="center">Cantidad</Th>
                  <Th textAlign="center">Estado</Th>
                  <Th textAlign="center">Marca</Th>
                  <Th textAlign="center">Zona</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {discounts.map((discount, index) => (
                  <Tr key={`${discount.id}-${index}`} borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{discount.description}</Td>
                    <Td textAlign="center">{discount.percentage}%</Td>
                    <Td textAlign="center">{formatDate(discount.expirationDate)}</Td>
                    <Td textAlign="center">{discount.productQuantity}</Td>
                    <Td textAlign="center">
                      <Badge colorScheme={getStatusColor(discount.status)}>
                        {getDiscountStatusLabel(discount.status)}
                      </Badge>
                    </Td>
                    <Td textAlign="center">{discount.brand?.name || '-'}</Td>
                    <Td textAlign="center">{discount.zone?.name || '-'}</Td>
                    <Td textAlign="center">
                      <DiscountDetail discount={discount} setDiscounts={setDiscounts} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex mt="0.5rem" justifyContent="space-between" alignItems="center">
            <Text fontSize="sm">
              Mostrando {discounts.length} descuento{discounts.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
            />
          </Flex>
        </>
      )}
    </>
  );
};
