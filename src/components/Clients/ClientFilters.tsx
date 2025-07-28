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
import { useGetZones } from '@/hooks/zone';

type SearchParam = 'name' | 'razonSocial' | 'contactName';

type ClientFiltersProps = {
  isLoading: boolean;
  filterName: string;
  setFilterName: (value: string) => void;
  filterZone: string;
  setFilterZone: (value: string) => void;
  searchParam: SearchParam;
  setSearchParam: (value: SearchParam) => void;
};

export const ClientFilters = ({
  isLoading,
  filterName,
  setFilterName,
  filterZone,
  setFilterZone,
  searchParam,
  setSearchParam,
}: ClientFiltersProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const { isOpen: isFiltersOpen, onToggle: toggleFilters } = useDisclosure();

  const { data: zones, isLoading: isLoadingZones } = useGetZones();

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');

  const searchOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'razonSocial', label: 'Razón social' },
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

  const activeSelectFilters = filterZone !== '' ? 1 : 0;

  return (
    <Flex gap="1rem" flexDir="column" w="100%">
      <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap">
        <Box
          display="flex"
          bg={isLoading ? disabledColor : bgInput}
          borderRadius="md"
          overflow="hidden"
          flex={{ base: '1', md: '0 1 auto' }}
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
            maxW={{ base: '5rem', md: '100%' }}
            disabled={isLoading}
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
              disabled={isLoading}
            />
            <InputRightElement>
              <Icon boxSize="5" as={AiOutlineSearch} color={textColor} />
            </InputRightElement>
          </InputGroup>
        </Box>

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
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              bg={bgInput}
              borderColor={borderInput}
              color={textColor}
              disabled={isLoading || isLoadingZones}
              w={{ base: '100%', md: 'auto' }}
              minW={{ base: '100%', md: '10rem' }}
              maxW={{ base: '100%', md: '14rem' }}
              transition="all 0.2s ease"
            >
              {filterZone === '' && <option value="">Filtrar por zona</option>}
              {zones?.map((zone) => (
                <option key={zone.id} value={zone.id.toString()}>
                  {zone.name}
                </option>
              ))}
            </Select>
          </Flex>
        </Box>
      </Collapse>
    </Flex>
  );
};
