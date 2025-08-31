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
  HStack,
  Stack,
  Icon,
  SimpleGrid,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { FiInfo, FiUser, FiTruck, FiMapPin, FiFileText, FiHash, FiPackage, FiMap } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Distribution } from '@/entities/distribution';
import { DistributionEdit } from './DistributionEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteDistribution } from '@/hooks/distribution';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { getStatusLabel, getStatusColor } from '@/enums/status.enum';

type DistributionDetailProps = {
  distribution: Distribution;
  setDistributions: React.Dispatch<React.SetStateAction<Distribution[]>>;
};

export const DistributionDetail = ({ distribution, setDistributions }: DistributionDetailProps) => {
  const canEditDistributions = useUserStore((s) => s.hasPermission(Permission.EDIT_DISTRIBUTIONS));
  const canDeleteDistributions = useUserStore((s) => s.hasPermission(Permission.DELETE_DISTRIBUTIONS));
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

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
      >
        {value ?? '—'}
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        aria-label="Ver detalle"
        icon={<FiInfo />}
        onClick={onOpen}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }} isCentered>
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
            Detalle del reparto
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('ID', `#${distribution.id}`, FiHash)}
                {detailField('Usuario', distribution.user?.name, FiUser)}
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Vehículo', distribution.vehicle?.plate, FiTruck)}
                {detailField('Modelo', distribution.vehicle?.model, FiTruck)}
              </SimpleGrid>

              {detailField('Zonas', distribution.zones?.map((zone) => zone.name).join(', '), FiMapPin)}

              {/* Mostrar entregas detalladas */}
              {distribution.deliveries && distribution.deliveries.length > 0 ? (
                <Box>
                  <HStack mb="0.5rem" spacing="0.5rem" justify="space-between">
                    <HStack spacing="0.5rem">
                      <Icon as={FiPackage} boxSize="1rem" color={iconColor} />
                      <Text fontSize="lg" fontWeight="bold" color={labelColor}>
                        Entregas ({distribution.deliveries.length})
                      </Text>
                    </HStack>
                    <HStack spacing="0.5rem">
                      <Button
                        leftIcon={<FiInfo />}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => {
                          onClose();
                          router.push(`/entregas?distribution=${distribution.id}`);
                        }}
                      >
                        Ir a entregas
                      </Button>
                      <Button
                        leftIcon={<FiMap />}
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // TODO: Abrir mapa con direcciones
                        }}
                      >
                        Ver mapa
                      </Button>
                    </HStack>
                  </HStack>
                  <Box
                    p="0.5rem 1rem"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={inputBorder}
                    borderRadius="md"
                    maxH="200px"
                    overflowY="auto"
                  >
                    <VStack spacing="0" align="stretch">
                      {distribution.deliveries.map((delivery, index) => (
                        <Box key={delivery.id}>
                          {index > 0 && <Divider my="0.25rem" />}
                          <Box py="0.25rem">
                            <HStack justify="space-between" align="center" mb="0.25rem">
                              <Text fontSize="sm" fontWeight="medium">
                                Entrega #{delivery.id}
                              </Text>
                              <Badge
                                colorScheme={getStatusColor(delivery.status)}
                                fontSize="0.6rem"
                                p="0.125rem 0.375rem"
                                borderRadius="0.25rem"
                              >
                                {getStatusLabel(delivery.status)}
                              </Badge>
                            </HStack>
                            <Text fontSize="xs" color={iconColor}>
                              Cliente: {delivery.client?.name || '-'}
                            </Text>
                            {delivery.client?.address && (
                              <Text fontSize="xs" color={iconColor}>
                                Dirección: {delivery.client.address}
                              </Text>
                            )}
                            {delivery.observations && (
                              <Text fontSize="xs" color={iconColor} mt="0.125rem">
                                Notas: {delivery.observations}
                              </Text>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              ) : (
                detailField('Entregas', 'Sin entregas asignadas', FiPackage)
              )}

              {detailField('Observaciones', distribution.observations || 'Sin observaciones', FiFileText)}
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
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cerrar
              </Button>
              {canDeleteDistributions && (
                <GenericDelete
                  item={{ id: distribution.id, name: `Reparto #${distribution.id}` }}
                  useDeleteHook={useDeleteDistribution}
                  setItems={setDistributions}
                  onDeleted={onClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditDistributions && (
                <Button
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    openEdit();
                    onClose();
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

      {/* Solo renderizar DistributionEdit cuando está abierto */}
      {isEditOpen && (
        <DistributionEdit
          isOpen={isEditOpen}
          onClose={closeEdit}
          distribution={distribution}
          setDistributions={setDistributions}
        />
      )}
    </>
  );
};
