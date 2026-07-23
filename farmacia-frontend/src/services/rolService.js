import api from './api';

export function listarRoles() {
  return api.get('/roles');
}
export function crearRol(datos) {
  return api.post('/roles', datos);
}
export function actualizarRol(id, datos) {
  return api.put(`/roles/${id}`, datos);
}
export function eliminarRol(id) {
  return api.delete(`/roles/${id}`);
}