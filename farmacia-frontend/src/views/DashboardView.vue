<template>
  <AppLayout title="Panel">
    <div class="grid">
      <StatCard label="Medicamentos" :value="counts.medicamentos" icon="💊" />
      <StatCard
        label="Ventas del mes"
        :value="counts.ventas"
        icon="🧾"
        icon-bg="var(--success-soft)"
        icon-color="var(--success)"
      />
      <StatCard label="Proveedores" :value="counts.proveedores" icon="🚚" />
      <StatCard
        label="Clientes"
        :value="counts.clientes"
        icon="🧑"
        icon-bg="var(--danger-soft)"
        icon-color="var(--danger)"
      />
    </div>

    <div class="card hint">
      <p>
        Conecta el backend en <code>http://localhost:3000</code> para ver datos reales.
        Mientras tanto, cada tarjeta muestra <strong>0</strong> si la API no responde.
      </p>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import StatCard from '../components/StatCard.vue';
import api from '../services/api';

const counts = reactive({
  medicamentos: 0,
  ventas: 0,
  proveedores: 0,
  clientes: 0,
});

async function cargarConteo(recurso, clave) {
  try {
    const { data } = await api.get(`/${recurso}`);
    counts[clave] = Array.isArray(data) ? data.length : 0;
  } catch {
    counts[clave] = 0;
  }
}

onMounted(() => {
  cargarConteo('medicamentos', 'medicamentos');
  cargarConteo('ventas', 'ventas');
  cargarConteo('proveedores', 'proveedores');
  cargarConteo('clientes', 'clientes');
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.hint {
  padding: 18px 22px;
  color: var(--text-muted);
  font-size: 13.5px;
}

.hint code {
  color: var(--accent);
}

@media (max-width: 1000px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
