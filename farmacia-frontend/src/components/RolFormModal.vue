<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cerrar')">
    <div class="modal card">
      <h3>{{ rol ? 'Editar rol' : 'Agregar rol' }}</h3>
      <form @submit.prevent="guardar">
        <label>Nombre del rol</label>
        <input v-model="form.nombre_rol" required />

        <label class="checkbox">
          <input type="checkbox" v-model="form.estado_rol" /> Activo
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
import { crearRol, actualizarRol } from '../services/rolService';

const props = defineProps({ visible: Boolean, rol: { type: Object, default: null } });
const emit = defineEmits(['cerrar', 'guardado']);

const form = reactive({ nombre_rol: '', estado_rol: true });

watch(
  () => props.rol,
  (nuevo) => {
    form.nombre_rol = nuevo?.nombre_rol ?? '';
    form.estado_rol = nuevo ? !!nuevo.estado_rol : true;
  },
  { immediate: true }
);

async function guardar() {
  if (props.rol) {
    await actualizarRol(props.rol.id_rol, form);
  } else {
    await crearRol(form);
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