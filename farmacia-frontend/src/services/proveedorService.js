import api from './api';

export function listarProveedores() {
  return api.get('/proveedores');
}

export function listarCasasMedicas() {
  return api.get('/casas-medicas');
}

export function crearProveedor(datos) {
  return api.post('/proveedores', datos);
}

export function actualizarProveedor(id, datos) {
  return api.put(`/proveedores/${id}`, datos);
}

export function eliminarProveedor(id) {
  return api.delete(`/proveedores/${id}`);
}