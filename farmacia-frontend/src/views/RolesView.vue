<template>
  <AppLayout title="Roles">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los roles</h2>
        <button class="btn btn-accent" @click="abrirCrear">+ Agregar rol</button>
      </div>

      <table>
        <thead>
          <tr><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr v-for="rol in itemsPaginados" :key="rol.id_rol">
            <td class="nombre">{{ rol.nombre_rol }}</td>
            <td>
              <span class="badge" :class="rol.estado_rol ? 'badge-success' : 'badge-danger'">
                {{ rol.estado_rol ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn accent" @click="abrirEditar(rol)">✎</button>
                <button class="icon-btn danger" @click="eliminar(rol)">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && rolesFiltrados.length === 0">
            <td colspan="3" class="vacio">
              {{ busqueda.texto ? 'No hay roles que coincidan con la búsqueda.' : 'No hay roles registrados todavía.' }}
            </td>
          </tr>
        </tbody>
      </table>

      <Paginador :pagina-actual="paginaActual" :total-paginas="totalPaginas" @cambiar="irAPagina" />
    </div>

    <RolFormModal :visible="mostrarModal" :rol="rolEditar" @cerrar="mostrarModal = false" @guardado="onGuardado" />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import RolFormModal from '../components/RolFormModal.vue';
import Paginador from '../components/Paginador.vue';
import { listarRoles, eliminarRol } from '../services/rolService';
import { busqueda } from '../services/searchStore';
import { usePaginacion } from '../composables/usePaginacion';

const roles = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const rolEditar = ref(null);

const rolesFiltrados = computed(() => {
  const texto = busqueda.texto.trim().toLowerCase();
  if (!texto) return roles.value;
  return roles.value.filter((r) => r.nombre_rol.toLowerCase().includes(texto));
});

const { paginaActual, totalPaginas, itemsPaginados, irAPagina } = usePaginacion(rolesFiltrados, 5);

async function cargarRoles() {
  cargando.value = true;
  try {
    const { data } = await listarRoles();
    roles.value = data;
  } finally {
    cargando.value = false;
  }
}
function abrirCrear() { rolEditar.value = null; mostrarModal.value = true; }
function abrirEditar(rol) { rolEditar.value = rol; mostrarModal.value = true; }
async function onGuardado() { mostrarModal.value = false; await cargarRoles(); }
async function eliminar(rol) {
  if (!window.confirm(`¿Eliminar el rol ${rol.nombre_rol}?`)) return;
  await eliminarRol(rol.id_rol);
  await cargarRoles();
}

onMounted(cargarRoles);
onUnmounted(() => {
  busqueda.texto = '';
});
</script>

<style scoped>
.toolbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px; }
.toolbar h2 { font-size: 15px; margin: 0; color: var(--text-muted); font-weight: 600; }
.nombre { font-weight: 600; }
.acciones { display: flex; gap: 8px; }
.vacio { text-align: center; color: var(--text-muted); padding: 32px; }
</style>