'use client';

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Box,
  Text,
  Spinner,
  Flex,
  useDisclosure,
  VStack,
  useMediaQuery,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { Brand } from '@/entities/brand';
import { BrandEdit } from './BrandEdit';

type BrandListProps = {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  isLoading: boolean;
  error?: string;
};

export const BrandList = ({ brands, setBrands, isLoading, error }: BrandListProps) => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand);
    onOpen();
  };

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar las marcas: {error}</Text>
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

  if (!brands || brands.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron marcas registradas.
        </Text>
        <Text fontSize="sm" color={textColor}>
          Intente agregando una nueva marca.
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
              {brands.map((brand) => (
                <Box
                  key={brand.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">{brand.name}</Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    {brand.description}
                  </Text>
                  <IconButton
                    aria-label="Editar marca"
                    icon={<FiEdit />}
                    onClick={() => handleEditClick(brand)}
                    size="md"
                    position="absolute"
                    bottom="0.25rem"
                    right="0.25rem"
                    bg="transparent"
                    _hover={{ bg: hoverBgIcon }}
                  />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {brands.length} marcas</Text>
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
                  <Th textAlign="center" w="20rem">
                    Nombre
                  </Th>
                  <Th textAlign="center">Descripción</Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {brands.map((brand) => (
                  <Tr key={brand.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{brand.name}</Td>
                    <Td textAlign="center">{brand.description}</Td>
                    <Td textAlign="center" pr="2rem">
                      <IconButton
                        aria-label="Editar marca"
                        icon={<FiEdit />}
                        onClick={() => handleEditClick(brand)}
                        variant="ghost"
                        size="lg"
                        _hover={{ bg: hoverBgIcon }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {brands.length} marcas</Text>
          </Box>
        </>
      )}
      <BrandEdit isOpen={isOpen} onClose={onClose} brand={selectedBrand} setBrands={setBrands} />
    </>
  );
};
