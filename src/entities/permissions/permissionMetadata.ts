import { PermissionId } from './permissionId';

export const PERMISSIONS_METADATA = [
  // Roles
  { id: PermissionId.CREATE_ROLES, label: 'Crear roles', group: 'Roles' },
  { id: PermissionId.DELETE_ROLES, label: 'Eliminar roles', group: 'Roles' },
  { id: PermissionId.EDIT_ROLES, label: 'Editar roles', group: 'Roles' },
  { id: PermissionId.VIEW_ROLES, label: 'Ver roles', group: 'Roles' },

  // Usuarios
  { id: PermissionId.CREATE_USERS, label: 'Crear usuarios', group: 'Usuarios' },
  { id: PermissionId.DELETE_USERS, label: 'Eliminar usuarios', group: 'Usuarios' },
  { id: PermissionId.EDIT_USERS, label: 'Editar usuarios', group: 'Usuarios' },
  { id: PermissionId.VIEW_USERS, label: 'Ver usuarios', group: 'Usuarios' },

  // Categorías
  { id: PermissionId.CREATE_CATEGORIES, label: 'Crear categorías', group: 'Categorías' },
  { id: PermissionId.DELETE_CATEGORIES, label: 'Eliminar categorías', group: 'Categorías' },
  { id: PermissionId.EDIT_CATEGORIES, label: 'Editar categorías', group: 'Categorías' },
  { id: PermissionId.VIEW_CATEGORIES, label: 'Ver categorías', group: 'Categorías' },

  // Productos
  { id: PermissionId.CREATE_PRODUCTS, label: 'Crear productos', group: 'Productos' },
  { id: PermissionId.DELETE_PRODUCTS, label: 'Eliminar productos', group: 'Productos' },
  { id: PermissionId.EDIT_PRODUCTS, label: 'Editar productos', group: 'Productos' },
  { id: PermissionId.VIEW_PRODUCTS, label: 'Ver productos', group: 'Productos' },

  // Depósitos
  { id: PermissionId.CREATE_WAREHOUSES, label: 'Crear depósitos', group: 'Depósitos' },
  { id: PermissionId.DELETE_WAREHOUSES, label: 'Eliminar depósitos', group: 'Depósitos' },
  { id: PermissionId.EDIT_WAREHOUSES, label: 'Editar depósitos', group: 'Depósitos' },
  { id: PermissionId.VIEW_WAREHOUSES, label: 'Ver depósitos', group: 'Depósitos' },

  // Zonas
  { id: PermissionId.CREATE_ZONES, label: 'Crear zonas', group: 'Zonas' },
  { id: PermissionId.DELETE_ZONES, label: 'Eliminar zonas', group: 'Zonas' },
  { id: PermissionId.EDIT_ZONES, label: 'Editar zonas', group: 'Zonas' },
  { id: PermissionId.VIEW_ZONES, label: 'Ver zonas', group: 'Zonas' },

  // Clientes
  { id: PermissionId.CREATE_CLIENTS, label: 'Crear clientes', group: 'Clientes' },
  { id: PermissionId.DELETE_CLIENTS, label: 'Eliminar clientes', group: 'Clientes' },
  { id: PermissionId.EDIT_CLIENTS, label: 'Editar clientes', group: 'Clientes' },
  { id: PermissionId.VIEW_CLIENTS, label: 'Ver clientes', group: 'Clientes' },

  // Proveedores
  { id: PermissionId.CREATE_SUPPLIERS, label: 'Crear proveedores', group: 'Proveedores' },
  { id: PermissionId.DELETE_SUPPLIERS, label: 'Eliminar proveedores', group: 'Proveedores' },
  { id: PermissionId.EDIT_SUPPLIERS, label: 'Editar proveedores', group: 'Proveedores' },
  { id: PermissionId.VIEW_SUPPLIERS, label: 'Ver proveedores', group: 'Proveedores' },

  // Compras
  { id: PermissionId.CREATE_PURCHASES, label: 'Crear compras', group: 'Compras' },
  { id: PermissionId.DELETE_PURCHASES, label: 'Eliminar compras', group: 'Compras' },
  { id: PermissionId.EDIT_PURCHASES, label: 'Editar compras', group: 'Compras' },
  { id: PermissionId.VIEW_PURCHASES, label: 'Ver compras', group: 'Compras' },

  // Ventas
  { id: PermissionId.CREATE_SALES, label: 'Crear ventas', group: 'Ventas' },
  { id: PermissionId.DELETE_SALES, label: 'Eliminar ventas', group: 'Ventas' },
  { id: PermissionId.EDIT_SALES, label: 'Editar ventas', group: 'Ventas' },
  { id: PermissionId.VIEW_SALES, label: 'Ver ventas', group: 'Ventas' },

  // Pedidos
  { id: PermissionId.CREATE_ORDERS, label: 'Crear pedidos', group: 'Pedidos' },
  { id: PermissionId.DELETE_ORDERS, label: 'Eliminar pedidos', group: 'Pedidos' },
  { id: PermissionId.EDIT_ORDERS, label: 'Editar pedidos', group: 'Pedidos' },
  { id: PermissionId.VIEW_ORDERS, label: 'Ver pedidos', group: 'Pedidos' },

  // Entregas
  { id: PermissionId.CREATE_DELIVERIES, label: 'Crear entregas', group: 'Entregas' },
  { id: PermissionId.DELETE_DELIVERIES, label: 'Eliminar entregas', group: 'Entregas' },
  { id: PermissionId.EDIT_DELIVERIES, label: 'Editar entregas', group: 'Entregas' },
  { id: PermissionId.VIEW_DELIVERIES, label: 'Ver entregas', group: 'Entregas' },

  // Movimientos de stock
  { id: PermissionId.CREATE_STOCK_MOVEMENTS, label: 'Crear movimientos de stock', group: 'Movimientos de stock' },
  { id: PermissionId.DELETE_STOCK_MOVEMENTS, label: 'Eliminar movimientos de stock', group: 'Movimientos de stock' },
  { id: PermissionId.EDIT_STOCK_MOVEMENTS, label: 'Editar movimientos de stock', group: 'Movimientos de stock' },
  { id: PermissionId.VIEW_STOCK_MOVEMENTS, label: 'Ver movimientos de stock', group: 'Movimientos de stock' },

  // Vehículos
  { id: PermissionId.CREATE_VEHICLES, label: 'Crear vehículos', group: 'Vehículos' },
  { id: PermissionId.DELETE_VEHICLES, label: 'Eliminar vehículos', group: 'Vehículos' },
  { id: PermissionId.EDIT_VEHICLES, label: 'Editar vehículos', group: 'Vehículos' },
  { id: PermissionId.VIEW_VEHICLES, label: 'Ver vehículos', group: 'Vehículos' },

  // Pagos
  { id: PermissionId.CREATE_PAYMENTS, label: 'Crear pagos', group: 'Pagos' },
  { id: PermissionId.DELETE_PAYMENTS, label: 'Eliminar pagos', group: 'Pagos' },
  { id: PermissionId.EDIT_PAYMENTS, label: 'Editar pagos', group: 'Pagos' },
  { id: PermissionId.VIEW_PAYMENTS, label: 'Ver pagos', group: 'Pagos' },

  // Cobros
  { id: PermissionId.CREATE_COLLECTIONS, label: 'Crear cobros', group: 'Cobros' },
  { id: PermissionId.DELETE_COLLECTIONS, label: 'Eliminar cobros', group: 'Cobros' },
  { id: PermissionId.EDIT_COLLECTIONS, label: 'Editar cobros', group: 'Cobros' },
  { id: PermissionId.VIEW_COLLECTIONS, label: 'Ver cobros', group: 'Cobros' },
];
