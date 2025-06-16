'use client';

import {
  Flex,
  Select,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  useMediaQuery,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { useGetRoles } from '@/hooks/roles';

type UserFiltersProps = {
  filterRoleId?: number;
  setFilterRoleId: (value?: number) => void;
  filterStateId?: string;
  setFilterStateId: (value?: string) => void;
  filterName: string;
  setFilterName: (value: string) => void;
};

export const UserFilters = ({
  filterRoleId,
  setFilterRoleId,
  filterStateId,
  setFilterStateId,
  filterName,
  setFilterName,
}: UserFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const { data: roles, isLoading } = useGetRoles();

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterRoleId(value === '-1' ? undefined : parseInt(value, 10));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterStateId(value === '-1' ? undefined : value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
  };

  const handleResetFilters = () => {
    setFilterRoleId(undefined);
    setFilterStateId(undefined);
    setFilterName('');
  };

  const hasActiveFilters = filterRoleId !== undefined || filterStateId !== undefined || filterName !== '';

  return (
    <Flex
      gap="1rem"
      flexDir={{ base: 'column', md: 'row' }}
      w="100%"
      alignItems={{ base: 'stretch', md: 'center' }}
      flexWrap="wrap"
    >
      <Select
        value={filterRoleId !== undefined ? String(filterRoleId) : '-1'}
        onChange={handleRoleChange}
        bg={bgInput}
        borderColor={borderInput}
        disabled={isLoading}
        w={{ base: '100%', md: '12rem' }}
        color={textColor}
      >
        <option value="-1">Filtrar por rol</option>
        {roles?.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </Select>

      <Select
        value={filterStateId || '-1'}
        onChange={handleStateChange}
        bg={bgInput}
        borderColor={borderInput}
        disabled={isLoading}
        w={{ base: '100%', md: '12rem' }}
        color={textColor}
      >
        <option value="-1">Filtrar por estado</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </Select>

      <InputGroup w={{ base: '100%', md: '15rem' }}>
        <Input
          placeholder="Buscar por nombre..."
          value={filterName}
          onChange={handleNameChange}
          disabled={isLoading}
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
