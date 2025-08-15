'use client';

import { HStack, Button, Select, IconButton, useColorModeValue, Text } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
};

export const Pagination = ({
  currentPage,
  pageSize,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: PaginationProps) => {
  const selectBg = useColorModeValue('white', 'gray.800');
  const selectBorder = useColorModeValue('gray.300', 'gray.600');
  const selectFocusBorder = useColorModeValue('blue.500', 'blue.300');

  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonBorder = useColorModeValue('gray.300', 'gray.600');
  const buttonHover = useColorModeValue('gray.50', 'gray.700');
  const buttonDisabled = useColorModeValue('gray.100', 'gray.700');

  const currentPageBg = useColorModeValue('gray.100', 'gray.700');
  const currentPageColor = useColorModeValue('black', 'white');

  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <HStack spacing="0.75rem" align="center">
      <HStack spacing="0.5rem" align="center" display={{ base: 'none', md: 'flex' }}>
        <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
          Por página:
        </Text>
        <Select
          size="sm"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          w="4.5rem"
          disabled={isLoading}
          bg={selectBg}
          borderColor={selectBorder}
          _focus={{
            borderColor: selectFocusBorder,
            boxShadow: `0 0 0 1px ${selectFocusBorder}`,
          }}
          _hover={{
            borderColor: selectFocusBorder,
          }}
          borderRadius="md"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </Select>
      </HStack>

      <HStack spacing="0.25rem" align="center">
        <IconButton
          aria-label="Página anterior"
          icon={<FiChevronLeft />}
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          bg={buttonBg}
          border="1px solid"
          borderColor={buttonBorder}
          _hover={{
            bg: buttonHover,
            borderColor: selectFocusBorder,
          }}
          _disabled={{
            bg: buttonDisabled,
            opacity: 0.4,
            cursor: 'not-allowed',
          }}
          borderRadius="md"
        />

        <Button
          size="sm"
          bg={currentPageBg}
          color={currentPageColor}
          minW="2.5rem"
          fontWeight="semibold"
          border="1px solid"
          borderColor={currentPageBg}
          borderRadius="md"
          cursor="default"
          _hover={{}}
          _active={{}}
        >
          {currentPage}
        </Button>

        <IconButton
          aria-label="Página siguiente"
          icon={<FiChevronRight />}
          size="sm"
          onClick={handleNext}
          disabled={!hasNextPage || isLoading}
          bg={buttonBg}
          border="1px solid"
          borderColor={buttonBorder}
          _hover={{
            bg: buttonHover,
            borderColor: selectFocusBorder,
          }}
          _disabled={{
            bg: buttonDisabled,
            opacity: 0.4,
            cursor: 'not-allowed',
          }}
          borderRadius="md"
        />
      </HStack>
    </HStack>
  );
};
