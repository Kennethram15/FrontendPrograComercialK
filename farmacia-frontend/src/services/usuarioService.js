import api from './api';

export function listarUsuarios() {
  return api.get('/usuarios');
}

export function listarRoles() {
  return api.get('/roles');
}

export function crearUsuario(datos) {
  return api.post('/usuarios', datos);
}

export function actualizarUsuario(id, datos) {
  return api.put(`/usuarios/${id}`, datos);
}

export function eliminarUsuario(id) {
  return api.delete(`/usuarios/${id}`);
}