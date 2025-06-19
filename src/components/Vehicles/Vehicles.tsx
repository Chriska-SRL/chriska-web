'use client';

import {
  Divider,
  Flex,
  Text,
  useMediaQuery,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GenericSearchFilter, filterByFields } from '@/components/shared/GenericSearchFilter';
import { GenericList } from '@/components/shared/GenericList';
import { GenericAdd } from '@/components/shared/GenericAdd';
import { GenericEdit } from '@/components/shared/GenericEdit';
import { GenericDelete } from '@/components/shared/GenericDelete';
import { Vehicle } from '@/entities/vehicle';
import {
  useAddVehicle,
  useDeleteVehicle,
  useGetVehicles,
  useUpdateVehicle,
} from '@/hooks/vehicle';
import { validate } from '@/utils/validate';
import type { FieldConfig } from '@/components/shared/GenericAdd';

export const Vehicles = () => {
  const [filterName, setFilterName] = useState('');
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetVehicles();
  const vehicles = data ?? [];
  const [localVehicles, setLocalVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const { isOpen: isDeleteOpen, onOpen: openDeleteDialog, onClose: closeDeleteDialog } = useDisclosure();

  const {
    mutate: addVehicle,
    isLoading: isCreating,
    error: createError,
  } = useAddVehicle();

  const {
    mutate: updateVehicle,
    isLoading: isEditing,
    error: editError,
  } = useUpdateVehicle();

  const {
    mutate: deleteVehicle,
    error: deleteError,
  } = useDeleteVehicle();

  useEffect(() => {
    setLocalVehicles(vehicles);
  }, [vehicles]);

  const filtered = filterByFields(localVehicles, filterName, ['plate', 'brand', 'model']);

  const fields: FieldConfig<Vehicle>[] = [
    { name: 'plate', label: 'Matrícula', validate },
    { name: 'brand', label: 'Marca', validate },
    { name: 'model', label: 'Modelo', validate },
    { name: 'crateCapacity', label: 'Capacidad', validate },
  ];

  const columns: { header: string; accessor: keyof Vehicle }[] = [
    { header: 'Matrícula', accessor: 'plate' },
    { header: 'Marca', accessor: 'brand' },
    { header: 'Modelo', accessor: 'model' },
    { header: 'Capacidad', accessor: 'crateCapacity' },
  ];

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">Vehículos</Text>

      <Flex
        direction={{ base: 'column-reverse', md: 'row' }}
        justifyContent="space-between"
        gap="1rem"
        w="100%"
      >
        <GenericSearchFilter
          value={filterName}
          onChange={setFilterName}
          placeholder="Buscar vehículo..."
        />
        {isMobile && <Divider />}
        <GenericAdd<Vehicle>
          buttonLabel="Crear vehículo"
          fields={fields}
          isLoading={isCreating}
          onSubmit={(values, onSuccess) => {
            addVehicle(values, {
              onSuccess: (created) => {
                setLocalVehicles(prev =>
                  prev.some(v => v.id === created.id) ? prev : [...prev, created]
                );
                onSuccess();
              },
            });
          }}
        />
      </Flex>

      <GenericList<Vehicle>
        data={filtered}
        columns={columns}
        isLoading={isLoading}
        actions={{ view: false, edit: true, delete: true }}
        onEdit={(vehicle) => {
          setSelectedVehicle(vehicle);
          setIsEditOpen(true);
        }}
        onDelete={(vehicle) => {
          setVehicleToDelete(vehicle);
          openDeleteDialog();
        }}
      />

      {selectedVehicle && (
        <GenericEdit<Vehicle>
          item={selectedVehicle}
          fields={fields}
          isOpen={isEditOpen}
          isLoading={isEditing}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedVehicle(null);
          }}
          onSubmit={(values, onSuccess) => {
            if (!selectedVehicle) return;
            const vehicleToUpdate = { ...values, id: selectedVehicle.id };
            updateVehicle(vehicleToUpdate, {
              onSuccess: (updated) => {
                setLocalVehicles(prev =>
                  prev.map(v => v.id === updated.id ? updated : v)
                );
                onSuccess();
              },
            });
          }}
        />
      )}

      <GenericDelete<Vehicle>
        item={vehicleToDelete}
        isOpen={isDeleteOpen}
        onClose={closeDeleteDialog}
        onDelete={(id) => {
          deleteVehicle(id, {
            onSuccess: () => {
              setLocalVehicles(prev => prev.filter(v => v.id !== id));
            },
          });
        }}
        name="vehículo"
      />
    </>
  );
};
