<template>
  <AppLayout title="Nueva venta">
    <div class="card form-card">
      <form @submit.prevent="registrarVenta">
        <div class="fila">
          <div>
            <label>Cliente</label>
            <select v-model.number="form.id_cliente" required>
              <option disabled value="">Selecciona un cliente</option>
              <option v-for="c in clientes" :key="c.id_cliente" :value="c.id_cliente">
                {{ c.nombre_cliente }}
              </option>
            </select>
          </div>
          <div>
            <label>Vendedor</label>
            <select v-model.number="form.id_usuario" required>
              <option disabled value="">Selecciona un usuario</option>
              <option v-for="u in usuarios" :key="u.id_usuarios" :value="u.id_usuarios">
                {{ u.nombre_usuario }}
              </option>
            </select>
          </div>
        </div>

        <h3>Medicamentos</h3>
        <div class="linea" v-for="(linea, index) in form.detalles" :key="index">
          <select v-model.number="linea.id_medicamento" required>
            <option disabled value="">Selecciona un medicamento</option>
            <option v-for="m in medicamentos" :key="m.id_medicamento" :value="m.id_medicamento">
              {{ m.nombre_medicamento }} (Q{{ Number(m.precio_venta).toFixed(2) }} · {{ m.existencia_total_medicamento }} disp.)
            </option>
          </select>
          <input v-model.number="linea.cantidad" type="number" min="1" placeholder="Cantidad" required />
          <span class="subtotal">Q{{ subtotalLinea(linea).toFixed(2) }}</span>
          <button type="button" class="icon-btn danger" @click="quitarLinea(index)">🗑</button>
        </div>
        <button type="button" class="btn btn-ghost" @click="agregarLinea">+ Agregar medicamento</button>

        <div class="fila" style="margin-top: 20px">
          <div>
            <label>Método de pago</label>
            <select v-model.number="form.id_metodo_pago" required>
              <option disabled value="">Selecciona uno</option>
              <option v-for="mp in metodosPago" :key="mp.id_metodo_pago" :value="mp.id_metodo_pago">
                {{ mp.nombre_metodo_pago }}
              </option>
            </select>
          </div>
          <div class="total">
            <label>Total</label>
            <p>Q{{ totalVenta.toFixed(2) }}</p>
          </div>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="acciones-modal">
          <button type="button" class="btn btn-ghost" @click="$router.push('/ventas')">Cancelar</button>
          <button type="submit" class="btn btn-accent" :disabled="enviando">
            {{ enviando ? 'Guardando...' : 'Registrar venta' }}
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import {
  listarClientes,
  listarUsuarios,
  listarMedicamentosDisponibles,
  listarMetodosPago,
  registrarVentaCompleta,
} from '../services/ventaService';

const router = useRouter();

const clientes = ref([]);
const usuarios = ref([]);
const medicamentos = ref([]);
const metodosPago = ref([]);
const enviando = ref(false);
const error = ref('');

const form = reactive({
  id_cliente: '',
  id_usuario: '',
  id_metodo_pago: '',
  detalles: [{ id_medicamento: '', cantidad: 1 }],
});

function subtotalLinea(linea) {
  const med = medicamentos.value.find((m) => m.id_medicamento === linea.id_medicamento);
  if (!med || !linea.cantidad) return 0;
  return Number(med.precio_venta) * Number(linea.cantidad);
}

const totalVenta = computed(() => form.detalles.reduce((acc, l) => acc + subtotalLinea(l), 0));

function agregarLinea() {
  form.detalles.push({ id_medicamento: '', cantidad: 1 });
}
function quitarLinea(index) {
  if (form.detalles.length === 1) return;
  form.detalles.splice(index, 1);
}

async function registrarVenta() {
  error.value = '';
  enviando.value = true;
  try {
    await registrarVentaCompleta(form);
    router.push('/ventas');
  } catch (e) {
    error.value = e.response?.data?.mensaje || 'No se pudo registrar la venta';
  } finally {
    enviando.value = false;
  }
}

onMounted(async () => {
  const [resClientes, resUsuarios, resMedicamentos, resMetodos] = await Promise.all([
    listarClientes(),
    listarUsuarios(),
    listarMedicamentosDisponibles(),
    listarMetodosPago(),
  ]);
  clientes.value = resClientes.data;
  usuarios.value = resUsuarios.data;
  medicamentos.value = resMedicamentos.data;
  metodosPago.value = resMetodos.data;
});
</script>

<style scoped>
.form-card {
  padding: 24px 28px;
  max-width: 700px;
}
h3 {
  font-size: 14px;
  color: var(--text-muted);
  margin: 20px 0 10px;
}
.fila {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.fila label,
.linea label {
  font-size: 12.5px;
  color: var(--text-muted);
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}
.linea {
  display: grid;
  grid-template-columns: 1fr 100px 90px 40px;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}
.subtotal {
  font-weight: 600;
  text-align: right;
}
.total p {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}
.error {
  color: var(--danger);
  font-size: 13px;
  margin-top: 10px;
}
.acciones-modal {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}
</style>