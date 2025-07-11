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
  VStack,
  useMediaQuery,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { Vehicle } from '@/entities/vehicle';
import { VehicleDetail } from './VehicleDetail';

type VehicleListProps = {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  isLoading: boolean;
  error?: string;
};

export const VehicleList = ({ vehicles, setVehicles, isLoading, error }: VehicleListProps) => {
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleViewClick = (vehicleId: number) => {
    router.push(`/vehiculos/${vehicleId}`);
  };

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los vehículos: {error}</Text>
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

  if (!vehicles || vehicles.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron vehículos con esos parámetros de búsqueda.
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
              {vehicles.map((vehicle) => (
                <Box
                  key={vehicle.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">Matrícula: {vehicle.plate}</Text>
                  <Text fontSize="sm" color={textColor}>
                    Marca: {vehicle.brand}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Modelo: {vehicle.model}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Capacidad de cajones: {vehicle.crateCapacity}
                  </Text>
                  <IconButton
                    aria-label="Ver vehículo"
                    icon={<BsCurrencyDollar />}
                    onClick={() => handleViewClick(vehicle.id)}
                    size="md"
                    position="absolute"
                    top="0"
                    right="3rem"
                    bg="transparent"
                    _hover={{ bg: hoverBgIcon }}
                  />
                  <VehicleDetail vehicle={vehicle} setVehicles={setVehicles} />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {vehicles.length} vehículos</Text>
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
                  <Th textAlign="center">Matrícula</Th>
                  <Th textAlign="center">Marca</Th>
                  <Th textAlign="center">Modelo</Th>
                  <Th textAlign="center">Cap. de cajones</Th>
                  <Th w="4rem"></Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {vehicles.map((vehicle) => (
                  <Tr key={vehicle.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{vehicle.plate}</Td>
                    <Td textAlign="center">{vehicle.brand}</Td>
                    <Td textAlign="center">{vehicle.model}</Td>
                    <Td textAlign="center">{vehicle.crateCapacity}</Td>
                    <Td textAlign="center">
                      <Tooltip label="Ver costo del vehículo">
                        <IconButton
                          aria-label="Ver vehículo"
                          icon={<BsCurrencyDollar />}
                          onClick={() => handleViewClick(vehicle.id)}
                          variant="ghost"
                          size="lg"
                          _hover={{ bg: hoverBgIcon }}
                        />
                      </Tooltip>
                    </Td>
                    <Td textAlign="center" pr="3rem">
                      <VehicleDetail vehicle={vehicle} setVehicles={setVehicles} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {vehicles.length} vehículos</Text>
          </Box>
        </>
      )}
    </>
  );
};
