import api from './api';

export function listarPresentaciones() {
  return api.get('/presentaciones');
}
export function crearPresentacion(datos) {
  return api.post('/presentaciones', datos);
}
export function actualizarPresentacion(id, datos) {
  return api.put(`/presentaciones/${id}`, datos);
}
export function eliminarPresentacion(id) {
  return api.delete(`/presentaciones/${id}`);
}