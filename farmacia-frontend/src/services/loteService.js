import api from './api';

export function listarLotes() {
  return api.get('/lotes');
}

export function listarMedicamentosActivos() {
  return api.get('/medicamentos');
}

export function crearLote(datos) {
  return api.post('/lotes', datos);
}

export function actualizarLote(id, datos) {
  return api.put(`/lotes/${id}`, datos);
}

export function eliminarLote(id) {
  return api.delete(`/lotes/${id}`);
}