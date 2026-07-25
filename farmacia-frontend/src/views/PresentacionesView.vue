<template>
  <AppLayout title="Presentaciones">
    <div class="card">
      <div class="toolbar">
        <h2>Todas las presentaciones</h2>
        <button class="btn btn-accent" @click="abrirCrear">+ Agregar presentación</button>
      </div>

      <table>
        <thead>
          <tr><th>Nombre</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in itemsPaginados" :key="p.id_presentacion">
            <td class="nombre">{{ p.nombre_presentacion }}</td>
            <td>
              <span class="badge" :class="p.estado_presentacion ? 'badge-success' : 'badge-danger'">
                {{ p.estado_presentacion ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn accent" @click="abrirEditar(p)">✎</button>
                <button class="icon-btn danger" @click="eliminar(p)">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && presentacionesFiltradas.length === 0">
            <td colspan="3" class="vacio">
              {{ busqueda.texto ? 'No hay presentaciones que coincidan con la búsqueda.' : 'No hay presentaciones registradas todavía.' }}
            </td>
          </tr>
        </tbody>
      </table>

      <Paginador :pagina-actual="paginaActual" :total-paginas="totalPaginas" @cambiar="irAPagina" />
    </div>

    <PresentacionFormModal :visible="mostrarModal" :presentacion="presentacionEditar" @cerrar="mostrarModal = false" @guardado="onGuardado" />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import PresentacionFormModal from '../components/PresentacionFormModal.vue';
import Paginador from '../components/Paginador.vue';
import { listarPresentaciones, eliminarPresentacion } from '../services/presentacionService';
import { busqueda } from '../services/searchStore';
import { usePaginacion } from '../composables/usePaginacion';

const presentaciones = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const presentacionEditar = ref(null);

const presentacionesFiltradas = computed(() => {
  const texto = busqueda.texto.trim().toLowerCase();
  if (!texto) return presentaciones.value;
  return presentaciones.value.filter((p) => p.nombre_presentacion.toLowerCase().includes(texto));
});

const { paginaActual, totalPaginas, itemsPaginados, irAPagina } = usePaginacion(presentacionesFiltradas, 5);

async function cargarPresentaciones() {
  cargando.value = true;
  try {
    const { data } = await listarPresentaciones();
    presentaciones.value = data;
  } finally {
    cargando.value = false;
  }
}
function abrirCrear() { presentacionEditar.value = null; mostrarModal.value = true; }
function abrirEditar(p) { presentacionEditar.value = p; mostrarModal.value = true; }
async function onGuardado() { mostrarModal.value = false; await cargarPresentaciones(); }
async function eliminar(p) {
  if (!window.confirm(`¿Eliminar ${p.nombre_presentacion}?`)) return;
  await eliminarPresentacion(p.id_presentacion);
  await cargarPresentaciones();
}

onMounted(cargarPresentaciones);
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