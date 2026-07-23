import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'panel', component: () => import('../views/DashboardView.vue') },
  { path: '/medicamentos', name: 'medicamentos', component: () => import('../views/MedicamentosView.vue') },
  { path: '/ventas', name: 'ventas', component: () => import('../views/VentasView.vue') },
  { path: '/compras', name: 'compras', component: () => import('../views/ComprasView.vue') },
  { path: '/proveedores', name: 'proveedores', component: () => import('../views/ProveedoresView.vue') },
  { path: '/clientes', name: 'clientes', component: () => import('../views/ClientesView.vue') },
  { path: '/roles', name: 'roles', component: () => import('../views/RolesView.vue') },
  { path: '/metodos-pago', name: 'metodos-pago', component: () => import('../views/MetodosPagoView.vue') },
  { path: '/presentaciones', name: 'presentaciones', component: () => import('../views/PresentacionesView.vue') },
  { path: '/lotes', name: 'lotes', component: () => import('../views/LotesView.vue') },
  { path: '/nueva-venta', name: 'nueva-venta', component: () => import('../views/NuevaVentaView.vue') },
  { path: '/nueva-compra', name: 'nueva-compra', component: () => import('../views/NuevaCompraView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
