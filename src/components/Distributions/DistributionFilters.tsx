'use client';

import {
  Flex,
  Select,
  Input,
  useColorModeValue,
  IconButton,
  InputGroup,
  InputRightElement,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaFilter } from 'react-icons/fa';
import { useGetUsers } from '@/hooks/user';
import { useGetVehicles } from '@/hooks/vehicle';

type DistributionFiltersProps = {
  isLoading: boolean;
  filterId: string;
  setFilterId: (value: string) => void;
  filterUser?: string;
  setFilterUser: (value?: string) => void;
  filterVehicle?: string;
  setFilterVehicle: (value?: string) => void;
  filterDate?: string;
  setFilterDate: (value?: string) => void;
};

export const DistributionFilters = ({
  isLoading,
  filterId,
  setFilterId,
  filterUser,
  setFilterUser,
  filterVehicle,
  setFilterVehicle,
  filterDate,
  setFilterDate,
}: DistributionFiltersProps) => {
  const [inputValue, setInputValue] = useState('');

  // Color values (identical to ProductFilters)
  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');
  const popoverBg = useColorModeValue('white', 'gray.800');
  const popoverBorder = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = useColorModeValue('blue.400', 'blue.300');
  const focusBoxShadow = useColorModeValue('0 0 0 1px rgb(66, 153, 225)', '0 0 0 1px rgb(144, 205, 244)');

  // Data hooks
  const { data: users, isLoading: isLoadingUsers } = useGetUsers(1, 100);
  const { data: vehicles, isLoading: isLoadingVehicles } = useGetVehicles(1, 100);

  // Handlers
  const handleUserChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilterUser(value === '-1' ? undefined : value);
    },
    [setFilterUser],
  );

  const handleVehicleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilterVehicle(value === '-1' ? undefined : value);
    },
    [setFilterVehicle],
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterDate(value === '' ? undefined : value);
    },
    [setFilterDate],
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    if (inputValue.length >= 1 || inputValue.length === 0) {
      setFilterId(inputValue);
    }
  }, [inputValue, setFilterId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch],
  );

  const handleResetFilters = useCallback(() => {
    setFilterUser(undefined);
    setFilterVehicle(undefined);
    setFilterDate(undefined);
    setInputValue('');
    setFilterId('');
  }, [setFilterUser, setFilterVehicle, setFilterDate, setFilterId]);

  // Sync inputValue when filterId changes externally
  useEffect(() => {
    setInputValue(filterId);
  }, [filterId]);

  const hasActiveFilters =
    filterUser !== undefined || filterVehicle !== undefined || filterDate !== undefined || filterId !== '';

  const activeSelectFilters = [
    filterUser !== undefined ? 1 : 0,
    filterVehicle !== undefined ? 1 : 0,
    filterDate !== undefined ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap" w="100%">
      <Flex bg={isLoading ? disabledColor : bgInput} borderRadius="md" overflow="hidden" flex="1" w="100%">
        <InputGroup flex="1">
          <Input
            placeholder="Buscar por ID..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
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
            <IconButton
              aria-label="Buscar"
              icon={<AiOutlineSearch size="1.25rem" />}
              size="sm"
              variant="ghost"
              onClick={handleSearch}
              disabled={isLoading}
              color={textColor}
              _hover={{}}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>

      <Flex gap="1rem" w={{ base: '100%', md: 'auto' }} alignItems="center" flexShrink={0}>
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Button
              leftIcon={<FaFilter />}
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
          </PopoverTrigger>
          <PopoverContent
            w="auto"
            minW="18rem"
            maxW="22rem"
            bg={popoverBg}
            borderColor={popoverBorder}
            shadow="xl"
            borderRadius="md"
          >
            <PopoverArrow bg={popoverBg} />
            <PopoverBody p="0.75rem">
              <Flex gap="0.75rem" flexDir="column">
                <Select
                  value={filterUser !== undefined ? filterUser : '-1'}
                  onChange={handleUserChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || isLoadingUsers}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterUser === undefined && <option value="-1">Filtrar por usuario</option>}
                  {users?.map((user) => (
                    <option key={user.id} value={user.id.toString()}>
                      {user.name}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterVehicle !== undefined ? filterVehicle : '-1'}
                  onChange={handleVehicleChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading || isLoadingVehicles}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {filterVehicle === undefined && <option value="-1">Filtrar por vehículo</option>}
                  {vehicles?.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.plate} - {vehicle.model}
                    </option>
                  ))}
                </Select>

                <Input
                  type="date"
                  value={filterDate || ''}
                  onChange={handleDateChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  disabled={isLoading}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                  placeholder="Filtrar por fecha"
                />
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>

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
  );
};
