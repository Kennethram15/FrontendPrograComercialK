<template>
  <AppLayout title="Clientes">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los clientes</h2>
        <button class="btn btn-accent" @click="abrirCrear">+ Agregar cliente</button>
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
                <button class="icon-btn accent" @click="abrirEditar(cli)">✎</button>
                <button class="icon-btn danger" @click="eliminar(cli)">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && clientes.length === 0">
            <td colspan="4" class="vacio">No hay clientes registrados todavía.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ClienteFormModal
      :visible="mostrarModal"
      :cliente="clienteEditar"
      @cerrar="cerrarModal"
      @guardado="onGuardado"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import ClienteFormModal from '../components/ClienteFormModal.vue';
import { listarClientes, eliminarCliente } from '../services/clienteService';

const clientes = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const clienteEditar = ref(null);

async function cargarClientes() {
  cargando.value = true;
  try {
    const { data } = await listarClientes();
    clientes.value = data;
  } catch (error) {
    console.error('Error al cargar clientes', error);
  } finally {
    cargando.value = false;
  }
}

function abrirCrear() {
  clienteEditar.value = null;
  mostrarModal.value = true;
}

function abrirEditar(cliente) {
  clienteEditar.value = cliente;
  mostrarModal.value = true;
}

function cerrarModal() {
  mostrarModal.value = false;
}

async function onGuardado() {
  mostrarModal.value = false;
  await cargarClientes();
}

async function eliminar(cliente) {
  const confirmar = window.confirm(`¿Eliminar a ${cliente.nombre_cliente}?`);
  if (!confirmar) return;
  await eliminarCliente(cliente.id_cliente);
  await cargarClientes();
}

onMounted(cargarClientes);
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