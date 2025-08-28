'use client';

import {
  Divider,
  Flex,
  Text,
  useMediaQuery,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { ReturnRequestFilters } from './ReturnRequestFilters';
import { ReturnRequestAdd } from './ReturnRequestAdd';
import { ReturnRequestList } from './ReturnRequestList';
import { ReturnRequestEdit } from './ReturnRequestEdit';
import { useGetReturnRequests, useChangeReturnRequestStatus } from '@/hooks/returnRequest';
import { ReturnRequest } from '@/entities/returnRequest';
import { useSearchParams } from 'next/navigation';

export const ReturnRequests = () => {
  const searchParams = useSearchParams();
  const deliveryIdParam = searchParams.get('deliveryId');
  const shouldAddParam = searchParams.get('add');
  const toast = useToast();

  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterClientId, setFilterClientId] = useState<number | undefined>();
  const [filterUserId, setFilterUserId] = useState<number | undefined>();
  const [filterFromDate, setFilterFromDate] = useState<string>('');
  const [filterToDate, setFilterToDate] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [editingReturnRequest, setEditingReturnRequest] = useState<ReturnRequest | null>(null);
  
  // Modal de confirmación para confirmar devolución
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [returnRequestToConfirm, setReturnRequestToConfirm] = useState<ReturnRequest | null>(null);
  const [confirmStatusProps, setConfirmStatusProps] = useState<{ id: number; status: string }>();

  const filters = useMemo(() => {
    const result: { status?: string; clientId?: number; userId?: number; fromDate?: string; toDate?: string } = {};
    if (filterStatus) result.status = filterStatus;
    if (filterClientId) result.clientId = filterClientId;
    if (filterUserId) result.userId = filterUserId;
    if (filterFromDate) result.fromDate = filterFromDate;
    if (filterToDate) result.toDate = filterToDate;
    return Object.keys(result).length > 0 ? result : undefined;
  }, [filterStatus, filterClientId, filterUserId, filterFromDate, filterToDate]);

  const { data, isLoading, error } = useGetReturnRequests(currentPage, pageSize, filters);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  
  // Hook para cambiar status de devolución
  const { 
    data: confirmData, 
    isLoading: isConfirming, 
    fieldError: confirmError 
  } = useChangeReturnRequestStatus(confirmStatusProps);

  useEffect(() => {
    if (data) {
      setReturnRequests(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterStatus || filterClientId || filterUserId || filterFromDate || filterToDate) {
      setIsFilterLoading(true);
    }
  }, [filterStatus, filterClientId, filterUserId, filterFromDate, filterToDate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: {
    status?: string;
    clientId?: number;
    userId?: number;
    fromDate?: string;
    toDate?: string;
  }) => {
    setFilterStatus(newFilters.status);
    setFilterClientId(newFilters.clientId);
    setFilterUserId(newFilters.userId);
    setFilterFromDate(newFilters.fromDate || '');
    setFilterToDate(newFilters.toDate || '');
  };

  // Handler para cuando se actualiza una devolución
  const handleReturnRequestUpdated = (updatedReturnRequest: ReturnRequest) => {
    setReturnRequestToConfirm(updatedReturnRequest);
    setShowConfirmModal(true);
  };

  // Handler para confirmar la devolución
  const handleConfirmReturn = () => {
    if (returnRequestToConfirm) {
      setConfirmStatusProps({ 
        id: returnRequestToConfirm.id, 
        status: 'Confirmada' 
      });
    }
  };

  // Handler para cancelar la confirmación
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setReturnRequestToConfirm(null);
    setConfirmStatusProps(undefined);
  };

  // Handle successful status change
  useEffect(() => {
    if (confirmData) {
      setReturnRequests((prev) => prev.map((r) => (r.id === confirmData.id ? confirmData : r)));
      setShowConfirmModal(false);
      setReturnRequestToConfirm(null);
      setConfirmStatusProps(undefined);
      
      toast({
        title: 'Devolución confirmada',
        description: 'La devolución ha sido confirmada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [confirmData, toast]);

  // Handle confirmation errors
  useEffect(() => {
    if (confirmError) {
      toast({
        title: 'Error al confirmar',
        description: confirmError.error || 'Error al confirmar la devolución',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }, [confirmError, toast]);

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Devoluciones
        </Text>
        {isMobile && (
          <ReturnRequestAdd
            isLoading={isLoading}
            setReturnRequests={setReturnRequests}
            preselectedDeliveryId={deliveryIdParam ? Number(deliveryIdParam) : undefined}
            forceOpen={shouldAddParam === 'true'}
            onReturnRequestCreated={setEditingReturnRequest}
          />
        )}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ReturnRequestFilters onFilterChange={handleFilterChange} disabled={isLoading || isFilterLoading} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <ReturnRequestAdd
              isLoading={isLoading}
              setReturnRequests={setReturnRequests}
              preselectedDeliveryId={deliveryIdParam ? Number(deliveryIdParam) : undefined}
              forceOpen={shouldAddParam === 'true'}
              onReturnRequestCreated={setEditingReturnRequest}
            />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <ReturnRequestList
        returnRequests={returnRequests}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setReturnRequests={setReturnRequests}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {editingReturnRequest && (
        <ReturnRequestEdit
          isOpen={!!editingReturnRequest}
          onClose={() => setEditingReturnRequest(null)}
          returnRequest={editingReturnRequest}
          setReturnRequests={setReturnRequests}
          onReturnRequestUpdated={handleReturnRequestUpdated}
        />
      )}

      {/* Modal de confirmación */}
      <Modal isOpen={showConfirmModal} onClose={handleCancelConfirm} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing="0.5rem">
              <Icon as={FaCheckCircle} color="green.500" />
              <Text>Confirmar Devolución</Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Text>
              ¿Deseas confirmar esta devolución ahora? Esto cambiará el estado de la devolución a "Confirmada".
            </Text>
            {returnRequestToConfirm && (
              <Text mt="1rem" fontSize="sm" color="gray.600">
                <strong>Cliente:</strong> {returnRequestToConfirm.client?.name || 'N/A'}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing="0.75rem">
              <Button 
                variant="outline" 
                onClick={handleCancelConfirm}
                disabled={isConfirming}
              >
                Ahora no
              </Button>
              <Button 
                colorScheme="green" 
                onClick={handleConfirmReturn}
                isLoading={isConfirming}
                loadingText="Confirmando..."
              >
                Sí, confirmar
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
