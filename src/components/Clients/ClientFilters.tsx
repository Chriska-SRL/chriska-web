'use client';

import {
  Flex,
  Select,
  Input,
  useColorModeValue,
  IconButton,
  InputGroup,
  InputRightElement,
  Button,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaFilter } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import { useGetZones } from '@/hooks/zone';

type SearchParam = 'name' | 'rut' | 'razonSocial' | 'contactName';

type ClientFiltersProps = {
  isLoading: boolean;
  filterName: string;
  setFilterName: (value: string) => void;
  searchParam: SearchParam;
  setSearchParam: (value: SearchParam) => void;
  filterQualification: string;
  setFilterQualification: (value: string) => void;
  filterZoneId: string;
  setFilterZoneId: (value: string) => void;
};

export const ClientFilters = ({
  isLoading,
  filterName,
  setFilterName,
  searchParam,
  setSearchParam,
  filterQualification,
  setFilterQualification,
  filterZoneId,
  setFilterZoneId,
}: ClientFiltersProps) => {
  const [inputValue, setInputValue] = useState(filterName);

  const { data: zones, isLoading: isLoadingZones } = useGetZones();

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');
  const popoverBg = useColorModeValue('white', 'gray.800');
  const popoverBorder = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = useColorModeValue('blue.400', 'blue.300');
  const focusBoxShadow = useColorModeValue('0 0 0 1px rgb(66, 153, 225)', '0 0 0 1px rgb(144, 205, 244)');

  const searchOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'rut', label: 'RUT' },
    { value: 'razonSocial', label: 'Razón social' },
    { value: 'contactName', label: 'Contacto' },
  ];

  const qualificationOptions = [
    { value: '5/5', label: '⭐⭐⭐⭐⭐ (5/5)' },
    { value: '4/5', label: '⭐⭐⭐⭐☆ (4/5)' },
    { value: '3/5', label: '⭐⭐⭐☆☆ (3/5)' },
    { value: '2/5', label: '⭐⭐☆☆☆ (2/5)' },
    { value: '1/5', label: '⭐☆☆☆☆ (1/5)' },
  ];

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    if (inputValue.length >= 2 || inputValue.length === 0) {
      setFilterName(inputValue);
    }
  }, [inputValue, setFilterName]);

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
      setFilterName('');
    },
    [setSearchParam, setFilterName],
  );

  const handleResetFilters = useCallback(() => {
    setFilterQualification('');
    setFilterZoneId('');
    setInputValue('');
    setFilterName('');
    setSearchParam('name');
  }, [setFilterQualification, setFilterZoneId, setFilterName, setSearchParam]);

  // Sync inputValue when filterName changes externally
  useEffect(() => {
    setInputValue(filterName);
  }, [filterName]);

  const hasActiveFilters = filterQualification !== '' || filterZoneId !== '' || filterName !== '';

  const activeSelectFilters = [filterQualification !== '' ? 1 : 0, filterZoneId !== '' ? 1 : 0].reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap" w="100%">
      <Flex bg={isLoading ? disabledColor : bgInput} borderRadius="md" overflow="hidden" flex="1" w="100%">
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
      </Flex>

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
                  value={filterZoneId}
                  onChange={(e) => setFilterZoneId(e.target.value)}
                  bg={bgInput}
                  borderColor={borderInput}
                  color={textColor}
                  disabled={isLoading || isLoadingZones}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterZoneId === '' && <option value="">Filtrar por zona</option>}
                  {zones?.map((zone) => (
                    <option key={zone.id} value={zone.id.toString()}>
                      {zone.name}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterQualification}
                  onChange={(e) => setFilterQualification(e.target.value)}
                  bg={bgInput}
                  borderColor={borderInput}
                  color={textColor}
                  disabled={isLoading}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterQualification === '' && <option value="">Calificación</option>}
                  {qualificationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
