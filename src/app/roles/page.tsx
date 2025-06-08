'use client';
import { NextPage } from 'next';
import { SideBar, Content, Roles } from '@/components';
import { Flex } from '@chakra-ui/react';
import { ClientOnly } from '@/components/ClientOnly';

const RolesPage: NextPage = () => {
  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="roles" />
        <Content>
          <Roles />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default RolesPage;
