'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { RoleFilters } from './RoleFilters';
import { RoleAdd } from './RoleAdd';
import { RoleList } from './RoleList';
import { Role } from '@/entities/role';
import { useGetRoles } from '@/hooks/roles';

export const Roles = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetRoles();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (data) setRoles(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');

  const filteredRoles = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return roles.filter((role) => (filterName ? normalize(role.name).includes(normalize(filterName)) : true));
  }, [roles, filterName]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Roles
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <RoleFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <RoleAdd setRoles={setRoles} />
      </Flex>
      <RoleList roles={filteredRoles} isLoading={isLoading} error={error} setRoles={setRoles} />
    </>
  );
};
