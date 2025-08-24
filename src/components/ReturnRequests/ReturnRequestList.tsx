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
  Badge,
  Icon,
} from '@chakra-ui/react';
import { ReturnRequest } from '@/entities/returnRequest';
import { ReturnRequestDetail } from './ReturnRequestDetail';
import { FiCalendar, FiUser, FiUsers, FiTruck, FiRotateCcw } from 'react-icons/fi';
import { Pagination } from '../Pagination';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusLabel, getStatusColor } from '@/enums/status.enum';

type ReturnRequestListProps = {
  returnRequests: ReturnRequest[];
  isLoading: boolean;
  error?: string;
  setReturnRequests: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const ReturnRequestList = ({
  returnRequests,
  isLoading,
  error,
  setReturnRequests,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ReturnRequestListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const hasNextPage = returnRequests.length === pageSize;

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

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

  if (!returnRequests?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold">
          No se encontraron devoluciones.
        </Text>
        <Text fontSize="sm" color={emptyTextColor} mt="0.5rem">
          Ajusta los filtros o crea una nueva devolución.
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
              {returnRequests.map((returnRequest, index) => (
                <Box
                  key={`${returnRequest.id}-${index}`}
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
                      <Text fontWeight="bold" fontSize="md" noOfLines={1} lineHeight="1.3" wordBreak="break-word">
                        Devolución #{returnRequest.id}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiUsers} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Cliente</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {returnRequest.delivery?.client?.name || '-'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiUser} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Usuario</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {returnRequest.user?.name || '-'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiCalendar} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Fecha</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {formatDate(returnRequest.date)}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiTruck} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Entrega</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        #{returnRequest.delivery?.id || '-'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiRotateCcw} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Estado</Text>
                      </HStack>
                      <Badge
                        colorScheme={getStatusColor(returnRequest.status)}
                        fontSize="0.75rem"
                        p="0.125rem 0.5rem"
                        borderRadius="0.375rem"
                      >
                        {getStatusLabel(returnRequest.status)}
                      </Badge>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0" right="0.25rem">
                    <ReturnRequestDetail
                      returnRequest={returnRequest}
                      setReturnRequests={setReturnRequests}
                      returnRequests={returnRequests}
                    />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>

          <Box mt="1rem">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
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
                  <Th textAlign="center" w="8rem">
                    ID
                  </Th>
                  <Th textAlign="center" w="15rem">
                    Cliente
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Usuario
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Fecha
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Entrega
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Estado
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {returnRequests.map((returnRequest, index) => (
                  <Tr
                    key={`${returnRequest.id}-${index}`}
                    h="3rem"
                    borderBottom="1px solid"
                    borderBottomColor={borderBottomColor}
                  >
                    <Td textAlign="center">#{returnRequest.id}</Td>
                    <Td textAlign="center">{returnRequest.delivery?.client?.name || '-'}</Td>
                    <Td textAlign="center">{returnRequest.user?.name || '-'}</Td>
                    <Td textAlign="center">{formatDate(returnRequest.date)}</Td>
                    <Td textAlign="center">#{returnRequest.delivery?.id || '-'}</Td>
                    <Td textAlign="center">
                      <Badge
                        colorScheme={getStatusColor(returnRequest.status)}
                        fontSize="0.75rem"
                        p="0.25rem 0.75rem"
                        borderRadius="0.375rem"
                      >
                        {getStatusLabel(returnRequest.status)}
                      </Badge>
                    </Td>
                    <Td textAlign="center" pr="2rem">
                      <ReturnRequestDetail
                        returnRequest={returnRequest}
                        setReturnRequests={setReturnRequests}
                        returnRequests={returnRequests}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {returnRequests.length} devoluci{returnRequests.length !== 1 ? 'ones' : 'ón'}
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
