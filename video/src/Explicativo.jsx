import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Portada, Problema, Flujo } from './secciones';
import { Roles, Datos, Cifras } from './secciones2';
import { C } from './estilo';

export const FPS = 30;

// Los tiempos salen de la narración ya generada (video_planta/secciones.json):
// cada sección dura exactamente lo que dura su bloque de voz más el aire final.
const SECCIONES = [
  { comp: Portada, inicio: 0.0, dur: 20.008 },
  { comp: Problema, inicio: 20.008, dur: 36.16 },
  { comp: Flujo, inicio: 56.168, dur: 52.456 },
  { comp: Roles, inicio: 108.624, dur: 41.704 },
  { comp: Datos, inicio: 150.328, dur: 33.664 },
  { comp: Cifras, inicio: 183.992, dur: 30.048 },
];

const TOTAL_S = 214.04;
export const DURACION_FRAMES = Math.round(TOTAL_S * FPS);

/** Corte con fundido corto: separa secciones sin el efecto de diapositiva. */
const Velo = ({ dur }) => {
  const frame = useCurrentFrame();
  const f = Math.round(dur * FPS);
  const o = interpolate(frame, [0, 9, f - 9, f], [1, 0, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ background: C.blanco, opacity: o, pointerEvents: 'none' }} />
  );
};

export const Explicativo = () => (
  <AbsoluteFill style={{ background: C.blanco }}>
    {SECCIONES.map(({ comp: Comp, inicio, dur }, i) => (
      <Sequence
        key={i}
        from={Math.round(inicio * FPS)}
        durationInFrames={Math.round(dur * FPS)}
      >
        <Comp />
        <Velo dur={dur} />
      </Sequence>
    ))}
    <Audio src={staticFile('narracion.mp3')} />
  </AbsoluteFill>
);
