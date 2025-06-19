'use client';

import {
  Divider,
  Flex,
  Text,
  useMediaQuery,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GenericSearchFilter, filterByFields } from '@/components/shared/GenericSearchFilter';
import { GenericList } from '@/components/shared/GenericList';
import { GenericAdd } from '@/components/shared/GenericAdd';
import { GenericEdit } from '@/components/shared/GenericEdit';
import { GenericDelete } from '@/components/shared/GenericDelete';
import {
  useAddVehicleCost,
  useDeleteVehicleCost,
  useGetVehicleCosts,
  useUpdateVehicleCost,
} from '@/hooks/vehicleCost';
import { useGetVehicleById } from '@/hooks/vehicle';
import { validate } from '@/utils/validate';
import type { FieldConfig } from '@/components/shared/GenericAdd';
import { VehicleCost } from '@/entities/vehicleCost';

interface VehicleCostsProps {
  vehicleId: number;
}

export const VehicleCosts = ({ vehicleId }: VehicleCostsProps) => {
  const [filterName, setFilterName] = useState('');
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data: costsData, isLoading: isLoadingCosts, error: costsError } = useGetVehicleCosts(vehicleId);
  const { data: vehicle, isLoading: isLoadingVehicle, error: vehicleError } = useGetVehicleById(vehicleId);

  const [localCosts, setLocalCosts] = useState<VehicleCost[]>([]);
  const [selectedCost, setSelectedCost] = useState<VehicleCost | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [costToDelete, setCostToDelete] = useState<VehicleCost | null>(null);
  const { isOpen: isDeleteOpen, onOpen: openDeleteDialog, onClose: closeDeleteDialog } = useDisclosure();

  const { mutate: addVehicleCost, isLoading: isCreating } = useAddVehicleCost();
  const { mutate: updateVehicleCost, isLoading: isEditing } = useUpdateVehicleCost();
  const { mutate: deleteVehicleCost } = useDeleteVehicleCost();

  useEffect(() => {
    setLocalCosts(costsData ?? []);
  }, [costsData]);

  const filtered = filterByFields(localCosts, filterName, ['type', 'description']);

  const fields: FieldConfig<VehicleCost>[] = [
  {
    name: 'date',
    label: 'Fecha',
    validate,
    type: 'date', // 👈 hace que GenericAdd/GenericEdit use input type="date"
  },
  {
    name: 'type',
    label: 'Tipo',
    validate,
    type: 'select', // 👈 hace que se renderice como <select>
    options: [
      { label: 'Combustible', value: 'Combustible' },
      { label: 'Mantenimiento', value: 'Mantenimiento' },
      { label: 'Seguro', value: 'Seguro' },
      { label: 'Reparación', value: 'Reparación' },
      { label: 'Otro', value: 'Otro' },
    ],
  },
  { name: 'amount', label: 'Monto', validate },
  { name: 'description', label: 'Descripción', validate },
];

  const columns: { header: string; accessor: keyof VehicleCost }[] = [
    { header: 'Fecha', accessor: 'date' },
    { header: 'Tipo', accessor: 'type' },
    { header: 'Monto', accessor: 'amount' },
    { header: 'Descripción', accessor: 'description' },
  ];

  if (isLoadingVehicle) return <Spinner size="lg" />;
  if (vehicleError) return <Text>Error al cargar vehículo</Text>;
  if (!vehicle) return <Text>Vehículo no encontrado</Text>;

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">Costos del vehículo {vehicle.plate}</Text>

      <Flex
        direction={{ base: 'column-reverse', md: 'row' }}
        justifyContent="space-between"
        gap="1rem"
        w="100%"
      >
        <GenericSearchFilter
          value={filterName}
          onChange={setFilterName}
          placeholder="Buscar costo..."
        />
        {isMobile && <Divider />}
        <GenericAdd<VehicleCost>
          buttonLabel="Añadir costo"
          fields={fields}
          isLoading={isCreating}
          onSubmit={(values, onSuccess) => {
            addVehicleCost({ ...values, VehicleId: vehicleId }, {
              onSuccess: (created) => {
                setLocalCosts(prev =>
                  prev.some(v => v.id === created.id) ? prev : [...prev, created]
                );
                onSuccess();
              },
            });
          }}
        />
      </Flex>

      <GenericList<VehicleCost>
        data={filtered}
        columns={columns}
        isLoading={isLoadingCosts}
        error={costsError?.error}
        actions={{ view: false, edit: true, delete: true }}
        onEdit={(cost) => {
          setSelectedCost(cost);
          setIsEditOpen(true);
        }}
        onDelete={(cost) => {
          setCostToDelete(cost);
          openDeleteDialog();
        }}
      />

      {selectedCost && (
        <GenericEdit<VehicleCost>
          item={selectedCost}
          fields={fields}
          isOpen={isEditOpen}
          isLoading={isEditing}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedCost(null);
          }}
          onSubmit={(values, onSuccess) => {
            const updatedCost = { ...values, id: selectedCost.id, VehicleId: vehicleId };
            updateVehicleCost(updatedCost, {
              onSuccess: (updated) => {
                setLocalCosts(prev =>
                  prev.map(v => v.id === updated.id ? updated : v)
                );
                onSuccess();
              },
            });
          }}
        />
      )}

      <GenericDelete<VehicleCost>
        item={costToDelete}
        isOpen={isDeleteOpen}
        onClose={closeDeleteDialog}
        onDelete={(id) => {
          deleteVehicleCost(id, {
            onSuccess: () => {
              setLocalCosts(prev => prev.filter(v => v.id !== id));
            },
          });
        }}
        name="costo"
      />
    </>
  );
};
