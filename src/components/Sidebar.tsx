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
  useDisclosure,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { useMediaQuery, useColorModeValue } from '@chakra-ui/react';
import { ElementType } from 'react';
import { FaUserShield, FaBars, FaCar } from 'react-icons/fa6';
import { BsPeopleFill } from 'react-icons/bs';
import { FaCubes, FaTags, FaWarehouse, FaPercent } from 'react-icons/fa';
import { BiCategoryAlt } from 'react-icons/bi';
import { MdPlace } from 'react-icons/md';
import { FiBriefcase } from 'react-icons/fi';
import { LuArrowDownUp } from 'react-icons/lu';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { useUserStore } from '@/stores/useUserStore';
import { Permission } from '@/enums/permission.enum';

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

const sidebarItems = [
  { path: 'roles', text: 'Roles', icon: FaUserShield, Permission: Permission.VIEW_ROLES },
  { path: 'usuarios', text: 'Usuarios', icon: BsPeopleFill, Permission: Permission.VIEW_USERS },
  { path: 'productos', text: 'Productos', icon: FaCubes, Permission: Permission.VIEW_PRODUCTS },
  { path: 'descuentos', text: 'Descuentos', icon: FaPercent, Permission: Permission.VIEW_DISCOUNTS },
  { path: 'marcas', text: 'Marcas', icon: FaTags, Permission: Permission.VIEW_BRANDS },
  { path: 'categorias', text: 'Categorias', icon: BiCategoryAlt, Permission: Permission.VIEW_CATEGORIES },
  { path: 'vehiculos', text: 'Vehiculos', icon: FaCar, Permission: Permission.VIEW_VEHICLES },
  { path: 'clientes', text: 'Clientes', icon: BsPeopleFill, Permission: Permission.VIEW_CLIENTS },
  { path: 'zonas', text: 'Zonas', icon: MdPlace, Permission: Permission.VIEW_ZONES },
  { path: 'proveedores', text: 'Proveedores', icon: FiBriefcase, Permission: Permission.VIEW_SUPPLIERS },
  {
    path: 'movimientos-de-stock',
    text: 'Movimientos de stock',
    icon: LuArrowDownUp,
    Permission: Permission.VIEW_STOCK_MOVEMENTS,
  },
  {
    path: 'depositos-y-estanterias',
    text: 'Depós. y estanterias',
    icon: FaWarehouse,
    Permission: Permission.VIEW_WAREHOUSES,
  },
];

export const SideBar = ({ currentPage }: SideBarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const hasPermission = useUserStore((s) => s.hasPermission);

  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const activeBg = useColorModeValue('#f2f2f2', 'gray.700');
  const hoverBg = useColorModeValue('#e0dede', 'gray.600');
  const activeColor = useColorModeValue('black', 'white');
  const defaultColor = useColorModeValue('gray.600', 'gray.300');
  const hoverColor = useColorModeValue('black', 'white');

  const visibleItems = sidebarItems.filter((item) => hasPermission(item.Permission));

  const renderSidebarContent = () => (
    <Flex
      bg={bg}
      flexDir="column"
      justifyContent="space-between"
      minW="15rem"
      h="100dvh"
      borderRight="1px solid"
      borderColor={borderColor}
      p="1rem"
    >
      <Flex flexDir="column" flex="1" overflow="hidden">
        <Flex justifyContent="space-between">
          <Text fontWeight="bold" pt="0.5rem" pb="1rem" fontSize="1.25rem" color={textColor}>
            Chriska S.R.L.
          </Text>
          <ThemeToggle />
        </Flex>
        <Flex
          flexDir="column"
          gap="0.625rem"
          alignItems="start"
          overflowY="auto"
          maxH="calc(100dvh - 12rem)"
          pr="0.5rem"
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: useColorModeValue('#CBD5E0', '#4A5568'),
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: useColorModeValue('#A0AEC0', '#2D3748'),
            },
          }}
        >
          {visibleItems.map((item) => (
            <SidebarButton
              key={item.path}
              path={item.path}
              text={item.text}
              icon={item.icon}
              currentPage={currentPage}
              {...{ activeBg, hoverBg, activeColor, defaultColor, hoverColor }}
            />
          ))}
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
          height="3.5rem"
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
          <DrawerBody p={0}>{renderSidebarContent()}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
