'use client';

import { Flex, Text, Divider, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { DistributionFilters } from './DistributionFilters';
import { DistributionAdd } from './DistributionAdd';
import { DistributionList } from './DistributionList';
import { Distribution } from '@/entities/distribution';
import { useGetDistributions } from '@/hooks/distribution';

export const Distributions = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterId, setFilterId] = useState<string>('');
  const [filterUser, setFilterUser] = useState<string | undefined>();
  const [filterVehicle, setFilterVehicle] = useState<string | undefined>();
  const [filterDate, setFilterDate] = useState<string | undefined>();
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const filters = useMemo(() => {
    const result: {
      id?: number;
      userId?: number;
      vehicleId?: number;
      date?: string;
    } = {};

    if (filterId) result.id = parseInt(filterId);
    if (filterUser) result.userId = parseInt(filterUser);
    if (filterVehicle) result.vehicleId = parseInt(filterVehicle);
    if (filterDate) result.date = filterDate;

    return Object.keys(result).length > 0 ? result : {};
  }, [filterId, filterUser, filterVehicle, filterDate]);

  const { data, isLoading, error } = useGetDistributions(currentPage, pageSize, filters);
  const [distributions, setDistributions] = useState<Distribution[]>([]);

  useEffect(() => {
    if (data) {
      setDistributions(data);
    }
  }, [data]);

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
          Repartos
        </Text>
        {isMobile && <DistributionAdd isLoading={isLoading} setDistributions={setDistributions} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <DistributionFilters
          isLoading={isLoading || isFilterLoading}
          filterId={filterId}
          setFilterId={setFilterId}
          filterUser={filterUser}
          setFilterUser={setFilterUser}
          filterVehicle={filterVehicle}
          setFilterVehicle={setFilterVehicle}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
        />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <DistributionAdd isLoading={isLoading} setDistributions={setDistributions} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <DistributionList
        distributions={distributions}
        isLoading={isLoading}
        error={error}
        setDistributions={setDistributions}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
