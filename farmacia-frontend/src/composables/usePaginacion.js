import { ref, computed, watch } from 'vue';

export function usePaginacion(itemsRef, porPagina = 5) {
  const paginaActual = ref(1);

  const totalPaginas = computed(() => Math.max(1, Math.ceil(itemsRef.value.length / porPagina)));

  const itemsPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * porPagina;
    return itemsRef.value.slice(inicio, inicio + porPagina);
  });

  // Si la lista cambia (filtro de búsqueda, eliminar, etc.) y la página actual queda fuera de rango, regresa a la 1
  watch(itemsRef, () => {
    if (paginaActual.value > totalPaginas.value) {
      paginaActual.value = 1;
    }
  });

  function irAPagina(pagina) {
    if (pagina < 1 || pagina > totalPaginas.value) return;
    paginaActual.value = pagina;
  }

  return { paginaActual, totalPaginas, itemsPaginados, irAPagina };
}