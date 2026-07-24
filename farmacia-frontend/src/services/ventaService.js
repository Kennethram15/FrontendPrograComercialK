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
export async function descargarComprobante(idVenta) {
  const respuesta = await api.get(`/ventas/${idVenta}/comprobante`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([respuesta.data], { type: 'application/pdf' }));
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `comprobante_venta_${idVenta}.pdf`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  window.URL.revokeObjectURL(url);
}