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
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { Product } from '@/entities/product';
import { useGetProducts } from '@/hooks/product';
import { ProductEdit } from './ProductEdit';

type ProductListProps = {
  filterName?: string;
};

export const ProductList = ({ filterName }: ProductListProps) => {
  const { data: products, isLoading, error } = useGetProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const filteredProducts = products?.filter((product) =>
    filterName ? product.name.toLowerCase().includes(filterName.toLowerCase()) : true,
  );

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los productos: {error}</Text>
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

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron roles con esos parámetros de búsqueda.
        </Text>
        <Text fontSize="sm" color="gray.500">
          Inténtelo con otros parámetros.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <TableContainer overflowY="scroll" border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2" h="100%">
        <Table variant="simple">
          <Thead position="sticky" top="0" bg="#f2f2f2" zIndex="1">
            <Tr>
              <Th textAlign="center" maxW="10rem">
                Categoría
              </Th>
              <Th textAlign="center">Cód. Interno</Th>
              <Th textAlign="center">Imagen</Th>
              <Th textAlign="center" maxW="10rem">
                Nombre
              </Th>
              <Th textAlign="center">Precio</Th>
              <Th textAlign="center">Stock</Th>
              <Th textAlign="center">Conserv.</Th>
              <Th textAlign="center">Unidad</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProducts.map((product) => (
              <Tr key={product.internalCode}>
                <Td textAlign="center" maxW="10rem" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {product.subCategory.name}
                </Td>

                <Td textAlign="center">{product.internalCode}</Td>
                <Td py="0.125rem">
                  <Flex justify="center" align="center" h="5rem" w="100%">
                    <Image
                      src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                      objectFit="cover"
                      maxH="100%"
                      maxW="100%"
                      h="100%"
                    />
                  </Flex>
                </Td>

                <Td textAlign="center" maxW="10rem" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {product.name}
                </Td>

                <Td textAlign="center">${product.price.toFixed(2)}</Td>
                <Td textAlign="center">{product.stock}</Td>
                <Td textAlign="center">{product.temperatureCondition}</Td>
                <Td textAlign="center">{product.unitType}</Td>
                <Td textAlign="center">
                  <IconButton
                    aria-label="Editar producto"
                    icon={<FiEdit />}
                    onClick={() => handleEditClick(product)}
                    variant="ghost"
                    size="lg"
                    _hover={{ bg: 'blackAlpha.100' }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box mt="0.5rem">
        <Text fontSize="sm">Mostrando {filteredProducts.length} productos</Text>
      </Box>
      <ProductEdit isOpen={isOpen} onClose={onClose} product={selectedProduct} />
    </>
  );
};
