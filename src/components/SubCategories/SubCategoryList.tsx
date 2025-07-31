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
  VStack,
  useMediaQuery,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { SubCategory } from '@/entities/subcategory';
import { SubCategoryDetail } from './SubCategoryDetail';
import { Pagination } from '../Pagination';
import { FiTag, FiList } from 'react-icons/fi';

type SubCategoryListProps = {
  subcategories: SubCategory[];
  setSubcategories: React.Dispatch<React.SetStateAction<SubCategory[]>>;
  isLoading: boolean;
  error?: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const SubCategoryList = ({
  subcategories,
  setSubcategories,
  isLoading,
  error,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: SubCategoryListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const hasNextPage = subcategories.length === pageSize;

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

  if (!subcategories?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold">
          No se encontraron subcategorías.
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
              {subcategories.map((subcategory) => (
                <Box
                  key={subcategory.id}
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
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3" wordBreak="break-word">
                        {subcategory.name}
                      </Text>
                      {subcategory.description && (
                        <Text fontSize="sm" color={textColor} noOfLines={2} wordBreak="break-word">
                          {subcategory.description}
                        </Text>
                      )}
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiList} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Categoría</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {subcategory.category?.name}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0rem" right="0.25rem">
                    <SubCategoryDetail 
                      subcategory={subcategory} 
                      setCategories={() => {}} 
                      onSubcategoryDeleted={() => {
                        setSubcategories(prev => prev.filter(sub => sub.id !== subcategory.id));
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {subcategories.length} subcategorías
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
                  <Th textAlign="center" w="15rem">
                    Nombre
                  </Th>
                  <Th textAlign="center" w="20rem">
                    Descripción
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Categoría
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {subcategories.map((subcategory) => (
                  <Tr key={subcategory.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{subcategory.name}</Td>
                    <Td textAlign="center">{subcategory.description || '-'}</Td>
                    <Td textAlign="center">{subcategory.category?.name}</Td>
                    <Td textAlign="center" pr="2rem">
                      <SubCategoryDetail 
                        subcategory={subcategory} 
                        setCategories={() => {}} 
                        onSubcategoryDeleted={() => {
                          setSubcategories(prev => prev.filter(sub => sub.id !== subcategory.id));
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex mt="0.5rem" justifyContent="space-between" alignItems="center">
            <Text fontSize="sm">Mostrando {subcategories.length} subcategorías</Text>
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