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
import { useGetClients } from '@/hooks/client';
import { useGetUsers } from '@/hooks/user';
import { StatusOptions } from '@/enums/status.enum';

type ReturnRequestFiltersProps = {
  onFilterChange: (filters: {
    status?: string;
    clientId?: number;
    userId?: number;
    fromDate?: string;
    toDate?: string;
  }) => void;
  disabled?: boolean;
};

export const ReturnRequestFilters = ({ onFilterChange, disabled = false }: ReturnRequestFiltersProps) => {
  // Búsqueda principal de clientes
  const [clientSearch, setClientSearch] = useState('');
  const [clientSearchType, setClientSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const [debouncedClientSearch, setDebouncedClientSearch] = useState(clientSearch);
  const [lastClientSearchTerm, setLastClientSearchTerm] = useState('');
  const clientSearchRef = useRef<HTMLDivElement>(null);

  // Filtros avanzados
  const [status, setStatus] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const { data: users = [] } = useGetUsers(1, 1000);

  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const disabledColor = useColorModeValue('#fafafa', '#202532');

  // Debounce para búsqueda de clientes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClientSearch(clientSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [clientSearch]);

  // Filtros de búsqueda de clientes
  const clientFilters = useMemo(() => {
    if (!debouncedClientSearch || debouncedClientSearch.length < 2) return undefined;
    const filters: any = {};
    switch (clientSearchType) {
      case 'name':
        filters.name = debouncedClientSearch;
        break;
      case 'rut':
        filters.rut = debouncedClientSearch;
        break;
      case 'razonSocial':
        filters.razonSocial = debouncedClientSearch;
        break;
      case 'contactName':
        filters.contactName = debouncedClientSearch;
        break;
    }
    return filters;
  }, [debouncedClientSearch, clientSearchType]);

  const actualClientFilters = debouncedClientSearch && debouncedClientSearch.length >= 2 ? clientFilters : undefined;

  const { data: clientsSearch = [], isLoading: isLoadingClientsSearch } = useGetClients(1, 10, actualClientFilters);

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingClientsSearch && debouncedClientSearch && debouncedClientSearch.length >= 2) {
      setLastClientSearchTerm(debouncedClientSearch);
    }
  }, [isLoadingClientsSearch, debouncedClientSearch]);

  // Funciones para manejar búsqueda de clientes
  const handleClientSearch = (value: string) => {
    setClientSearch(value);
    if (value.length >= 2) {
      setShowClientDropdown(true);
    } else {
      setShowClientDropdown(false);
    }
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient({ id: client.id, name: client.name });
    setClientSearch('');
    setShowClientDropdown(false);
  };

  const handleClearClientSearch = () => {
    setSelectedClient(null);
    setClientSearch('');
    setShowClientDropdown(false);
  };

  // Handlers para filtros avanzados
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const handleResetFilters = () => {
    setSelectedClient(null);
    setClientSearch('');
    setShowClientDropdown(false);
    setStatus('');
    setUserId('');
    setFromDate('');
    setToDate('');
  };

  useEffect(() => {
    onFilterChange({
      status: status || undefined,
      clientId: selectedClient?.id,
      userId: userId ? Number(userId) : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });
  }, [status, selectedClient, userId, fromDate, toDate, onFilterChange]);

  const hasActiveFilters =
    selectedClient !== null || status !== '' || userId !== '' || fromDate !== '' || toDate !== '';

  const activeSelectFilters = [
    status !== '' ? 1 : 0,
    userId !== '' ? 1 : 0,
    fromDate !== '' ? 1 : 0,
    toDate !== '' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} alignItems="center" flexWrap="wrap" w="100%">
      {/* Búsqueda principal de clientes */}
      <Box position="relative" ref={clientSearchRef} flex="1" minW="18.75rem">
        {selectedClient ? (
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
                {selectedClient.name}
              </Text>
            </Box>
            <Box pr="0.5rem">
              <IconButton
                aria-label="Limpiar cliente"
                icon={<Text fontSize="sm">✕</Text>}
                size="sm"
                variant="ghost"
                onClick={handleClearClientSearch}
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
                value={clientSearchType}
                onChange={(e) => setClientSearchType(e.target.value as 'name' | 'rut' | 'razonSocial' | 'contactName')}
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
                  placeholder="Buscar cliente..."
                  value={clientSearch}
                  onChange={(e) => handleClientSearch(e.target.value)}
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
                  onFocus={() => clientSearch && setShowClientDropdown(true)}
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

            {/* Dropdown de resultados de clientes */}
            {showClientDropdown && (
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
                  const isTyping = clientSearch !== debouncedClientSearch && clientSearch.length >= 2;
                  const isSearching = !isTyping && isLoadingClientsSearch && debouncedClientSearch.length >= 2;
                  const searchCompleted =
                    !isTyping &&
                    !isSearching &&
                    debouncedClientSearch.length >= 2 &&
                    lastClientSearchTerm === debouncedClientSearch;

                  if (isTyping || isSearching) {
                    return (
                      <Flex p={3} justify="center" align="center" gap={2}>
                        <Spinner size="sm" />
                        <Text fontSize="sm" color="gray.500">
                          Buscando clientes...
                        </Text>
                      </Flex>
                    );
                  }

                  if (searchCompleted && clientsSearch?.length > 0) {
                    return (
                      <List spacing={0}>
                        {clientsSearch.map((client: any, index: number) => (
                          <Fragment key={client.id}>
                            <ListItem
                              p="0.75rem"
                              cursor="pointer"
                              _hover={{ bg: hoverBg }}
                              transition="background-color 0.2s ease"
                              onClick={() => handleClientSelect(client)}
                            >
                              <Box>
                                <Text fontSize="sm" fontWeight="medium">
                                  {client.name}
                                </Text>
                                <Text fontSize="xs" color={textColor}>
                                  {client.rut && `RUT: ${client.rut}`}
                                  {client.contactName && ` - Contacto: ${client.contactName}`}
                                </Text>
                              </Box>
                            </ListItem>
                            {index < clientsSearch.length - 1 && <Divider />}
                          </Fragment>
                        ))}
                      </List>
                    );
                  }

                  if (searchCompleted && clientsSearch?.length === 0) {
                    return (
                      <Text p={3} fontSize="sm" color="gray.500">
                        No se encontraron clientes
                      </Text>
                    );
                  }

                  if (debouncedClientSearch.length >= 2 && (!searchCompleted || isLoadingClientsSearch)) {
                    return (
                      <Flex p={3} justify="center" align="center" gap={2}>
                        <Spinner size="sm" />
                        <Text fontSize="sm" color="gray.500">
                          Buscando clientes...
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
                  placeholder="Filtrar por estado"
                  value={status}
                  onChange={handleStatusChange}
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
                  {StatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="Filtrar por usuario"
                  value={userId}
                  onChange={handleUserChange}
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
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
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
