import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Portadilla, DUR_PORTADILLA } from '../Portadilla';
import { Declaracion, Numeral, Familia, Indice } from './arquetipos';
import { T, Fuentes } from './base';
import catalogo from '../catalogo.json';

export const FPS = 30;

/* La paleta del catálogo se pensó para fondo claro; sobre el verde tinta de este
 * vídeo el territorio y la plataforma desaparecían. Mismo orden, más luz. */
const COLOR = ['#E5383B', '#F4813F', '#52B788', '#95D5B2',
               '#4CA3F5', '#9DB3AC', '#A78BFA', '#FFC233'];

const F = catalogo.familias.map((f, i) => ({ ...f, color: COLOR[i] }));
const titulos = (i) => F[i].repos.map((r) => r.titulo);

/* Cada familia hereda su color del catálogo y alterna el lado del ancla. */
const cap = (i, clip, lado) => () => (
  <Familia
    indice={i + 1}
    nombre={F[i].nombre}
    color={F[i].color}
    repos={titulos(i)}
    clip={clip}
    lado={lado}
    total={F.length}
  />
);

const Gancho = () => (
  <Declaracion
    rotulo="CONAF · UNIDAD DE INFORMACIÓN Y ANÁLISIS"
    frase={<>Cuarenta y nueve repositorios.<br /><em style={{ fontStyle: 'italic', color: T.ambar }}>Todos empiezan por la misma palabra.</em></>}
    clip="bosque_aereo"
  />
);

const Apertura = () => (
  <Numeral
    rotulo="COIPO"
    valor={8}
    unidad="familias, no cuarenta y nueve ideas sueltas"
    texto="Coipo es el roedor que da nombre a cada proyecto de la unidad. Los repositorios se agrupan por el trabajo al que sirven, y cada familia responde a una parte distinta de la institución."
    clip="rio"
  />
);

const Remate = () => (
  <Declaracion
    rotulo="PLATAFORMA Y DATOS"
    frase={<>Nadie los abre nunca. Y si fallan, <em style={{ fontStyle: 'italic', color: T.arcilla }}>no funciona ninguno de los demás.</em></>}
    clip="nubes"
    acento={T.arcilla}
  />
);

const Cierre = () => (
  <Indice
    rotulo="49 REPOSITORIOS · 8 FAMILIAS"
    titulo="El mapa completo"
    grupos={F.map((f) => ({ nombre: f.nombre, color: f.color, items: f.repos.map((r) => r.titulo) }))}
    pie="Del fuego a los contratos, del catastro a la sala de clases."
    clip="montana"
  />
);

const LISTA = [
  { r: Gancho, inicio: 10.0, dur: 6.472 },
  { r: Apertura, inicio: 16.472, dur: 16.432 },
  { r: cap(0, 'pirocumulo', 'izq'), inicio: 32.904, dur: 13.912 },
  { r: cap(1, 'dosel', 'der'), inicio: 46.816, dur: 13.768 },
  { r: cap(2, 'montana', 'izq'), inicio: 60.584, dur: 11.248 },
  { r: cap(3, 'bosque_aereo', 'der'), inicio: 71.832, dur: 10.0 },
  { r: cap(4, 'rio', 'izq'), inicio: 81.832, dur: 14.128 },
  { r: cap(5, 'nubes', 'der'), inicio: 95.96, dur: 13.672 },
  { r: Remate, inicio: 109.632, dur: 7.072 },
  { r: cap(6, 'dosel', 'izq'), inicio: 116.704, dur: 11.728 },
  { r: cap(7, 'rio', 'der'), inicio: 128.432, dur: 12.256 },
  { r: Cierre, inicio: 140.688, dur: 14.592 },
];

export const DURACION_FRAMES = Math.round(155.28 * FPS);

const Corte = ({ dur }) => {
  const frame = useCurrentFrame();
  const f = Math.round(dur * FPS);
  const o = interpolate(frame, [0, 7, f - 7, f], [1, 0, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: T.tinta, opacity: o, pointerEvents: 'none' }} />;
};

export const VideoEcosistema2 = () => (
  <AbsoluteFill style={{ background: T.tinta }}>
    <Fuentes />
    <Sequence from={0} durationInFrames={Math.round(DUR_PORTADILLA * FPS)}>
      <Portadilla
        titulo={'El ecosistema\nCOIPO'}
        bajada="Cuarenta y nueve repositorios, ocho familias, una sola unidad."
      />
    </Sequence>
    {LISTA.map((s, i) => (
      <Sequence key={i} from={Math.round(s.inicio * FPS)} durationInFrames={Math.round(s.dur * FPS)}>
        <s.r />
        <Corte dur={s.dur} />
      </Sequence>
    ))}
    <Audio src={staticFile('intro.mp3')} />
    <Audio src={staticFile('narracion_ecosistema2.mp3')} />
  </AbsoluteFill>
);
