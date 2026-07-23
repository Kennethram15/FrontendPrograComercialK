<template>
  <AppLayout title="Métodos de pago">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los métodos de pago</h2>
        <button class="btn btn-accent" @click="abrirCrear">+ Agregar método</button>
      </div>

      <table>
        <thead>
          <tr><th>Nombre</th><th>Cuenta</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr v-for="m in metodos" :key="m.id_metodo_pago">
            <td class="nombre">{{ m.nombre_metodo_pago }}</td>
            <td>{{ m.cuenta_metodo_pago || '—' }}</td>
            <td>
              <span class="badge" :class="m.estado_metodo_pago ? 'badge-success' : 'badge-danger'">
                {{ m.estado_metodo_pago ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn accent" @click="abrirEditar(m)">✎</button>
                <button class="icon-btn danger" @click="eliminar(m)">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && metodos.length === 0">
            <td colspan="4" class="vacio">No hay métodos de pago registrados todavía.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <MetodoPagoFormModal :visible="mostrarModal" :metodo="metodoEditar" @cerrar="mostrarModal = false" @guardado="onGuardado" />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import MetodoPagoFormModal from '../components/MetodoPagoFormModal.vue';
import { listarMetodosPago, eliminarMetodoPago } from '../services/metodoPagoService';

const metodos = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const metodoEditar = ref(null);

async function cargarMetodos() {
  cargando.value = true;
  try {
    const { data } = await listarMetodosPago();
    metodos.value = data;
  } finally {
    cargando.value = false;
  }
}
function abrirCrear() { metodoEditar.value = null; mostrarModal.value = true; }
function abrirEditar(m) { metodoEditar.value = m; mostrarModal.value = true; }
async function onGuardado() { mostrarModal.value = false; await cargarMetodos(); }
async function eliminar(m) {
  if (!window.confirm(`¿Eliminar ${m.nombre_metodo_pago}?`)) return;
  await eliminarMetodoPago(m.id_metodo_pago);
  await cargarMetodos();
}

onMounted(cargarMetodos);
</script>

<style scoped>
.toolbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px; }
.toolbar h2 { font-size: 15px; margin: 0; color: var(--text-muted); font-weight: 600; }
.nombre { font-weight: 600; }
.acciones { display: flex; gap: 8px; }
.vacio { text-align: center; color: var(--text-muted); padding: 32px; }
</style>