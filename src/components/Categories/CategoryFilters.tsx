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

type CategoryFiltersProps = {
  filterName: string;
  setFilterName: (value: string) => void;
};

export const CategoryFilters = ({ filterName, setFilterName }: CategoryFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const inputBg = useColorModeValue('#f2f2f2', 'gray.700');
  const inputBorder = useColorModeValue('#f2f2f2', 'gray.600');
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  const hoverReset = useColorModeValue('#e0dede', 'gray.600');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
  };

  const handleResetFilters = () => {
    setFilterName('');
  };

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
          placeholder="Buscar por nombre..."
          value={filterName}
          onChange={handleNameChange}
          bg={inputBg}
          borderColor={inputBorder}
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color={iconColor} />
        </InputRightElement>
      </InputGroup>

      {filterName && (
        <IconButton
          aria-label="Reiniciar filtros"
          icon={<VscDebugRestart />}
          bg={inputBg}
          _hover={{ bg: hoverReset }}
          onClick={handleResetFilters}
        />
      )}
    </Flex>
  );
};
