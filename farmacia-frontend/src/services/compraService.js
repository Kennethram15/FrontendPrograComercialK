import api from './api';

export function listarProveedores() {
  return api.get('/proveedores');
}
export function listarMedicamentos() {
  return api.get('/medicamentos');
}
export function registrarCompraCompleta(payload) {
  return api.post('/compras/completa', payload);
}