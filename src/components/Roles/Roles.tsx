'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useState } from 'react';
import { RoleFilters } from './RoleFilters';
import { RoleAdd } from './RoleAdd';
import { RoleList } from './RoleList';

export const Roles = () => {
  const [filterName, setFilterName] = useState<string>('');
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Roles
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <RoleFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <RoleAdd />
      </Flex>
      <RoleList filterName={filterName} />
    </>
  );
};
