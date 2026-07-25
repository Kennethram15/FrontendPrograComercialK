<template>
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.tipo">
      {{ toast.mensaje }}
    </div>
  </div>
</template>

<script setup>
import { toasts } from '../services/toastStore';
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}
.toast {
  padding: 12px 18px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  max-width: 320px;
}
.toast.error {
  background: var(--danger-soft);
  color: var(--danger);
  border: 1px solid var(--danger);
}
.toast.success {
  background: var(--success-soft);
  color: var(--success);
  border: 1px solid var(--success);
}
</style>