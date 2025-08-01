'use client';

import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  useMediaQuery,
  Select,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaFilter } from 'react-icons/fa';
import { useGetWarehousesSimple } from '@/hooks/warehouse';

type ShelveFiltersProps = {
  isLoading: boolean;
  filterName: string;
  setFilterName: (value: string) => void;
  filterWarehouseId?: number;
  setFilterWarehouseId: (value?: number) => void;
};

export const ShelveFilters = ({
  isLoading,
  filterName,
  setFilterName,
  filterWarehouseId,
  setFilterWarehouseId,
}: ShelveFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [inputValue, setInputValue] = useState(filterName);
  const { data: warehouses, isLoading: isLoadingWarehouses } = useGetWarehousesSimple();

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

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterWarehouseId(value === '-1' ? undefined : parseInt(value, 10));
  };

  const handleResetFilters = () => {
    setInputValue('');
    setFilterName('');
    setFilterWarehouseId(undefined);
  };

  useEffect(() => {
    setInputValue(filterName);
  }, [filterName]);

  const hasActiveFilters = filterName !== '' || filterWarehouseId !== undefined;
  const activeSelectFilters = filterWarehouseId !== undefined ? 1 : 0;

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap" w="100%">
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
            bg={useColorModeValue('white', 'gray.800')}
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            shadow="xl"
            borderRadius="md"
          >
            <PopoverArrow bg={useColorModeValue('white', 'gray.800')} />
            <PopoverBody p="0.75rem">
              <Flex gap="0.75rem" flexDir="column">
                <Select
                  value={filterWarehouseId !== undefined ? String(filterWarehouseId) : '-1'}
                  onChange={handleWarehouseChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || isLoadingWarehouses}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: useColorModeValue('blue.400', 'blue.300'),
                    boxShadow: `0 0 0 1px ${useColorModeValue('rgb(66, 153, 225)', 'rgb(144, 205, 244)')}`,
                  }}
                >
                  {filterWarehouseId === undefined && <option value="-1">Filtrar por depósito</option>}
                  {warehouses?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
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
