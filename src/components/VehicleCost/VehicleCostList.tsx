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
  Tooltip,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { VehicleCost } from '@/entities/vehicleCost';
import { VehicleCostEdit } from './VehicleCostEdit';
import { VehicleCostTypeLabels } from '@/entities/vehicleCostType';
import { VehicleCostDetail } from './VehicleCostDetail';

type VehicleCostListProps = {
  costs: VehicleCost[];
  setCosts: React.Dispatch<React.SetStateAction<VehicleCost[]>>;
  isLoading: boolean;
  error?: string;
};

export const VehicleCostList = ({ costs, setCosts, isLoading, error }: VehicleCostListProps) => {
  const [selectedCost, setSelectedCost] = useState<VehicleCost | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleEditClick = (cost: VehicleCost) => {
    setSelectedCost(cost);
    onOpen();
  };

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los costos: {error}</Text>
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

  if (!costs || costs.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron costos con esos parámetros de búsqueda.
        </Text>
        <Text fontSize="sm" color={textColor}>
          Inténtelo con otros parámetros.
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
              {costs.map((cost) => (
                <Box
                  key={cost.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">Fecha: {new Date(cost.date).toLocaleDateString()}</Text>
                  <Text fontSize="sm" color={textColor}>
                    Tipo:{' '}
                    {cost.type && VehicleCostTypeLabels[cost.type] ? VehicleCostTypeLabels[cost.type] : 'Sin tipo'}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Monto: ${cost.amount}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Descripción: {cost.description || '—'}
                  </Text>
                  <VehicleCostDetail vehicleCost={cost} setVehicleCosts={setCosts} />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {costs.length} costos</Text>
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
                  <Th textAlign="center">Tipo</Th>
                  <Th textAlign="center">Monto</Th>
                  <Th textAlign="center">Descripción</Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {costs.map((cost) => (
                  <Tr key={cost.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{new Date(cost.date).toLocaleDateString()}</Td>
                    <Td textAlign="center">
                      {cost.type && VehicleCostTypeLabels[cost.type] ? VehicleCostTypeLabels[cost.type] : 'Sin tipo'}
                    </Td>
                    <Td textAlign="center">${cost.amount}</Td>
                    <Td textAlign="center">{cost.description || '—'}</Td>
                    <Td textAlign="center" pr="3rem">
                      <VehicleCostDetail vehicleCost={cost} setVehicleCosts={setCosts} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {costs.length} costos</Text>
          </Box>
        </>
      )}
      <VehicleCostEdit isOpen={isOpen} onClose={onClose} cost={selectedCost} setCosts={setCosts} />
    </>
  );
};
