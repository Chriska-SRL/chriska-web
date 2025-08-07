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
import { Pagination } from '@/components/Pagination';
import { VehicleCost } from '@/entities/vehicleCost';
import { VehicleCostTypeLabels } from '@/enums/vehicleCostType.enum';
import { VehicleCostDetail } from './VehicleCostDetail';
import { formatDate } from '@/utils/formatters/date';
import { FiCalendar, FiTag, FiDollarSign, FiFileText } from 'react-icons/fi';

type VehicleCostListProps = {
  costs: VehicleCost[];
  setCosts: React.Dispatch<React.SetStateAction<VehicleCost[]>>;
  isLoading: boolean;
  error?: string;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const VehicleCostList = ({
  costs,
  setCosts,
  isLoading,
  error,
  currentPage,
  pageSize,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
}: VehicleCostListProps) => {
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

  if (!costs?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron costos.
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
              {costs.map((cost) => (
                <Box
                  key={cost.id}
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
                      <Text fontWeight="bold" fontSize="lg" noOfLines={1} lineHeight="1.3">
                        ${cost.amount}
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
                        {formatDate(cost.date)}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiTag} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Tipo</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {cost.type && VehicleCostTypeLabels[cost.type] ? VehicleCostTypeLabels[cost.type] : 'Sin tipo'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiFileText} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Descripción</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {cost.description || 'N/A'}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0.25rem" right="0.5rem">
                    <VehicleCostDetail vehicleCost={cost} setVehicleCosts={setCosts} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {costs.length} costo{costs.length !== 1 ? 's' : ''}
            </Text>
            {!isLoading && (costs.length > 0 || currentPage > 1) && (
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                hasNextPage={hasNextPage}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                isLoading={isLoading}
              />
            )}
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
                  <Th textAlign="center">Fecha</Th>
                  <Th textAlign="center">Tipo</Th>
                  <Th textAlign="center">Monto</Th>
                  <Th textAlign="center">Descripción</Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {costs.map((cost) => (
                  <Tr key={cost.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{formatDate(cost.date)}</Td>
                    <Td textAlign="center">
                      {cost.type && VehicleCostTypeLabels[cost.type] ? VehicleCostTypeLabels[cost.type] : 'Sin tipo'}
                    </Td>
                    <Td textAlign="center">${cost.amount}</Td>
                    <Td textAlign="center">
                      <Box whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={cost.description}>
                        {cost.description || 'N/A'}
                      </Box>
                    </Td>
                    <Td textAlign="center" pr="2rem">
                      <VehicleCostDetail vehicleCost={cost} setVehicleCosts={setCosts} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex mt="0.5rem" justifyContent="space-between" alignItems="center">
            <Text fontSize="sm">
              {costs.length} costo{costs.length !== 1 ? 's' : ''}
            </Text>
            {!isLoading && (costs.length > 0 || currentPage > 1) && (
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                hasNextPage={hasNextPage}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                isLoading={isLoading}
              />
            )}
          </Flex>
        </>
      )}
    </>
  );
};
