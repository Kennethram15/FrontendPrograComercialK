<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cerrar')">
    <div class="modal card">
      <h3>{{ cliente ? 'Editar cliente' : 'Agregar cliente' }}</h3>
      <form @submit.prevent="guardar">
        <label>Nombre</label>
        <input v-model="form.nombre_cliente" required />

        <label>NIT</label>
        <input v-model="form.nit_cliente" placeholder="C/F" />

        <label class="checkbox">
          <input type="checkbox" v-model="form.estado_cliente" /> Activo
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
import { crearCliente, actualizarCliente } from '../services/clienteService';

const props = defineProps({
  visible: Boolean,
  cliente: { type: Object, default: null },
});
const emit = defineEmits(['cerrar', 'guardado']);

const form = reactive({ nombre_cliente: '', nit_cliente: '', estado_cliente: true });

watch(
  () => props.cliente,
  (nuevo) => {
    form.nombre_cliente = nuevo?.nombre_cliente ?? '';
    form.nit_cliente = nuevo?.nit_cliente ?? '';
    form.estado_cliente = nuevo ? !!nuevo.estado_cliente : true;
  },
  { immediate: true }
);

async function guardar() {
  if (props.cliente) {
    await actualizarCliente(props.cliente.id_cliente, form);
  } else {
    await crearCliente(form);
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
  width: 360px;
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