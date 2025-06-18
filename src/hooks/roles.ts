import { Role } from '@/entities/role';
import { getRoles, addRole, updateRole, deleteRole } from '@/services/role';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetRoles = () => useFetchNoParams<Role[]>(getRoles, []);

export const useAddRole = (props?: Partial<Role>) =>
  useFetch<Partial<Role>, Role>(addRole, props, { parseFieldError: true });

export const useUpdateRole = (props?: Partial<Role>) =>
  useFetch<Partial<Role>, Role>(updateRole, props, { parseFieldError: true });

export const useDeleteRole = (id?: number) => useFetch<number, Role>(deleteRole, id);
