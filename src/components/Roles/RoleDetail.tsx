'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  VStack,
  Box,
  Text,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
} from '@chakra-ui/react';
import { PERMISSIONS_METADATA } from '@/entities/permissions/permissionMetadata';
import { Role } from '@/entities/role';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
};

export const RoleDetail = ({ isOpen, onClose, role }: Props) => {
  if (!role) return null;

  const groupedPermissions = PERMISSIONS_METADATA.reduce(
    (acc, perm) => {
      if (!acc[perm.group]) acc[perm.group] = [];
      acc[perm.group].push(perm);
      return acc;
    },
    {} as Record<string, typeof PERMISSIONS_METADATA>,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader textAlign="center" fontSize="2rem">
          Detalle de rol
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px="2rem" pb="2rem" pt="0">
          <Flex gap="2rem" align="start">
            <Box flex="1">
              <FormControl>
                <FormLabel>Permisos</FormLabel>
                <Box maxH="52vh" overflowY="auto" pr="0.5rem">
                  <Accordion allowMultiple>
                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                      <AccordionItem key={group}>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                              {group}
                            </Box>
                            <Text fontSize="sm" color="gray.600" mr="1rem">
                              {perms.filter((perm) => role.permissions.includes(perm.id)).length} seleccionados
                            </Text>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Flex wrap="wrap" gap="0.75rem">
                            {perms.map((perm) => (
                              <Checkbox key={perm.id} isChecked={role.permissions.includes(perm.id)} isDisabled>
                                {perm.label}
                              </Checkbox>
                            ))}
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Box>
              </FormControl>
            </Box>

            <Divider orientation="vertical" h="27rem" />

            {/* Columna derecha: datos en modo solo lectura */}
            <Flex flex="1" flexDir="column" justifyContent="space-between" h="27rem">
              <Box>
                <VStack spacing="1rem" align="stretch" height="100%">
                  <FormControl>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      value={role.name}
                      isDisabled
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      fontSize="0.875rem"
                      h="2.75rem"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Descripción</FormLabel>
                    <Textarea
                      value={role.description}
                      isDisabled
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      fontSize="0.875rem"
                      resize="vertical"
                      minH="8rem"
                    />
                  </FormControl>
                </VStack>
              </Box>
              <Box />
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
