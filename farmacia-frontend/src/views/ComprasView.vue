<template>
  <AppLayout title="Compras">
    <div class="card">
      <div class="toolbar">
        <h2>Todas las compras</h2>
        <button class="btn btn-accent" @click="$router.push('/nueva-compra')">+ Nueva compra</button>
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
          <tr v-for="compra in itemsPaginados" :key="compra.id_compra">
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
          <tr v-if="!cargando && comprasFiltradas.length === 0">
            <td colspan="6" class="vacio">
              {{ busqueda.texto ? 'No hay compras que coincidan con la búsqueda.' : 'No hay compras registradas todavía.' }}
            </td>
          </tr>
        </tbody>
      </table>

      <Paginador :pagina-actual="paginaActual" :total-paginas="totalPaginas" @cambiar="irAPagina" />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import Paginador from '../components/Paginador.vue';
import api from '../services/api';
import { busqueda } from '../services/searchStore';
import { usePaginacion } from '../composables/usePaginacion';

const compras = ref([]);
const cargando = ref(true);

const comprasFiltradas = computed(() => {
  const texto = busqueda.texto.trim().toLowerCase();
  if (!texto) return compras.value;
  return compras.value.filter((c) => (c.proveedor?.nombre_proveedor || '').toLowerCase().includes(texto));
});

const { paginaActual, totalPaginas, itemsPaginados, irAPagina } = usePaginacion(comprasFiltradas, 5);

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
  } finally {
    cargando.value = false;
  }
});

onUnmounted(() => {
  busqueda.texto = '';
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