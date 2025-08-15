'use client';

import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  IconButton,
  useMediaQuery,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';

type RoleFiltersProps = {
  isLoading: boolean;
  filterName: string;
  setFilterName: (value: string) => void;
};

export const RoleFilters = ({ isLoading, filterName, setFilterName }: RoleFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [inputValue, setInputValue] = useState(filterName);

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

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

  // Sync inputValue when filterName changes externally
  useEffect(() => {
    setInputValue(filterName);
  }, [filterName]);

  return (
    <Flex gap="1rem" flexDir="row" w="100%" alignItems="center" flexWrap="wrap">
      <InputGroup flex="1" minW={{ base: '0', md: '15rem' }}>
        <Input
          placeholder="Buscar por nombre..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          bg={bgInput}
          borderColor={borderInput}
          _placeholder={{ color: textColor }}
          color={textColor}
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

      {filterName && (
        <IconButton
          aria-label="Reiniciar filtros"
          icon={<VscDebugRestart />}
          bg={bgInput}
          _hover={{ bg: hoverResetBg }}
          onClick={handleResetFilters}
          flexShrink={0}
          disabled={isLoading}
        />
      )}
    </Flex>
  );
};
