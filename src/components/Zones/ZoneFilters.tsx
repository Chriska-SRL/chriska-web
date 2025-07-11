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
} from '@chakra-ui/react';
import { VscDebugRestart } from 'react-icons/vsc';
import { Day } from '@/enums/day.enum';
import { AiOutlineSearch } from 'react-icons/ai';

type ZoneFiltersProps = {
  filterName: string;
  setFilterName: (value: string) => void;
  filterPedidoDay: Day | '';
  setFilterPedidoDay: (value: Day | '') => void;
  filterEntregaDay: Day | '';
  setFilterEntregaDay: (value: Day | '') => void;
};

export const ZoneFilters = ({
  filterName,
  setFilterName,
  filterPedidoDay,
  setFilterPedidoDay,
  filterEntregaDay,
  setFilterEntregaDay,
}: ZoneFiltersProps) => {
  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

  const dayOptions = Object.values(Day);

  const handleResetFilters = () => {
    setFilterName('');
    setFilterPedidoDay('');
    setFilterEntregaDay('');
  };

  const hasActiveFilters = filterName !== '' || filterPedidoDay !== '' || filterEntregaDay !== '';

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} w="100%" alignItems="center" flexWrap="wrap">
      <InputGroup w={{ base: '100%', md: '15rem' }}>
        <Input
          placeholder="Buscar por nombre..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          bg={bgInput}
          borderColor={borderInput}
          _placeholder={{ color: textColor }}
          color={textColor}
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color={textColor} />
        </InputRightElement>
      </InputGroup>

      <Select
        placeholder="Día de pedido"
        value={filterPedidoDay || ''}
        onChange={(e) => setFilterPedidoDay(e.target.value as Day | '')}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: 'auto' }}
      >
        {dayOptions.map((day) => (
          <option key={`pedido-${day}`} value={day}>
            {day}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Día de entrega"
        value={filterEntregaDay || ''}
        onChange={(e) => setFilterEntregaDay(e.target.value as Day | '')}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: 'auto' }}
      >
        {dayOptions.map((day) => (
          <option key={`entrega-${day}`} value={day}>
            {day}
          </option>
        ))}
      </Select>

      {hasActiveFilters && (
        <IconButton
          aria-label="Reiniciar filtros"
          icon={<VscDebugRestart />}
          bg={bgInput}
          _hover={{ bg: hoverResetBg }}
          onClick={handleResetFilters}
          flexShrink={0}
        />
      )}
    </Flex>
  );
};
