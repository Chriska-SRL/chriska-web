'use client';

import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableContainer,
  Box,
  Text,
  Spinner,
  IconButton,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';

type Column<T> = {
  header: string;
  accessor: keyof T;
  width?: string;
};

type GenericListProps<T> = {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  error?: string;
  actions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
};

export const GenericList = <T extends { id: number }>({
  data,
  columns,
  isLoading,
  error,
  actions,
  onView,
  onEdit,
  onDelete,
}: GenericListProps<T>) => {
  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

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

  if (!data || data.length === 0) {
    return (
      <Box p="2rem" textAlign="center">
        <Text>No hay datos disponibles.</Text>
      </Box>
    );
  }

  return (
    <TableContainer border="1px solid" borderColor={borderColor} borderRadius="0.5rem">
      <Table variant="unstyled">
        <Thead bg={tableHeadBg}>
          <Tr>
            {columns.map((col) => (
              <Th key={String(col.accessor)} textAlign="center" w={col.width}>
                {col.header}
              </Th>
            ))}
            {(actions?.view || actions?.edit || actions?.delete) && <Th textAlign="center">Acciones</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.id} borderBottom="1px solid" borderBottomColor={borderBottomColor}>
              {columns.map((col) => (
                <Td key={String(col.accessor)} textAlign="center">
                  {String(item[col.accessor])}
                </Td>
              ))}
              {(actions?.view || actions?.edit || actions?.delete) && (
                <Td textAlign="center">
                  <Flex justify="center" gap="0.5rem">
                    {actions?.view && (
                      <IconButton
                        aria-label="Ver"
                        icon={<FiEye />}
                        size="sm"
                        variant="ghost"
                        onClick={() => onView?.(item)}
                        _hover={{ bg: hoverBgIcon }}
                      />
                    )}
                    {actions?.edit && (
                      <IconButton
                        aria-label="Editar"
                        icon={<FiEdit />}
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit?.(item)}
                        _hover={{ bg: hoverBgIcon }}
                      />
                    )}
                    {actions?.delete && (
                      <IconButton
                        aria-label="Eliminar"
                        icon={<FiTrash />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => onDelete?.(item)}
                        _hover={{ bg: hoverBgIcon }}
                      />
                    )}
                  </Flex>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
