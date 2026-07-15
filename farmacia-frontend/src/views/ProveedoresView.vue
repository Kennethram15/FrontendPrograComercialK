<template>
  <AppLayout title="Proveedores">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los proveedores</h2>
        <button class="btn btn-accent">+ Agregar proveedor</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Total adquirido</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prov in proveedores" :key="prov.id_proveedor">
            <td class="nombre">{{ prov.nombre_proveedor }}</td>
            <td>{{ prov.telefono_proveedor || '—' }}</td>
            <td>{{ prov.correo_proveedor || '—' }}</td>
            <td>Q{{ Number(prov.total_adquirido_proveedor).toFixed(2) }}</td>
            <td>
              <span class="badge" :class="prov.estado_proveedor ? 'badge-success' : 'badge-danger'">
                {{ prov.estado_proveedor ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button class="icon-btn">👁</button>
                <button class="icon-btn accent">✎</button>
                <button class="icon-btn danger">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && proveedores.length === 0">
            <td colspan="6" class="vacio">No hay proveedores registrados todavía.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import api from '../services/api';

const proveedores = ref([]);
const cargando = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get('/proveedores');
    proveedores.value = data;
  } catch (error) {
    console.error('Error al cargar proveedores', error);
  } finally {
    cargando.value = false;
  }
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
