import { Flex, Text } from '@chakra-ui/react';
import { UserFilters } from './UserFilters';
import { UserAdd } from './UserAdd';
import { UserList } from './UserList';

export const Users = () => {
  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Usuarios
      </Text>
      <Flex justifyContent="space-between">
        <UserFilters />
        <UserAdd />
      </Flex>
      <UserList />
    </>
  );
};
