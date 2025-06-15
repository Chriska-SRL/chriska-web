'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RoleFilters } from './RoleFilters';
import { RoleAdd } from './RoleAdd';
import { RoleList } from './RoleList';
import { Role } from '@/entities/role';
import { useGetRoles } from '@/hooks/roles';

export const Roles = () => {
  const [filterName, setFilterName] = useState<string>('');
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const { data: roles = [], isLoading, error } = useGetRoles();
  const [localRoles, setLocalRoles] = useState<Role[]>(roles);

  useEffect(() => {
    setLocalRoles(roles); // sincroniza con fetch
  }, [roles]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Roles
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <RoleFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <RoleAdd setLocalRoles={setLocalRoles} />
      </Flex>
      <RoleList
        filterName={filterName}
        roles={localRoles}
        isLoading={isLoading}
        error={error}
        setLocalRoles={setLocalRoles}
      />
    </>
  );
};
