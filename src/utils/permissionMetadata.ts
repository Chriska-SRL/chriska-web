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
  { id: Permission.CREATE_PRODUCT_WITHDATE, label: 'Crear producto con fecha', group: 'Movimientos de stock' },

  // Vehículos
  { id: Permission.CREATE_VEHICLES, label: 'Crear vehículos', group: 'Vehículos' },
  { id: Permission.DELETE_VEHICLES, label: 'Eliminar vehículos', group: 'Vehículos' },
  { id: Permission.EDIT_VEHICLES, label: 'Editar vehículos', group: 'Vehículos' },
  { id: Permission.VIEW_VEHICLES, label: 'Ver vehículos', group: 'Vehículos' },

  // Marcas
  { id: Permission.CREATE_BRANDS, label: 'Crear marcas', group: 'Marcas' },
  { id: Permission.DELETE_BRANDS, label: 'Eliminar marcas', group: 'Marcas' },
  { id: Permission.EDIT_BRANDS, label: 'Editar marcas', group: 'Marcas' },
  { id: Permission.VIEW_BRANDS, label: 'Ver marcas', group: 'Marcas' },

  // Descuentos
  { id: Permission.CREATE_DISCOUNTS, label: 'Crear descuentos', group: 'Descuentos' },
  { id: Permission.DELETE_DISCOUNTS, label: 'Eliminar descuentos', group: 'Descuentos' },
  { id: Permission.EDIT_DISCOUNTS, label: 'Editar descuentos', group: 'Descuentos' },
  { id: Permission.VIEW_DISCOUNTS, label: 'Ver descuentos', group: 'Descuentos' },

  // Solicitudes de pedido
  { id: Permission.CREATE_ORDER_REQUESTS, label: 'Crear solicitudes de pedido', group: 'Solicitudes de pedido' },
  { id: Permission.DELETE_ORDER_REQUESTS, label: 'Eliminar solicitudes de pedido', group: 'Solicitudes de pedido' },
  { id: Permission.EDIT_ORDER_REQUESTS, label: 'Editar solicitudes de pedido', group: 'Solicitudes de pedido' },
  { id: Permission.VIEW_ORDER_REQUESTS, label: 'Ver solicitudes de pedido', group: 'Solicitudes de pedido' },

  // Solicitudes de devolución
  {
    id: Permission.CREATE_RETURN_REQUESTS,
    label: 'Crear solicitudes de devolución',
    group: 'Solicitudes de devolución',
  },
  {
    id: Permission.DELETE_RETURN_REQUESTS,
    label: 'Eliminar solicitudes de devolución',
    group: 'Solicitudes de devolución',
  },
  {
    id: Permission.EDIT_RETURN_REQUESTS,
    label: 'Editar solicitudes de devolución',
    group: 'Solicitudes de devolución',
  },
  { id: Permission.VIEW_RETURN_REQUESTS, label: 'Ver solicitudes de devolución', group: 'Solicitudes de devolución' },

  // Distribuciones
  { id: Permission.ADD_DISTRIBUTIONS, label: 'Agregar distribuciones', group: 'Distribuciones' },
  { id: Permission.DELETE_DISTRIBUTIONS, label: 'Eliminar distribuciones', group: 'Distribuciones' },
  { id: Permission.EDIT_DISTRIBUTIONS, label: 'Editar distribuciones', group: 'Distribuciones' },
  { id: Permission.VIEW_DISTRIBUTIONS, label: 'Ver distribuciones', group: 'Distribuciones' },

  // Recibos
  { id: Permission.CREATE_RECEIPTS, label: 'Crear recibos', group: 'Recibos' },
  { id: Permission.DELETE_RECEIPTS, label: 'Eliminar recibos', group: 'Recibos' },
  { id: Permission.EDIT_RECEIPTS, label: 'Editar recibos', group: 'Recibos' },
  { id: Permission.VIEW_RECEIPTS, label: 'Ver recibos', group: 'Recibos' },
];
