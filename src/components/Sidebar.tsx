'use client';

import { Flex, Text, Icon, Link } from '@chakra-ui/react';
import { UserMenu } from './UserMenu';
import { ElementType } from 'react';
import { FaUserShield } from 'react-icons/fa6';
import { BsPeopleFill } from 'react-icons/bs';
// import { FiBox } from "react-icons/fi";
// import { HiOutlineShoppingCart } from "react-icons/hi2";

type SidebarButtonProps = {
  path: string;
  text: string;
  icon: ElementType;
  currentPage?: string;
};

const SidebarButton = ({ path, text, icon, currentPage }: SidebarButtonProps) => (
  <Link
    href={`/${path}`}
    display="flex"
    alignItems="center"
    borderRadius="0.5rem"
    bg={currentPage == path ? '#f2f2f2' : 'white'}
    color={currentPage == path ? 'black' : 'gray'}
    fontWeight="medium"
    fontSize="0.875rem"
    w="100%"
    justifyContent="start"
    gap="0.75rem"
    _hover={currentPage == path ? { color: 'black', bg: '#e0dede' } : { color: 'black', bg: '#e0dede' }}
    py="0.375rem"
    px="0.75rem"
  >
    <Icon as={icon} boxSize={5} />
    {text}
  </Link>
);

type SiderBarProps = {
  currentPage?: string;
};

export const SideBar = ({ currentPage }: SiderBarProps) => {
  return (
    <Flex
      bg="white"
      flexDir="column"
      justifyContent="space-between"
      minW="15rem"
      minH="100vh"
      borderX="2px solid"
      borderColor="#f2f2f2"
      p="1.25rem"
    >
      <Flex flexDir="column">
        <Text fontWeight="bold" pt="0.5rem" pb="1.5rem" fontSize="1.25rem">
          Chriska S.R.L.
        </Text>
        <Flex flexDir="column" gap="0.625rem" alignItems="start">
          <SidebarButton path="roles" text="Roles" icon={FaUserShield} currentPage={currentPage} />
          <SidebarButton path="usuarios" text="Usuarios" icon={BsPeopleFill} currentPage={currentPage} />
          {/* <SidebarButton
            path="ordenes"
            text="Ordenes"
            icon={HiOutlineShoppingCart}
            currentPage={currentPage}
          />
          <SidebarButton
            path="productos"
            text="Productos"
            icon={FiBox}
            currentPage={currentPage}
          /> */}
        </Flex>
      </Flex>
      <UserMenu />
    </Flex>
  );
};
