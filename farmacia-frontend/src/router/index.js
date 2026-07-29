import { createRouter, createWebHistory } from 'vue-router';
import { obtenerUsuario } from '../services/authService';

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/', name: 'panel', component: () => import('../views/DashboardView.vue') },
  { path: '/medicamentos', name: 'medicamentos', component: () => import('../views/MedicamentosView.vue') },
  { path: '/ventas', name: 'ventas', component: () => import('../views/VentasView.vue') },
  { path: '/nueva-venta', name: 'nueva-venta', component: () => import('../views/NuevaVentaView.vue') },
  { path: '/compras', name: 'compras', component: () => import('../views/ComprasView.vue') },
  { path: '/nueva-compra', name: 'nueva-compra', component: () => import('../views/NuevaCompraView.vue') },
  { path: '/proveedores', name: 'proveedores', component: () => import('../views/ProveedoresView.vue') },
  { path: '/clientes', name: 'clientes', component: () => import('../views/ClientesView.vue') },
  { path: '/roles', name: 'roles', component: () => import('../views/RolesView.vue'), meta: { soloAdmin: true } },
  { path: '/metodos-pago', name: 'metodos-pago', component: () => import('../views/MetodosPagoView.vue') },
  { path: '/presentaciones', name: 'presentaciones', component: () => import('../views/PresentacionesView.vue') },
  { path: '/lotes', name: 'lotes', component: () => import('../views/LotesView.vue') },
  { path: '/reportes', name: 'reportes', component: () => import('../views/ReportesView.vue') },
  { path: '/usuarios', name: 'usuarios', component: () => import('../views/UsuariosView.vue'), meta: { soloAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const esLogin = to.path === '/login';
  const token = localStorage.getItem('farmacia_token');

  if (!esLogin && !token) {
    return '/login';
  }
  if (esLogin && token) {
    return '/';
  }

  if (to.meta?.soloAdmin) {
    const usuario = obtenerUsuario();
    if (usuario?.nombre_rol !== 'Administrador') {
      return '/';
    }
  }
});

export default router;