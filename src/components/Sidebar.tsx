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
import { useMediaQuery, useColorModeValue } from '@chakra-ui/react';
import { ElementType } from 'react';
import { FaUserShield, FaBars } from 'react-icons/fa6';
import { BsPeopleFill } from 'react-icons/bs';
import { FaCubes } from 'react-icons/fa';
import { BiCategoryAlt } from 'react-icons/bi';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

type SidebarButtonProps = {
  path: string;
  text: string;
  icon: ElementType;
  currentPage?: string;
  activeBg: string;
  hoverBg: string;
  activeColor: string;
  defaultColor: string;
  hoverColor: string;
};

const SidebarButton = ({
  path,
  text,
  icon,
  currentPage,
  activeBg,
  hoverBg,
  activeColor,
  defaultColor,
  hoverColor,
}: SidebarButtonProps) => {
  const isActive = currentPage === path;

  return (
    <Link
      href={`/${path}`}
      display="flex"
      alignItems="center"
      borderRadius="0.5rem"
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : defaultColor}
      fontWeight="medium"
      fontSize="0.875rem"
      w="100%"
      justifyContent="start"
      gap="0.75rem"
      _hover={{ color: hoverColor, bg: hoverBg }}
      py="0.375rem"
      px="0.75rem"
    >
      <Icon as={icon} boxSize={5} />
      {text}
    </Link>
  );
};

type SideBarProps = {
  currentPage?: string;
};

export const SideBar = ({ currentPage }: SideBarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const activeBg = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.200', 'gray.600');
  const activeColor = useColorModeValue('black', 'white');
  const defaultColor = useColorModeValue('gray.600', 'gray.300');
  const hoverColor = useColorModeValue('black', 'white');

  const renderSidebarContent = () => (
    <Flex
      bg={bg}
      flexDir="column"
      justifyContent="space-between"
      minW="15rem"
      minH="100vh"
      borderRight="1px solid"
      borderColor={borderColor}
      p="1.25rem"
    >
      <Flex flexDir="column">
        <Flex justifyContent="space-between">
          <Text fontWeight="bold" pt="0.5rem" pb="1.5rem" fontSize="1.25rem" color={textColor}>
            Chriska S.R.L.
          </Text>
          <ThemeToggle />
        </Flex>
        <Flex flexDir="column" gap="0.625rem" alignItems="start">
          <SidebarButton
            path="roles"
            text="Roles"
            icon={FaUserShield}
            currentPage={currentPage}
            {...{ activeBg, hoverBg, activeColor, defaultColor, hoverColor }}
          />
          <SidebarButton
            path="usuarios"
            text="Usuarios"
            icon={BsPeopleFill}
            currentPage={currentPage}
            {...{ activeBg, hoverBg, activeColor, defaultColor, hoverColor }}
          />
          <SidebarButton
            path="productos"
            text="Productos"
            icon={FaCubes}
            currentPage={currentPage}
            {...{ activeBg, hoverBg, activeColor, defaultColor, hoverColor }}
          />
          <SidebarButton
            path="categorias"
            text="Categorias"
            icon={BiCategoryAlt}
            currentPage={currentPage}
            {...{ activeBg, hoverBg, activeColor, defaultColor, hoverColor }}
          />
        </Flex>
      </Flex>

      <UserMenu />
    </Flex>
  );

  return (
    <>
      {isMobile && (
        <Flex
          as="nav"
          position="fixed"
          top="0"
          left="0"
          right="0"
          height="4rem"
          bg={bg}
          borderBottom="1px solid"
          borderColor={borderColor}
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

      {isMobile && <Box height="4rem" />}

      {!isMobile && renderSidebarContent()}

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="15rem">
          <DrawerCloseButton />
          <DrawerBody p={0}>{renderSidebarContent()}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
