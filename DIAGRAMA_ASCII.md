# Diagrama de Componentes ASCII - Sistema Chriska

```
                                    ┌─────────────────────────────────────┐
                                    │          APLICACIÓN WEB             │
                                    │           (App Component)           │
                                    └─────────────────┬───────────────────┘
                                                      │
                                    ┌─────────────────┴───────────────────┐
                                    │              LAYOUT                 │
                                    └─────┬─────────┬─────────┬───────────┘
                                          │         │         │
                          ┌───────────────┴─┐   ┌───┴───┐ ┌───┴──────┐
                          │     HEADER      │   │SIDEBAR│ │  FOOTER  │
                          └─────────────────┘   └───────┘ └──────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                    ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
                    │  PÁGINAS  │   │  PÁGINAS  │   │  PÁGINAS  │
                    │PRINCIPALES│   │PRINCIPALES│   │PRINCIPALES│
                    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
                          │               │               │
    ┌─────────────────────┼───────────────┼───────────────┼─────────────────────┐
    │                     │               │               │                     │
┌───▼────┐  ┌───▼────┐  ┌─▼──┐  ┌───▼────┐  ┌───▼────┐  ┌─▼──┐  ┌───▼────┐  ┌─▼──┐
│Products│  │ Users  │  │Cli-│  │ Orders │  │Deliver │  │Inv-│  │Vehicle │  │Rep-│
│        │  │        │  │ent │  │        │  │  ies   │  │ent │  │   s    │  │ort │
└───┬────┘  └───┬────┘  └─┬──┘  └───┬────┘  └───┬────┘  └─┬──┘  └───┬────┘  └─┬──┘
    │           │         │         │           │         │         │         │
    ▼           ▼         ▼         ▼           ▼         ▼         ▼         ▼

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           COMPONENTES ESPECÍFICOS                              │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┤
│  PRODUCTS   │    USERS    │   CLIENTS   │   ORDERS    │ DELIVERIES  │ INVENTORY   │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ProductList  │ UserList    │ ClientList  │ OrderList   │DeliveryList │StockMovList │
│ProductAdd   │ UserAdd     │ ClientAdd   │ OrderAdd    │DeliveryConf │WarehouseList│
│ProductEdit  │ UserEdit    │ ClientEdit  │ OrderEdit   │DeliveryMap  │ ShelfList   │
│ProductDetail│ UserDetail  │ClientDetail │ OrderDetail │VehicleAssign│ StockAlert  │
│ProductFilters│UserFilters │ClientFilters│OrderFilters │RouteOptim   │LocationSel  │
│ProductCard  │ RoleSelect  │ ClientCard  │ OrderCard   │DeliveryCard │InventoryCard│
│CategorySel  │PermMatrix   │ ZoneSelect  │ProductSel   │DeliveryFilt │StockMovAdd  │
│BrandSelect  │PassChange   │ ContactInfo │ OrderSum    │             │ BatchTracker│
│ImageUpload  │             │             │ StatusBadge │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    │                                          │
         ┌──────────▼──────────┐                    ┌──────────▼──────────┐
         │      VEHICLES       │                    │      REPORTS        │
         ├─────────────────────┤                    ├─────────────────────┤
         │ VehicleList         │                    │ ReportDashboard     │
         │ VehicleAdd          │                    │ SalesChart          │
         │ VehicleEdit         │                    │ InventoryChart      │
         │ VehicleDetail       │                    │ DeliveryChart       │
         │ VehicleCard         │                    │ ReportFilters       │
         │ CostTracker         │                    │ ExportButton        │
         │ MaintenanceLog      │                    │ DateRangePicker     │
         └─────────────────────┘                    │ MetricCard          │
                                                    └─────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            COMPONENTES COMPARTIDOS                             │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┤
│   LAYOUT    │    FORMS    │    DATA     │    UI/UX    │   FEEDBACK  │  NAVIGATION │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Layout      │ FormField   │ DataTable   │ Modal       │ Toast       │ Breadcrumb  │
│ Sidebar     │ GenericAdd  │ SearchBox   │ Card        │LoadingSpin  │ Pagination  │
│ Header      │ GenericEdit │ DatePicker  │ Badge       │ErrorBound   │ Navbar      │
│ Footer      │GenericDelete│             │ Avatar      │ConfirmDiag  │             │
│             │ ButtonGroup │             │             │UnsavedMod   │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

                                    FLUJO DE DATOS
                                          │
                               ┌──────────▼──────────┐
                               │   TODAS LAS LISTAS  │
                               │    COMPONENTES     │
                               └──────────┬──────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
                    │ DataTable │   │ SearchBox │   │Pagination │
                    └───────────┘   └───────────┘   └───────────┘

                               ┌──────────▼──────────┐
                               │ TODOS LOS ADD/EDIT  │
                               │    COMPONENTES     │
                               └──────────┬──────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
                    │   Modal   │   │ FormField │   │GenericAdd │
                    └───────────┘   └───────────┘   └───────────┘
```

## Ventajas del diagrama ASCII:

1. **Se ve en cualquier lugar** - En emails, documentos, código, etc.
2. **Fácil de modificar** - Solo necesitas un editor de texto
3. **Profesional** - Se ve técnico y detallado
4. **No necesita herramientas** - Funciona en cualquier markdown
5. **Imprimible** - Se ve perfecto en papel

## Desventajas:

1. **Lleva tiempo hacerlo** - Requiere paciencia para alinear todo
2. **No tiene colores** - Solo texto monocromo
3. **Limitado visualmente** - No tan atractivo como diagramas gráficos

¿Te gusta más este estilo? ¿O preferís que probemos con PlantUML para algo más colorido?