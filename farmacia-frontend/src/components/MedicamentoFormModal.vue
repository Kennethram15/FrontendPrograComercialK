<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cerrar')">
    <div class="modal card">
      <h3>{{ medicamento ? 'Editar medicamento' : 'Agregar medicamento' }}</h3>
      <form @submit.prevent="guardar">
        <label>Nombre</label>
        <input v-model="form.nombre_medicamento" required />

        <label>Código de barras</label>
        <input v-model="form.codigo_barras" />

        <label>Presentación</label>
        <select v-model.number="form.id_presentacion" required>
          <option disabled value="">Selecciona una</option>
          <option v-for="p in presentaciones" :key="p.id_presentacion" :value="p.id_presentacion">
            {{ p.nombre_presentacion }}
          </option>
        </select>

        <label>Componente activo</label>
        <input v-model="form.componente_activo" />

        <div class="fila">
          <div>
            <label>Cantidad por paquete</label>
            <input v-model.number="form.cantidad_por_paquete" type="number" min="1" required />
          </div>
          <div>
            <label>Existencia total</label>
            <input v-model.number="form.existencia_total_medicamento" type="number" min="0" required />
          </div>
        </div>

        <div class="fila-3">
          <div>
            <label>Precio mayorista</label>
            <input v-model.number="form.precio_mayorista" type="number" step="0.01" min="0" required />
          </div>
          <div>
            <label>Precio mínimo</label>
            <input v-model.number="form.precio_minimo" type="number" step="0.01" min="0" required />
          </div>
          <div>
            <label>Precio de venta</label>
            <input v-model.number="form.precio_venta" type="number" step="0.01" min="0" required />
          </div>
        </div>

        <label class="checkbox">
          <input type="checkbox" v-model="form.venta_libre" /> Venta libre
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="form.estado_medicamento" /> Activo
        </label>

        <div class="acciones-modal">
          <button type="button" class="btn btn-ghost" @click="$emit('cerrar')">Cancelar</button>
          <button type="submit" class="btn btn-accent">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import { crearMedicamento, actualizarMedicamento, listarPresentacionesActivas } from '../services/medicamentoService';

const props = defineProps({
  visible: Boolean,
  medicamento: { type: Object, default: null },
});
const emit = defineEmits(['cerrar', 'guardado']);

const presentaciones = ref([]);

const form = reactive({
  nombre_medicamento: '',
  codigo_barras: '',
  id_presentacion: '',
  componente_activo: '',
  cantidad_por_paquete: 1,
  existencia_total_medicamento: 0,
  precio_mayorista: 0,
  precio_minimo: 0,
  precio_venta: 0,
  venta_libre: true,
  estado_medicamento: true,
});

watch(
  () => props.medicamento,
  (nuevo) => {
    form.nombre_medicamento = nuevo?.nombre_medicamento ?? '';
    form.codigo_barras = nuevo?.codigo_barras ?? '';
    form.id_presentacion = nuevo?.id_presentacion ?? '';
    form.componente_activo = nuevo?.componente_activo ?? '';
    form.cantidad_por_paquete = nuevo?.cantidad_por_paquete ?? 1;
    form.existencia_total_medicamento = nuevo?.existencia_total_medicamento ?? 0;
    form.precio_mayorista = Number(nuevo?.precio_mayorista ?? 0);
    form.precio_minimo = Number(nuevo?.precio_minimo ?? 0);
    form.precio_venta = Number(nuevo?.precio_venta ?? 0);
    form.venta_libre = nuevo ? !!nuevo.venta_libre : true;
    form.estado_medicamento = nuevo ? !!nuevo.estado_medicamento : true;
  },
  { immediate: true }
);

onMounted(async () => {
  const { data } = await listarPresentacionesActivas();
  presentaciones.value = data;
});

async function guardar() {
  if (props.medicamento) {
    await actualizarMedicamento(props.medicamento.id_medicamento, form);
  } else {
    await crearMedicamento(form);
  }
  emit('guardado');
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal {
  width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
}
.modal h3 {
  margin: 0 0 18px;
  font-size: 16px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
label {
  font-size: 12.5px;
  color: var(--text-muted);
  font-weight: 600;
}
.fila {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.fila-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  display: flex;
}
.acciones-modal {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}
</style>