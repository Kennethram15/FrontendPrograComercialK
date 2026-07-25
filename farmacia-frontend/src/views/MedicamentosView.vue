<template>
  <AppLayout title="Medicamentos">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los medicamentos</h2>
        <button class="btn btn-accent" @click="abrirCrear">+ Agregar medicamento</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Presentación</th>
            <th>Precio de venta</th>
            <th>Existencia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="med in itemsPaginados" :key="med.id_medicamento">
            <td>
              <div class="nombre">{{ med.nombre_medicamento }}</div>
              <div class="subtexto">{{ med.codigo_barras || 'Sin código' }}</div>
            </td>
            <td>{{ med.presentacion?.nombre_presentacion || '—' }}</td>
            <td>Q{{ Number(med.precio_venta).toFixed(2) }}</td>
            <td>{{ med.existencia_total_medicamento }} unidades</td>
            <td>
              <span class="badge" :class="med.estado_medicamento ? 'badge-success' : 'badge-danger'">
                {{ med.estado_medicamento ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn accent" @click="abrirEditar(med)">✎</button>
                <button class="icon-btn danger" @click="eliminar(med)">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && medicamentosFiltrados.length === 0">
            <td colspan="6" class="vacio">
              {{ busqueda.texto ? 'No hay medicamentos que coincidan con la búsqueda.' : 'No hay medicamentos registrados todavía.' }}
            </td>
          </tr>
        </tbody>
      </table>

      <Paginador :pagina-actual="paginaActual" :total-paginas="totalPaginas" @cambiar="irAPagina" />
    </div>

    <MedicamentoFormModal
      :visible="mostrarModal"
      :medicamento="medicamentoEditar"
      @cerrar="mostrarModal = false"
      @guardado="onGuardado"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import MedicamentoFormModal from '../components/MedicamentoFormModal.vue';
import Paginador from '../components/Paginador.vue';
import { listarMedicamentos, eliminarMedicamento } from '../services/medicamentoService';
import { busqueda } from '../services/searchStore';
import { usePaginacion } from '../composables/usePaginacion';

const medicamentos = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const medicamentoEditar = ref(null);

const medicamentosFiltrados = computed(() => {
  const texto = busqueda.texto.trim().toLowerCase();
  if (!texto) return medicamentos.value;
  return medicamentos.value.filter((m) => m.nombre_medicamento.toLowerCase().includes(texto));
});

const { paginaActual, totalPaginas, itemsPaginados, irAPagina } = usePaginacion(medicamentosFiltrados, 5);

async function cargarMedicamentos() {
  cargando.value = true;
  try {
    const { data } = await listarMedicamentos();
    medicamentos.value = data;
  } finally {
    cargando.value = false;
  }
}

function abrirCrear() {
  medicamentoEditar.value = null;
  mostrarModal.value = true;
}
function abrirEditar(med) {
  medicamentoEditar.value = med;
  mostrarModal.value = true;
}
async function onGuardado() {
  mostrarModal.value = false;
  await cargarMedicamentos();
}
async function eliminar(med) {
  if (!window.confirm(`¿Eliminar ${med.nombre_medicamento}?`)) return;
  await eliminarMedicamento(med.id_medicamento);
  await cargarMedicamentos();
}

onMounted(cargarMedicamentos);
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
.subtexto {
  color: var(--text-muted);
  font-size: 12.5px;
  margin-top: 2px;
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