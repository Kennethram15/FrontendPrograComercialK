<template>
  <AppLayout title="Medicamentos">
    <div class="card">
      <div class="toolbar">
        <h2>Todos los medicamentos</h2>
        <button class="btn btn-accent">+ Agregar medicamento</button>
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
          <tr v-for="med in medicamentos" :key="med.id_medicamento">
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
                <button class="icon-btn">👁</button>
                <button class="icon-btn accent">✎</button>
                <button class="icon-btn danger">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="!cargando && medicamentos.length === 0">
            <td colspan="6" class="vacio">No hay medicamentos registrados todavía.</td>
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

const medicamentos = ref([]);
const cargando = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get('/medicamentos');
    medicamentos.value = data;
  } catch (error) {
    console.error('Error al cargar medicamentos', error);
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
