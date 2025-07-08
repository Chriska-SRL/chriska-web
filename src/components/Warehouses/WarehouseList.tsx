'use client';

import { Box, Collapse, Divider, Flex, IconButton, Spinner, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';
import { ShelveAdd } from '../Shelves/ShelveAdd';
import { ShelveEdit } from '../Shelves/ShelveEdit';
import { WarehouseEdit } from './WarehouseEdit';
import { Warehouse } from '@/entities/warehouse';
import { PermissionId } from '@/entities/permissions/permissionId';
import { useUserStore } from '@/stores/useUserStore';

type WarehouseListProps = {
  warehouses: Warehouse[];
  isLoading: boolean;
  error?: string;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

export const WarehouseList = ({ warehouses, isLoading, error, setWarehouses }: WarehouseListProps) => {
  const [expandedWarehouseIds, setExpandedWarehouseIds] = useState<number[]>([]);

  const bgBox = useColorModeValue('white', 'gray.800');
  const borderBox = useColorModeValue('#f2f2f2', 'gray.600');
  const subDescColor = useColorModeValue('gray.600', 'gray.400');
  const subEmptyColor = useColorModeValue('gray.500', 'gray.500');
  const noResultsColor = useColorModeValue('gray.500', 'gray.400');
  const iconHoverBg = useColorModeValue('#e0dede', 'gray.600');

  const toggleExpand = (warehouseId: number) => {
    setExpandedWarehouseIds((prev) =>
      prev.includes(warehouseId) ? prev.filter((id) => id !== warehouseId) : [...prev, warehouseId],
    );
  };

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los almacenes: {error}</Text>
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

  if (!warehouses || warehouses.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron almacenes con esos parámetros de búsqueda.
        </Text>
        <Text fontSize="sm" color={noResultsColor}>
          Inténtelo con otros parámetros.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="100%" maxH="80%" justifyContent="space-between">
      <Box overflowY="scroll">
        <VStack spacing="1rem" align="stretch" pb="1rem">
          {warehouses.map((wh) => (
            <Box
              key={wh.id}
              px="1rem"
              py="0.75rem"
              border="1px solid"
              borderColor={borderBox}
              borderRadius="0.5rem"
              bg={bgBox}
              boxShadow="sm"
              position="relative"
            >
              <Flex alignItems="center" justifyContent="space-between">
                <Box>
                  <Text
                    fontWeight="bold"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxW={{ base: '10rem', md: 'none' }}
                    mt={{ base: '0.125rem', md: '0' }}
                  >
                    {wh.name}
                  </Text>
                  <Text
                    fontSize="sm"
                    color={subDescColor}
                    mt={{ base: '0.625rem', md: '0.25rem' }}
                    maxW={{ base: '22rem', md: '40rem' }}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {wh.description}
                  </Text>
                  <Text
                    fontSize="xs"
                    color={subDescColor}
                    mt="0.25rem"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxW={{ base: '13rem', md: '40rem' }}
                  >
                    📍 {wh.address}
                  </Text>
                </Box>

                <Flex alignItems="center" gap="1rem" display={{ base: 'none', md: 'flex' }}>
                  <ShelveAdd warehouse={wh} setWarehouses={setWarehouses} />
                  <WarehouseEdit warehouse={wh} setWarehouses={setWarehouses} />
                  <IconButton
                    aria-label="Expandir almacén"
                    icon={expandedWarehouseIds.includes(wh.id) ? <FiChevronDown /> : <FiChevronRight />}
                    size="md"
                    bg="transparent"
                    _hover={{ bg: iconHoverBg }}
                    onClick={() => toggleExpand(wh.id)}
                  />
                </Flex>
              </Flex>

              <Flex position="absolute" top="0.5rem" right="0.5rem" gap="0.5rem" display={{ base: 'flex', md: 'none' }}>
                <ShelveAdd warehouse={wh} setWarehouses={setWarehouses} />
                <WarehouseEdit warehouse={wh} setWarehouses={setWarehouses} />
                <IconButton
                  aria-label="Expandir almacén"
                  icon={expandedWarehouseIds.includes(wh.id) ? <FiChevronDown /> : <FiChevronRight />}
                  size="md"
                  bg="transparent"
                  _hover={{ bg: iconHoverBg }}
                  onClick={() => toggleExpand(wh.id)}
                />
              </Flex>

              <Collapse in={expandedWarehouseIds.includes(wh.id)} animateOpacity>
                <Box pt="0.75rem">
                  <Divider mb="0.5rem" />
                  {wh.shelves.length === 0 ? (
                    <Text color={subEmptyColor} fontSize="sm">
                      No hay estanterías.
                    </Text>
                  ) : (
                    <VStack align="start" spacing="0.5rem" pl="2rem">
                      {wh.shelves.map((shelve, index) => (
                        <Box key={shelve.id} w="100%">
                          <Flex justifyContent="space-between" alignItems="center">
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {shelve.name}
                              </Text>
                              {shelve.description && (
                                <Text fontSize="xs" color={subDescColor}>
                                  {shelve.description}
                                </Text>
                              )}
                            </Box>
                            <ShelveEdit shelve={shelve} setWarehouses={setWarehouses} />
                          </Flex>
                          {index < wh.shelves.length - 1 && <Divider mt="0.5rem" />}
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
    </Flex>
  );
};
