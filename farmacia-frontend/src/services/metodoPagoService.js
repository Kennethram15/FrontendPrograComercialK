import api from './api';

export function listarMetodosPago() {
  return api.get('/metodos-pago');
}
export function crearMetodoPago(datos) {
  return api.post('/metodos-pago', datos);
}
export function actualizarMetodoPago(id, datos) {
  return api.put(`/metodos-pago/${id}`, datos);
}
export function eliminarMetodoPago(id) {
  return api.delete(`/metodos-pago/${id}`);
}