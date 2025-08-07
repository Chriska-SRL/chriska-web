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
  HStack,
  useMediaQuery,
  useColorModeValue,
} from '@chakra-ui/react';
import { StockMovement } from '@/entities/stockMovement';
import { StockMovementDetail } from './StockMovementDetail';
import { Pagination } from '../Pagination';
import { getStockMovementTypeLabel } from '@/enums/stockMovementType.enum';

type StockMovementListProps = {
  stockMovements: StockMovement[];
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  isLoading: boolean;
  error?: string;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
};

export const StockMovementList = ({
  stockMovements,
  setStockMovements,
  isLoading,
  error,
  totalCount,
  currentPage,
  pageSize,
  hasNextPage,
  onPageChange,
}: StockMovementListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los movimientos: {error}</Text>
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

  if (!stockMovements || stockMovements.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron movimientos registrados.
        </Text>
        <Text fontSize="sm" color={textColor}>
          Intente con otro rango de fechas o filtros.
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
              {stockMovements.map((mov) => (
                <Box
                  key={mov.id}
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
                        {mov.product.name}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <Text color={textColor}>Cantidad</Text>
                      <Text fontWeight="semibold">{mov.quantity}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text color={textColor}>Tipo</Text>
                      <Text fontWeight="semibold">{getStockMovementTypeLabel(mov.type)}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text color={textColor}>Razón</Text>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {mov.reason}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text color={textColor}>Usuario</Text>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {mov.user.name}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text color={textColor}>Fecha</Text>
                      <Text fontWeight="semibold">{new Date(mov.date).toLocaleDateString()}</Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0" right="0.25rem">
                    <StockMovementDetail movement={mov} setMovements={setStockMovements} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {stockMovements.length} movimiento{stockMovements.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={() => {}}
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
                  <Th textAlign="center">Fecha</Th>
                  <Th textAlign="center">Producto</Th>
                  <Th textAlign="center">Cantidad</Th>
                  <Th textAlign="center">Tipo</Th>
                  <Th textAlign="center">Razón</Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {stockMovements.map((stockMovement) => (
                  <Tr key={stockMovement.id} h="5rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{new Date(stockMovement.date).toLocaleDateString()}</Td>
                    <Td textAlign="center">{stockMovement.product.name}</Td>
                    <Td textAlign="center">{stockMovement.quantity}</Td>
                    <Td textAlign="center">{getStockMovementTypeLabel(stockMovement.type)}</Td>
                    <Td textAlign="center">{stockMovement.reason}</Td>
                    <Td textAlign="center" pr="2rem">
                      <StockMovementDetail movement={stockMovement} setMovements={setStockMovements} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <HStack justifyContent="space-between" mt="0.5rem">
            <Text fontSize="sm" color={textColor}>
              Mostrando {stockMovements.length} de {totalCount} movimiento{totalCount !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={() => {}}
              isLoading={isLoading}
            />
          </HStack>
        </>
      )}
    </>
  );
};
