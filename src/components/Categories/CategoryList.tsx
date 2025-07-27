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
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { SubCategoryAdd } from '../SubCategories/SubCategoryAdd';
import { Category } from '@/entities/category';
import { CategoryDetail } from './CategoryDetail';
import { SubCategoryDetail } from '../SubCategories/SubCategoryDetail';

type CategoryListProps = {
  categories: Category[];
  isLoading: boolean;
  error?: string;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  categoryToOpenModal?: number | null;
  setCategoryToOpenModal?: (id: number | null) => void;
  subcategoryToOpenModal?: number | null;
  setSubcategoryToOpenModal?: (id: number | null) => void;
};

export const CategoryList = ({
  categories,
  isLoading,
  error,
  setCategories,
  categoryToOpenModal,
  setCategoryToOpenModal,
  subcategoryToOpenModal,
  setSubcategoryToOpenModal,
}: CategoryListProps) => {
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<number[]>([]);
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const bgBox = useColorModeValue('white', 'gray.800');
  const borderBox = useColorModeValue('#f2f2f2', 'gray.600');
  const subDescColor = useColorModeValue('gray.600', 'gray.400');
  const subEmptyColor = useColorModeValue('gray.500', 'gray.500');
  const noResultsColor = useColorModeValue('gray.500', 'gray.400');
  const iconHoverBg = useColorModeValue('#e0dede', 'gray.600');

  useEffect(() => {
    if (subcategoryToOpenModal) {
      const categoryWithSubcategory = categories.find((cat) =>
        cat.subCategories?.some((sub) => sub.id === subcategoryToOpenModal),
      );
      if (categoryWithSubcategory && !expandedCategoryIds.includes(categoryWithSubcategory.id)) {
        setExpandedCategoryIds((prev) => [...prev, categoryWithSubcategory.id]);
      }
    }
  }, [subcategoryToOpenModal, categories, expandedCategoryIds]);

  const toggleExpand = (categoryId: number) => {
    setExpandedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
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

  if (!categories?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron categorías.
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
          {categories.map((category) => (
            <Box
              key={category.id}
              p="1rem"
              border="1px solid"
              borderColor={borderBox}
              borderRadius="0.5rem"
              bg={bgBox}
              boxShadow="sm"
              position="relative"
            >
              <Flex alignItems="flex-start" justifyContent="space-between">
                <Box flex="1" minW="0">
                  <Text fontWeight="bold" fontSize="md" mb="0.5rem">
                    {category.name}
                  </Text>
                  <Text fontSize="sm" color={subDescColor}>
                    {category.description}
                  </Text>
                </Box>

                <Flex position="absolute" top="0.25rem" right="1rem" gap="0.5rem" alignItems="center">
                  <SubCategoryAdd category={category} setCategories={setCategories} />
                  <CategoryDetail
                    category={category}
                    setCategories={setCategories}
                    forceOpen={categoryToOpenModal === category.id}
                    onModalClose={() => setCategoryToOpenModal?.(null)}
                  />
                  <IconButton
                    aria-label="Expandir categoría"
                    icon={expandedCategoryIds.includes(category.id) ? <FiChevronDown /> : <FiChevronRight />}
                    size="sm"
                    bg="transparent"
                    _hover={{ bg: iconHoverBg }}
                    onClick={() => toggleExpand(category.id)}
                  />
                </Flex>
              </Flex>

              <Collapse in={expandedCategoryIds.includes(category.id)} animateOpacity>
                <Box pt="0.75rem">
                  <Divider mb="0.5rem" />
                  {category.subCategories.length === 0 ? (
                    <Text color={subEmptyColor} fontSize="sm">
                      No hay subcategorías.
                    </Text>
                  ) : (
                    <VStack align="start" spacing="0.5rem" pl="1rem">
                      {category.subCategories.map((sub, index) => (
                        <Box key={sub.id} w="100%">
                          <Flex justifyContent="space-between" alignItems="flex-start">
                            <Box flex="1" pr="3rem" minW="0">
                              <Text fontSize="sm" fontWeight="medium" noOfLines={2} wordBreak="break-word">
                                {sub.name}
                              </Text>
                              {sub.description && (
                                <Text fontSize="xs" color={subDescColor} noOfLines={2} wordBreak="break-word">
                                  {sub.description}
                                </Text>
                              )}
                            </Box>
                            <Box flexShrink="0">
                              <SubCategoryDetail
                                subcategory={sub}
                                setCategories={setCategories}
                                forceOpen={subcategoryToOpenModal === sub.id}
                                onModalClose={() => setSubcategoryToOpenModal?.(null)}
                              />
                            </Box>
                          </Flex>
                          {index < category.subCategories.length - 1 && <Divider />}
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
      <Flex alignItems="center" justifyContent={{ base: 'center', md: 'flex-start' }}>
        <Text fontSize="sm">Mostrando {categories.length} categorías</Text>
      </Flex>
    </>
  );
};
