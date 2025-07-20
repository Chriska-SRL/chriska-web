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
  HStack,
  Icon,
} from '@chakra-ui/react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { FiTruck, FiHash, FiTag, FiPackage } from 'react-icons/fi';
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
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleViewClick = (vehicleId: number) => {
    router.push(`/vehiculos/${vehicleId}`);
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

  if (!vehicles?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron vehículos.
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
              {vehicles.map((vehicle) => (
                <Box
                  key={vehicle.id}
                  p="1rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <HStack spacing="0.75rem" mb="0.75rem" pr="6rem">
                    <VStack align="start" spacing="0.125rem" flex="1" minW="0">
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3" wordBreak="break-word">
                        {vehicle.plate}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiTruck} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Marca</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {vehicle.brand}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiTag} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Modelo</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {vehicle.model}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiPackage} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Cap. cajones</Text>
                      </HStack>
                      <Text fontWeight="semibold">{vehicle.crateCapacity}</Text>
                    </HStack>
                  </VStack>

                  <Flex position="absolute" top="0.25rem" right="0.5rem" gap="0.5rem" alignItems="center">
                    <Tooltip label="Ver costo del vehículo">
                      <IconButton
                        aria-label="Ver vehículo"
                        icon={<BsCurrencyDollar />}
                        onClick={() => handleViewClick(vehicle.id)}
                        variant="ghost"
                        size="md"
                        _hover={{ bg: hoverBgIcon }}
                      />
                    </Tooltip>
                    <VehicleDetail vehicle={vehicle} setVehicles={setVehicles} />
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box h="3.5rem" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {vehicles.length} vehículos
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
                  <Th textAlign="center" w="12rem">
                    Matrícula
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Marca
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Modelo
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Cap. de cajones
                  </Th>
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
                    <Td textAlign="center" pr="2rem">
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
