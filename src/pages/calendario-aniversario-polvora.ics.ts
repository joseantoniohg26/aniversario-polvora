import type { APIRoute } from 'astro';
import programa from '../data/programa.json';
import distrito from '../data/distrito.json';
import { parseHora } from '../lib/horas';

// Calendario del programa para agregar al teléfono. Las horas están en hora de Perú (UTC-5, sin horario de verano).
const DURACION_POR_DEFECTO = 60;

const dos = (n: number) => String(n).padStart(2, '0');
const aUtc = (fecha: string, minutos: number) => {
  const [a, m, d] = fecha.split('-').map(Number);
  const t = new Date(Date.UTC(a, m - 1, d, 0, 0, 0) + (minutos + 5 * 60) * 60000);
  return `${t.getUTCFullYear()}${dos(t.getUTCMonth() + 1)}${dos(t.getUTCDate())}T${dos(t.getUTCHours())}${dos(t.getUTCMinutes())}00Z`;
};
const escapar = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
// Las líneas del .ics no pasan de 75 caracteres; las largas se doblan.
const doblar = (linea: string) => {
  const partes: string[] = [];
  let resto = linea;
  while (resto.length > 73) {
    partes.push(resto.slice(0, 73));
    resto = ' ' + resto.slice(73);
  }
  partes.push(resto);
  return partes.join('\r\n');
};

export const GET: APIRoute = () => {
  const lineas: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Municipalidad Distrital de Polvora//Aniversario 2026//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapar(`${distrito.aniversario}.º aniversario de Pólvora`)}`,
    'X-WR-TIMEZONE:America/Lima',
  ];

  for (const dia of programa.dias) {
    dia.actividades.forEach((a, i) => {
      const rango = parseHora(a.hora);
      if (!rango) return;
      const fin = rango.fin ?? rango.inicio + DURACION_POR_DEFECTO;
      const detalle = [(a as { detalle?: string }).detalle, 'Horario según el cronograma de la municipalidad.'].filter(Boolean).join(' ');
      lineas.push(
        'BEGIN:VEVENT',
        `UID:${dia.fecha}-${i + 1}@aniversario-polvora`,
        'DTSTAMP:20261125T000000Z',
        `DTSTART:${aUtc(dia.fecha, rango.inicio)}`,
        `DTEND:${aUtc(dia.fecha, fin)}`,
        `SUMMARY:${escapar(a.titulo)}`,
        `DESCRIPTION:${escapar(detalle)}`,
        ...(a.lugar ? [`LOCATION:${escapar(a.lugar)}`] : []),
        'END:VEVENT',
      );
    });
  }
  lineas.push('END:VCALENDAR');

  return new Response(lineas.map(doblar).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
