<template>
  <div class="stat-card card">
    <div>
      <p class="stat-label">{{ label }}</p>
      <p class="stat-value">{{ value }}</p>
    </div>
    <div class="stat-icon" :style="{ background: iconBg, color: iconColor }">
      {{ icon }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  icon: {
    type: String,
    default: '📦',
  },
  iconBg: {
    type: String,
    default: 'var(--accent-soft)',
  },
  iconColor: {
    type: String,
    default: 'var(--accent)',
  },
});
</script>

<style scoped>
.stat-card {
  padding: 20px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  margin: 0 0 8px;
  color: var(--text-muted);
  font-size: 13.5px;
  font-weight: 500;
}

.stat-value {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
</style>
