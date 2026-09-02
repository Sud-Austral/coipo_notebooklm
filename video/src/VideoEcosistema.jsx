import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Portadilla, DUR_PORTADILLA } from './Portadilla';
import { Apertura, Familia, CierreEco } from './ecosistema';
import { C } from './estilo';

export const FPS = 30;

// Tiempos tomados de secciones_ecosistema.json. Las ocho familias van en orden.
const LISTA = [
  { render: () => <Apertura />, inicio: 10.0, dur: 17.712 },
  { render: () => <Familia indice={0} />, inicio: 27.712, dur: 15.648 },
  { render: () => <Familia indice={1} />, inicio: 43.36, dur: 15.576 },
  { render: () => <Familia indice={2} />, inicio: 58.936, dur: 11.088 },
  { render: () => <Familia indice={3} />, inicio: 70.024, dur: 9.72 },
  { render: () => <Familia indice={4} />, inicio: 79.744, dur: 16.392 },
  { render: () => <Familia indice={5} />, inicio: 96.136, dur: 18.888 },
  { render: () => <Familia indice={6} />, inicio: 115.024, dur: 11.688 },
  { render: () => <Familia indice={7} />, inicio: 126.712, dur: 13.344 },
  { render: () => <CierreEco />, inicio: 140.056, dur: 14.784 },
];

const TOTAL_S = 154.84;
export const DURACION_FRAMES = Math.round(TOTAL_S * FPS);

const Velo = ({ dur }) => {
  const frame = useCurrentFrame();
  const f = Math.round(dur * FPS);
  const o = interpolate(frame, [0, 9, f - 9, f], [1, 0, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{ background: C.blanco, opacity: o, pointerEvents: 'none' }} />;
};

export const VideoEcosistema = () => (
  <AbsoluteFill style={{ background: C.blanco }}>
    <Sequence from={0} durationInFrames={Math.round(DUR_PORTADILLA * FPS)}>
      <Portadilla
        titulo={'El ecosistema COIPO'}
        bajada="Cuarenta y nueve repositorios de la Unidad de Información y Análisis."
      />
    </Sequence>

    {LISTA.map((s, i) => (
      <Sequence key={i} from={Math.round(s.inicio * FPS)} durationInFrames={Math.round(s.dur * FPS)}>
        {s.render()}
        <Velo dur={s.dur} />
      </Sequence>
    ))}

    <Audio src={staticFile('intro.mp3')} />
    <Audio src={staticFile('narracion_ecosistema.mp3')} />
  </AbsoluteFill>
);
