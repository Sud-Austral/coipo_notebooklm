import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Portadilla, DUR_PORTADILLA } from './Portadilla';
import { QueEs, Problema, Estados, Plantillas, Bandeja, Seguridad, Infraestructura, Cierre } from './contrato';
import { C } from './estilo';

export const FPS = 30;

// Tiempos tomados de la narración ya generada (secciones_contrato.json).
// La portadilla ocupa los 10 s iniciales y no lleva voz: solo música.
const SECCIONES = [
  { comp: QueEs, inicio: 10.0, dur: 15.816 },
  { comp: Problema, inicio: 25.816, dur: 16.344 },
  { comp: Estados, inicio: 42.16, dur: 28.344 },
  { comp: Plantillas, inicio: 70.504, dur: 20.64 },
  { comp: Bandeja, inicio: 91.144, dur: 17.328 },
  { comp: Seguridad, inicio: 108.472, dur: 20.16 },
  { comp: Infraestructura, inicio: 128.632, dur: 22.176 },
  { comp: Cierre, inicio: 150.808, dur: 11.136 },
];

const TOTAL_S = 161.944;
export const DURACION_FRAMES = Math.round(TOTAL_S * FPS);

const Velo = ({ dur, color }) => {
  const frame = useCurrentFrame();
  const f = Math.round(dur * FPS);
  const o = interpolate(frame, [0, 9, f - 9, f], [1, 0, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: 'none' }} />;
};

export const VideoContrato = () => (
  <AbsoluteFill style={{ background: C.blanco }}>
    <Sequence from={0} durationInFrames={Math.round(DUR_PORTADILLA * FPS)}>
      <Portadilla
        titulo={'Sistema de Gestión\nde Contratos'}
        bajada="Del contrato firmado en papel a un expediente que se puede seguir."
      />
    </Sequence>

    {SECCIONES.map(({ comp: Comp, inicio, dur }, i) => (
      <Sequence key={i} from={Math.round(inicio * FPS)} durationInFrames={Math.round(dur * FPS)}>
        <Comp />
        <Velo dur={dur} color={C.blanco} />
      </Sequence>
    ))}

    {/* Música solo en la portadilla; la voz ya trae 10 s de silencio al inicio. */}
    <Audio src={staticFile('intro.mp3')} />
    <Audio src={staticFile('narracion_contrato.mp3')} />
  </AbsoluteFill>
);
