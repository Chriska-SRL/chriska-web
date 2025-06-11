'use client';

import { NextPage } from 'next';
import { SideBar, Content } from '@/components';
import { Flex } from '@chakra-ui/react';
import { ClientOnly } from '@/components/ClientOnly';
import { Categories } from '@/components/Categories/Categories';

const CategoriesPage: NextPage = () => {
  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="categorias" />
        <Content>
          <Categories />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default CategoriesPage;
