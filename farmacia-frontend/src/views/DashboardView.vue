<template>
  <AppLayout title="Panel" :mostrar-buscador="false">
    <div class="grid">
      <StatCard label="Medicamentos" :value="counts.medicamentos" icon="💊" />
      <StatCard
        label="Ventas del mes"
        :value="counts.ventas"
        icon="🧾"
        icon-bg="var(--success-soft)"
        icon-color="var(--success)"
      />
      <StatCard label="Proveedores" :value="counts.proveedores" icon="🚚" />
      <StatCard
        label="Clientes"
        :value="counts.clientes"
        icon="🧑"
        icon-bg="var(--danger-soft)"
        icon-color="var(--danger)"
      />
    </div>

    <div class="alertas-grid">
      <div class="card">
        <div class="toolbar"><h2>⚠️ Stock bajo (≤ 20 unidades)</h2></div>
        <table>
          <thead>
            <tr><th>Medicamento</th><th>Existencia</th></tr>
          </thead>
          <tbody>
            <tr v-for="m in alertas.stockBajo" :key="m.id_medicamento">
              <td>{{ m.nombre_medicamento }}</td>
              <td>{{ m.existencia_total_medicamento }}</td>
            </tr>
            <tr v-if="!cargandoAlertas && alertas.stockBajo.length === 0">
              <td colspan="2" class="vacio">Sin medicamentos con stock bajo.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="toolbar"><h2>⏳ Lotes por vencer (30 días)</h2></div>
        <table>
          <thead>
            <tr><th>Medicamento</th><th>Vence</th><th>Existencia</th></tr>
          </thead>
          <tbody>
            <tr v-for="l in alertas.lotesPorVencer" :key="l.id_lote">
              <td>{{ l.medicamento?.nombre_medicamento || '—' }}</td>
              <td>{{ formatearFecha(l.fecha_vencimiento) }}</td>
              <td>{{ l.existencia_lote }}</td>
            </tr>
            <tr v-if="!cargandoAlertas && alertas.lotesPorVencer.length === 0">
              <td colspan="3" class="vacio">Sin lotes por vencer.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import StatCard from '../components/StatCard.vue';
import api from '../services/api';
import { obtenerAlertas } from '../services/reporteService';

const counts = reactive({ medicamentos: 0, ventas: 0, proveedores: 0, clientes: 0 });
const alertas = reactive({ stockBajo: [], lotesPorVencer: [] });
const cargandoAlertas = ref(true);

function formatearFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function cargarConteo(recurso, clave) {
  try {
    const { data } = await api.get(`/${recurso}`);
    counts[clave] = Array.isArray(data) ? data.length : 0;
  } catch {
    counts[clave] = 0;
  }
}

async function cargarAlertas() {
  cargandoAlertas.value = true;
  try {
    const { data } = await obtenerAlertas();
    alertas.stockBajo = data.stockBajo;
    alertas.lotesPorVencer = data.lotesPorVencer;
  } catch (error) {
    console.error('Error al cargar alertas', error);
  } finally {
    cargandoAlertas.value = false;
  }
}

onMounted(() => {
  cargarConteo('medicamentos', 'medicamentos');
  cargarConteo('ventas', 'ventas');
  cargarConteo('proveedores', 'proveedores');
  cargarConteo('clientes', 'clientes');
  cargarAlertas();
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}
.alertas-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.toolbar {
  padding: 18px 20px;
}
.toolbar h2 {
  font-size: 14px;
  margin: 0;
  color: var(--text-muted);
  font-weight: 600;
}
.vacio {
  text-align: center;
  color: var(--text-muted);
  padding: 24px;
}
@media (max-width: 1000px) {
  .grid,
  .alertas-grid {
    grid-template-columns: 1fr;
  }
}
</style>