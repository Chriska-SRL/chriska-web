'use client';

import {
  Box,
  Collapse,
  Divider,
  Flex,
  IconButton,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  useMediaQuery,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronRight, FiMapPin } from 'react-icons/fi';
import { useState } from 'react';
import { ShelveAdd } from '../Shelves/ShelveAdd';
import { ShelveDetail } from '../Shelves/ShelveDetail';
import { WarehouseDetail } from './WarehouseDetail';
import { Warehouse } from '@/entities/warehouse';
import { ShelveEdit } from '../Shelves/ShelveEdit';
import { Pagination } from '../Pagination';

type WarehouseListProps = {
  warehouses: Warehouse[];
  isLoading: boolean;
  error?: string;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const WarehouseList = ({
  warehouses,
  isLoading,
  error,
  setWarehouses,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: WarehouseListProps) => {
  const [expandedWarehouseIds, setExpandedWarehouseIds] = useState<number[]>([]);
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const bgBox = useColorModeValue('white', 'gray.800');
  const borderBox = useColorModeValue('#f2f2f2', 'gray.600');
  const subDescColor = useColorModeValue('gray.600', 'gray.400');
  const subEmptyColor = useColorModeValue('gray.500', 'gray.500');
  const noResultsColor = useColorModeValue('gray.500', 'gray.400');
  const iconHoverBg = useColorModeValue('#e0dede', 'gray.600');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const toggleExpand = (warehouseId: number) => {
    setExpandedWarehouseIds((prev) =>
      prev.includes(warehouseId) ? prev.filter((id) => id !== warehouseId) : [...prev, warehouseId],
    );
  };

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

  if (!warehouses?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron depósitos.
        </Text>
        <Text fontSize="sm" color={noResultsColor}>
          Intenta con otros parámetros.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Box overflowY="auto" h="calc(100% - 3.5rem)">
        <VStack spacing="1rem" align="stretch">
          {warehouses.map((wh) => (
            <Box
              key={wh.id}
              p="1rem"
              pb="1rem"
              // pb={expandedWarehouseIds.includes(wh.id) ? "0" : "1rem"}
              border="1px solid"
              borderColor={borderBox}
              borderRadius="0.5rem"
              bg={bgBox}
              boxShadow="sm"
              position="relative"
            >
              <Flex alignItems="flex-start" justifyContent="space-between">
                <Box flex="1" minW="0">
                  <Text fontWeight="bold" fontSize="md" mb="0.125rem">
                    {wh.name}
                  </Text>
                  <Text fontSize="sm" color={subDescColor} noOfLines={2} wordBreak="break-word" mb="0.25rem">
                    {wh.description}
                  </Text>
                  <HStack spacing="0.5rem" align="start">
                    <Icon as={FiMapPin} boxSize="12px" color={iconColor} mt="0.25rem" flexShrink="0" />
                    <Text fontSize="sm" color={subDescColor} noOfLines={2} wordBreak="break-word">
                      {wh.address}
                    </Text>
                  </HStack>
                </Box>

                <Flex position="absolute" top="0.25rem" right="1rem" gap="0.5rem" alignItems="center">
                  <ShelveAdd warehouse={wh} setWarehouses={setWarehouses} />
                  <WarehouseDetail warehouse={wh} setWarehouses={setWarehouses} />
                  <IconButton
                    aria-label="Expandir depósito"
                    icon={expandedWarehouseIds.includes(wh.id) ? <FiChevronDown /> : <FiChevronRight />}
                    size="sm"
                    bg="transparent"
                    _hover={{ bg: iconHoverBg }}
                    onClick={() => toggleExpand(wh.id)}
                  />
                </Flex>
              </Flex>

              <Collapse in={expandedWarehouseIds.includes(wh.id)} animateOpacity>
                <Box pt="0.75rem">
                  <Divider mb="1.25rem" />
                  {!wh.shelves || wh.shelves.length === 0 ? (
                    <Text color={subEmptyColor} fontSize="sm">
                      El depósito no tiene estanterías.
                    </Text>
                  ) : (
                    <VStack align="start" spacing="0.5rem" pl="1rem">
                      {wh.shelves.map((shelve, index) => (
                        <Box key={shelve.id} w="100%">
                          <Flex justifyContent="space-between" alignItems="flex-start">
                            <Box flex="1" pr="3rem" minW="0">
                              <Text fontSize="sm" fontWeight="medium" noOfLines={2} wordBreak="break-word">
                                {shelve.name}
                              </Text>
                              {shelve.description && (
                                <Text fontSize="xs" color={subDescColor} noOfLines={2} wordBreak="break-word">
                                  {shelve.description}
                                </Text>
                              )}
                            </Box>
                            <Box flexShrink="0">
                              <ShelveDetail shelve={shelve} setWarehouses={setWarehouses} />
                            </Box>
                          </Flex>
                          {index < wh.shelves.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              </Collapse>
            </Box>
          ))}
        </VStack>
      </Box>
      <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
        <Text fontSize="sm" fontWeight="medium">
          Mostrando {warehouses.length} depósito{warehouses.length !== 1 ? 's' : ''}
        </Text>
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          hasNextPage={warehouses.length === pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
        />
      </Flex>
    </>
  );
};
