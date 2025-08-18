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
  Image,
  VStack,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Product } from '@/entities/product';
import { ProductDetail } from './ProductDetail';
import { getUnitTypeLabel } from '@/enums/unitType.enum';
import { FiHash, FiDollarSign, FiPackage, FiGrid, FiTag } from 'react-icons/fi';
import { ImageModal } from '../ImageModal';
import { Pagination } from '../Pagination';

type ProductListProps = {
  products: Product[];
  isLoading: boolean;
  error?: string;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const ProductList = ({
  products,
  isLoading,
  error,
  setProducts,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ProductListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const hasNextPage = products.length === pageSize;

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
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
        <>
          <Box overflowY="auto" h="calc(100% - 3.5rem)">
            <VStack spacing="1rem" align="stretch">
              {products.map((product, index) => (
                <Box
                  key={`${product.id}-${index}`}
                  p="1rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <HStack spacing="0.75rem" mb="0.5rem" pr="2.5rem">
                    <ImageModal
                      src={product.imageUrl || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                      alt={product.name}
                    >
                      <Image
                        src={product.imageUrl || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                        alt={product.name}
                        boxSize="60px"
                        borderRadius="md"
                        bg="gray.100"
                        objectFit="cover"
                      />
                    </ImageModal>
                    <VStack align="start" spacing="0.125rem" flex="1" minW="0">
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3" wordBreak="break-word">
                        {product.name}
                      </Text>
                      <Text fontSize="sm" color={textColor} noOfLines={1}>
                        {product.subCategory.name}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiHash} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Cód. interno</Text>
                      </HStack>
                      <Text fontWeight="semibold">{product.internalCode}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiDollarSign} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Precio</Text>
                      </HStack>
                      <Text fontWeight="semibold" color="green.600">
                        {formatPrice(product.price)}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiPackage} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Stock</Text>
                      </HStack>
                      <Text fontWeight="semibold">{product.stock}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiGrid} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Unidad</Text>
                      </HStack>
                      <Text fontWeight="semibold">{getUnitTypeLabel(product.unitType)}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiTag} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Marca</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {product.brand.name}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0.5rem" right="0.5rem">
                    <ProductDetail product={product} setProducts={setProducts} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
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
                  <Th textAlign="center">Imagen</Th>
                  <Th textAlign="center">Cod. Interno</Th>
                  <Th textAlign="center">Nombre</Th>
                  <Th textAlign="center">Categoría</Th>
                  <Th textAlign="center">Precio</Th>
                  <Th textAlign="center">Stock</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product, index) => (
                  <Tr key={`${product.id}-${index}`} borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td display="flex" justifyContent="center" align="center" py="0.75rem">
                      <ImageModal
                        src={product.imageUrl || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                        alt={product.name}
                      >
                        <Image
                          src={product.imageUrl || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                          alt={product.name}
                          boxSize="3rem"
                          borderRadius="md"
                          bg="gray.100"
                          objectFit="cover"
                        />
                      </ImageModal>
                    </Td>
                    <Td textAlign="center">{product.internalCode}</Td>
                    <Td textAlign="center">{product.name}</Td>
                    <Td textAlign="center">{product.subCategory.name}</Td>
                    <Td textAlign="center">{formatPrice(product.price)}</Td>
                    <Td textAlign="center">{product.stock}</Td>
                    <Td textAlign="center">
                      <ProductDetail product={product} setProducts={setProducts} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
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
