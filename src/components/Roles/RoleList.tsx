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
  Flex,
  Spinner,
  VStack,
  useMediaQuery,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { Role } from '@/entities/role';
import { RoleDetail } from './RoleDetail';
import { Pagination } from '../Pagination';

type RoleListProps = {
  roles: Role[];
  isLoading: boolean;
  error?: string;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const RoleList = ({
  roles,
  isLoading,
  error,
  setRoles,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: RoleListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const hasNextPage = roles.length === pageSize;

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

  if (!roles?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron roles.
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
              {roles.map((role) => (
                <Box
                  key={role.id}
                  p="1rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <HStack spacing="0.75rem" pr="2.5rem">
                    <VStack align="start" spacing="0.125rem" flex="1" minW="0">
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3" wordBreak="break-word">
                        {role.name}
                      </Text>
                      <Text fontSize="sm" color={textColor} noOfLines={3} mt="0.25rem">
                        {role.description}
                      </Text>
                    </VStack>
                  </HStack>

                  <Box position="absolute" top="0" right="0.5rem">
                    <RoleDetail role={role} setRoles={setRoles} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {roles.length} rol{roles.length !== 1 ? 'es' : ''}
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
                  <Th textAlign="center">Nombre</Th>
                  <Th textAlign="center">Descripción</Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {roles.map((role) => (
                  <Tr key={role.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{role.name}</Td>
                    <Td textAlign="center">
                      <Box whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={role.description}>
                        {role.description || 'N/A'}
                      </Box>
                    </Td>
                    <Td textAlign="center" pr="2rem">
                      <RoleDetail role={role} setRoles={setRoles} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {roles.length} rol{roles.length !== 1 ? 'es' : ''}
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
      )}
    </>
  );
};
