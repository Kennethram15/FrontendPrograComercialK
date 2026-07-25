import api from './api';

export function obtenerAlertas() {
  return api.get('/reportes/alertas');
}

export function obtenerVentasPorPeriodo(fechaInicio, fechaFin) {
  return api.get('/reportes/ventas-periodo', {
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
  });
}

export function obtenerMedicamentosMasVendidos(fechaInicio, fechaFin) {
  return api.get('/reportes/medicamentos-mas-vendidos', {
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
  });
}
export async function descargarReportePdf(fechaInicio, fechaFin) {
  const respuesta = await api.get('/reportes/ventas-periodo/pdf', {
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([respuesta.data], { type: 'application/pdf' }));
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `reporte_ventas_${fechaInicio}_a_${fechaFin}.pdf`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  window.URL.revokeObjectURL(url);
}