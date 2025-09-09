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
} from '@chakra-ui/react';
import { Distribution } from '@/entities/distribution';
import { DistributionDetail } from './DistributionDetail';
import { FiTruck, FiUser, FiMapPin } from 'react-icons/fi';
import { Pagination } from '../Pagination';

type DistributionListProps = {
  distributions: Distribution[];
  isLoading: boolean;
  error?: string;
  setDistributions: React.Dispatch<React.SetStateAction<Distribution[]>>;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const DistributionList = ({
  distributions,
  isLoading,
  error,
  setDistributions,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: DistributionListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const hasNextPage = distributions.length === pageSize;

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

  if (!distributions?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold">
          No se encontraron repartos.
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
              {distributions.map((distribution, index) => (
                <Box
                  key={`${distribution.id}-${index}`}
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
                        Reparto #{distribution.id}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiUser} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Usuario</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {distribution.user?.name || '-'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiTruck} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Vehículo</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {distribution.vehicle?.plate || '-'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiMapPin} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Zonas</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={2} maxW="10rem">
                        {distribution.zones?.map((zone) => zone.name).join(', ') || '-'}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0rem" right="0.25rem">
                    <DistributionDetail distribution={distribution} setDistributions={setDistributions} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {distributions.length} reparto{distributions.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
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
                  <Th textAlign="center" w="8rem">
                    ID
                  </Th>
                  <Th textAlign="center" w="15rem">
                    Usuario
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Vehículo
                  </Th>
                  <Th textAlign="center">Zonas</Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {distributions.map((distribution, index) => (
                  <Tr
                    key={`${distribution.id}-${index}`}
                    h="3rem"
                    borderBottom="1px solid"
                    borderBottomColor={borderBottomColor}
                  >
                    <Td textAlign="center">#{distribution.id}</Td>
                    <Td textAlign="center">{distribution.user?.name || '-'}</Td>
                    <Td textAlign="center">{distribution.vehicle?.plate || '-'}</Td>
                    <Td textAlign="center">
                      <Text noOfLines={2}>{distribution.zones?.map((zone) => zone.name).join(', ') || '-'}</Text>
                    </Td>
                    <Td textAlign="center" pr="2rem">
                      <DistributionDetail distribution={distribution} setDistributions={setDistributions} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {distributions.length} reparto{distributions.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={false}
            />
          </Flex>
        </>
      )}
    </>
  );
};
