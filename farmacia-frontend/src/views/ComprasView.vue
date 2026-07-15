<template>
  <AppLayout title="Compras">
    <div class="card">
      <div class="toolbar">
        <h2>Todas las compras</h2>
        <button class="btn btn-accent">+ Nueva compra</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Compra</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="compra in compras" :key="compra.id_compra">
            <td>#C{{ compra.id_compra }}</td>
            <td>{{ compra.proveedor?.nombre_proveedor || '—' }}</td>
            <td>{{ formatearFecha(compra.fecha_compra) }}</td>
            <td>Q{{ Number(compra.total_compra).toFixed(2) }}</td>
            <td>
              <span class="badge" :class="claseEstado(compra.estado_compra)">
                {{ compra.estado_compra }}
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
          <tr v-if="!cargando && compras.length === 0">
            <td colspan="6" class="vacio">No hay compras registradas todavía.</td>
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

const compras = ref([]);
const cargando = ref(true);

function claseEstado(estado) {
  if (estado === 'recibida' || estado === 'completada') return 'badge-success';
  if (estado === 'cancelada') return 'badge-danger';
  return 'badge-neutral';
}

function formatearFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
}

onMounted(async () => {
  try {
    const { data } = await api.get('/compras');
    compras.value = data;
  } catch (error) {
    console.error('Error al cargar compras', error);
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
