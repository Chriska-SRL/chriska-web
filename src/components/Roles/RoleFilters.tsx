'use client';

import { useRouter } from 'next/navigation';
import { Flex, Input, InputGroup, InputRightElement, IconButton, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

function getUsersUrl() {
  if (typeof window !== 'undefined') return window.location.href;
  return '/roles';
}

export const RoleFilters = () => {
  const router = useRouter();

  const [searchName, setSearchName] = useState<string>('');

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
    <Flex>
      <InputGroup minW="15rem">
        <Input
          placeholder="Buscar por nombre..."
          value={searchName}
          onChange={handleNameChange}
          onKeyDown={handleKeyPress}
          bg="#f2f2f2"
          borderColor="#f2f2f2"
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color={'grey'} onClick={handleNameSubmit} cursor="pointer" />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};
