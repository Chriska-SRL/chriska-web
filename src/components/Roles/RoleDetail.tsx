'use client';

import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
  Box,
  Text,
  Button,
  useColorModeValue,
  useDisclosure,
  Icon,
  HStack,
  Stack,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  useMediaQuery,
} from '@chakra-ui/react';
import { FiInfo, FiUser, FiFileText, FiShield } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Role } from '@/entities/role';
import { RoleEdit } from './RoleEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteRole } from '@/hooks/role';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useEffect, useCallback } from 'react';
import { PERMISSIONS_METADATA } from '@/utils/permissionMetadata';

type RoleDetailProps = {
  role: Role;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
};

export const RoleDetail = ({ role, setRoles, forceOpen, onModalClose }: RoleDetailProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const canEditRoles = useUserStore((s) => s.hasPermission(Permission.EDIT_ROLES));
  const canDeleteRoles = useUserStore((s) => s.hasPermission(Permission.DELETE_ROLES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleClose = useCallback(() => {
    onClose();
    onModalClose?.();
  }, [onClose, onModalClose]);

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const groupedPermissions = PERMISSIONS_METADATA.reduce(
    (acc, perm) => {
      if (!acc[perm.group]) acc[perm.group] = [];
      acc[perm.group].push(perm);
      return acc;
    },
    {} as Record<string, typeof PERMISSIONS_METADATA>,
  );

  const detailField = (label: string, value: string | number | null | undefined, icon?: any) => (
    <Box w="100%">
      <HStack mb="0.5rem" spacing="0.5rem">
        {icon && <Icon as={icon} boxSize="1rem" color={iconColor} />}
        <Text color={labelColor} fontWeight="semibold">
          {label}
        </Text>
      </HStack>
      <Box
        px="1rem"
        py="0.5rem"
        bg={inputBg}
        border="1px solid"
        borderColor={inputBorder}
        borderRadius="md"
        minH="2.75rem"
        maxH="10rem"
        overflowY="auto"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        transition="all 0.2s"
      >
        {value ?? '—'}
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        aria-label="Ver detalles"
        icon={<FiInfo />}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'full', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent maxH="90dvh" display="flex" flexDirection="column">
          <ModalHeader
            py="0.75rem"
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Detalle del rol
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1.5rem" align="stretch">
              {detailField('Nombre', role.name, FiUser)}
              {detailField('Descripción', role.description, FiFileText)}

              <Box>
                <HStack mb="0.5rem" spacing="0.5rem">
                  <Icon as={FiShield} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Permisos
                  </Text>
                </HStack>
                <Box overflowY="auto" pr="0.5rem">
                  <Accordion allowMultiple>
                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                      <AccordionItem key={group}>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                              {group}
                            </Box>
                            <Text fontSize="sm" color={textColor} mx="1rem">
                              {perms.filter((perm) => role.permissions?.includes(perm.id)).length}{' '}
                              {isMobile ? 'asign.' : 'asignados'}
                            </Text>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Flex wrap="wrap" gap="0.75rem">
                            {perms.map((perm) => (
                              <Checkbox
                                key={perm.id}
                                isChecked={role.permissions?.includes(perm.id) || false}
                                isDisabled={true}
                              >
                                {perm.label}
                              </Checkbox>
                            ))}
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <Stack
              direction={{ base: 'column-reverse', md: 'row' }}
              spacing="0.5rem"
              w="100%"
              align="stretch"
              justify={{ base: 'stretch', md: 'flex-end' }}
            >
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Cerrar
              </Button>
              {canDeleteRoles && (
                <GenericDelete
                  item={{ id: role.id, name: role.name }}
                  useDeleteHook={useDeleteRole}
                  setItems={setRoles}
                  onDeleted={handleClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditRoles && (
                <Button
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    openEdit();
                    handleClose();
                  }}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                >
                  Editar
                </Button>
              )}
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <RoleEdit isOpen={isEditOpen} onClose={closeEdit} role={role} setRoles={setRoles} />
    </>
  );
};
