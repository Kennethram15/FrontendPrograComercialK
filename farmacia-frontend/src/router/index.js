import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'panel', component: () => import('../views/DashboardView.vue') },
  { path: '/medicamentos', name: 'medicamentos', component: () => import('../views/MedicamentosView.vue') },
  { path: '/ventas', name: 'ventas', component: () => import('../views/VentasView.vue') },
  { path: '/compras', name: 'compras', component: () => import('../views/ComprasView.vue') },
  { path: '/proveedores', name: 'proveedores', component: () => import('../views/ProveedoresView.vue') },
  { path: '/clientes', name: 'clientes', component: () => import('../views/ClientesView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
