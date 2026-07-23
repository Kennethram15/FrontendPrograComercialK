<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cerrar')">
    <div class="modal card">
      <h3>{{ lote ? 'Editar lote' : 'Agregar lote' }}</h3>
      <form @submit.prevent="guardar">
        <label>Medicamento</label>
        <select v-model.number="form.id_medicamento" required>
          <option disabled value="">Selecciona uno</option>
          <option v-for="m in medicamentos" :key="m.id_medicamento" :value="m.id_medicamento">
            {{ m.nombre_medicamento }}
          </option>
        </select>

        <div class="fila">
          <div>
            <label>Fecha de producción</label>
            <input v-model="form.fecha_produccion" type="date" />
          </div>
          <div>
            <label>Fecha de vencimiento</label>
            <input v-model="form.fecha_vencimiento" type="date" required />
          </div>
        </div>

        <div class="fila">
          <div>
            <label>Existencia del lote</label>
            <input v-model.number="form.existencia_lote" type="number" min="0" required />
          </div>
          <div>
            <label>Precio del lote</label>
            <input v-model.number="form.precio_lote" type="number" step="0.01" min="0" required />
          </div>
        </div>

        <label class="checkbox">
          <input type="checkbox" v-model="form.estado_lote" /> Activo
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
import { crearLote, actualizarLote, listarMedicamentosActivos } from '../services/loteService';

const props = defineProps({
  visible: Boolean,
  lote: { type: Object, default: null },
});
const emit = defineEmits(['cerrar', 'guardado']);

const medicamentos = ref([]);

const form = reactive({
  id_medicamento: '',
  fecha_produccion: '',
  fecha_vencimiento: '',
  existencia_lote: 0,
  precio_lote: 0,
  estado_lote: true,
});

function formatearFecha(fecha) {
  if (!fecha) return '';
  return new Date(fecha).toISOString().slice(0, 10);
}

watch(
  () => props.lote,
  (nuevo) => {
    form.id_medicamento = nuevo?.id_medicamento ?? '';
    form.fecha_produccion = formatearFecha(nuevo?.fecha_produccion);
    form.fecha_vencimiento = formatearFecha(nuevo?.fecha_vencimiento);
    form.existencia_lote = nuevo?.existencia_lote ?? 0;
    form.precio_lote = Number(nuevo?.precio_lote ?? 0);
    form.estado_lote = nuevo ? !!nuevo.estado_lote : true;
  },
  { immediate: true }
);

onMounted(async () => {
  const { data } = await listarMedicamentosActivos();
  medicamentos.value = data;
});

async function guardar() {
  if (props.lote) {
    await actualizarLote(props.lote.id_lote, form);
  } else {
    await crearLote(form);
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
  width: 400px;
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