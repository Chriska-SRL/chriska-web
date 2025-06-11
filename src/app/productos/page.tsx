'use client';

import { NextPage } from 'next';
import { SideBar, Content, Products } from '@/components';
import { Flex } from '@chakra-ui/react';
import { ClientOnly } from '@/components/ClientOnly';

const ProductsPage: NextPage = () => {
  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="products" />
        <Content>
          <Products />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default ProductsPage;
