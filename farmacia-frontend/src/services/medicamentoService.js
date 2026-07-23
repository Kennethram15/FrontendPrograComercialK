import api from './api';

export function listarMedicamentos() {
  return api.get('/medicamentos');
}

export function listarPresentacionesActivas() {
  return api.get('/presentaciones');
}

export function crearMedicamento(datos) {
  return api.post('/medicamentos', datos);
}

export function actualizarMedicamento(id, datos) {
  return api.put(`/medicamentos/${id}`, datos);
}

export function eliminarMedicamento(id) {
  return api.delete(`/medicamentos/${id}`);
}