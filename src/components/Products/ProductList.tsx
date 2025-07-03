// Adaptación de ProductList para versión mobile
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
  useMediaQuery,
  Image,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { Product } from '@/entities/product';
import { ProductEdit } from './ProductEdit';

type ProductListProps = {
  products: Product[];
  isLoading: boolean;
  error?: string;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const ProductList = ({ products, isLoading, error, setProducts }: ProductListProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const temperatureCondition = (condition: string) => {
    switch (condition) {
      case 'Cold':
        return 'Frío';
      case 'Frozen':
        return 'Congelado';
      case 'Ambient':
        return 'Natural';
      default:
        return 'Desconocido';
    }
  };

  const unitType = (unitType: string) => {
    switch (unitType) {
      case 'Unit':
        return 'Unidades';
      case 'Kilo':
        return 'Kilos';
      default:
        return 'Desconocido';
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
  if (!products?.length)
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron productos.
        </Text>
        <Text fontSize="sm" color={emptyTextColor}>
          Intenta con otros parámetros.
        </Text>
      </Flex>
    );

  return (
    <>
      {isMobile ? (
        <Flex direction="column" maxH="32rem" justifyContent="space-between">
          <Box overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {products.map((product) => (
                <Box
                  key={product.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">{product.name}</Text>
                  <Text fontSize="sm" color={textColor}>
                    Categoría: {product.subCategory.name}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Precio: ${product.price.toFixed(2)}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Stock: {product.stock}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Conservación: {temperatureCondition(product.temperatureCondition)}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Unidad: {unitType(product.unitType)}
                  </Text>
                  <Flex justify="center" align="center" mt="0.5rem">
                    <Image
                      src={'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                      objectFit="cover"
                      maxH="5rem"
                      maxW="100%"
                    />
                  </Flex>
                  <IconButton
                    aria-label="Editar producto"
                    icon={<FiEdit />}
                    onClick={() => handleEditClick(product)}
                    size="md"
                    position="absolute"
                    top="0.5rem"
                    right="0.5rem"
                    bg="transparent"
                    _hover={{ bg: hoverColor }}
                  />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {products.length} productos</Text>
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
                  <Th textAlign="center">Cod. Interno</Th>
                  <Th textAlign="center">Categoría</Th>
                  <Th textAlign="center">Imagen</Th>
                  <Th textAlign="center">Nombre</Th>
                  <Th textAlign="center">Precio</Th>
                  <Th textAlign="center">Stock</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product) => (
                  <Tr key={product.id} borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{product.internalCode}</Td>
                    <Td textAlign="center">{product.subCategory.name}</Td>
                    <Td py="0.125rem">
                      <Flex justify="center" align="center" h="5rem" w="100%">
                        <Image
                          src={'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                          objectFit="cover"
                          maxH="100%"
                          maxW="100%"
                          h="100%"
                        />
                      </Flex>
                    </Td>
                    <Td textAlign="center">{product.name}</Td>
                    <Td textAlign="center">${product.price.toFixed(2)}</Td>
                    <Td textAlign="center">{product.stock}</Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="Editar producto"
                        icon={<FiEdit />}
                        onClick={() => handleEditClick(product)}
                        variant="ghost"
                        size="lg"
                        _hover={{ bg: hoverColor }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {products.length} productos</Text>
          </Box>
        </>
      )}
      <ProductEdit isOpen={isOpen} onClose={onClose} product={selectedProduct} setProducts={setProducts} />
    </>
  );
};
