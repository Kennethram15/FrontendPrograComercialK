import api from './api';

const TOKEN_KEY = 'farmacia_token';
const USUARIO_KEY = 'farmacia_usuario';

export async function login(usuario, password) {
  const { data } = await api.post('/auth/login', { usuario, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(data.usuario));
  return data.usuario;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
}

export function obtenerUsuario() {
  const raw = localStorage.getItem(USUARIO_KEY);
  return raw ? JSON.parse(raw) : null;
}