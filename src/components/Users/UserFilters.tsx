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
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';
import { useGetRoles } from '@/hooks/role';

type UserFiltersProps = {
  isLoading: boolean;
  filterRoleId?: number;
  setFilterRoleId: (value?: number) => void;
  filterStateId?: string;
  setFilterStateId: (value?: string) => void;
  filterName: string;
  setFilterName: (value: string) => void;
};

export const UserFilters = ({
  isLoading,
  filterRoleId,
  setFilterRoleId,
  filterStateId,
  setFilterStateId,
  filterName,
  setFilterName,
}: UserFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const { isOpen: isFiltersOpen, onToggle: toggleFilters } = useDisclosure();
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

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

  const activeSelectFilters = [filterRoleId !== undefined ? 1 : 0, filterStateId !== undefined ? 1 : 0].reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <Flex gap="1rem" flexDir="column" w="100%">
      <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap">
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
            disabled={isLoading}
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
              disabled={isLoading}
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
              value={filterRoleId !== undefined ? String(filterRoleId) : '-1'}
              onChange={handleRoleChange}
              bg={bgInput}
              borderColor={borderInput}
              disabled={isLoading || isLoadingRoles}
              w={{ base: '100%', md: 'auto' }}
              minW={{ base: '100%', md: '10rem' }}
              maxW={{ base: '100%', md: '14rem' }}
              color={textColor}
              transition="all 0.2s ease"
            >
              {filterRoleId === undefined && <option value="-1">Filtrar por rol</option>}
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
              w={{ base: '100%', md: 'auto' }}
              minW={{ base: '100%', md: '10rem' }}
              maxW={{ base: '100%', md: '14rem' }}
              color={textColor}
              transition="all 0.2s ease"
            >
              {filterStateId === undefined && <option value="-1">Filtrar por estado</option>}
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </Select>
          </Flex>
        </Box>
      </Collapse>
    </Flex>
  );
};
