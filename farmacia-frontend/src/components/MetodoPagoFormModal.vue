<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cerrar')">
    <div class="modal card">
      <h3>{{ metodo ? 'Editar método de pago' : 'Agregar método de pago' }}</h3>
      <form @submit.prevent="guardar">
        <label>Nombre</label>
        <input v-model="form.nombre_metodo_pago" required />

        <label>Cuenta (opcional)</label>
        <input v-model="form.cuenta_metodo_pago" />

        <label class="checkbox">
          <input type="checkbox" v-model="form.estado_metodo_pago" /> Activo
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
import { crearMetodoPago, actualizarMetodoPago } from '../services/metodoPagoService';

const props = defineProps({ visible: Boolean, metodo: { type: Object, default: null } });
const emit = defineEmits(['cerrar', 'guardado']);

const form = reactive({ nombre_metodo_pago: '', cuenta_metodo_pago: '', estado_metodo_pago: true });

watch(
  () => props.metodo,
  (nuevo) => {
    form.nombre_metodo_pago = nuevo?.nombre_metodo_pago ?? '';
    form.cuenta_metodo_pago = nuevo?.cuenta_metodo_pago ?? '';
    form.estado_metodo_pago = nuevo ? !!nuevo.estado_metodo_pago : true;
  },
  { immediate: true }
);

async function guardar() {
  if (props.metodo) {
    await actualizarMetodoPago(props.metodo.id_metodo_pago, form);
  } else {
    await crearMetodoPago(form);
  }
  emit('guardado');
}
</script>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { width: 360px; padding: 24px; }
.modal h3 { margin: 0 0 18px; font-size: 16px; }
form { display: flex; flex-direction: column; gap: 12px; }
label { font-size: 12.5px; color: var(--text-muted); font-weight: 600; }
.checkbox { flex-direction: row; align-items: center; gap: 8px; display: flex; }
.acciones-modal { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
</style>