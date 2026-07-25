<template>
  <AppLayout title="Reportes" :mostrar-buscador="false">
    <div class="card filtro">
      <div>
        <label>Desde</label>
        <input v-model="fechaInicio" type="date" />
      </div>
      <div>
        <label>Hasta</label>
        <input v-model="fechaFin" type="date" />
      </div>
      <button class="btn btn-accent" @click="generarReporte" :disabled="cargando">
        {{ cargando ? 'Generando...' : 'Generar reporte' }}
      </button>
    </div>
    

    <div v-if="generado" class="acciones-reporte">
  <button class="btn btn-ghost" @click="descargarPdf">📄 Descargar en PDF</button>
</div>

<div v-if="generado" class="resumen-grid">
      <div class="card resumen">
        <p class="label">Ventas en el período</p>
        <p class="valor">{{ resumen.cantidadVentas }}</p>
      </div>
      <div class="card resumen">
        <p class="label">Total vendido</p>
        <p class="valor">Q{{ resumen.totalPeriodo.toFixed(2) }}</p>
      </div>
    </div>

    <div v-if="generado" class="card">
      <div class="toolbar"><h2>Medicamentos más vendidos</h2></div>
      <table>
        <thead>
          <tr><th>Medicamento</th><th>Cantidad vendida</th><th>Ingresos</th></tr>
        </thead>
        <tbody>
          <tr v-for="m in masVendidos" :key="m.id_medicamento">
            <td>{{ m.medicamento?.nombre_medicamento || '—' }}</td>
            <td>{{ m.total_cantidad }}</td>
            <td>Q{{ Number(m.total_ingresos).toFixed(2) }}</td>
          </tr>
          <tr v-if="masVendidos.length === 0">
            <td colspan="3" class="vacio">No hay ventas en ese período.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import { obtenerVentasPorPeriodo, obtenerMedicamentosMasVendidos, descargarReportePdf } from '../services/reporteService';

const hoy = new Date().toISOString().slice(0, 10);
const fechaInicio = ref(hoy);
const fechaFin = ref(hoy);
const cargando = ref(false);
const generado = ref(false);

const resumen = reactive({ cantidadVentas: 0, totalPeriodo: 0 });
const masVendidos = ref([]);

async function generarReporte() {
  cargando.value = true;
  try {
    const [resVentas, resMasVendidos] = await Promise.all([
      obtenerVentasPorPeriodo(fechaInicio.value, fechaFin.value),
      obtenerMedicamentosMasVendidos(fechaInicio.value, fechaFin.value),
    ]);
    resumen.cantidadVentas = resVentas.data.cantidadVentas;
    resumen.totalPeriodo = resVentas.data.totalPeriodo;
    masVendidos.value = resMasVendidos.data;
    generado.value = true;
  } catch (error) {
    console.error('Error al generar el reporte', error);
  } finally {
    cargando.value = false;
  }
}
async function descargarPdf() {
  await descargarReportePdf(fechaInicio.value, fechaFin.value);
}
</script>

<style scoped>
.acciones-reporte {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.filtro {
  padding: 20px 22px;
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 20px;
}
.filtro label {
  font-size: 12.5px;
  color: var(--text-muted);
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}
.resumen-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 20px;
}
.resumen {
  padding: 18px 20px;
}
.label {
  margin: 0 0 6px;
  color: var(--text-muted);
  font-size: 13px;
}
.valor {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
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
</style>