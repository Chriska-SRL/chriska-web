// VehicleCostFilters.tsx
'use client';

import { VehicleCostTypeLabels } from '@/entities/vehicleCostType';
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

type VehicleCostFiltersProps = {
  filterType?: string;
  setFilterType: (value?: string) => void;
  filterDescription: string;
  setFilterDescription: (value: string) => void;
  from: string;
  to: string;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  availableTypes: string[];
};

export const VehicleCostFilters = ({
  filterType,
  setFilterType,
  filterDescription,
  setFilterDescription,
  from,
  to,
  setFrom,
  setTo,
  availableTypes,
}: VehicleCostFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterType(value === '-1' ? undefined : value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDescription(e.target.value);
  };

  const handleResetFilters = () => {
    setFilterType(undefined);
    setFilterDescription('');
    setFrom('');
    setTo('');
  };

  const hasActiveFilters = !!filterType || filterDescription !== '' || from !== '' || to !== '';

  return (
    <Flex
      gap="1rem"
      flexDir={{ base: 'column', md: 'row' }}
      w="100%"
      alignItems={{ base: 'stretch', md: 'center' }}
      flexWrap="wrap"
    >
      <Select
        value={filterType ?? '-1'}
        onChange={handleTypeChange}
        bg={bgInput}
        borderColor={borderInput}
        w={{ base: '100%', md: '12rem' }}
        color={textColor}
      >
        <option value="-1">Filtrar por tipo</option>
        {Object.entries(VehicleCostTypeLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </Select>

      <InputGroup w={{ base: '100%', md: '15rem' }}>
        <Input
          placeholder="Buscar en descripción..."
          value={filterDescription}
          onChange={handleDescriptionChange}
          bg={bgInput}
          borderColor={borderInput}
          _placeholder={{ color: textColor }}
          color={textColor}
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color={textColor} />
        </InputRightElement>
      </InputGroup>

      <Input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        max={to || undefined}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: '11rem' }}
      />
      <Input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        min={from || undefined}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: '11rem' }}
      />

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
