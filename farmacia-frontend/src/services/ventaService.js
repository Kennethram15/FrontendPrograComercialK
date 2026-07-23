import api from './api';

export function listarClientes() {
  return api.get('/clientes');
}
export function listarUsuarios() {
  return api.get('/usuarios');
}
export function listarMedicamentosDisponibles() {
  return api.get('/medicamentos');
}
export function listarMetodosPago() {
  return api.get('/metodos-pago');
}
export function registrarVentaCompleta(payload) {
  return api.post('/ventas/completa', payload);
}