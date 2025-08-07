'use client';

import {
  Flex,
  Select,
  useColorModeValue,
  IconButton,
  Spinner,
  Input,
  Box,
  List,
  ListItem,
  Text,
  Button,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Image,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { VscDebugRestart } from 'react-icons/vsc';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaFilter } from 'react-icons/fa';
import { useGetUsers } from '@/hooks/user';
import { useGetProducts } from '@/hooks/product';
import { useDebounce } from '@/hooks/useDebounce';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StockMovementTypeOptions } from '@/enums/stockMovementType.enum';

type StockMovementFilters = {
  Type?: string;
  DateFrom?: string;
  DateTo?: string;
  ProductId?: number;
  CreatedBy?: number;
};

type StockMovementFiltersProps = {
  filters: StockMovementFilters;
  onFiltersChange: (filters: StockMovementFilters) => void;
  isLoading: boolean;
};

export const StockMovementFilters = ({ filters, onFiltersChange, isLoading }: StockMovementFiltersProps) => {
  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');
  const popoverBg = useColorModeValue('white', 'gray.800');
  const popoverBorder = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = useColorModeValue('blue.400', 'blue.300');
  const focusBoxShadow = useColorModeValue('0 0 0 1px rgb(66, 153, 225)', '0 0 0 1px rgb(144, 205, 244)');

  const { data: users } = useGetUsers(1, 100, undefined);
  const [productSearch, setProductSearch] = useState('');
  const [productSearchType, setProductSearchType] = useState<'name' | 'internalCode' | 'barcode'>('name');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: number; name: string } | null>(null);
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Usar el hook de debounce
  const debouncedProductSearch = useDebounce(productSearch, 500);

  const productFilters = React.useMemo(() => {
    if (!debouncedProductSearch || debouncedProductSearch.length < 2) return undefined;

    return {
      ...(productSearchType === 'name' && { name: debouncedProductSearch }),
      ...(productSearchType === 'internalCode' && { internalCode: debouncedProductSearch }),
      ...(productSearchType === 'barcode' && { barcode: debouncedProductSearch }),
    };
  }, [debouncedProductSearch, productSearchType]);

  // Solo hacer la llamada si tenemos filtros válidos
  const shouldFetchProducts = productFilters !== undefined;
  const { data: products, isLoading: isLoadingProducts } = useGetProducts(
    1,
    10,
    shouldFetchProducts ? productFilters : undefined,
  );

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingProducts && debouncedProductSearch && debouncedProductSearch.length >= 2) {
      setLastSearchTerm(debouncedProductSearch);
    }
  }, [isLoadingProducts, debouncedProductSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductSearch = useCallback(
    (value: string) => {
      setProductSearch(value);

      // Mostrar dropdown inmediatamente si hay contenido para mejor UX
      setShowProductDropdown(value.length >= 2);

      // Solo limpiar el ProductId si el usuario está escribiendo algo diferente
      if (selectedProduct && value !== selectedProduct.name) {
        setSelectedProduct(null);
        onFiltersChange({ ...filters, ProductId: undefined });
      }
    },
    [selectedProduct, filters, onFiltersChange],
  );

  const handleProductSelect = (product: { id: number; name: string }) => {
    setSelectedProduct(product);
    setProductSearch(product.name);
    setShowProductDropdown(false);
    onFiltersChange({ ...filters, ProductId: product.id });
  };

  const handleClearProductSearch = () => {
    setProductSearch('');
    setLastSearchTerm('');
    setSelectedProduct(null);
    setShowProductDropdown(false);
    onFiltersChange({ ...filters, ProductId: undefined });
  };

  const handleResetFilters = () => {
    setProductSearch('');
    setLastSearchTerm('');
    setSelectedProduct(null);
    onFiltersChange({
      Type: undefined,
      DateFrom: undefined,
      DateTo: undefined,
      ProductId: undefined,
      CreatedBy: undefined,
    });
  };

  const activeFilterCount = [filters.Type, filters.DateFrom, filters.DateTo, filters.CreatedBy].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0 || filters.ProductId;

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap" w="100%">
      {/* Búsqueda principal de productos */}
      <Box position="relative" ref={searchRef} flex="1">
        <Box
          display="flex"
          bg={isLoading ? disabledColor : bgInput}
          borderRadius="md"
          overflow="hidden"
          borderWidth="1px"
          borderColor={isLoading ? disabledColor : borderInput}
        >
          <Select
            value={productSearchType}
            onChange={(e) => setProductSearchType(e.target.value as 'name' | 'internalCode' | 'barcode')}
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
            <option value="name">Nombre</option>
            <option value="internalCode">Cód. interno</option>
            <option value="barcode">Cód. de barras</option>
          </Select>

          <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

          <InputGroup flex="1">
            <Input
              placeholder={`Buscar producto...`}
              value={productSearch}
              onChange={(e) => handleProductSearch(e.target.value)}
              bg="transparent"
              border="none"
              borderRadius="none"
              _placeholder={{ color: textColor }}
              color={textColor}
              _focus={{ boxShadow: 'none' }}
              pl="1rem"
              disabled={isLoading}
              onFocus={() => productSearch && setShowProductDropdown(true)}
            />
            <InputRightElement>
              {selectedProduct ? (
                <IconButton
                  aria-label="Limpiar búsqueda"
                  icon={<Text fontSize="sm">✕</Text>}
                  size="sm"
                  variant="ghost"
                  onClick={handleClearProductSearch}
                  color={textColor}
                  _hover={{}}
                />
              ) : (
                <IconButton
                  aria-label="Buscar"
                  icon={<AiOutlineSearch size="1.25rem" />}
                  size="sm"
                  variant="ghost"
                  disabled={isLoading}
                  color={textColor}
                  _hover={{}}
                />
              )}
            </InputRightElement>
          </InputGroup>
        </Box>

        {showProductDropdown && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            bg={dropdownBg}
            border="1px solid"
            borderColor={dropdownBorder}
            borderRadius="md"
            boxShadow="lg"
            maxH="400px"
            overflowY="auto"
            zIndex={20}
          >
            {(() => {
              // Estados del dropdown:
              // 1. Usuario está escribiendo (debounce en progreso)
              const isTyping = productSearch !== debouncedProductSearch && productSearch.length >= 2;
              // 2. Esperando resultados de la API
              const isSearching = !isTyping && isLoadingProducts && debouncedProductSearch.length >= 2;
              // 3. Mostrar resultados o mensaje de no encontrado (solo si la búsqueda está completa)
              const searchCompleted =
                !isTyping &&
                !isSearching &&
                debouncedProductSearch.length >= 2 &&
                lastSearchTerm === debouncedProductSearch;

              if (isTyping || isSearching) {
                return (
                  <Flex p={3} justify="center" align="center" gap={2}>
                    <Spinner size="sm" />
                    <Text fontSize="sm" color="gray.500">
                      Buscando productos...
                    </Text>
                  </Flex>
                );
              }

              if (searchCompleted && products?.length > 0) {
                return (
                  <List>
                    {products.map((product) => (
                      <ListItem
                        key={product.id}
                        cursor="pointer"
                        _hover={{ bg: hoverBg }}
                        onClick={() => handleProductSelect({ id: product.id, name: product.name })}
                        transition="background-color 0.2s ease"
                      >
                        <HStack p={3} spacing={4} align="center">
                          <Image
                            src={product.imageUrl || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                            alt={product.name}
                            w="60px"
                            h="60px"
                            objectFit="cover"
                            borderRadius="md"
                            flexShrink={0}
                          />
                          <VStack align="flex-start" spacing={1} flex="1" minW={0}>
                            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                              {product.name}
                            </Text>
                            {product.internalCode && (
                              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                Cód. Interno: {product.internalCode}
                              </Text>
                            )}
                            {product.barcode && (
                              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                Cód. Barras: {product.barcode}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                );
              }

              if (searchCompleted && products?.length === 0) {
                return (
                  <Text p={3} fontSize="sm" color="gray.500">
                    No se encontraron productos
                  </Text>
                );
              }

              // Mientras esperamos que se complete la búsqueda, mostrar loading
              if (debouncedProductSearch.length >= 2 && (!searchCompleted || isLoadingProducts)) {
                return (
                  <Flex p={3} justify="center" align="center" gap={2}>
                    <Spinner size="sm" />
                    <Text fontSize="sm" color="gray.500">
                      Buscando productos...
                    </Text>
                  </Flex>
                );
              }

              return null;
            })()}
          </Box>
        )}
      </Box>

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
              transition="all 0.2s ease"
              flex={{ base: '1', md: 'none' }}
              minW={{ base: '0', md: '10rem' }}
            >
              Filtros avanzados {activeFilterCount > 0 && `(${activeFilterCount})`}
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
                <Box>
                  <Text fontSize="xs" color={textColor} mb={1} ml={1}>
                    Desde
                  </Text>
                  <Input
                    type="date"
                    value={filters.DateFrom || ''}
                    onChange={(e) => {
                      onFiltersChange({ ...filters, DateFrom: e.target.value || undefined });
                    }}
                    bg={bgInput}
                    borderColor={borderInput}
                    color={textColor}
                    disabled={isLoading}
                    transition="all 0.2s ease"
                    borderRadius="md"
                    _focus={{
                      borderColor: focusBorderColor,
                      boxShadow: focusBoxShadow,
                    }}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" color={textColor} mb={1} ml={1}>
                    Hasta
                  </Text>
                  <Input
                    type="date"
                    value={filters.DateTo || ''}
                    onChange={(e) => {
                      onFiltersChange({ ...filters, DateTo: e.target.value || undefined });
                    }}
                    bg={bgInput}
                    borderColor={borderInput}
                    color={textColor}
                    disabled={isLoading}
                    transition="all 0.2s ease"
                    borderRadius="md"
                    _focus={{
                      borderColor: focusBorderColor,
                      boxShadow: focusBoxShadow,
                    }}
                  />
                </Box>

                <Select
                  placeholder="Tipo de movimiento"
                  value={filters.Type || ''}
                  onChange={(e) => {
                    const type = e.target.value || undefined;
                    onFiltersChange({ ...filters, Type: type });
                  }}
                  bg={bgInput}
                  borderColor={borderInput}
                  color={textColor}
                  disabled={isLoading}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {StockMovementTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="Filtrar por usuario"
                  value={filters.CreatedBy || ''}
                  onChange={(e) => {
                    const userId = e.target.value ? Number(e.target.value) : undefined;
                    onFiltersChange({ ...filters, CreatedBy: userId });
                  }}
                  bg={bgInput}
                  borderColor={borderInput}
                  color={textColor}
                  disabled={isLoading}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: focusBoxShadow,
                  }}
                >
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <IconButton
            aria-label="Reiniciar todos los filtros"
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
