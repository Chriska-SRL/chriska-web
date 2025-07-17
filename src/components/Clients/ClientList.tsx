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
import { Client } from '@/entities/client';
import { ClientDetail } from './ClientDetail';

type ClientListProps = {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  isLoading: boolean;
  error?: string;
};

export const ClientList = ({ clients, setClients, isLoading, error }: ClientListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los clientes: {error}</Text>
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

  if (!clients || clients.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron clientes con esos parámetros de búsqueda.
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
        <Flex direction="column" h="32rem" justifyContent="space-between">
          <Box overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {clients.map((client) => (
                <Box
                  key={client.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">{client.name}</Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    RUT: {client.rut}
                  </Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    Razón social: {client.razonSocial}
                  </Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    Zona: {client.zone?.name}
                  </Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    Teléfono: {client.phone}
                  </Text>
                  <ClientDetail client={client} setClients={setClients} />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {clients.length} clientes</Text>
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
                    <Td textAlign="center">{client.contactName}</Td>
                    <Td textAlign="center">{client.phone}</Td>
                    <Td textAlign="center">{client.zone?.name}</Td>
                    <Td textAlign="center" pr="2rem">
                      <ClientDetail client={client} setClients={setClients} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {clients.length} clientes</Text>
          </Box>
        </>
      )}
    </>
  );
};
