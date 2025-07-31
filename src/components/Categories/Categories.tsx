'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { CategoryList } from './CategoryList';
import { CategoryAdd } from './CategoryAdd';
import { CategoryFilters } from './CategoryFilters';
import { Category } from '@/entities/category';
import { useGetCategories } from '@/hooks/category';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export const Categories = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryToOpenModal, setCategoryToOpenModal] = useState<number | null>(null);
  const [subcategoryToOpenModal, setSubcategoryToOpenModal] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filterName, setFilterName] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Filters for API call
  const filters = useMemo(
    () => ({
      name: filterName || undefined,
    }),
    [filterName],
  );

  const { data, isLoading, error } = useGetCategories(currentPage, pageSize, filters);

  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryToOpen = searchParams.get('open');
  const typeToOpen = searchParams.get('type');

  useEffect(() => {
    if (categoryToOpen && categories.length > 0) {
      const id = parseInt(categoryToOpen);

      if (typeToOpen === 'subcategory') {
        const foundCategory = categories.find((cat) => cat.subCategories?.some((sub) => sub.id === id));
        if (foundCategory) {
          setSubcategoryToOpenModal(id);
          router.replace('/categorias', { scroll: false });
        }
      } else {
        const category = categories.find((cat) => cat.id === id);
        if (category) {
          setCategoryToOpenModal(category.id);
          router.replace('/categorias', { scroll: false });
        }
      }
    }
  }, [categoryToOpen, typeToOpen, categories, router]);

  useEffect(() => {
    if (data) {
      setCategories(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '') {
      setIsFilterLoading(true);
    }
  }, [filterName]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Categorías
        </Text>
        {isMobile && <CategoryAdd isLoading={isLoading} setCategories={setCategories} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <CategoryFilters isLoading={isLoading} filterName={filterName} setFilterName={setFilterName} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <CategoryAdd isLoading={isLoading} setCategories={setCategories} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <CategoryList
        categories={categories}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setCategories={setCategories}
        categoryToOpenModal={categoryToOpenModal}
        setCategoryToOpenModal={setCategoryToOpenModal}
        subcategoryToOpenModal={subcategoryToOpenModal}
        setSubcategoryToOpenModal={setSubcategoryToOpenModal}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
