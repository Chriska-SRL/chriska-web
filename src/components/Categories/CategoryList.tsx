'use client';

import { Box, Collapse, Divider, Flex, IconButton, Spinner, Text, VStack } from '@chakra-ui/react';
import { FiChevronDown, FiChevronRight, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import { useGetCategories } from '@/hooks/category';
import { FiEdit } from 'react-icons/fi';
import { CategoryEdit } from './CategoryEdit';
import { SubCategoryEdit } from '../SubCategories/SubCategoryEdit';
import { SubCategoryAdd } from '../SubCategories/SubCategoryAdd';

type CategoryListProps = {
  filterName?: string;
};

export const CategoryList = ({ filterName }: CategoryListProps) => {
  const { data: categories, isLoading, error } = useGetCategories();
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

  const toggleExpand = (categoryId: number) => {
    setExpandedCategoryId((prevId) => (prevId === categoryId ? null : categoryId));
  };

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const filteredCategories = categories?.filter((cat) =>
    filterName ? cat.name.toLowerCase().includes(filterName.toLowerCase()) : true,
  );

  return (
    <Flex direction="column" h="100%" maxH="32rem" justifyContent="space-between">
      <Box overflowY="auto">
        <VStack spacing="1rem" align="stretch" pb="1rem">
          {filteredCategories?.map((cat) => (
            <Box
              key={cat.id}
              px="1rem"
              py="0.75rem"
              border="1px solid #f2f2f2"
              borderRadius="0.5rem"
              bg="white"
              boxShadow="sm"
              position="relative"
            >
              <Flex alignItems="center" justifyContent="space-between">
                <Box>
                  <Text fontWeight="bold">{cat.name}</Text>
                  <Text fontSize="sm" color="gray.600" mt="0.125rem">
                    {cat.description}
                  </Text>
                </Box>
                <Flex alignItems="center" gap="1rem">
                  <SubCategoryAdd categoryId={cat.id} />
                  <CategoryEdit category={cat} />
                  <IconButton
                    aria-label="Expandir categoría"
                    icon={expandedCategoryId === cat.id ? <FiChevronDown /> : <FiChevronRight />}
                    size="md"
                    bg="transparent"
                    _hover={{ bg: '#e0dede' }}
                    onClick={() => toggleExpand(cat.id)}
                  />
                </Flex>
              </Flex>

              <Collapse in={expandedCategoryId === cat.id} animateOpacity>
                <Box pt="0.75rem">
                  <Divider mb="0.5rem" />
                  {cat.subCategories.length === 0 ? (
                    <Text color="gray.500" fontSize="sm">
                      No hay subcategorías.
                    </Text>
                  ) : (
                    <VStack align="start" spacing="0.5rem" pl="2rem">
                      {cat.subCategories.map((sub, index) => (
                        <Box key={sub.id} w="100%">
                          <Flex justifyContent="space-between" alignItems="center">
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {sub.name}
                              </Text>
                              {sub.description && (
                                <Text fontSize="xs" color="gray.600">
                                  {sub.description}
                                </Text>
                              )}
                            </Box>
                            <SubCategoryEdit subcategory={sub} />
                          </Flex>
                          {index < cat.subCategories.length - 1 && <Divider mt="0.5rem" />}
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
