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
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';

type VehicleFiltersProps = {
  filterPlate: string;
  setFilterPlate: (value: string) => void;
  availableBrands: string[];
  availableModels: string[];
};

export const VehicleFilters = ({ filterPlate, setFilterPlate }: VehicleFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterPlate(e.target.value);
  };

  const handleResetFilters = () => {
    setFilterPlate('');
  };

  const hasActiveFilters = filterPlate !== '';

  return (
    <Flex
      gap="1rem"
      flexDir={{ base: 'column', md: 'row' }}
      w="100%"
      alignItems={{ base: 'stretch', md: 'center' }}
      flexWrap="wrap"
    >
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
