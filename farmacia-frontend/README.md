# Sistema de Farmacia — Frontend (Vue 3 + Vite)

Interfaz sencilla en Vue 3, inspirada en las capturas de referencia (tema
oscuro, barra superior con iconos, tarjetas de estadísticas y tablas con
acciones).

## Estructura

```
farmacia-frontend/
├── src/
│   ├── assets/main.css       # Tema oscuro + variables CSS
│   ├── components/
│   │   ├── AppLayout.vue     # Barra lateral + barra superior
│   │   └── StatCard.vue      # Tarjeta de estadística (panel/ventas)
│   ├── router/index.js
│   ├── services/api.js       # Cliente axios apuntando a http://localhost:3000/api
│   └── views/
│       ├── DashboardView.vue
│       ├── MedicamentosView.vue
│       ├── VentasView.vue
│       ├── ComprasView.vue
│       ├── ProveedoresView.vue
│       └── ClientesView.vue
├── index.html
├── vite.config.js
└── package.json
```

## Instalación

```bash
cd farmacia-frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Asegúrate de tener el backend corriendo en
`http://localhost:3000` (ver `farmacia-backend/README.md`); si no está
disponible, cada vista simplemente muestra "No hay registros todavía".

## Vistas incluidas

Se implementaron 6 vistas (Panel, Medicamentos, Ventas, Compras,
Proveedores, Clientes) siguiendo el mismo patrón de tabla + tarjetas. Para
Roles, Usuarios, Presentación, Lote y Métodos de Pago no se construyó vista
todavía; se puede replicar el mismo patrón (copiar una vista existente y
apuntar al endpoint correspondiente) cuando lo necesites.
