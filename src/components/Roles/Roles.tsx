'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { RoleFilters } from './RoleFilters';
import { RoleAdd } from './RoleAdd';
import { RoleList } from './RoleList';
import { Role } from '@/entities/role';
import { useGetRoles } from '@/hooks/role';

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
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Roles
        </Text>
        {isMobile && <RoleAdd setRoles={setRoles} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <RoleFilters filterName={filterName} setFilterName={setFilterName} />
        {!isMobile && <RoleAdd setRoles={setRoles} />}
      </Flex>

      {isMobile && <Divider />}

      <RoleList roles={filteredRoles} isLoading={isLoading} error={error} setRoles={setRoles} />
    </>
  );
};
