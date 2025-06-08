import { Flex, Select, Input, InputGroup, InputRightElement, Icon, useMediaQuery } from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const mockRoles = [
  { id: 'admin', name: 'Administrador', href: '/usuarios?rol=admin' },
  { id: 'editor', name: 'Editor', href: '/usuarios?rol=editor' },
  { id: 'viewer', name: 'Lector', href: '/usuarios?rol=viewer' },
];

const mockStates = [
  { id: 'activo', name: 'Activo', href: '/usuarios?estado=activo' },
  { id: 'inactivo', name: 'Inactivo', href: '/usuarios?estado=inactivo' },
];

function removeSearchParamFromUrl(url: string, param: string) {
  const u = new URL(url, 'http://localhost');
  u.searchParams.delete(param);
  return u.pathname + u.search;
}

function getUsersUrl() {
  if (typeof window !== 'undefined') return window.location.href;
  return '/usuarios';
}

export const UserFilters = () => {
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(undefined);
  const [selectedStateId, setSelectedStateId] = useState<string | undefined>(undefined);
  const [searchName, setSearchName] = useState<string>('');

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let href;
    if (value === '-1') {
      setSelectedRoleId(undefined);
      href = removeSearchParamFromUrl(getUsersUrl(), 'rol');
    } else {
      const role = mockRoles.find((r) => r.id === value);
      setSelectedRoleId(role?.id);
      href = role?.href;
    }
    if (href) router.push(href);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let href;
    if (value === '-1') {
      setSelectedStateId(undefined);
      href = removeSearchParamFromUrl(getUsersUrl(), 'estado');
    } else {
      const state = mockStates.find((s) => s.id === value);
      setSelectedStateId(state?.id);
      href = state?.href;
    }
    if (href) router.push(href);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  const handleNameSubmit = () => {
    const name = searchName.trim();
    const baseUrl = new URL(getUsersUrl(), 'http://localhost');
    if (name) {
      baseUrl.searchParams.set('nombre', name);
    } else {
      baseUrl.searchParams.delete('nombre');
    }
    router.push(baseUrl.pathname + baseUrl.search);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSubmit();
    }
  };

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} w="100%" alignItems={{ base: 'stretch', md: 'center' }}>
      <Select
        value={selectedRoleId || '-1'}
        onChange={handleRoleChange}
        bg="#f2f2f2"
        borderColor="#f2f2f2"
        w={{ base: '100%', md: '12rem' }}
      >
        <option value="-1">Filtrar por rol</option>
        {mockRoles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </Select>

      <Select
        value={selectedStateId || '-1'}
        onChange={handleStateChange}
        bg="#f2f2f2"
        borderColor="#f2f2f2"
        w={{ base: '100%', md: '12rem' }}
      >
        <option value="-1">Filtrar por estado</option>
        {mockStates.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>

      <InputGroup w={{ base: '100%', md: '15rem' }}>
        <Input
          placeholder="Buscar por nombre..."
          value={searchName}
          onChange={handleNameChange}
          onKeyDown={handleKeyPress}
          bg="#f2f2f2"
          borderColor="#f2f2f2"
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color="grey" onClick={handleNameSubmit} cursor="pointer" />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};
