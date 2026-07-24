<template>
  <div class="login-page">
    <form class="card login-card" @submit.prevent="ingresar">
      <div class="brand-mark">Rx</div>
      <h1>Sistema de Farmacia</h1>
      <p class="subtitulo">Ingresa con tu usuario para continuar</p>

      <label>Usuario</label>
      <input v-model="usuario" required autofocus />

      <label>Contraseña</label>
      <input v-model="password" type="password" required />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" class="btn btn-accent" :disabled="cargando">
        {{ cargando ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/authService';

const router = useRouter();
const usuario = ref('');
const password = ref('');
const error = ref('');
const cargando = ref(false);

async function ingresar() {
  error.value = '';
  cargando.value = true;
  try {
    await login(usuario.value, password.value);
    router.push('/');
  } catch (e) {
    error.value = e.response?.data?.mensaje || 'No se pudo iniciar sesión';
  } finally {
    cargando.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}
.login-card {
  width: 340px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
}
.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  margin: 0 auto 8px;
}
h1 {
  font-size: 18px;
  margin: 0;
}
.subtitulo {
  color: var(--text-muted);
  font-size: 13px;
  margin: 0 0 12px;
}
label {
  font-size: 12.5px;
  color: var(--text-muted);
  font-weight: 600;
  text-align: left;
}
.error {
  color: var(--danger);
  font-size: 13px;
  margin: 0;
}
button {
  margin-top: 8px;
}
</style>