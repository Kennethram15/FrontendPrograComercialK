<template>
  <AppLayout title="Ventas">
    <div class="grid">
      <StatCard label="Total de ventas" :value="stats.total" icon="🧾" />
      <StatCard
        label="Completadas"
        :value="stats.completadas"
        icon="✅"
        icon-bg="var(--success-soft)"
        icon-color="var(--success)"
      />
      <StatCard label="Pendientes" :value="stats.pendientes" icon="⏳" />
      <StatCard
        label="Canceladas"
        :value="stats.canceladas"
        icon="✕"
        icon-bg="var(--danger-soft)"
        icon-color="var(--danger)"
      />
    </div>

    <div class="card">
      <div class="toolbar">
        <h2>Todas las ventas</h2>
        <button class="btn btn-accent" @click="$router.push('/nueva-venta')">+ Nueva venta</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Venta</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="venta in itemsPaginados" :key="venta.id_venta">
            <td>#V{{ venta.id_venta }}</td>
            <td>{{ venta.cliente?.nombre_cliente || 'Consumidor final' }}</td>
            <td>{{ formatearFecha(venta.fecha_venta) }}</td>
            <td>Q{{ Number(venta.total_venta).toFixed(2) }}</td>
            <td>
              <span class="badge" :class="claseEstado(venta.estado_venta)">
                {{ venta.estado_venta }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn" title="Descargar comprobante" @click="descargar(venta.id_venta)">🧾</button>
                <button class="icon-btn accent">✎</button>
                <button class="icon-btn danger">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && ventasFiltradas.length === 0">
            <td colspan="6" class="vacio">
              {{ busqueda.texto ? 'No hay ventas que coincidan con la búsqueda.' : 'No hay ventas registradas todavía.' }}
            </td>
          </tr>
        </tbody>
      </table>

      <Paginador :pagina-actual="paginaActual" :total-paginas="totalPaginas" @cambiar="irAPagina" />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import StatCard from '../components/StatCard.vue';
import Paginador from '../components/Paginador.vue';
import api from '../services/api';
import { descargarComprobante } from '../services/ventaService';
import { busqueda } from '../services/searchStore';
import { usePaginacion } from '../composables/usePaginacion';

const ventas = ref([]);
const cargando = ref(true);
const stats = reactive({ total: 0, completadas: 0, pendientes: 0, canceladas: 0 });

const ventasFiltradas = computed(() => {
  const texto = busqueda.texto.trim().toLowerCase();
  if (!texto) return ventas.value;
  return ventas.value.filter((v) =>
    (v.cliente?.nombre_cliente || 'consumidor final').toLowerCase().includes(texto)
  );
});

const { paginaActual, totalPaginas, itemsPaginados, irAPagina } = usePaginacion(ventasFiltradas, 5);

async function descargar(idVenta) {
  try {
    await descargarComprobante(idVenta);
  } catch (e) {
    // el error ya se muestra con el toast global
  }
}

function claseEstado(estado) {
  if (estado === 'completada') return 'badge-success';
  if (estado === 'cancelada') return 'badge-danger';
  return 'badge-neutral';
}

function formatearFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
}

onMounted(async () => {
  try {
    const { data } = await api.get('/ventas');
    ventas.value = data;
    stats.total = data.length;
    stats.completadas = data.filter((v) => v.estado_venta === 'completada').length;
    stats.pendientes = data.filter((v) => v.estado_venta === 'pendiente').length;
    stats.canceladas = data.filter((v) => v.estado_venta === 'cancelada').length;
  } finally {
    cargando.value = false;
  }
});

onUnmounted(() => {
  busqueda.texto = '';
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}
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
@media (max-width: 1000px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>