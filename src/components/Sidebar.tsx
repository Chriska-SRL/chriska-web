'use client';

import {
  Flex,
  Text,
  Icon,
  Link,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { UserMenu } from './UserMenu';
import { ElementType, useEffect, useState } from 'react';
import { FaUserShield, FaBars } from 'react-icons/fa6';
import { BsPeopleFill } from 'react-icons/bs';

// import { isMobile as isMobileDevice } from 'react-device-detect';

import { useMediaQuery } from '@chakra-ui/react';

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
    _hover={{ color: 'black', bg: '#e0dede' }}
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const SidebarContent = (
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
        </Flex>
      </Flex>
      <UserMenu />
    </Flex>
  );

  return (
    <>
      {/* Mobile navbar */}
      {isMobile && (
        <Flex
          as="nav"
          position="fixed"
          top="0"
          left="0"
          right="0"
          height="4rem"
          bg="white"
          borderBottom="1px solid #e2e8f0"
          alignItems="center"
          justifyContent="space-between"
          px="1rem"
          zIndex="1000"
          boxShadow="sm"
        >
          <IconButton aria-label="Abrir menú" icon={<FaBars />} onClick={onOpen} variant="ghost" size="lg" />
          <Text fontWeight="bold" fontSize="1.25rem">
            Chriska S.R.L.
          </Text>
        </Flex>
      )}

      {/* Espacio compensatorio para contenido en mobile */}
      {isMobile && <Box height="4rem" />}

      {/* Sidebar en desktop */}
      {!isMobile && SidebarContent}

      {/* Drawer en mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="15rem">
          <DrawerCloseButton />
          <DrawerBody p={0}>{SidebarContent}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
