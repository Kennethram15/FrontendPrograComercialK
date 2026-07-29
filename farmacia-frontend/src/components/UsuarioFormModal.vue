<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cerrar')">
    <div class="modal card">
      <h3>{{ usuario ? 'Editar usuario' : 'Agregar usuario' }}</h3>
      <form @submit.prevent="guardar">
        <label>Nombre completo</label>
        <input v-model="form.nombre_usuario" required />

        <label>Usuario (para iniciar sesión)</label>
        <input v-model="form.usuario" required />

        <label>{{ usuario ? 'Nueva contraseña (dejar en blanco para no cambiarla)' : 'Contraseña' }}</label>
        <input v-model="form.password" type="password" :required="!usuario" />

        <label>Rol</label>
        <select v-model.number="form.id_rol" required>
          <option disabled value="">Selecciona uno</option>
          <option v-for="r in roles" :key="r.id_rol" :value="r.id_rol">
            {{ r.nombre_rol }}
          </option>
        </select>

        <div class="fila">
          <div class="campo">
            <label>Teléfono</label>
            <input v-model="form.telefono_usuario" />
          </div>
          <div class="campo">
            <label>DPI</label>
            <input v-model="form.dpi_usuario" />
          </div>
        </div>

        <label>Correo</label>
        <input v-model="form.correo_usuario" type="email" />

        <label class="checkbox">
          <input type="checkbox" v-model="form.estado_usuario" /> Activo
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
import { crearUsuario, actualizarUsuario, listarRoles } from '../services/usuarioService';

const props = defineProps({
  visible: Boolean,
  usuario: { type: Object, default: null },
});
const emit = defineEmits(['cerrar', 'guardado']);

const roles = ref([]);

const form = reactive({
  nombre_usuario: '',
  usuario: '',
  password: '',
  id_rol: '',
  telefono_usuario: '',
  dpi_usuario: '',
  correo_usuario: '',
  estado_usuario: true,
});

watch(
  () => props.usuario,
  (nuevo) => {
    form.nombre_usuario = nuevo?.nombre_usuario ?? '';
    form.usuario = nuevo?.usuario ?? '';
    form.password = '';
    form.id_rol = nuevo?.id_rol ?? '';
    form.telefono_usuario = nuevo?.telefono_usuario ?? '';
    form.dpi_usuario = nuevo?.dpi_usuario ?? '';
    form.correo_usuario = nuevo?.correo_usuario ?? '';
    form.estado_usuario = nuevo ? !!nuevo.estado_usuario : true;
  },
  { immediate: true }
);

onMounted(async () => {
  const { data } = await listarRoles();
  roles.value = data;
});

async function guardar() {
  // Solo se manda la contraseña si el usuario escribió algo,
  // para no sobreescribir la contraseña real con un valor vacío al editar.
  const payload = { ...form };
  if (!payload.password) {
    delete payload.password;
  }

  if (props.usuario) {
    await actualizarUsuario(props.usuario.id_usuarios, payload);
  } else {
    await crearUsuario(payload);
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
  padding: 20px;
}
.modal {
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  box-sizing: border-box;
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
input:not([type='checkbox']),
select {
  width: 100%;
  box-sizing: border-box;
}
.fila {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
}
.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  display: flex;
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
}
.checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: var(--accent);
  cursor: pointer;
}
.acciones-modal {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}
</style>