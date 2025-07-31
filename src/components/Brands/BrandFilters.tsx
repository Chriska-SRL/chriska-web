'use client';

import { Flex, Input, InputGroup, InputRightElement, useColorModeValue, IconButton } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';

type BrandFiltersProps = {
  isLoading: boolean;
  filterName: string;
  setFilterName: (value: string) => void;
};

export const BrandFilters = ({ isLoading, filterName, setFilterName }: BrandFiltersProps) => {
  const [inputValue, setInputValue] = useState(filterName);

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    if (inputValue.length >= 2 || inputValue.length === 0) {
      setFilterName(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResetFilters = () => {
    setInputValue('');
    setFilterName('');
  };

  useEffect(() => {
    setInputValue(filterName);
  }, [filterName]);

  const hasActiveFilters = filterName !== '';

  return (
    <Flex gap="1rem" flexDir="row" w="100%" alignItems="center" flexWrap="wrap">
      <InputGroup flex="1">
        <Input
          placeholder="Buscar por nombre..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          bg={bgInput}
          borderColor={borderInput}
          _placeholder={{ color: textColor }}
          color={textColor}
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

      {hasActiveFilters && (
        <IconButton
          aria-label="Reiniciar filtros"
          icon={<VscDebugRestart />}
          bg={bgInput}
          _hover={{ bg: bgInput }}
          onClick={handleResetFilters}
          flexShrink={0}
          disabled={isLoading}
        />
      )}
    </Flex>
  );
};
