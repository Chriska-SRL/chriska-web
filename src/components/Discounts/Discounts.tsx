'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, /* useMemo, */ useState } from 'react';
// import { DiscountFilters } from './DiscountFilters';
import { DiscountAdd } from './DiscountAdd';
import { DiscountList } from './DiscountList';
import { Discount } from '@/entities/discount';
import { useGetDiscounts } from '@/hooks/discount';

export const Discounts = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  /*   const [filterDescription, setFilterDescription] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterBrand, setFilterBrand] = useState<string | undefined>();
  const [filterSubCategory, setFilterSubCategory] = useState<string | undefined>();
  const [filterZone, setFilterZone] = useState<string | undefined>();
  const [filterClient, setFilterClient] = useState<string | undefined>();
  const [filterProduct, setFilterProduct] = useState<string | undefined>();
  const [isFilterLoading, setIsFilterLoading] = useState(false); */

  // const filters = useMemo(() => {
  //   const result: {
  //     description?: string;
  //     status?: string;
  //     brandId?: number;
  //     subCategoryId?: number;
  //     zoneId?: number;
  //     clientId?: number;
  //     productId?: number;
  //   } = {};

  //   if (filterDescription && filterDescription.trim() !== '') result.description = filterDescription;
  //   if (filterStatus) result.status = filterStatus;
  //   if (filterBrand) result.brandId = parseInt(filterBrand);
  //   if (filterSubCategory) result.subCategoryId = parseInt(filterSubCategory);
  //   if (filterZone) result.zoneId = parseInt(filterZone);
  //   if (filterClient) result.clientId = parseInt(filterClient);
  //   if (filterProduct) result.productId = parseInt(filterProduct);

  //   return Object.keys(result).length > 0 ? result : {};
  // }, [filterDescription, filterStatus, filterBrand, filterSubCategory, filterZone, filterClient, filterProduct]);

  const { data, isLoading, error } = useGetDiscounts(currentPage, pageSize /* , filters */);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    if (data) {
      setDiscounts(data);
      // setIsFilterLoading(false);
    }
  }, [data]);

  // useEffect(() => {
  //   setCurrentPage(1);
  //   if (
  //     (filterDescription && filterDescription.trim() !== '') ||
  //     filterStatus ||
  //     filterBrand ||
  //     filterSubCategory ||
  //     filterZone ||
  //     filterClient ||
  //     filterProduct
  //   ) {
  //     setIsFilterLoading(true);
  //   }
  // }, [filterDescription, filterStatus, filterBrand, filterSubCategory, filterZone, filterClient, filterProduct]);

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
          Descuentos
        </Text>
        <DiscountAdd isLoading={isLoading} setDiscounts={setDiscounts} />
        {/* {isMobile && <DiscountAdd isLoading={isLoading} setDiscounts={setDiscounts} />} */}
      </Flex>

      {/* {isMobile && <Divider />} */}

      {/* Filters hidden for now */}
      {/* <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <DiscountFilters
          isLoading={isLoading}
          filterDescription={filterDescription}
          setFilterDescription={setFilterDescription}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterBrand={filterBrand}
          setFilterBrand={setFilterBrand}
          filterSubCategory={filterSubCategory}
          setFilterSubCategory={setFilterSubCategory}
          filterZone={filterZone}
          setFilterZone={setFilterZone}
          filterClient={filterClient}
          setFilterClient={setFilterClient}
          filterProduct={filterProduct}
          setFilterProduct={setFilterProduct}
        />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <DiscountAdd isLoading={isLoading} setDiscounts={setDiscounts} />
          </>
        )}
      </Flex> */}

      {/* {!isMobile && (
        <Flex justifyContent="flex-end">
          <DiscountAdd isLoading={isLoading} setDiscounts={setDiscounts} />
        </Flex>
      )} */}

      {isMobile && <Divider />}

      <DiscountList
        discounts={discounts}
        isLoading={isLoading /* || isFilterLoading */}
        error={error}
        setDiscounts={setDiscounts}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
