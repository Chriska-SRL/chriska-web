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
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

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

  if (!zones?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron zonas.
        </Text>
        <Text fontSize="sm" color={emptyTextColor}>
          Intenta agregando una nueva zona.
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
              {zones.map((zone) => (
                <Box
                  key={zone.id}
                  p="1rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <HStack spacing="0.75rem" pr="2rem">
                    <VStack align="start" spacing="0.125rem" flex="1" minW="0">
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3" wordBreak="break-word">
                        {zone.name}
                      </Text>
                      <Text fontSize="sm" color={textColor} noOfLines={3} mt="0.25rem">
                        {zone.description}
                      </Text>
                    </VStack>
                  </HStack>

                  <Box position="absolute" top="0.25rem" right="0.5rem">
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
          <Box h="3.5rem" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {zones.length} zonas
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
                  <Th textAlign="center">Nombre</Th>
                  <Th textAlign="center">Descripción</Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {zones.map((zone) => (
                  <Tr key={zone.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{zone.name}</Td>
                    <Td textAlign="center">
                      <Box whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={zone.description}>
                        {zone.description || 'N/A'}
                      </Box>
                    </Td>
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
