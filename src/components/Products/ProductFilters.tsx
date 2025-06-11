// ProductFilters.tsx

'use client';

import { Flex, Input, InputGroup, InputRightElement, Icon, IconButton, useMediaQuery } from '@chakra-ui/react';
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
          bg="#f2f2f2"
          borderColor="#f2f2f2"
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color="grey" />
        </InputRightElement>
      </InputGroup>

      {hasActiveFilters && (
        <IconButton
          aria-label="Reiniciar filtros"
          icon={<VscDebugRestart />}
          bg="#f2f2f2"
          _hover={{ bg: '#e0dede' }}
          onClick={handleResetFilters}
        />
      )}
    </Flex>
  );
};
