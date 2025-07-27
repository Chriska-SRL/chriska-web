'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ProductFilters } from './ProductFilters';
import { ProductAdd } from './ProductAdd';
import { ProductList } from './ProductList';
import { Product } from '@/entities/product';
import { useGetProducts } from '@/hooks/product';

type SearchParam = 'name' | 'internalCode' | 'barcode';

export const Products = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  // TODO: Cuando esté lista la API, este hook debería recibir los filtros como parámetros
  // const { data, isLoading, error } = useGetProducts({
  //   search: filterName,
  //   searchParam,
  //   unitType: filterUnitType,
  //   brandId: filterBrand,
  //   categoryId: filterCategory,
  //   subCategoryId: filterSubCategory
  // });
  const { data, isLoading, error } = useGetProducts();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (data) setProducts(data);
  }, [data]);

  // Estados de filtros
  const [filterName, setFilterName] = useState<string>('');
  const [filterUnitType, setFilterUnitType] = useState<string>('');
  const [filterBrand, setFilterBrand] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterSubCategory, setFilterSubCategory] = useState<string>('');
  const [searchParam, setSearchParam] = useState<SearchParam>('name');

  // TODO: Cuando esté lista la API, remover este filtrado del lado del cliente
  // La API debería devolver los resultados ya filtrados
  const filteredProducts = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return products.filter((product) => {
      // Filtro por búsqueda según el parámetro seleccionado
      let matchSearch = true;
      if (filterName) {
        const searchValue = normalize(filterName);
        switch (searchParam) {
          case 'name':
            matchSearch = normalize(product.name).includes(searchValue);
            break;
          case 'internalCode':
            matchSearch = normalize(product.internalCode || '').includes(searchValue);
            break;
          case 'barcode':
            matchSearch = normalize(product.barcode || '').includes(searchValue);
            break;
        }
      }

      // Filtro por tipo de unidad
      const matchUnitType = filterUnitType ? product.unitType === filterUnitType : true;

      // Filtro por marca
      const matchBrand = filterBrand ? product.brand.id.toString() === filterBrand : true;

      // Filtro por categoría (a través de subcategoría)
      const matchCategory = filterCategory ? product.subCategory.category.id.toString() === filterCategory : true;

      // Filtro por subcategoría
      const matchSubCategory = filterSubCategory ? product.subCategory.id.toString() === filterSubCategory : true;

      return matchSearch && matchUnitType && matchBrand && matchCategory && matchSubCategory;
    });
  }, [products, filterName, filterUnitType, filterBrand, filterCategory, filterSubCategory, searchParam]);

  // TODO: Cuando esté lista la API, agregar useEffect para hacer llamadas cuando cambien los filtros
  // useEffect(() => {
  //   // Debounce la búsqueda para evitar demasiadas llamadas a la API
  //   const timeoutId = setTimeout(() => {
  //     if (filterName || filterUnitType || filterBrand || filterCategory || filterSubCategory) {
  //       // Hacer nueva llamada a la API con los filtros
  //       refetch({
  //         search: filterName,
  //         searchParam,
  //         unitType: filterUnitType,
  //         brandId: filterBrand,
  //         categoryId: filterCategory,
  //         subCategoryId: filterSubCategory
  //       });
  //     }
  //   }, 500);
  //
  //   return () => clearTimeout(timeoutId);
  // }, [filterName, filterUnitType, filterBrand, filterCategory, filterSubCategory, searchParam]);

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Productos
        </Text>
        {isMobile && <ProductAdd setProducts={setProducts} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ProductFilters
          filterName={filterName}
          setFilterName={setFilterName}
          filterUnitType={filterUnitType}
          setFilterUnitType={setFilterUnitType}
          filterBrand={filterBrand}
          setFilterBrand={setFilterBrand}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterSubCategory={filterSubCategory}
          setFilterSubCategory={setFilterSubCategory}
          searchParam={searchParam}
          setSearchParam={setSearchParam}
        />
        {!isMobile && <ProductAdd setProducts={setProducts} />}
      </Flex>

      {isMobile && <Divider />}

      <ProductList products={filteredProducts} isLoading={isLoading} error={error} setProducts={setProducts} />
    </>
  );
};
