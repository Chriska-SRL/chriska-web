'use client';

import {
  Flex,
  Select,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  IconButton,
  useMediaQuery,
  useColorModeValue,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';

type VehicleFiltersProps = {
  filterBrand?: string;
  setFilterBrand: (value?: string) => void;
  filterModel?: string;
  setFilterModel: (value?: string) => void;
  filterPlate: string;
  setFilterPlate: (value: string) => void;
  availableBrands: string[];
  availableModels: string[];
};

export const VehicleFilters = ({
  filterBrand,
  setFilterBrand,
  filterModel,
  setFilterModel,
  filterPlate,
  setFilterPlate,
  availableBrands,
  availableModels,
}: VehicleFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterBrand(value === '-1' ? undefined : value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterModel(value === '-1' ? undefined : value);
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterPlate(e.target.value);
  };

  const handleResetFilters = () => {
    setFilterBrand(undefined);
    setFilterModel(undefined);
    setFilterPlate('');
  };

  const hasActiveFilters = !!filterBrand || !!filterModel || filterPlate !== '';

  return (
    <Flex
      gap="1rem"
      flexDir={{ base: 'column', md: 'row' }}
      w="100%"
      alignItems={{ base: 'stretch', md: 'center' }}
      flexWrap="wrap"
    >
      <Select
        value={filterBrand ?? '-1'}
        onChange={handleBrandChange}
        bg={bgInput}
        borderColor={borderInput}
        w={{ base: '100%', md: '12rem' }}
        color={textColor}
      >
        <option value="-1">Filtrar por marca</option>
        {availableBrands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </Select>

      <Select
        value={filterModel ?? '-1'}
        onChange={handleModelChange}
        bg={bgInput}
        borderColor={borderInput}
        w={{ base: '100%', md: '12rem' }}
        color={textColor}
      >
        <option value="-1">Filtrar por modelo</option>
        {availableModels.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Select>

      <InputGroup w={{ base: '100%', md: '15rem' }}>
        <Input
          placeholder="Buscar por matrícula..."
          value={filterPlate}
          onChange={handlePlateChange}
          bg={bgInput}
          borderColor={borderInput}
          _placeholder={{ color: textColor }}
          color={textColor}
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color={textColor} />
        </InputRightElement>
      </InputGroup>

      {hasActiveFilters && (
        <IconButton
          aria-label="Reiniciar filtros"
          icon={<VscDebugRestart />}
          bg={bgInput}
          _hover={{ bg: hoverResetBg }}
          onClick={handleResetFilters}
        />
      )}
    </Flex>
  );
};
