'use client';

import { NextPage } from 'next';
import { SideBar, Content, Users } from '@/components';
import { Flex } from '@chakra-ui/react';
import { ClientOnly } from '@/components/ClientOnly';

const UsersPage: NextPage = () => {
  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="usuarios" />
        <Content>
          <Users />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default UsersPage;
