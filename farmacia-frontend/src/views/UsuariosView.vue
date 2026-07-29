<template>
  <AppLayout title="Usuarios">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los usuarios</h2>
        <button class="btn btn-accent" @click="abrirCrear">+ Agregar usuario</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in itemsPaginados" :key="u.id_usuarios">
            <td class="nombre">{{ u.nombre_usuario }}</td>
            <td>{{ u.usuario }}</td>
            <td>{{ u.rol?.nombre_rol || '—' }}</td>
            <td>
              <span class="badge" :class="u.estado_usuario ? 'badge-success' : 'badge-danger'">
                {{ u.estado_usuario ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn accent" @click="abrirEditar(u)">✎</button>
                <button class="icon-btn danger" @click="eliminar(u)">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && usuariosFiltrados.length === 0">
            <td colspan="5" class="vacio">
              {{ busqueda.texto ? 'No hay usuarios que coincidan con la búsqueda.' : 'No hay usuarios registrados todavía.' }}
            </td>
          </tr>
        </tbody>
      </table>

      <Paginador :pagina-actual="paginaActual" :total-paginas="totalPaginas" @cambiar="irAPagina" />
    </div>

    <UsuarioFormModal
      :visible="mostrarModal"
      :usuario="usuarioEditar"
      @cerrar="mostrarModal = false"
      @guardado="onGuardado"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import UsuarioFormModal from '../components/UsuarioFormModal.vue';
import Paginador from '../components/Paginador.vue';
import { listarUsuarios, eliminarUsuario } from '../services/usuarioService';
import { busqueda } from '../services/searchStore';
import { usePaginacion } from '../composables/usePaginacion';

const usuarios = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const usuarioEditar = ref(null);

const usuariosFiltrados = computed(() => {
  const texto = busqueda.texto.trim().toLowerCase();
  if (!texto) return usuarios.value;
  return usuarios.value.filter(
    (u) =>
      u.nombre_usuario.toLowerCase().includes(texto) ||
      u.usuario.toLowerCase().includes(texto)
  );
});

const { paginaActual, totalPaginas, itemsPaginados, irAPagina } = usePaginacion(usuariosFiltrados, 5);

async function cargarUsuarios() {
  cargando.value = true;
  try {
    const { data } = await listarUsuarios();
    usuarios.value = data;
  } finally {
    cargando.value = false;
  }
}

function abrirCrear() {
  usuarioEditar.value = null;
  mostrarModal.value = true;
}
function abrirEditar(u) {
  usuarioEditar.value = u;
  mostrarModal.value = true;
}
async function onGuardado() {
  mostrarModal.value = false;
  await cargarUsuarios();
}
async function eliminar(u) {
  if (!window.confirm(`¿Eliminar al usuario ${u.nombre_usuario}?`)) return;
  await eliminarUsuario(u.id_usuarios);
  await cargarUsuarios();
}

onMounted(cargarUsuarios);
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