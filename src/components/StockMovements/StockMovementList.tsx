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
} from '@chakra-ui/react';
import { StockMovement } from '@/entities/stockMovement';
import { StockMovementDetail } from './StockMovementDetail';

type StockMovementListProps = {
  stockMovements: StockMovement[];
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  isLoading: boolean;
  error?: string;
};

export const StockMovementList = ({ stockMovements, setStockMovements, isLoading, error }: StockMovementListProps) => {
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
        <Flex direction="column" h="32rem" justifyContent="space-between">
          <Box overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {stockMovements.map((mov) => (
                <Box
                  key={mov.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">{mov.product.name}</Text>
                  <Text fontSize="sm" color={textColor}>
                    Cantidad: {mov.quantity}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Tipo: {mov.type}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Razón: {mov.reason}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Estantería: {mov.shelve.name}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Almacén: {mov.shelve.warehouse.name}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Usuario: {mov.user.name}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Fecha: {new Date(mov.date).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {stockMovements.length} movimientos</Text>
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
                    <Td textAlign="center">{stockMovement.type}</Td>
                    <Td textAlign="center">{stockMovement.reason}</Td>
                    <Td textAlign="center" pr="2rem">
                      <StockMovementDetail movement={stockMovement} setMovements={setStockMovements} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {stockMovements.length} movimientos</Text>
          </Box>
        </>
      )}
    </>
  );
};
