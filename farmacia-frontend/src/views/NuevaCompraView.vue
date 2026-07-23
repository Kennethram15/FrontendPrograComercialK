<template>
  <AppLayout title="Nueva compra">
    <div class="card form-card">
      <form @submit.prevent="registrarCompra">
        <div class="fila">
          <div>
            <label>Proveedor</label>
            <select v-model.number="form.id_proveedor" required>
              <option disabled value="">Selecciona un proveedor</option>
              <option v-for="p in proveedores" :key="p.id_proveedor" :value="p.id_proveedor">
                {{ p.nombre_proveedor }}
              </option>
            </select>
          </div>
          <div>
            <label>Fecha de compra</label>
            <input v-model="form.fecha_compra" type="date" required />
          </div>
        </div>

        <h3>Medicamentos recibidos</h3>
        <div class="linea encabezado">
  <span>Medicamento</span>
  <span>Cantidad</span>
  <span>Precio lote</span>
  <span>Producción</span>
  <span>Vencimiento</span>
  <span></span>
  <span></span>
</div>
<div class="linea" v-for="(linea, index) in form.detalles" :key="index">
  <select v-model.number="linea.id_medicamento" required>
    <option disabled value="">Medicamento</option>
    <option v-for="m in medicamentos" :key="m.id_medicamento" :value="m.id_medicamento">
      {{ m.nombre_medicamento }}
    </option>
  </select>
  <input v-model.number="linea.cantidad" type="number" min="1" placeholder="Cantidad" required />
  <input v-model.number="linea.precio_lote" type="number" step="0.01" min="0" placeholder="Precio lote" required />
  <input v-model="linea.fecha_produccion" type="date" />
  <input v-model="linea.fecha_vencimiento" type="date" required />
  <span class="subtotal">Q{{ subtotalLinea(linea).toFixed(2) }}</span>
  <button type="button" class="icon-btn danger" @click="quitarLinea(index)">🗑</button>
</div>
        <button type="button" class="btn btn-ghost" @click="agregarLinea">+ Agregar medicamento</button>

        <div class="fila" style="margin-top: 20px; justify-content: flex-end">
          <div class="total">
            <label>Total</label>
            <p>Q{{ totalCompra.toFixed(2) }}</p>
          </div>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="acciones-modal">
          <button type="button" class="btn btn-ghost" @click="$router.push('/compras')">Cancelar</button>
          <button type="submit" class="btn btn-accent" :disabled="enviando">
            {{ enviando ? 'Guardando...' : 'Registrar compra' }}
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
import { listarProveedores, listarMedicamentos, registrarCompraCompleta } from '../services/compraService';

const router = useRouter();

const proveedores = ref([]);
const medicamentos = ref([]);
const enviando = ref(false);
const error = ref('');

function lineaVacia() {
  return { id_medicamento: '', cantidad: 1, precio_lote: 0, fecha_produccion: '', fecha_vencimiento: '' };
}

const form = reactive({
  id_proveedor: '',
  fecha_compra: new Date().toISOString().slice(0, 10),
  detalles: [lineaVacia()],
});

function subtotalLinea(linea) {
  return Number(linea.precio_lote || 0) * Number(linea.cantidad || 0);
}
const totalCompra = computed(() => form.detalles.reduce((acc, l) => acc + subtotalLinea(l), 0));

function agregarLinea() {
  form.detalles.push(lineaVacia());
}
function quitarLinea(index) {
  if (form.detalles.length === 1) return;
  form.detalles.splice(index, 1);
}

async function registrarCompra() {
  error.value = '';
  enviando.value = true;
  try {
    await registrarCompraCompleta(form);
    router.push('/compras');
  } catch (e) {
    error.value = e.response?.data?.mensaje || 'No se pudo registrar la compra';
  } finally {
    enviando.value = false;
  }
}

onMounted(async () => {
  const [resProveedores, resMedicamentos] = await Promise.all([listarProveedores(), listarMedicamentos()]);
  proveedores.value = resProveedores.data;
  medicamentos.value = resMedicamentos.data;
});
</script>

<style scoped>
.form-card {
  padding: 24px 28px;
  max-width: 900px;
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
.fila label {
  font-size: 12.5px;
  color: var(--text-muted);
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}
.linea {
  display: grid;
  grid-template-columns: 1.4fr 80px 100px 130px 130px 80px 36px;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}
.subtotal {
  font-weight: 600;
  text-align: right;
  font-size: 13px;
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
.linea.encabezado {
  font-size: 11.5px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
</style>