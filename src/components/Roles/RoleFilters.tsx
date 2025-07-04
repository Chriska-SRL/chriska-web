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

type RoleFiltersProps = {
  filterName: string;
  setFilterName: (value: string) => void;
};

export const RoleFilters = ({ filterName, setFilterName }: RoleFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

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
          bg={bgInput}
          borderColor={borderInput}
          _placeholder={{ color: textColor }}
          color={textColor}
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color={textColor} />
        </InputRightElement>
      </InputGroup>

      {filterName && (
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
