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
import { Client } from '@/entities/client';
import { ClientDetail } from './ClientDetail';
import { FiUser, FiPhone, FiMapPin, FiFileText } from 'react-icons/fi';
import { Pagination } from '@/components/Pagination';

type ClientListProps = {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  isLoading: boolean;
  error?: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  clientToOpenModal: number | null;
  setClientToOpenModal: React.Dispatch<React.SetStateAction<number | null>>;
};

export const ClientList = ({ 
  clients, 
  setClients, 
  isLoading, 
  error, 
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  clientToOpenModal,
  setClientToOpenModal
}: ClientListProps) => {
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

  if (!clients?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron clientes.
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
              {clients.map((client) => (
                <Box
                  key={client.id}
                  p="1rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <HStack spacing="0.75rem" mb="0.5rem" pr="2.5rem">
                    {/* <Flex align="center" justify="center" boxSize="60px" bg="gray.100" borderRadius="md" flexShrink={0}>
                      <Icon as={FiUser} boxSize="1.5rem" color={iconColor} />
                    </Flex> */}
                    <VStack align="start" spacing="0.125rem" flex="1" minW="0">
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3" wordBreak="break-word">
                        {client.name}
                      </Text>
                      <Text fontSize="sm" color={textColor} noOfLines={1}>
                        {client.razonSocial}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiFileText} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>RUT</Text>
                      </HStack>
                      <Text fontWeight="semibold">{client.rut}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiUser} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Contacto</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {client.contactName || 'N/A'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiPhone} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Teléfono</Text>
                      </HStack>
                      <Text fontWeight="semibold">{client.phone || 'N/A'}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiMapPin} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Zona</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {client.zone?.name || 'N/A'}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0.5rem" right="0.5rem">
                    <ClientDetail 
                      client={client} 
                      setClients={setClients}
                      forceOpen={clientToOpenModal === client.id}
                      onModalClose={() => setClientToOpenModal(null)}
                    />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box h="3.5rem" display="flex" alignItems="center" justifyContent="space-between" px="1rem">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {clients.length} cliente{clients.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={clients.length === pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
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
                  <Th textAlign="center" w="14rem">
                    Nombre
                  </Th>
                  <Th textAlign="center" w="14rem">
                    Razón social
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Contacto
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Teléfono
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Zona
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {clients.map((client) => (
                  <Tr key={client.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{client.name}</Td>
                    <Td textAlign="center">{client.razonSocial}</Td>
                    <Td textAlign="center">{client.contactName || 'N/A'}</Td>
                    <Td textAlign="center">{client.phone || 'N/A'}</Td>
                    <Td textAlign="center">{client.zone?.name || 'N/A'}</Td>
                    <Td textAlign="center" pr="2rem">
                      <ClientDetail 
                        client={client} 
                        setClients={setClients}
                        forceOpen={clientToOpenModal === client.id}
                        onModalClose={() => setClientToOpenModal(null)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem" display="flex" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm">Mostrando {clients.length} cliente{clients.length !== 1 ? 's' : ''}</Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={clients.length === pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </Box>
        </>
      )}
    </>
  );
};
