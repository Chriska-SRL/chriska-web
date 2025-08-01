'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RoleFilters } from './RoleFilters';
import { RoleAdd } from './RoleAdd';
import { RoleList } from './RoleList';
import { Role } from '@/entities/role';
import { useGetRoles } from '@/hooks/role';

export const Roles = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterName, setFilterName] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { data, isLoading, error } = useGetRoles(currentPage, pageSize, filterName);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (data) {
      setRoles(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '') {
      setIsFilterLoading(true);
    }
  }, [filterName]);

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
          Roles
        </Text>
        {isMobile && <RoleAdd isLoading={isLoading} setRoles={setRoles} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <RoleFilters isLoading={isLoading} filterName={filterName} setFilterName={setFilterName} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <RoleAdd isLoading={isLoading} setRoles={setRoles} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <RoleList
        roles={roles}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setRoles={setRoles}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
