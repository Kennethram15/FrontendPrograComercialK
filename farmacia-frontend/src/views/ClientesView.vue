<template>
  <AppLayout title="Clientes">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los clientes</h2>
        <button class="btn btn-accent">+ Agregar cliente</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>NIT</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cli in clientes" :key="cli.id_cliente">
            <td class="nombre">{{ cli.nombre_cliente }}</td>
            <td>{{ cli.nit_cliente }}</td>
            <td>
              <span class="badge" :class="cli.estado_cliente ? 'badge-success' : 'badge-danger'">
                {{ cli.estado_cliente ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn">👁</button>
                <button class="icon-btn accent">✎</button>
                <button class="icon-btn danger">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && clientes.length === 0">
            <td colspan="4" class="vacio">No hay clientes registrados todavía.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import api from '../services/api';

const clientes = ref([]);
const cargando = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get('/clientes');
    clientes.value = data;
  } catch (error) {
    console.error('Error al cargar clientes', error);
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px;
}

.toolbar h2 {
  font-size: 15px;
  margin: 0;
  color: var(--text-muted);
  font-weight: 600;
}

.nombre {
  font-weight: 600;
}

.acciones {
  display: flex;
  gap: 8px;
}

.vacio {
  text-align: center;
  color: var(--text-muted);
  padding: 32px;
}
</style>
