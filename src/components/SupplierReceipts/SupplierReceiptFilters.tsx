'use client';

import {
  Flex,
  Select,
  Input,
  useColorModeValue,
  IconButton,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Box,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Text,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaFilter } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { useGetSuppliers } from '@/hooks/supplier';
import { PaymentMethodOptions } from '@/enums/paymentMethod.enum';

type SupplierReceiptFiltersProps = {
  onFilterChange: (filters: {
    supplierId?: number;
    paymentMethod?: string;
    fromDate?: string;
    toDate?: string;
  }) => void;
  disabled?: boolean;
};

export const SupplierReceiptFilters = ({ onFilterChange, disabled = false }: SupplierReceiptFiltersProps) => {
  // Búsqueda principal de proveedores
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierSearchType, setSupplierSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<{ id: number; name: string } | null>(null);
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState(supplierSearch);
  const [lastSupplierSearchTerm, setLastSupplierSearchTerm] = useState('');
  const supplierSearchRef = useRef<HTMLDivElement>(null);

  // Filtros avanzados
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');

  // Debounce para búsqueda de proveedores
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSupplierSearch(supplierSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [supplierSearch]);

  // Filtros de búsqueda de proveedores
  const supplierFilters = useMemo(() => {
    if (!debouncedSupplierSearch || debouncedSupplierSearch.length < 2) return undefined;
    const filters: any = {};
    switch (supplierSearchType) {
      case 'name':
        filters.name = debouncedSupplierSearch;
        break;
      case 'rut':
        filters.rut = debouncedSupplierSearch;
        break;
      case 'razonSocial':
        filters.razonSocial = debouncedSupplierSearch;
        break;
      case 'contactName':
        filters.contactName = debouncedSupplierSearch;
        break;
    }
    return filters;
  }, [debouncedSupplierSearch, supplierSearchType]);

  const actualSupplierFilters =
    debouncedSupplierSearch && debouncedSupplierSearch.length >= 2 ? supplierFilters : undefined;

  const { data: suppliersSearch = [], isLoading: isLoadingSuppliersSearch } = useGetSuppliers(
    1,
    10,
    actualSupplierFilters,
  );

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingSuppliersSearch && debouncedSupplierSearch && debouncedSupplierSearch.length >= 2) {
      setLastSupplierSearchTerm(debouncedSupplierSearch);
    }
  }, [isLoadingSuppliersSearch, debouncedSupplierSearch]);

  // Funciones para manejar búsqueda de proveedores
  const handleSupplierSearch = (value: string) => {
    setSupplierSearch(value);
    if (value.length >= 2) {
      setShowSupplierDropdown(true);
    } else {
      setShowSupplierDropdown(false);
    }
  };

  const handleSupplierSelect = (supplier: any) => {
    setSelectedSupplier({ id: supplier.id, name: supplier.name });
    setSupplierSearch('');
    setShowSupplierDropdown(false);
  };

  const handleClearSupplierSearch = () => {
    setSelectedSupplier(null);
    setSupplierSearch('');
    setShowSupplierDropdown(false);
  };

  // Handlers para filtros avanzados
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const handleResetFilters = () => {
    setSelectedSupplier(null);
    setSupplierSearch('');
    setShowSupplierDropdown(false);
    setPaymentMethod('');
    setFromDate('');
    setToDate('');
  };

  useEffect(() => {
    onFilterChange({
      supplierId: selectedSupplier?.id,
      paymentMethod: paymentMethod || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });
  }, [selectedSupplier, paymentMethod, fromDate, toDate, onFilterChange]);

  const hasActiveFilters = selectedSupplier !== null || paymentMethod !== '' || fromDate !== '' || toDate !== '';

  const activeSelectFilters = [paymentMethod !== '' ? 1 : 0, fromDate !== '' ? 1 : 0, toDate !== '' ? 1 : 0].reduce(
    (a, b) => a + b,
    0,
  );

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (supplierSearchRef.current && !supplierSearchRef.current.contains(event.target as Node)) {
        setShowSupplierDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap" w="100%">
      {/* Búsqueda principal de proveedores */}
      <Box position="relative" ref={supplierSearchRef} flex="1" minW="18.75rem">
        {selectedSupplier ? (
          <Flex
            bg={disabled ? disabledColor : bgInput}
            borderRadius="md"
            overflow="hidden"
            border="1px solid"
            borderColor={borderInput}
            minH="2.5rem"
            align="center"
          >
            <Box flex="1" px="1rem" py="0.5rem">
              <Text fontSize="md" noOfLines={1} fontWeight="medium" color={textColor}>
                {selectedSupplier.name}
              </Text>
            </Box>
            <Box pr="0.5rem">
              <IconButton
                aria-label="Limpiar proveedor"
                icon={<Text fontSize="sm">✕</Text>}
                size="sm"
                variant="ghost"
                onClick={handleClearSupplierSearch}
                color={textColor}
                _hover={{}}
                disabled={disabled}
              />
            </Box>
          </Flex>
        ) : (
          <Box>
            <Flex bg={disabled ? disabledColor : bgInput} borderRadius="md" overflow="hidden">
              <Select
                value={supplierSearchType}
                onChange={(e) =>
                  setSupplierSearchType(e.target.value as 'name' | 'rut' | 'razonSocial' | 'contactName')
                }
                bg="transparent"
                border="none"
                color={textColor}
                w="auto"
                minW="7rem"
                borderRadius="none"
                _focus={{ boxShadow: 'none' }}
                maxW={{ base: '5rem', md: '100%' }}
                disabled={disabled}
              >
                <option value="name">Nombre</option>
                <option value="rut">RUT</option>
                <option value="razonSocial">Razón social</option>
                <option value="contactName">Contacto</option>
              </Select>

              <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

              <InputGroup flex="1">
                <Input
                  placeholder="Buscar proveedor..."
                  value={supplierSearch}
                  onChange={(e) => handleSupplierSearch(e.target.value)}
                  bg="transparent"
                  border="none"
                  borderRadius="none"
                  _placeholder={{ color: textColor }}
                  color={textColor}
                  _focus={{ boxShadow: 'none' }}
                  _disabled={{
                    opacity: 0.6,
                    cursor: 'not-allowed',
                    color: textColor,
                  }}
                  pl="1rem"
                  onFocus={() => supplierSearch && setShowSupplierDropdown(true)}
                  disabled={disabled}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Buscar"
                    icon={<AiOutlineSearch size="1.25rem" />}
                    size="sm"
                    variant="ghost"
                    color={textColor}
                    _hover={{}}
                    disabled={disabled}
                  />
                </InputRightElement>
              </InputGroup>
            </Flex>

            {/* Dropdown de resultados de proveedores */}
            {showSupplierDropdown && (
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
                  const isTyping = supplierSearch !== debouncedSupplierSearch && supplierSearch.length >= 2;
                  const isSearching = !isTyping && isLoadingSuppliersSearch && debouncedSupplierSearch.length >= 2;
                  const searchCompleted =
                    !isTyping &&
                    !isSearching &&
                    debouncedSupplierSearch.length >= 2 &&
                    lastSupplierSearchTerm === debouncedSupplierSearch;

                  if (isTyping || isSearching) {
                    return (
                      <Flex p={3} justify="center" align="center" gap={2}>
                        <Spinner size="sm" />
                        <Text fontSize="sm" color="gray.500">
                          Buscando proveedores...
                        </Text>
                      </Flex>
                    );
                  }

                  if (searchCompleted && suppliersSearch?.length > 0) {
                    return (
                      <List spacing={0}>
                        {suppliersSearch.map((supplier: any, index: number) => (
                          <Fragment key={supplier.id}>
                            <ListItem
                              p="0.75rem"
                              cursor="pointer"
                              _hover={{ bg: hoverBg }}
                              transition="background-color 0.2s ease"
                              onClick={() => handleSupplierSelect(supplier)}
                            >
                              <Box>
                                <Text fontSize="sm" fontWeight="medium">
                                  {supplier.name}
                                </Text>
                                <Text fontSize="xs" color={textColor}>
                                  {supplier.rut && `RUT: ${supplier.rut}`}
                                  {supplier.contactName && ` - Contacto: ${supplier.contactName}`}
                                </Text>
                              </Box>
                            </ListItem>
                            {index < suppliersSearch.length - 1 && <Divider />}
                          </Fragment>
                        ))}
                      </List>
                    );
                  }

                  if (searchCompleted && suppliersSearch?.length === 0) {
                    return (
                      <Text p={3} fontSize="sm" color="gray.500">
                        No se encontraron proveedores
                      </Text>
                    );
                  }

                  if (debouncedSupplierSearch.length >= 2 && (!searchCompleted || isLoadingSuppliersSearch)) {
                    return (
                      <Flex p={3} justify="center" align="center" gap={2}>
                        <Spinner size="sm" />
                        <Text fontSize="sm" color="gray.500">
                          Buscando proveedores...
                        </Text>
                      </Flex>
                    );
                  }

                  return null;
                })()}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Filtros avanzados */}
      <Flex gap="1rem" w={{ base: '100%', md: 'auto' }} alignItems="center" flexShrink={0}>
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button
              leftIcon={<FaFilter />}
              bg={bgInput}
              _hover={{ bg: hoverResetBg }}
              size="md"
              variant="outline"
              borderColor={borderInput}
              color={textColor}
              flex={{ base: '1', md: 'none' }}
              minW={{ base: '0', md: '10rem' }}
              transition="all 0.2s ease"
              disabled={disabled}
            >
              Filtros avanzados {activeSelectFilters > 0 && `(${activeSelectFilters})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            w="auto"
            minW="22rem"
            maxW="26rem"
            bg={useColorModeValue('white', 'gray.800')}
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            shadow="xl"
            borderRadius="md"
          >
            <PopoverArrow bg={useColorModeValue('white', 'gray.800')} />
            <PopoverBody p="0.75rem">
              <Flex gap="0.75rem" flexDir="column">
                <Select
                  placeholder="Filtrar por método de pago"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: useColorModeValue('blue.400', 'blue.300'),
                    boxShadow: `0 0 0 1px ${useColorModeValue('rgb(66, 153, 225)', 'rgb(144, 205, 244)')}`,
                  }}
                  disabled={disabled}
                >
                  {PaymentMethodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <Input
                  type="date"
                  placeholder="Fecha desde"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: useColorModeValue('blue.400', 'blue.300'),
                    boxShadow: `0 0 0 1px ${useColorModeValue('rgb(66, 153, 225)', 'rgb(144, 205, 244)')}`,
                  }}
                  disabled={disabled}
                />

                <Input
                  type="date"
                  placeholder="Fecha hasta"
                  value={toDate}
                  onChange={handleToDateChange}
                  bg={bgInput}
                  borderColor={borderInput}
                  color={textColor}
                  transition="all 0.2s ease"
                  borderRadius="md"
                  _focus={{
                    borderColor: useColorModeValue('blue.400', 'blue.300'),
                    boxShadow: `0 0 0 1px ${useColorModeValue('rgb(66, 153, 225)', 'rgb(144, 205, 244)')}`,
                  }}
                  disabled={disabled}
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
            flexShrink={0}
            borderColor={borderInput}
            transition="all 0.2s ease"
            disabled={disabled}
          />
        )}
      </Flex>
    </Flex>
  );
};
