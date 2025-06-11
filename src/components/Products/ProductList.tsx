// ProductList.tsx

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

// const products: Product[] = [
//   {
//     id: 1,
//     internalCode: 'PRD001',
//     barcode: '7891234567890',
//     name: 'Aceite de Girasol 1L',
//     price: 129.99,
//     image: 'https://via.placeholder.com/100x100.png?text=Aceite',
//     stock: 34,
//     unitType: 'unidad',
//     description: 'Aceite vegetal ideal para cocinar.',
//     temperatureCondition: 'Ambiente',
//     observation: '',
//     subCategoryId: 1,
//   },
//   {
//     id: 2,
//     internalCode: 'PRD002',
//     barcode: '7891234567891',
//     name: 'Leche Entera 1L',
//     price: 75.5,
//     image: 'https://via.placeholder.com/100x100.png?text=Leche',
//     stock: 50,
//     unitType: 'unidad',
//     description: 'Leche entera pasteurizada.',
//     temperatureCondition: 'Refrigerado',
//     observation: 'Consumir antes de 5 días',
//     subCategoryId: 2,
//   },
//   {
//     id: 3,
//     internalCode: 'PRD003',
//     barcode: '7891234567892',
//     name: 'Harina de Trigo 1kg',
//     price: 59.0,
//     image: 'https://via.placeholder.com/100x100.png?text=Harina',
//     stock: 22,
//     unitType: 'unidad',
//     description: 'Harina tipo 000 para panificación.',
//     temperatureCondition: 'Ambiente',
//     observation: '',
//     subCategoryId: 1,
//   },
//   {
//     id: 4,
//     internalCode: 'PRD004',
//     barcode: '7891234567893',
//     name: 'Queso Colonia 300g',
//     price: 212.75,
//     image: 'https://via.placeholder.com/100x100.png?text=Queso',
//     stock: 15,
//     unitType: 'peso',
//     description: 'Queso semiduro tradicional uruguayo.',
//     temperatureCondition: 'Refrigerado',
//     observation: 'Mantener entre 2°C y 8°C',
//     subCategoryId: 3,
//   },
//   {
//     id: 5,
//     internalCode: 'PRD005',
//     barcode: '7891234567894',
//     name: 'Galletitas de Avena',
//     price: 98.25,
//     image: 'https://via.placeholder.com/100x100.png?text=Galletitas',
//     stock: 60,
//     unitType: 'unidad',
//     description: 'Galletitas dulces con avena y pasas.',
//     temperatureCondition: 'Ambiente',
//     observation: '',
//     subCategoryId: 4,
//   },
// ];

export const ProductList = ({ filterName }: { filterName: string }) => {
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

  console.log('aca', filteredProducts);

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No hay productos registrados.
        </Text>
        <Text fontSize="sm" color="gray.500">
          Agregue un producto para que aparezca en la lista.
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
              <Th textAlign="center">Cód. Interno</Th>
              <Th textAlign="center">Imagen</Th>
              <Th textAlign="center">Nombre</Th>
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
                <Td textAlign="center">{product.internalCode}</Td>
                <Td py="0.125rem">
                  <Flex justify="center" align="center" h="5rem" w="100%">
                    <Image
                      src="https://prod-resize.tiendainglesa.com.uy/images/large/P063443-1.jpg?20200608135722,Leche-Entera-CONAPROLE-Ultrapasteurizada-Sachet-1l-en-Tienda-Inglesa"
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
