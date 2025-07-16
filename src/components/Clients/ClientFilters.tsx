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
  InputLeftElement,
  Box,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { useGetZones } from '@/hooks/zone';

type SearchParam = 'name' | 'razonSocial' | 'contactName';

type ClientFiltersProps = {
  filterName: string;
  setFilterName: (value: string) => void;
  filterZone: string;
  setFilterZone: (value: string) => void;
  searchParam: SearchParam;
  setSearchParam: (value: SearchParam) => void;
};

export const ClientFilters = ({
  filterName,
  setFilterName,
  filterZone,
  setFilterZone,
  searchParam,
  setSearchParam,
}: ClientFiltersProps) => {
  const { data: zones } = useGetZones();

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

  const searchOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'razonSocial', label: 'Razón Social' },
    { value: 'contactName', label: 'Contacto' },
  ];

  const handleSearchParamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParam(e.target.value as SearchParam);
    setFilterName('');
  };

  const handleResetFilters = () => {
    setFilterName('');
    setFilterZone('');
    setSearchParam('name');
  };

  const hasActiveFilters = filterName !== '' || filterZone !== '';

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} w="100%" alignItems="center" flexWrap="wrap">
      <Box
        display="flex"
        bg={bgInput}
        borderRadius="md"
        border="1px solid"
        borderColor={borderInput}
        overflow="hidden"
        w={{ base: '100%', md: '20rem' }}
      >
        <Select
          value={searchParam}
          onChange={handleSearchParamChange}
          bg="transparent"
          border="none"
          color={textColor}
          w="auto"
          minW="7rem"
          borderRadius="none"
          _focus={{ boxShadow: 'none' }}
        >
          {searchOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

        <InputGroup flex="1">
          <Input
            placeholder="Buscar..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            bg="transparent"
            border="none"
            borderRadius="none"
            _placeholder={{ color: textColor }}
            color={textColor}
            _focus={{ boxShadow: 'none' }}
            pl="1rem"
          />
          <InputRightElement>
            <Icon boxSize="5" as={AiOutlineSearch} color={textColor} />
          </InputRightElement>
        </InputGroup>
      </Box>

      {/* Filtro por zona */}
      <Select
        placeholder="Todas las zonas"
        value={filterZone}
        onChange={(e) => setFilterZone(e.target.value)}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: 'auto' }}
      >
        {zones?.map((zone) => (
          <option key={zone.id} value={zone.id.toString()}>
            {zone.name}
          </option>
        ))}
      </Select>

      {/* Botón de reset */}
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
