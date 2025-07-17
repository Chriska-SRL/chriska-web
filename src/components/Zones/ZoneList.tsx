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
import { Zone } from '@/entities/zone';
import { ZoneDetail } from './ZoneDetail';

type ZoneListProps = {
  zones: Zone[];
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
  isLoading: boolean;
  error?: string;
  zoneToOpenModal?: number | null;
  setZoneToOpenModal?: (id: number | null) => void;
};

export const ZoneList = ({ zones, setZones, isLoading, error, zoneToOpenModal, setZoneToOpenModal }: ZoneListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar las zonas: {error}</Text>
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

  if (!zones || zones.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron zonas registradas.
        </Text>
        <Text fontSize="sm" color={textColor}>
          Intente agregando una nueva zona.
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
              {zones.map((zone) => (
                <Box
                  key={zone.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">{zone.name}</Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem" maxW="17rem">
                    {zone.description}
                  </Text>
                  <Box position="absolute" top="0" right="0">
                    <ZoneDetail
                      zone={zone}
                      setZones={setZones}
                      forceOpen={zoneToOpenModal === zone.id}
                      onModalClose={() => setZoneToOpenModal?.(null)}
                    />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {zones.length} zonas</Text>
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
                  <Th textAlign="center" w="20rem">
                    Nombre
                  </Th>
                  <Th textAlign="center">Descripción</Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {zones.map((zone) => (
                  <Tr key={zone.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{zone.name}</Td>
                    <Td textAlign="center">{zone.description}</Td>
                    <Td textAlign="center" pr="2rem">
                      <ZoneDetail
                        zone={zone}
                        setZones={setZones}
                        forceOpen={zoneToOpenModal === zone.id}
                        onModalClose={() => setZoneToOpenModal?.(null)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {zones.length} zonas</Text>
          </Box>
        </>
      )}
    </>
  );
};
