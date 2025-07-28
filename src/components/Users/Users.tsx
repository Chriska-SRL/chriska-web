'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { UserFilters } from './UserFilters';
import { UserAdd } from './UserAdd';
import { UserList } from './UserList';
import { useGetUsers } from '@/hooks/user';
import { User } from '@/entities/user';

export const Users = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetUsers();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data) setUsers(data);
  }, [data]);

  const [filterRoleId, setFilterRoleId] = useState<number | undefined>();
  const [filterStateId, setFilterStateId] = useState<string | undefined>();
  const [filterName, setFilterName] = useState<string>('');

  const filteredUsers = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return users.filter((user) => {
      const matchRole = filterRoleId ? user.role.id === filterRoleId : true;
      const matchState = filterStateId ? (filterStateId === 'activo' ? user.isEnabled : !user.isEnabled) : true;
      const matchName = filterName ? normalize(user.name).includes(normalize(filterName)) : true;
      return matchRole && matchState && matchName;
    });
  }, [users, filterRoleId, filterStateId, filterName]);

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Usuarios
        </Text>
        {isMobile && <UserAdd isLoading={isLoading} setUsers={setUsers} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <UserFilters
          isLoading={isLoading}
          filterRoleId={filterRoleId}
          setFilterRoleId={setFilterRoleId}
          filterStateId={filterStateId}
          setFilterStateId={setFilterStateId}
          filterName={filterName}
          setFilterName={setFilterName}
        />
        {!isMobile && <UserAdd isLoading={isLoading} setUsers={setUsers} />}
      </Flex>

      {isMobile && <Divider />}

      <UserList users={filteredUsers} isLoading={isLoading} error={error} setUsers={setUsers} />
    </>
  );
};
