import { Flex, Text } from '@chakra-ui/react';
import { RoleFilters } from './RoleFilters';
import { RoleAdd } from './RoleAdd';
import { RoleList } from './RoleList';

export const Roles = () => {
  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Roles
      </Text>
      <Flex justifyContent="space-between">
        <RoleFilters />
        <RoleAdd />
      </Flex>
      <RoleList />
    </>
  );
};
