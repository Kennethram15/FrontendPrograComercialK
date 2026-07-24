<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">Rx</div>
        <span>Farmacia</span>
      </div>

      <nav class="nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          <span class="nav-dot" />
          {{ item.label }}
        </router-link>
      </nav>
    </aside>

    <div class="main">
      <header class="topbar">
        <h1>{{ title }}</h1>

        <div class="topbar-actions">
          <button class="icon-btn" title="Tema">🌙</button>
          <button class="icon-btn" title="Notificaciones" style="position: relative">
            🔔
            <span class="notif-dot">3</span>
          </button>
          <button class="icon-btn" title="Configuración">⚙️</button>
          <button class="icon-btn" title="Cerrar sesión" @click="cerrarSesion">🚪</button>
          <div class="avatar" :title="usuario?.nombre_usuario">{{ inicial }}</div>
          <input class="search" type="text" placeholder="Buscar..." />
        </div>
      </header>

      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { obtenerUsuario, logout } from '../services/authService';

defineProps({
  title: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const usuario = obtenerUsuario();

const inicial = computed(() => usuario?.nombre_usuario?.charAt(0)?.toUpperCase() || '?');

const todosLosItems = [
  { path: '/', label: 'Panel' },
  { path: '/medicamentos', label: 'Medicamentos' },
  { path: '/ventas', label: 'Ventas' },
  { path: '/compras', label: 'Compras' },
  { path: '/proveedores', label: 'Proveedores' },
  { path: '/clientes', label: 'Clientes' },
  { path: '/roles', label: 'Roles', soloAdmin: true },
  { path: '/metodos-pago', label: 'Métodos de pago' },
  { path: '/presentaciones', label: 'Presentaciones' },
  { path: '/lotes', label: 'Lotes' },
];

const navItems = computed(() =>
  todosLosItems.filter((item) => !item.soloAdmin || usuario?.nombre_rol === 'Administrador')
);

function cerrarSesion() {
  logout();
  router.push('/login');
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 22px 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 28px;
  padding: 0 8px;
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  background: var(--surface-alt);
  color: var(--text);
}

.nav-item.active {
  background: var(--accent-soft);
  color: var(--accent);
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.7;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid var(--border);
}

.topbar h1 {
  font-size: 18px;
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notif-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--danger);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}

.search {
  width: 200px;
}

.content {
  padding: 28px;
  flex: 1;
  overflow-y: auto;
}
</style>