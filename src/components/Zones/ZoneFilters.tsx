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
import { VscDebugRestart } from 'react-icons/vsc';
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';
import { Day } from '@/enums/day.enum';
import { AiOutlineSearch } from 'react-icons/ai';

type ZoneFiltersProps = {
  isLoadingZones: boolean;
  filterName: string;
  setFilterName: (value: string) => void;
  filterPedidoDay: Day | '';
  setFilterPedidoDay: (value: Day | '') => void;
  filterEntregaDay: Day | '';
  setFilterEntregaDay: (value: Day | '') => void;
};

export const ZoneFilters = ({
  isLoadingZones,
  filterName,
  setFilterName,
  filterPedidoDay,
  setFilterPedidoDay,
  filterEntregaDay,
  setFilterEntregaDay,
}: ZoneFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const { isOpen: isFiltersOpen, onToggle: toggleFilters } = useDisclosure();

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

  const activeSelectFilters = [filterPedidoDay, filterEntregaDay].filter((f) => f !== '').length;

  return (
    <Flex gap="1rem" flexDir="column" w="100%">
      <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap">
        <InputGroup w={{ base: '100%', md: '15rem' }}>
          <Input
            placeholder="Buscar por nombre..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            disabled={isLoadingZones}
            bg={bgInput}
            borderColor={borderInput}
            _placeholder={{ color: textColor }}
            color={textColor}
          />
          <InputRightElement>
            <Icon boxSize="5" as={AiOutlineSearch} color={textColor} />
          </InputRightElement>
        </InputGroup>

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
            disabled={isLoadingZones}
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
              disabled={isLoadingZones}
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
              placeholder="Día de pedido"
              value={filterPedidoDay || ''}
              onChange={(e) => setFilterPedidoDay(e.target.value as Day | '')}
              disabled={isLoadingZones}
              bg={bgInput}
              borderColor={borderInput}
              color={textColor}
              w={{ base: '100%', md: 'auto' }}
              minW={{ base: '100%', md: '10rem' }}
              maxW={{ base: '100%', md: '14rem' }}
              transition="all 0.2s ease"
            >
              {filterPedidoDay === '' && <option value="">Día de pedido</option>}
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
              disabled={isLoadingZones}
              bg={bgInput}
              borderColor={borderInput}
              color={textColor}
              w={{ base: '100%', md: 'auto' }}
              minW={{ base: '100%', md: '10rem' }}
              maxW={{ base: '100%', md: '14rem' }}
              transition="all 0.2s ease"
            >
              {filterEntregaDay === '' && <option value="">Día de entrega</option>}
              {dayOptions.map((day) => (
                <option key={`entrega-${day}`} value={day}>
                  {day}
                </option>
              ))}
            </Select>
          </Flex>
        </Box>
      </Collapse>
    </Flex>
  );
};
