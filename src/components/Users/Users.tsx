import { Divider, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { UserFilters } from './UserFilters';
import { UserAdd } from './UserAdd';
import { UserList } from './UserList';

export const Users = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Usuarios
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <UserFilters />
        {isMobile && <Divider />}
        <UserAdd />
      </Flex>
      <UserList />
    </>
  );
};
