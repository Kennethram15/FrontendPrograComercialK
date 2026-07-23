<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cerrar')">
    <div class="modal card">
      <h3>{{ presentacion ? 'Editar presentación' : 'Agregar presentación' }}</h3>
      <form @submit.prevent="guardar">
        <label>Nombre</label>
        <input v-model="form.nombre_presentacion" required />

        <label class="checkbox">
          <input type="checkbox" v-model="form.estado_presentacion" /> Activo
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
import { reactive, watch } from 'vue';
import { crearPresentacion, actualizarPresentacion } from '../services/presentacionService';

const props = defineProps({ visible: Boolean, presentacion: { type: Object, default: null } });
const emit = defineEmits(['cerrar', 'guardado']);

const form = reactive({ nombre_presentacion: '', estado_presentacion: true });

watch(
  () => props.presentacion,
  (nuevo) => {
    form.nombre_presentacion = nuevo?.nombre_presentacion ?? '';
    form.estado_presentacion = nuevo ? !!nuevo.estado_presentacion : true;
  },
  { immediate: true }
);

async function guardar() {
  if (props.presentacion) {
    await actualizarPresentacion(props.presentacion.id_presentacion, form);
  } else {
    await crearPresentacion(form);
  }
  emit('guardado');
}
</script>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { width: 340px; padding: 24px; }
.modal h3 { margin: 0 0 18px; font-size: 16px; }
form { display: flex; flex-direction: column; gap: 12px; }
label { font-size: 12.5px; color: var(--text-muted); font-weight: 600; }
.checkbox { flex-direction: row; align-items: center; gap: 8px; display: flex; }
.acciones-modal { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
</style>