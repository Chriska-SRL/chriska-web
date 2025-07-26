'use client';

import {
  Flex,
  Select,
  Input,
  useColorModeValue,
  IconButton,
  InputGroup,
  Icon,
  InputRightElement,
  Box,
  Button,
  Collapse,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';
import { UnitTypeOptions } from '@/enums/unitType.enum';
import { useGetBrands } from '@/hooks/brand';
import { useGetCategories } from '@/hooks/category';
import { useGetSubCategories } from '@/hooks/subcategory';

type SearchParam = 'name' | 'internalCode' | 'barcode';

type ProductFiltersProps = {
  isLoadingProducts: boolean;
  filterName: string;
  setFilterName: (value: string) => void;
  filterUnitType: string;
  setFilterUnitType: (value: string) => void;
  filterBrand: string;
  setFilterBrand: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterSubCategory: string;
  setFilterSubCategory: (value: string) => void;
  searchParam: SearchParam;
  setSearchParam: (value: SearchParam) => void;
};

export const ProductFilters = ({
  isLoadingProducts,
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
  const { isOpen: isFiltersOpen, onToggle: toggleFilters } = useDisclosure();

  const { data: brands, isLoading: isLoadingBrands } = useGetBrands();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();
  const { data: subCategories, isLoading: isLoadingSubCategories } = useGetSubCategories();

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

  const searchOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'internalCode', label: 'Código interno' },
    { value: 'barcode', label: 'Código de barras' },
  ];

  const handleSearchParamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParam(e.target.value as SearchParam);
    setFilterName('');
  };

  const handleResetFilters = () => {
    setFilterName('');
    setFilterUnitType('');
    setFilterBrand('');
    setFilterCategory('');
    setFilterSubCategory('');
    setSearchParam('name');
  };

  const hasActiveFilters =
    filterName !== '' ||
    filterUnitType !== '' ||
    filterBrand !== '' ||
    filterCategory !== '' ||
    filterSubCategory !== '';

  const activeSelectFilters = [filterUnitType, filterBrand, filterCategory, filterSubCategory].filter(
    (f) => f !== '',
  ).length;

  const filteredSubCategories = filterCategory
    ? subCategories?.filter((sub) => sub.category.id.toString() === filterCategory)
    : subCategories;

  return (
    <Flex gap="1rem" flexDir="column" w="100%">
      <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap">
        <Box
          display="flex"
          bg={bgInput}
          borderRadius="md"
          border="1px solid"
          borderColor={borderInput}
          overflow="hidden"
          flex={{ base: '1', md: '0 1 auto' }}
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
            disabled={isLoadingProducts}
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
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              bg="transparent"
              border="none"
              borderRadius="none"
              _placeholder={{ color: textColor }}
              color={textColor}
              _focus={{ boxShadow: 'none' }}
              pl="1rem"
              disabled={isLoadingProducts}
            />
            <InputRightElement>
              <Icon boxSize="5" as={AiOutlineSearch} color={textColor} />
            </InputRightElement>
          </InputGroup>
        </Box>

        <Flex gap="1rem" w={{ base: '100%', md: 'auto' }} alignItems="center">
          <Button
            leftIcon={<FaFilter />}
            rightIcon={isFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
            onClick={toggleFilters}
            bg={bgInput}
            _hover={{ bg: hoverResetBg }}
            size="md"
            variant="outline"
            borderColor={borderInput}
            color={textColor}
            disabled={isLoadingProducts}
            flex={{ base: '1', md: 'none' }}
            minW={{ base: '0', md: '10rem' }}
            transition="all 0.2s ease"
          >
            Filtros avanzados {activeSelectFilters > 0 && `(${activeSelectFilters})`}
          </Button>

          {hasActiveFilters && (
            <IconButton
              aria-label="Reiniciar filtros"
              icon={<VscDebugRestart />}
              bg={bgInput}
              _hover={{ bg: hoverResetBg }}
              onClick={handleResetFilters}
              disabled={isLoadingProducts}
              flexShrink={0}
              borderColor={borderInput}
              transition="all 0.2s ease"
            />
          )}
        </Flex>
      </Flex>

      <Collapse
        in={isFiltersOpen}
        animateOpacity
        transition={{
          enter: { duration: 0.25, ease: 'easeOut' },
          exit: { duration: 0.25, ease: 'easeIn' },
        }}
        style={{
          overflow: 'hidden',
        }}
      >
        <Box>
          <Flex
            gap="1rem"
            flexDir={{ base: 'column', md: 'row' }}
            alignItems="center"
            flexWrap={{ base: 'nowrap', md: 'wrap' }}
          >
            <Select
              value={filterUnitType}
              onChange={(e) => setFilterUnitType(e.target.value)}
              bg={bgInput}
              borderColor={borderInput}
              color={textColor}
              disabled={isLoadingProducts}
              w={{ base: '100%', md: 'auto' }}
              minW={{ base: '100%', md: '10rem' }}
              maxW={{ base: '100%', md: '12rem' }}
              transition="all 0.2s ease"
            >
              {filterUnitType === '' && <option value="">Filtrar por unidad</option>}
              {UnitTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              bg={bgInput}
              borderColor={borderInput}
              color={textColor}
              disabled={isLoadingProducts || isLoadingBrands}
              w={{ base: '100%', md: 'auto' }}
              minW={{ base: '100%', md: '10rem' }}
              maxW={{ base: '100%', md: '14rem' }}
              transition="all 0.2s ease"
            >
              {filterBrand === '' && <option value="">Filtrar por marca</option>}
              {brands?.map((brand) => (
                <option key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </option>
              ))}
            </Select>

            <Select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setFilterSubCategory('');
              }}
              bg={bgInput}
              borderColor={borderInput}
              color={textColor}
              disabled={isLoadingProducts || isLoadingCategories}
              w={{ base: '100%', md: 'auto' }}
              minW={{ base: '100%', md: '10rem' }}
              maxW={{ base: '100%', md: '15rem' }}
              transition="all 0.2s ease"
            >
              {filterCategory === '' && <option value="">Filtrar por categoría</option>}
              {categories?.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </Select>

            <Select
              value={filterSubCategory}
              onChange={(e) => setFilterSubCategory(e.target.value)}
              bg={bgInput}
              borderColor={borderInput}
              color={textColor}
              w={{ base: '100%', md: 'auto' }}
              minW={{ base: '100%', md: '12rem' }}
              maxW={{ base: '100%', md: '16rem' }}
              disabled={!filterCategory || isLoadingProducts || isLoadingSubCategories}
              transition="all 0.2s ease"
            >
              {filterSubCategory === '' && <option value="">Filtrar por subcategoría</option>}
              {filteredSubCategories?.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id.toString()}>
                  {subCategory.name}
                </option>
              ))}
            </Select>
          </Flex>
        </Box>
      </Collapse>
    </Flex>
  );
};
