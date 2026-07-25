import { reactive } from 'vue';

export const toasts = reactive([]);
let contador = 0;

export function mostrarToast(mensaje, tipo = 'error') {
  const id = ++contador;
  toasts.push({ id, mensaje, tipo });
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) toasts.splice(index, 1);
  }, 4000);
}