'use client';

import {
  Flex,
  Select,
  Input,
  useColorModeValue,
  IconButton,
  InputGroup,
  InputRightElement,
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useMediaQuery,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaFilter } from 'react-icons/fa';
import { UnitTypeOptions } from '@/enums/unitType.enum';
import { useGetBrands } from '@/hooks/brand';
import { useGetCategories } from '@/hooks/category';

type SearchParam = 'name' | 'internalCode' | 'barcode';

type ProductFiltersProps = {
  isLoading: boolean;
  filterName: string;
  setFilterName: (value: string) => void;
  filterUnitType?: string;
  setFilterUnitType: (value?: string) => void;
  filterBrand?: string;
  setFilterBrand: (value?: string) => void;
  filterCategory?: string;
  setFilterCategory: (value?: string) => void;
  filterSubCategory?: string;
  setFilterSubCategory: (value?: string) => void;
  searchParam: SearchParam;
  setSearchParam: (value: SearchParam) => void;
};

export const ProductFilters = ({
  isLoading,
  filterName,
  setFilterName,
  filterUnitType,
  setFilterUnitType,
  filterBrand,
  setFilterBrand,
  filterCategory,
  setFilterCategory,
  filterSubCategory,
  setFilterSubCategory,
  searchParam,
  setSearchParam,
}: ProductFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const { data: brands, isLoading: isLoadingBrands } = useGetBrands();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();
  const [inputValue, setInputValue] = useState(filterName);

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const popoverBg = useColorModeValue('white', 'gray.800');
  const popoverBorder = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = useColorModeValue('blue.400', 'blue.300');
  const focusBoxShadow = useColorModeValue('0 0 0 1px rgb(66, 153, 225)', '0 0 0 1px rgb(144, 205, 244)');

  const searchOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'internalCode', label: 'Código interno' },
    { value: 'barcode', label: 'Código de barras' },
  ];

  const handleSearchParamChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParam(e.target.value as SearchParam);
    setInputValue('');
    setFilterName('');
  }, [setSearchParam, setFilterName]);

  const handleUnitTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterUnitType(value === '-1' ? undefined : value);
  }, [setFilterUnitType]);

  const handleBrandChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterBrand(value === '-1' ? undefined : value);
  }, [setFilterBrand]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterCategory(value === '-1' ? undefined : value);
    setFilterSubCategory(undefined);
  }, [setFilterCategory, setFilterSubCategory]);

  const handleSubCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterSubCategory(value === '-1' ? undefined : value);
  }, [setFilterSubCategory]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    if (inputValue.length >= 2 || inputValue.length === 0) {
      setFilterName(inputValue);
    }
  }, [inputValue, setFilterName]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleResetFilters = useCallback(() => {
    setFilterUnitType(undefined);
    setFilterBrand(undefined);
    setFilterCategory(undefined);
    setFilterSubCategory(undefined);
    setInputValue('');
    setFilterName('');
    setSearchParam('name');
  }, [setFilterUnitType, setFilterBrand, setFilterCategory, setFilterSubCategory, setFilterName, setSearchParam]);

  // Sync inputValue when filterName changes externally
  useEffect(() => {
    setInputValue(filterName);
  }, [filterName]);

  const hasActiveFilters = 
    filterUnitType !== undefined || 
    filterBrand !== undefined || 
    filterCategory !== undefined || 
    filterSubCategory !== undefined || 
    filterName !== '';

  const activeSelectFilters = [
    filterUnitType !== undefined ? 1 : 0,
    filterBrand !== undefined ? 1 : 0,
    filterCategory !== undefined ? 1 : 0,
    filterSubCategory !== undefined ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const filteredSubCategories = filterCategory
    ? categories?.find(c => c.id.toString() === filterCategory)?.subCategories
    : [];

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap" w="100%">
      <Box
        display="flex"
        bg={bgInput}
        borderRadius="md"
        overflow="hidden"
        flex="1"
        borderWidth="1px"
        borderColor={borderInput}
      >
        <Select
          value={searchParam}
          onChange={handleSearchParamChange}
          bg="transparent"
          border="none"
          color={textColor}
          w="auto"
          minW="7rem"
          borderRadius="none"
          _focus={{ boxShadow: 'none' }}
          maxW={{ base: '5rem', md: '100%' }}
          disabled={isLoading}
        >
          {searchOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

        <InputGroup flex="1">
          <Input
            placeholder="Buscar..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            bg="transparent"
            border="none"
            borderRadius="none"
            _placeholder={{ color: textColor }}
            color={textColor}
            _focus={{ boxShadow: 'none' }}
            pl="1rem"
            disabled={isLoading}
          />
          <InputRightElement>
            <IconButton
              aria-label="Buscar"
              icon={<AiOutlineSearch size="1.25rem" />}
              size="sm"
              variant="ghost"
              onClick={handleSearch}
              disabled={isLoading}
              color={textColor}
              _hover={{}}
            />
          </InputRightElement>
        </InputGroup>
      </Box>

      <Flex gap="1rem" w={{ base: '100%', md: 'auto' }} alignItems="center" flexShrink={0}>
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Button
              leftIcon={<FaFilter />}
              bg={bgInput}
              _hover={{ bg: hoverResetBg }}
              size="md"
              variant="outline"
              borderColor={borderInput}
              color={textColor}
              disabled={isLoading}
              flex={{ base: '1', md: 'none' }}
              minW={{ base: '0', md: '10rem' }}
              transition="all 0.2s ease"
            >
              Filtros avanzados {activeSelectFilters > 0 && `(${activeSelectFilters})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            w="auto"
            minW="18rem"
            maxW="22rem"
            bg={popoverBg}
            borderColor={popoverBorder}
            shadow="xl"
            borderRadius="md"
          >
            <PopoverArrow bg={popoverBg} />
            <PopoverBody p="0.75rem">
              <Flex gap="0.75rem" flexDir="column">
                <Select
                  value={filterUnitType !== undefined ? filterUnitType : '-1'}
                  onChange={handleUnitTypeChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterUnitType === undefined && <option value="-1">Filtrar por unidad</option>}
                  {UnitTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterBrand !== undefined ? filterBrand : '-1'}
                  onChange={handleBrandChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || isLoadingBrands}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterBrand === undefined && <option value="-1">Filtrar por marca</option>}
                  {brands?.map((brand) => (
                    <option key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterCategory !== undefined ? filterCategory : '-1'}
                  onChange={handleCategoryChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || isLoadingCategories}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterCategory === undefined && <option value="-1">Filtrar por categoría</option>}
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterSubCategory !== undefined ? filterSubCategory : '-1'}
                  onChange={handleSubCategoryChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || !filterCategory}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterSubCategory === undefined && <option value="-1">Filtrar por subcategoría</option>}
                  {filteredSubCategories?.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id.toString()}>
                      {subCategory.name}
                    </option>
                  ))}
                </Select>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <IconButton
            aria-label="Reiniciar filtros"
            icon={<VscDebugRestart />}
            bg={bgInput}
            _hover={{ bg: hoverResetBg }}
            onClick={handleResetFilters}
            disabled={isLoading}
            flexShrink={0}
            borderColor={borderInput}
            transition="all 0.2s ease"
          />
        )}
      </Flex>
    </Flex>
  );
};
