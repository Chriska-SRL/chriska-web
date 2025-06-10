'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useState } from 'react';
import { UserFilters } from './UserFilters';
import { UserAdd } from './UserAdd';
import { UserList } from './UserList';

export const Users = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const [filterRoleId, setFilterRoleId] = useState<number | undefined>();
  const [filterStateId, setFilterStateId] = useState<string | undefined>();
  const [filterName, setFilterName] = useState<string>('');

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Usuarios
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <UserFilters
          filterRoleId={filterRoleId}
          setFilterRoleId={setFilterRoleId}
          filterStateId={filterStateId}
          setFilterStateId={setFilterStateId}
          filterName={filterName}
          setFilterName={setFilterName}
        />
        {isMobile && <Divider />}
        <UserAdd />
      </Flex>
      <UserList filterRoleId={filterRoleId} filterStateId={filterStateId} filterName={filterName} />
    </>
  );
};
