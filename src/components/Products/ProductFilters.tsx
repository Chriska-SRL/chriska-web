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

export const ProductFilters = ({
  filterName,
  setFilterName,
}: {
  filterName: string;
  setFilterName: (value: string) => void;
}) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const inputBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const iconColor = useColorModeValue('gray.500', 'gray.300');
  const hoverBg = useColorModeValue('#e0dede', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
  };

  const handleResetFilters = () => {
    setFilterName('');
  };

  const hasActiveFilters = filterName !== '';

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
          borderColor={borderColor}
          _placeholder={{ color: textColor }}
          color={textColor}
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color={iconColor} />
        </InputRightElement>
      </InputGroup>

      {hasActiveFilters && (
        <IconButton
          aria-label="Reiniciar filtros"
          icon={<VscDebugRestart />}
          bg={inputBg}
          _hover={{ bg: hoverBg }}
          onClick={handleResetFilters}
        />
      )}
    </Flex>
  );
};
