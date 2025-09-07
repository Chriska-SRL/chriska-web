'use client';

import { Flex, Input, IconButton, useColorModeValue, Box, Text, HStack, Icon } from '@chakra-ui/react';
import { VscDebugRestart } from 'react-icons/vsc';
import { FiTrendingUp } from 'react-icons/fi';
import { useState, useEffect } from 'react';

type SupplierAccountStatementFiltersProps = {
  onFilterChange: (filters: { fromDate?: string; toDate?: string }) => void;
  disabled?: boolean;
  totalBalance?: string;
};

export const SupplierAccountStatementFilters = ({
  onFilterChange,
  disabled = false,
  totalBalance,
}: SupplierAccountStatementFiltersProps) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

  useEffect(() => {
    onFilterChange({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });
  }, [fromDate, toDate, onFilterChange]);

  const handleResetFilters = () => {
    setFromDate('');
    setToDate('');
  };

  const hasActiveFilters = fromDate !== '' || toDate !== '';

  const getAmountColor = (amount?: string) => {
    if (!amount) return textColor;
    const numAmount = parseFloat(amount);
    if (numAmount > 0) return 'green.500';
    if (numAmount < 0) return 'red.500';
    return textColor;
  };

  return (
    <Flex
      gap="1rem"
      flexDir={{ base: 'column', md: 'row' }}
      w="100%"
      alignItems={{ base: 'stretch', md: 'center' }}
      justifyContent="space-between"
    >
      {/* Balance Total - Izquierda */}
      <Box flex="1">
        {totalBalance !== undefined && (
          <Box
            px="1rem"
            py="0.5rem"
            bg={bgInput}
            border="1px solid"
            borderColor={borderInput}
            borderRadius="md"
            minH="2.5rem"
            display="flex"
            alignItems="center"
            w={{ base: '100%', md: 'fit-content' }}
          >
            <HStack spacing="0.5rem">
              <Icon as={FiTrendingUp} boxSize="1rem" color={textColor} />
              <Text color={textColor} fontSize="sm" fontWeight="medium">
                Saldo Total:
              </Text>
              <Text fontWeight="bold" color={getAmountColor(totalBalance)} fontSize="sm">
                ${totalBalance}
              </Text>
            </HStack>
          </Box>
        )}
      </Box>

      {/* Filtros de fecha - Derecha */}
      <Flex
        gap="1rem"
        flexDir={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'stretch', md: 'center' }}
        flexWrap="wrap"
      >
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          max={toDate || undefined}
          bg={bgInput}
          borderColor={borderInput}
          color={textColor}
          w={{ base: '100%', md: '11rem' }}
          disabled={disabled}
          placeholder="Desde"
        />

        <Input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          min={fromDate || undefined}
          bg={bgInput}
          borderColor={borderInput}
          color={textColor}
          w={{ base: '100%', md: '11rem' }}
          disabled={disabled}
          placeholder="Hasta"
        />

        {hasActiveFilters && (
          <IconButton
            aria-label="Reiniciar filtros"
            icon={<VscDebugRestart />}
            bg={bgInput}
            _hover={{ bg: hoverResetBg }}
            onClick={handleResetFilters}
            isDisabled={disabled}
          />
        )}
      </Flex>
    </Flex>
  );
};
