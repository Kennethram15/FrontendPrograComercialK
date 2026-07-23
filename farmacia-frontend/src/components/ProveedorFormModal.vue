<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cerrar')">
    <div class="modal card">
      <h3>{{ proveedor ? 'Editar proveedor' : 'Agregar proveedor' }}</h3>
      <form @submit.prevent="guardar">
        <label>Casa médica</label>
        <select v-model.number="form.id_casa_medica" required>
          <option disabled value="">Selecciona una</option>
          <option v-for="cm in casasMedicas" :key="cm.id_casa_medica" :value="cm.id_casa_medica">
            {{ cm.nombre_casa_medica }}
          </option>
        </select>

        <label>Nombre</label>
        <input v-model="form.nombre_proveedor" required />

        <label>Teléfono</label>
        <input v-model="form.telefono_proveedor" />

        <label>Correo</label>
        <input v-model="form.correo_proveedor" type="email" />

        <label>Dirección</label>
        <input v-model="form.direccion_proveedor" />

        <label class="checkbox">
          <input type="checkbox" v-model="form.estado_proveedor" /> Activo
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
import { crearProveedor, actualizarProveedor, listarCasasMedicas } from '../services/proveedorService';

const props = defineProps({
  visible: Boolean,
  proveedor: { type: Object, default: null },
});
const emit = defineEmits(['cerrar', 'guardado']);

const casasMedicas = ref([]);

const form = reactive({
  id_casa_medica: '',
  nombre_proveedor: '',
  telefono_proveedor: '',
  correo_proveedor: '',
  direccion_proveedor: '',
  estado_proveedor: true,
});

watch(
  () => props.proveedor,
  (nuevo) => {
    form.id_casa_medica = nuevo?.id_casa_medica ?? '';
    form.nombre_proveedor = nuevo?.nombre_proveedor ?? '';
    form.telefono_proveedor = nuevo?.telefono_proveedor ?? '';
    form.correo_proveedor = nuevo?.correo_proveedor ?? '';
    form.direccion_proveedor = nuevo?.direccion_proveedor ?? '';
    form.estado_proveedor = nuevo ? !!nuevo.estado_proveedor : true;
  },
  { immediate: true }
);

onMounted(async () => {
  const { data } = await listarCasasMedicas();
  casasMedicas.value = data;
});

async function guardar() {
  if (props.proveedor) {
    await actualizarProveedor(props.proveedor.id_proveedor, form);
  } else {
    await crearProveedor(form);
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
  width: 380px;
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