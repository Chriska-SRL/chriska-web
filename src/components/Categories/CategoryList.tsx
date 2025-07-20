'use client';

import { Box, Collapse, Divider, Flex, IconButton, Spinner, Text, VStack, useColorModeValue } from '@chakra-ui/react';
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

  const bgBox = useColorModeValue('white', 'gray.800');
  const borderBox = useColorModeValue('#f2f2f2', 'gray.600');
  const subDescColor = useColorModeValue('gray.600', 'gray.400');
  const subEmptyColor = useColorModeValue('gray.500', 'gray.500');
  const noResultsColor = useColorModeValue('gray.500', 'gray.400');
  const iconHoverBg = useColorModeValue('#e0dede', 'gray.600');

  // Auto-expandir categoría cuando se va a abrir una subcategoría
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
        <Text color="red.500">Error al cargar las categorias: {error}</Text>
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

  if (!categories || categories.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron categorías con esos parámetros de búsqueda.
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
          {categories.map((category) => (
            <Box
              key={category.id}
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
                    maxW={{ base: '6rem', md: 'none' }}
                    mt={{ base: '0.125rem', md: '0' }}
                  >
                    {category.name}
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
                    {category.description}
                  </Text>
                </Box>

                <Flex alignItems="center" gap="1rem" display={{ base: 'none', md: 'flex' }}>
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
                    size="md"
                    bg="transparent"
                    _hover={{ bg: iconHoverBg }}
                    onClick={() => toggleExpand(category.id)}
                  />
                </Flex>
              </Flex>

              <Flex position="absolute" top="0.5rem" right="0.5rem" gap="0.5rem" display={{ base: 'flex', md: 'none' }}>
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
                  size="md"
                  bg="transparent"
                  _hover={{ bg: iconHoverBg }}
                  onClick={() => toggleExpand(category.id)}
                />
              </Flex>

              <Collapse in={expandedCategoryIds.includes(category.id)} animateOpacity>
                <Box pt="0.75rem">
                  <Divider mb="0.5rem" />
                  {category.subCategories.length === 0 ? (
                    <Text color={subEmptyColor} fontSize="sm">
                      No hay subcategorías.
                    </Text>
                  ) : (
                    <VStack align="start" spacing="0.5rem" pl="2rem">
                      {category.subCategories.map((sub, index) => (
                        <Box key={sub.id} w="100%">
                          <Flex justifyContent="space-between" alignItems="center">
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {sub.name}
                              </Text>
                              {sub.description && (
                                <Text fontSize="xs" color={subDescColor}>
                                  {sub.description}
                                </Text>
                              )}
                            </Box>
                            <SubCategoryDetail
                              subcategory={sub}
                              setCategories={setCategories}
                              forceOpen={subcategoryToOpenModal === sub.id}
                              onModalClose={() => setSubcategoryToOpenModal?.(null)}
                            />
                          </Flex>
                          {index < category.subCategories.length - 1 && <Divider mt="0.5rem" />}
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
