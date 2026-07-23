<template>
  <AppLayout title="Proveedores">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los proveedores</h2>
        <button class="btn btn-accent" @click="abrirCrear">+ Agregar proveedor</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Total adquirido</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prov in proveedores" :key="prov.id_proveedor">
            <td class="nombre">{{ prov.nombre_proveedor }}</td>
            <td>{{ prov.telefono_proveedor || '—' }}</td>
            <td>{{ prov.correo_proveedor || '—' }}</td>
            <td>Q{{ Number(prov.total_adquirido_proveedor).toFixed(2) }}</td>
            <td>
              <span class="badge" :class="prov.estado_proveedor ? 'badge-success' : 'badge-danger'">
                {{ prov.estado_proveedor ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn accent" @click="abrirEditar(prov)">✎</button>
                <button class="icon-btn danger" @click="eliminar(prov)">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && proveedores.length === 0">
            <td colspan="6" class="vacio">No hay proveedores registrados todavía.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProveedorFormModal
      :visible="mostrarModal"
      :proveedor="proveedorEditar"
      @cerrar="mostrarModal = false"
      @guardado="onGuardado"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import ProveedorFormModal from '../components/ProveedorFormModal.vue';
import { listarProveedores, eliminarProveedor } from '../services/proveedorService';

const proveedores = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const proveedorEditar = ref(null);

async function cargarProveedores() {
  cargando.value = true;
  try {
    const { data } = await listarProveedores();
    proveedores.value = data;
  } finally {
    cargando.value = false;
  }
}

function abrirCrear() {
  proveedorEditar.value = null;
  mostrarModal.value = true;
}
function abrirEditar(prov) {
  proveedorEditar.value = prov;
  mostrarModal.value = true;
}
async function onGuardado() {
  mostrarModal.value = false;
  await cargarProveedores();
}
async function eliminar(prov) {
  if (!window.confirm(`¿Eliminar a ${prov.nombre_proveedor}?`)) return;
  await eliminarProveedor(prov.id_proveedor);
  await cargarProveedores();
}

onMounted(cargarProveedores);
</script>

<style scoped>
.toolbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px; }
.toolbar h2 { font-size: 15px; margin: 0; color: var(--text-muted); font-weight: 600; }
.nombre { font-weight: 600; }
.acciones { display: flex; gap: 8px; }
.vacio { text-align: center; color: var(--text-muted); padding: 32px; }
</style>