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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterRoleId, setFilterRoleId] = useState<number | undefined>();
  const [filterStateId, setFilterStateId] = useState<string | undefined>();
  const [filterName, setFilterName] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const filters = useMemo(() => {
    const result: { name?: string; roleId?: number; isEnabled?: boolean } = {};
    if (filterName) result.name = filterName;
    if (filterRoleId) result.roleId = filterRoleId;
    if (filterStateId) result.isEnabled = filterStateId === 'activo';
    return Object.keys(result).length > 0 ? result : undefined;
  }, [filterName, filterRoleId, filterStateId]);

  const { data, isLoading, error } = useGetUsers(currentPage, pageSize, filters);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '' || filterRoleId || filterStateId) {
      setIsFilterLoading(true);
    }
  }, [filterName, filterRoleId, filterStateId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

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

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <UserAdd isLoading={isLoading} setUsers={setUsers} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <UserList
        users={users}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setUsers={setUsers}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
