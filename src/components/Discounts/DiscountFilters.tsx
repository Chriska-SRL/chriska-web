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
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaFilter } from 'react-icons/fa';
import { useGetBrands } from '@/hooks/brand';
import { useGetSubCategoriesSimple } from '@/hooks/subcategory';
import { useGetZones } from '@/hooks/zone';
import { useGetClients } from '@/hooks/client';
// import { useGetProducts } from '@/hooks/product';

type DiscountFiltersProps = {
  isLoading: boolean;
  filterDescription: string | undefined;
  setFilterDescription: (value: string | undefined) => void;
  filterStatus?: string;
  setFilterStatus: (value?: string) => void;
  filterBrand?: string;
  setFilterBrand: (value?: string) => void;
  filterSubCategory?: string;
  setFilterSubCategory: (value?: string) => void;
  filterZone?: string;
  setFilterZone: (value?: string) => void;
  filterClient?: string;
  setFilterClient: (value?: string) => void;
  filterProduct?: string;
  setFilterProduct: (value?: string) => void;
};

export const DiscountFilters = ({
  isLoading,
  filterDescription,
  setFilterDescription,
  filterStatus,
  setFilterStatus,
  filterBrand,
  setFilterBrand,
  filterSubCategory,
  setFilterSubCategory,
  filterZone,
  setFilterZone,
  filterClient,
  setFilterClient,
  filterProduct,
  setFilterProduct,
}: DiscountFiltersProps) => {
  const { data: brands, isLoading: isLoadingBrands } = useGetBrands();
  const { data: subCategories, isLoading: isLoadingSubCategories } = useGetSubCategoriesSimple();
  const { data: zones, isLoading: isLoadingZones } = useGetZones();
  const { data: clients, isLoading: isLoadingClients } = useGetClients(1, 100);
  // const { data: products, isLoading: isLoadingProducts } = useGetProducts(1, 100, undefined);
  const products: any[] = [];
  const isLoadingProducts = false;
  const [inputValue, setInputValue] = useState(filterDescription || '');

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');
  const popoverBg = useColorModeValue('white', 'gray.800');
  const popoverBorder = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = useColorModeValue('blue.400', 'blue.300');
  const focusBoxShadow = useColorModeValue('0 0 0 1px rgb(66, 153, 225)', '0 0 0 1px rgb(144, 205, 244)');

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'pending', label: 'Pendiente' },
  ];

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilterStatus(value === '-1' ? undefined : value);
    },
    [setFilterStatus],
  );

  const handleBrandChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilterBrand(value === '-1' ? undefined : value);
    },
    [setFilterBrand],
  );

  const handleSubCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilterSubCategory(value === '-1' ? undefined : value);
    },
    [setFilterSubCategory],
  );

  const handleZoneChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilterZone(value === '-1' ? undefined : value);
    },
    [setFilterZone],
  );

  const handleClientChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilterClient(value === '-1' ? undefined : value);
    },
    [setFilterClient],
  );

  const handleProductChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilterProduct(value === '-1' ? undefined : value);
    },
    [setFilterProduct],
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    if (inputValue.length >= 2 || inputValue.length === 0) {
      setFilterDescription(inputValue);
    }
  }, [inputValue, setFilterDescription]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch],
  );

  const handleResetFilters = useCallback(() => {
    setFilterStatus(undefined);
    setFilterBrand(undefined);
    setFilterSubCategory(undefined);
    setFilterZone(undefined);
    setFilterClient(undefined);
    setFilterProduct(undefined);
    setInputValue('');
    setFilterDescription('');
  }, [
    setFilterStatus,
    setFilterBrand,
    setFilterSubCategory,
    setFilterZone,
    setFilterClient,
    setFilterProduct,
    setFilterDescription,
  ]);

  // Sync inputValue when filterDescription changes externally
  useEffect(() => {
    setInputValue(filterDescription || '');
  }, [filterDescription]);

  const hasActiveFilters =
    filterStatus !== undefined ||
    filterBrand !== undefined ||
    filterSubCategory !== undefined ||
    filterZone !== undefined ||
    filterClient !== undefined ||
    filterProduct !== undefined ||
    (filterDescription !== undefined && filterDescription.trim() !== '');

  const activeSelectFilters = [
    filterStatus !== undefined ? 1 : 0,
    filterBrand !== undefined ? 1 : 0,
    filterSubCategory !== undefined ? 1 : 0,
    filterZone !== undefined ? 1 : 0,
    filterClient !== undefined ? 1 : 0,
    filterProduct !== undefined ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap" w="100%">
      <Box
        display="flex"
        bg={isLoading ? disabledColor : bgInput}
        borderRadius="md"
        overflow="hidden"
        flex="1"
        w="100%"
        borderWidth="1px"
        borderColor={isLoading ? disabledColor : borderInput}
      >
        <InputGroup flex="1">
          <Input
            placeholder="Buscar por descripción..."
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
                  value={filterStatus !== undefined ? filterStatus : '-1'}
                  onChange={handleStatusChange}
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
                  {filterStatus === undefined && <option value="-1">Filtrar por estado</option>}
                  {statusOptions.map((option) => (
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
                  value={filterSubCategory !== undefined ? filterSubCategory : '-1'}
                  onChange={handleSubCategoryChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || isLoadingSubCategories}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterSubCategory === undefined && <option value="-1">Filtrar por subcategoría</option>}
                  {subCategories?.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id.toString()}>
                      {subCategory.name}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterZone !== undefined ? filterZone : '-1'}
                  onChange={handleZoneChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || isLoadingZones}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterZone === undefined && <option value="-1">Filtrar por zona</option>}
                  {zones?.map((zone) => (
                    <option key={zone.id} value={zone.id.toString()}>
                      {zone.name}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterClient !== undefined ? filterClient : '-1'}
                  onChange={handleClientChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || isLoadingClients}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterClient === undefined && <option value="-1">Filtrar por cliente</option>}
                  {clients?.map((client) => (
                    <option key={client.id} value={client.id.toString()}>
                      {client.name}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterProduct !== undefined ? filterProduct : '-1'}
                  onChange={handleProductChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || isLoadingProducts}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterProduct === undefined && <option value="-1">Filtrar por producto</option>}
                  {products?.map((product) => (
                    <option key={product.id} value={product.id.toString()}>
                      {product.name}
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
