<template>
  <AppLayout title="Lotes">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los lotes</h2>
        <button class="btn btn-accent" @click="abrirCrear">+ Agregar lote</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Vencimiento</th>
            <th>Existencia</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lote in lotes" :key="lote.id_lote">
            <td class="nombre">{{ lote.medicamento?.nombre_medicamento || '—' }}</td>
            <td>{{ formatearFecha(lote.fecha_vencimiento) }}</td>
            <td>{{ lote.existencia_lote }} unidades</td>
            <td>Q{{ Number(lote.precio_lote).toFixed(2) }}</td>
            <td>
              <span class="badge" :class="lote.estado_lote ? 'badge-success' : 'badge-danger'">
                {{ lote.estado_lote ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn accent" @click="abrirEditar(lote)">✎</button>
                <button class="icon-btn danger" @click="eliminar(lote)">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && lotes.length === 0">
            <td colspan="6" class="vacio">No hay lotes registrados todavía.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <LoteFormModal
      :visible="mostrarModal"
      :lote="loteEditar"
      @cerrar="mostrarModal = false"
      @guardado="onGuardado"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import LoteFormModal from '../components/LoteFormModal.vue';
import { listarLotes, eliminarLote } from '../services/loteService';

const lotes = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const loteEditar = ref(null);

function formatearFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function cargarLotes() {
  cargando.value = true;
  try {
    const { data } = await listarLotes();
    lotes.value = data;
  } finally {
    cargando.value = false;
  }
}

function abrirCrear() {
  loteEditar.value = null;
  mostrarModal.value = true;
}
function abrirEditar(lote) {
  loteEditar.value = lote;
  mostrarModal.value = true;
}
async function onGuardado() {
  mostrarModal.value = false;
  await cargarLotes();
}
async function eliminar(lote) {
  if (!window.confirm(`¿Eliminar este lote de ${lote.medicamento?.nombre_medicamento}?`)) return;
  await eliminarLote(lote.id_lote);
  await cargarLotes();
}

onMounted(cargarLotes);
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