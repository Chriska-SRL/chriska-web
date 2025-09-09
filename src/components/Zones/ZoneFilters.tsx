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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
} from '@chakra-ui/react';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaFilter } from 'react-icons/fa';
import { Day, DayOptions } from '@/enums/day.enum';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect, useCallback } from 'react';

type ZoneFiltersProps = {
  isLoading: boolean;
  filterName: string;
  setFilterName: (value: string) => void;
  filterPedidoDay: Day | '';
  setFilterPedidoDay: (value: Day | '') => void;
  filterEntregaDay: Day | '';
  setFilterEntregaDay: (value: Day | '') => void;
};

export const ZoneFilters = ({
  isLoading,
  filterName,
  setFilterName,
  filterPedidoDay,
  setFilterPedidoDay,
  filterEntregaDay,
  setFilterEntregaDay,
}: ZoneFiltersProps) => {
  const [inputValue, setInputValue] = useState(filterName);

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const popoverBg = useColorModeValue('white', 'gray.800');

  // No longer needed, we'll use DayOptions directly

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

  const handleResetFilters = useCallback(() => {
    setInputValue('');
    setFilterName('');
    setFilterPedidoDay('');
    setFilterEntregaDay('');
  }, [setFilterName, setFilterPedidoDay, setFilterEntregaDay]);

  useEffect(() => {
    setInputValue(filterName);
  }, [filterName]);

  const hasActiveFilters = filterName !== '' || filterPedidoDay !== '' || filterEntregaDay !== '';
  const activeFiltersCount = [filterPedidoDay, filterEntregaDay].filter((f) => f !== '').length;

  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap="1rem" w="100%" align="stretch">
      {/* Search box */}
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

      {/* Advanced filters and reset button */}
      <Flex gap="1rem" alignItems="center" minW={{ base: "auto", md: "200px" }}>
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button
              leftIcon={<FaFilter />}
              bg={bgInput}
              _hover={{ bg: hoverResetBg }}
              variant="outline"
              borderColor={borderInput}
              color={textColor}
              disabled={isLoading}
              flex="1"
            >
              Filtros avanzados{activeFiltersCount > 0 && ` (${activeFiltersCount})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent bg={popoverBg} minW="300px">
            <PopoverBody>
              <VStack spacing="0.75rem" align="stretch">
                <Select
                  placeholder="Día de pedido"
                  value={filterPedidoDay || ''}
                  onChange={(e) => setFilterPedidoDay(e.target.value as Day | '')}
                  disabled={isLoading}
                  bg={bgInput}
                  borderColor={borderInput}
                  color={textColor}
                  size="sm"
                >
                  {DayOptions.map((option) => (
                    <option key={`pedido-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="Día de entrega"
                  value={filterEntregaDay || ''}
                  onChange={(e) => setFilterEntregaDay(e.target.value as Day | '')}
                  disabled={isLoading}
                  bg={bgInput}
                  borderColor={borderInput}
                  color={textColor}
                  size="sm"
                >
                  {DayOptions.map((option) => (
                    <option key={`entrega-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </VStack>
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
          />
        )}
      </Flex>
    </Flex>
  );
};
