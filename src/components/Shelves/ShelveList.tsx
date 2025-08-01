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
import { Shelve } from '@/entities/shelve';
import { ShelveDetail } from './ShelveDetail';
import { Pagination } from '../Pagination';
import { FiBox, FiMapPin } from 'react-icons/fi';

type ShelveListProps = {
  shelves: Shelve[];
  setShelves: React.Dispatch<React.SetStateAction<Shelve[]>>;
  isLoading: boolean;
  error?: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const ShelveList = ({
  shelves,
  setShelves,
  isLoading,
  error,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ShelveListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const hasNextPage = shelves.length === pageSize;

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

  if (!shelves?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold">
          No se encontraron estanterías.
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
              {shelves.map((shelve) => (
                <Box
                  key={shelve.id}
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
                        {shelve.name}
                      </Text>
                      {shelve.description && (
                        <Text fontSize="sm" color={textColor} noOfLines={2} wordBreak="break-word">
                          {shelve.description}
                        </Text>
                      )}
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiMapPin} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Almacén</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {shelve.warehouse?.name}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0rem" right="0.25rem">
                    <ShelveDetail 
                      shelve={shelve} 
                      setWarehouses={() => {}} 
                      onShelveDeleted={() => {
                        setShelves(prev => prev.filter(s => s.id !== shelve.id));
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {shelves.length} estanterías
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
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
                  <Th textAlign="center" w="15rem">
                    Nombre
                  </Th>
                  <Th textAlign="center" w="20rem">
                    Descripción
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Almacén
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {shelves.map((shelve) => (
                  <Tr key={shelve.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{shelve.name}</Td>
                    <Td textAlign="center">{shelve.description || '-'}</Td>
                    <Td textAlign="center">{shelve.warehouse?.name}</Td>
                    <Td textAlign="center" pr="2rem">
                      <ShelveDetail 
                        shelve={shelve} 
                        setWarehouses={() => {}} 
                        onShelveDeleted={() => {
                          setShelves(prev => prev.filter(s => s.id !== shelve.id));
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex mt="0.5rem" justifyContent="space-between" alignItems="center">
            <Text fontSize="sm">Mostrando {shelves.length} estanterías</Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
            />
          </Flex>
        </>
      )}
    </>
  );
};