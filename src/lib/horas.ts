// Convierte textos como «5:30 a.m.» o «9:00 a.m. a 3:00 p.m.» en minutos desde la medianoche.
export interface RangoHora {
  inicio: number;
  fin?: number;
}

export function parseHora(texto: string): RangoHora | null {
  const coincidencias = [...texto.matchAll(/(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)/gi)];
  if (coincidencias.length === 0) return null;
  const minutos = coincidencias.map(([, h, m, ap]) => {
    let hora = Number(h) % 12;
    if (/^p/i.test(ap)) hora += 12;
    return hora * 60 + Number(m);
  });
  return { inicio: minutos[0], fin: minutos[1] };
}
