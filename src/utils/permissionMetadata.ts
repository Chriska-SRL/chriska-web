import { Permission } from '../enums/permission.enum';

export const PERMISSIONS_METADATA = [
  // Roles
  { id: Permission.CREATE_ROLES, label: 'Crear roles', group: 'Roles' },
  { id: Permission.DELETE_ROLES, label: 'Eliminar roles', group: 'Roles' },
  { id: Permission.EDIT_ROLES, label: 'Editar roles', group: 'Roles' },
  { id: Permission.VIEW_ROLES, label: 'Ver roles', group: 'Roles' },

  // Usuarios
  { id: Permission.CREATE_USERS, label: 'Crear usuarios', group: 'Usuarios' },
  { id: Permission.DELETE_USERS, label: 'Eliminar usuarios', group: 'Usuarios' },
  { id: Permission.EDIT_USERS, label: 'Editar usuarios', group: 'Usuarios' },
  { id: Permission.VIEW_USERS, label: 'Ver usuarios', group: 'Usuarios' },

  // Categorías
  { id: Permission.CREATE_CATEGORIES, label: 'Crear categorías', group: 'Categorías' },
  { id: Permission.DELETE_CATEGORIES, label: 'Eliminar categorías', group: 'Categorías' },
  { id: Permission.EDIT_CATEGORIES, label: 'Editar categorías', group: 'Categorías' },
  { id: Permission.VIEW_CATEGORIES, label: 'Ver categorías', group: 'Categorías' },

  // Productos
  { id: Permission.CREATE_PRODUCTS, label: 'Crear productos', group: 'Productos' },
  { id: Permission.DELETE_PRODUCTS, label: 'Eliminar productos', group: 'Productos' },
  { id: Permission.EDIT_PRODUCTS, label: 'Editar productos', group: 'Productos' },
  { id: Permission.VIEW_PRODUCTS, label: 'Ver productos', group: 'Productos' },

  // Depósitos
  { id: Permission.CREATE_WAREHOUSES, label: 'Crear depósitos', group: 'Depósitos' },
  { id: Permission.DELETE_WAREHOUSES, label: 'Eliminar depósitos', group: 'Depósitos' },
  { id: Permission.EDIT_WAREHOUSES, label: 'Editar depósitos', group: 'Depósitos' },
  { id: Permission.VIEW_WAREHOUSES, label: 'Ver depósitos', group: 'Depósitos' },

  // Zonas
  { id: Permission.CREATE_ZONES, label: 'Crear zonas', group: 'Zonas' },
  { id: Permission.DELETE_ZONES, label: 'Eliminar zonas', group: 'Zonas' },
  { id: Permission.EDIT_ZONES, label: 'Editar zonas', group: 'Zonas' },
  { id: Permission.VIEW_ZONES, label: 'Ver zonas', group: 'Zonas' },

  // Clientes
  { id: Permission.CREATE_CLIENTS, label: 'Crear clientes', group: 'Clientes' },
  { id: Permission.DELETE_CLIENTS, label: 'Eliminar clientes', group: 'Clientes' },
  { id: Permission.EDIT_CLIENTS, label: 'Editar clientes', group: 'Clientes' },
  { id: Permission.VIEW_CLIENTS, label: 'Ver clientes', group: 'Clientes' },

  // Proveedores
  { id: Permission.CREATE_SUPPLIERS, label: 'Crear proveedores', group: 'Proveedores' },
  { id: Permission.DELETE_SUPPLIERS, label: 'Eliminar proveedores', group: 'Proveedores' },
  { id: Permission.EDIT_SUPPLIERS, label: 'Editar proveedores', group: 'Proveedores' },
  { id: Permission.VIEW_SUPPLIERS, label: 'Ver proveedores', group: 'Proveedores' },

  // Compras
  { id: Permission.CREATE_PURCHASES, label: 'Crear compras', group: 'Compras' },
  { id: Permission.DELETE_PURCHASES, label: 'Eliminar compras', group: 'Compras' },
  { id: Permission.EDIT_PURCHASES, label: 'Editar compras', group: 'Compras' },
  { id: Permission.VIEW_PURCHASES, label: 'Ver compras', group: 'Compras' },

  // Ventas
  { id: Permission.CREATE_SALES, label: 'Crear ventas', group: 'Ventas' },
  { id: Permission.DELETE_SALES, label: 'Eliminar ventas', group: 'Ventas' },
  { id: Permission.EDIT_SALES, label: 'Editar ventas', group: 'Ventas' },
  { id: Permission.VIEW_SALES, label: 'Ver ventas', group: 'Ventas' },

  // Pedidos
  { id: Permission.CREATE_ORDERS, label: 'Crear pedidos', group: 'Pedidos' },
  { id: Permission.DELETE_ORDERS, label: 'Eliminar pedidos', group: 'Pedidos' },
  { id: Permission.EDIT_ORDERS, label: 'Editar pedidos', group: 'Pedidos' },
  { id: Permission.VIEW_ORDERS, label: 'Ver pedidos', group: 'Pedidos' },

  // Entregas
  { id: Permission.CREATE_DELIVERIES, label: 'Crear entregas', group: 'Entregas' },
  { id: Permission.DELETE_DELIVERIES, label: 'Eliminar entregas', group: 'Entregas' },
  { id: Permission.EDIT_DELIVERIES, label: 'Editar entregas', group: 'Entregas' },
  { id: Permission.VIEW_DELIVERIES, label: 'Ver entregas', group: 'Entregas' },

  // Movimientos de stock
  { id: Permission.CREATE_STOCK_MOVEMENTS, label: 'Crear movimientos de stock', group: 'Movimientos de stock' },
  { id: Permission.DELETE_STOCK_MOVEMENTS, label: 'Eliminar movimientos de stock', group: 'Movimientos de stock' },
  { id: Permission.EDIT_STOCK_MOVEMENTS, label: 'Editar movimientos de stock', group: 'Movimientos de stock' },
  { id: Permission.VIEW_STOCK_MOVEMENTS, label: 'Ver movimientos de stock', group: 'Movimientos de stock' },

  // Vehículos
  { id: Permission.CREATE_VEHICLES, label: 'Crear vehículos', group: 'Vehículos' },
  { id: Permission.DELETE_VEHICLES, label: 'Eliminar vehículos', group: 'Vehículos' },
  { id: Permission.EDIT_VEHICLES, label: 'Editar vehículos', group: 'Vehículos' },
  { id: Permission.VIEW_VEHICLES, label: 'Ver vehículos', group: 'Vehículos' },

  // Pagos
  { id: Permission.CREATE_PAYMENTS, label: 'Crear pagos', group: 'Pagos' },
  { id: Permission.DELETE_PAYMENTS, label: 'Eliminar pagos', group: 'Pagos' },
  { id: Permission.EDIT_PAYMENTS, label: 'Editar pagos', group: 'Pagos' },
  { id: Permission.VIEW_PAYMENTS, label: 'Ver pagos', group: 'Pagos' },

  // Cobros
  { id: Permission.CREATE_COLLECTIONS, label: 'Crear cobros', group: 'Cobros' },
  { id: Permission.DELETE_COLLECTIONS, label: 'Eliminar cobros', group: 'Cobros' },
  { id: Permission.EDIT_COLLECTIONS, label: 'Editar cobros', group: 'Cobros' },
  { id: Permission.VIEW_COLLECTIONS, label: 'Ver cobros', group: 'Cobros' },
];
