'use client';

import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Select,
  Box,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { useState, useEffect, useCallback } from 'react';

type SearchParam = 'plate' | 'brand' | 'model';

type VehicleFiltersProps = {
  isLoading: boolean;
  filterPlate: string;
  setFilterPlate: (value: string) => void;
  filterBrand: string;
  setFilterBrand: (value: string) => void;
  filterModel: string;
  setFilterModel: (value: string) => void;
};

export const VehicleFilters = ({
  isLoading: isLoadingVehicles,
  filterPlate,
  setFilterPlate,
  filterBrand,
  setFilterBrand,
  filterModel,
  setFilterModel,
}: VehicleFiltersProps) => {
  const [searchParam, setSearchParam] = useState<SearchParam>('plate');
  const [inputValue, setInputValue] = useState('');

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');

  const searchOptions = [
    { value: 'plate', label: 'Matrícula' },
    { value: 'brand', label: 'Marca' },
    { value: 'model', label: 'Modelo' },
  ];

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    if (inputValue.length >= 2 || inputValue.length === 0) {
      if (searchParam === 'plate') {
        setFilterPlate(inputValue);
        setFilterBrand('');
        setFilterModel('');
      } else if (searchParam === 'brand') {
        setFilterBrand(inputValue);
        setFilterPlate('');
        setFilterModel('');
      } else if (searchParam === 'model') {
        setFilterModel(inputValue);
        setFilterPlate('');
        setFilterBrand('');
      }
    }
  }, [inputValue, searchParam, setFilterPlate, setFilterBrand, setFilterModel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch],
  );

  const handleSearchParamChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSearchParam(e.target.value as SearchParam);
      setInputValue('');
      setFilterPlate('');
      setFilterBrand('');
      setFilterModel('');
    },
    [setFilterPlate, setFilterBrand, setFilterModel],
  );

  const handleResetFilters = useCallback(() => {
    setInputValue('');
    setFilterPlate('');
    setFilterBrand('');
    setFilterModel('');
    setSearchParam('plate');
  }, [setFilterPlate, setFilterBrand, setFilterModel]);

  // Sync inputValue with active filter
  useEffect(() => {
    if (filterPlate) {
      setInputValue(filterPlate);
      setSearchParam('plate');
    } else if (filterBrand) {
      setInputValue(filterBrand);
      setSearchParam('brand');
    } else if (filterModel) {
      setInputValue(filterModel);
      setSearchParam('model');
    }
  }, [filterPlate, filterBrand, filterModel]);

  const hasActiveFilters = filterPlate !== '' || filterBrand !== '' || filterModel !== '';

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap" w="100%">
      <Flex
        bg={isLoadingVehicles ? disabledColor : bgInput}
        borderRadius="md"
        overflow="hidden"
        flex="1"
        w="100%"
        borderWidth="1px"
        borderColor={isLoadingVehicles ? disabledColor : borderInput}
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
          disabled={isLoadingVehicles}
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
            disabled={isLoadingVehicles}
          />
          <InputRightElement>
            <IconButton
              aria-label="Buscar"
              icon={<AiOutlineSearch size="1.25rem" />}
              size="sm"
              variant="ghost"
              onClick={handleSearch}
              disabled={isLoadingVehicles}
              color={textColor}
              _hover={{}}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>

      {hasActiveFilters && (
        <IconButton
          aria-label="Reiniciar filtros"
          icon={<VscDebugRestart />}
          bg={bgInput}
          _hover={{ bg: hoverResetBg }}
          onClick={handleResetFilters}
          disabled={isLoadingVehicles}
          flexShrink={0}
          borderColor={borderInput}
          transition="all 0.2s ease"
        />
      )}
    </Flex>
  );
};
