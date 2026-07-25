<template>
  <div v-if="totalPaginas > 1" class="paginador">
    <button class="icon-btn" :disabled="paginaActual === 1" @click="$emit('cambiar', paginaActual - 1)">‹</button>
    <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
    <button class="icon-btn" :disabled="paginaActual === totalPaginas" @click="$emit('cambiar', paginaActual + 1)">›</button>
  </div>
</template>

<script setup>
defineProps({
  paginaActual: { type: Number, required: true },
  totalPaginas: { type: Number, required: true },
});
defineEmits(['cambiar']);
</script>

<style scoped>
.paginador {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 16px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>