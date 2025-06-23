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
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { Vehicle } from '@/entities/vehicle';
import { VehicleEdit } from './VehicleEdit';

type VehicleListProps = {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  isLoading: boolean;
  error?: string;
};

export const VehicleList = ({ vehicles, setVehicles, isLoading, error }: VehicleListProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    onOpen();
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
              {vehicles.map((v) => (
                <Box
                  key={v.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">Matrícula: {v.plate}</Text>
                  <Text fontSize="sm" color={textColor}>
                    Marca: {v.brand}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Modelo: {v.model}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Capacidad de cajones: {v.crateCapacity}
                  </Text>
                  <IconButton
                    aria-label="Editar vehículo"
                    icon={<FiEdit />}
                    onClick={() => handleEditClick(v)}
                    size="md"
                    position="absolute"
                    bottom="0.25rem"
                    right="0.25rem"
                    bg="transparent"
                    _hover={{ bg: hoverBgIcon }}
                  />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center" bg={cardBg}>
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
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {vehicles.map((v) => (
                  <Tr key={v.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{v.plate}</Td>
                    <Td textAlign="center">{v.brand}</Td>
                    <Td textAlign="center">{v.model}</Td>
                    <Td textAlign="center">{v.crateCapacity}</Td>
                    <Td textAlign="center" pr="2rem">
                      <IconButton
                        aria-label="Editar vehículo"
                        icon={<FiEdit />}
                        onClick={() => handleEditClick(v)}
                        variant="ghost"
                        size="lg"
                        _hover={{ bg: hoverBgIcon }}
                      />
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
      <VehicleEdit isOpen={isOpen} onClose={onClose} vehicle={selectedVehicle} setVehicles={setVehicles} />
    </>
  );
};
