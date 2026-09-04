import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, staticFile,
  useCurrentFrame, useVideoConfig, interpolate,
} from 'remotion';
import { Portadilla, DUR_PORTADILLA } from '../Portadilla';
import { T, SERIF, SANS, Fuentes, Grano } from './base';

/* ---------------------------------------------------------------- el motor
 * Lo común a los tres vídeos podcast. Antes vivía dentro de VideoCatastro y se
 * habría copiado tres veces; con vídeos recurrentes, copiar es garantizar que
 * las copias se separen.
 *
 * Un latido es UNA FRASE Y UN PLANO. Como la locución se sintetiza latido a
 * latido, se conoce la duración exacta de cada frase y el plano dura justo eso.
 * Ésa es toda la sincronía: no se ajusta, se construye.
 */

export const FPS = 30;

export const BANDA = 234;                  // la tira de conversación, abajo
export const ALTO_ESCENA = 1080 - BANDA;   // 846: lo que ve el espectador

export const VOZ = {
  c: { nombre: 'Catalina', color: T.ambar },
  l: { nombre: 'Lorenzo', color: T.musgo },
};

/** Qué latido manda en este frame. */
export const latidoEn = (beats, t) => {
  let i = 0;
  for (let j = 0; j < beats.length; j++) if (t >= beats[j].inicio) i = j;
  return i;
};

/**
 * La tira de conversación. Banda SÓLIDA y no un degradado: sobre un mapa casi
 * blanco ningún degradado garantiza leer el subtítulo. Se ven los dos nombres
 * siempre, con el que habla encendido, porque eso es lo que dice de un vistazo
 * que esto es una conversación y no una locución.
 *
 * El rótulo va arriba y nombra lo que se MIRA; el subtítulo va abajo y es,
 * palabra por palabra, lo que se OYE.
 */
export const Pie = ({ beats, desfase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + desfase;
  const b = beats[latidoEn(beats, t)];
  const v = VOZ[b.v];
  const entra = interpolate(t - b.inicio, [0, 0.12], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {b.rot ? (
        <div style={{
          position: 'absolute', left: 74, top: 56,
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'rgba(7,22,14,0.90)', padding: '14px 26px 15px 22px',
          borderRadius: 3, borderLeft: `4px solid ${T.ambar}`,
          opacity: entra, transform: `translateY(${(1 - entra) * -8}px)`,
        }}>
          <div style={{ fontFamily: SERIF, fontSize: 42, color: T.ambar, lineHeight: 1.02 }}>
            {b.rot}
          </div>
        </div>
      ) : null}

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: BANDA,
        background: '#07160E', borderTop: `2px solid ${v.color}`,
        display: 'flex', alignItems: 'center', padding: '0 74px', gap: 34,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, width: 156, flexShrink: 0 }}>
          {['c', 'l'].map((k) => (
            <div key={k} style={{
              fontFamily: SANS, fontSize: 17, fontWeight: 700, letterSpacing: 2.6,
              textTransform: 'uppercase',
              color: k === b.v ? VOZ[k].color : '#31493D',
              display: 'flex', alignItems: 'center', gap: 11,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: k === b.v ? VOZ[k].color : '#26382F',
              }} />
              {VOZ[k].nombre}
            </div>
          ))}
        </div>

        <div style={{ width: 1, alignSelf: 'stretch', background: '#1C3A2D', margin: '34px 0' }} />

        <div style={{
          fontFamily: SANS, fontSize: 33, lineHeight: 1.36, color: T.crema,
          maxWidth: 1440, fontWeight: 400,
          opacity: entra, transform: `translateY(${(1 - entra) * 7}px)`,
        }}>
          {b.texto}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Barra de avance: sesenta latidos son muchos, y ayuda saber por dónde va. */
export const Avance = ({ ficha, desfase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame / fps + desfase, [ficha.portadilla, ficha.total], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4,
                  background: 'rgba(255,255,255,0.10)' }}>
      <div style={{ height: '100%', width: `${p * 100}%`, background: T.ambar }} />
    </div>
  );
};

/**
 * Escenario para vídeos SIN capturas: resuelve el id de escena y funde al
 * cambiar. `Escena` recibe {id, dentro, dur} y devuelve el plano.
 *
 * Los latidos que comparten escena NO la re-montan: la escena sigue viva y sólo
 * cambia el subtítulo, que es lo que hace que una explicación de cuatro frases
 * se sienta como un plano y no como cuatro cortes.
 */
export const Escenario = ({ beats, desfase, Escena }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + desfase;
  const i = latidoEn(beats, t);
  const b = beats[i];

  // Cuándo empezó la escena actual, no el latido: la animación de entrada debe
  // correr una vez por escena.
  let inicioEscena = b.inicio;
  for (let j = i; j > 0; j--) {
    if (beats[j - 1].foto !== b.foto) break;
    inicioEscena = beats[j - 1].inicio;
  }
  const anterior = i > 0 ? beats[i - 1] : null;
  const cambio = anterior && anterior.foto !== b.foto;
  const fundido = cambio
    ? interpolate(t - b.inicio, [0, 0.30], [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  return (
    <AbsoluteFill style={{ background: T.tinta }}>
      <div style={{ position: 'absolute', inset: 0, height: ALTO_ESCENA, overflow: 'hidden' }}>
        {cambio && fundido < 1 ? (
          <Escena id={anterior.foto} dentro={t - inicioEscena} />
        ) : null}
        <div style={{ position: 'absolute', inset: 0, opacity: fundido }}>
          <Escena id={b.foto} dentro={t - inicioEscena} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** El vídeo entero: portadilla intocable + latidos + audio. */
export const Podcast = ({ ficha, audio, titulo, bajada, Escena }) => (
  <AbsoluteFill style={{ background: T.tinta }}>
    <Fuentes />
    <Sequence from={0} durationInFrames={Math.round(DUR_PORTADILLA * FPS)}>
      <Portadilla titulo={titulo} bajada={bajada} />
    </Sequence>
    <Sequence from={Math.round(DUR_PORTADILLA * FPS)}>
      {/* Dentro de un <Sequence from={N}>, useCurrentFrame() cuenta desde N y no
          desde cero. Los tiempos del JSON son absolutos, así que hay que
          devolverles ese origen o todo va diez segundos corrido — ya pasó. */}
      <Escenario beats={ficha.beats} desfase={ficha.portadilla} Escena={Escena} />
      <Grano opacidad={0.035} />
      <Pie beats={ficha.beats} desfase={ficha.portadilla} />
      <Avance ficha={ficha} desfase={ficha.portadilla} />
    </Sequence>
    <Audio src={staticFile('intro.mp3')} />
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
