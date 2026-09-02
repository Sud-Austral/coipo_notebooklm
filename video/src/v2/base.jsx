import React from 'react';
import {
  AbsoluteFill, Video, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring,
} from 'remotion';

/* ------------------------------------------------------------------ sistema
 * Dirección "editorial forestal".
 *
 * El error de la versión anterior fue usar UNA sola receta para todo:
 * antetítulo, título, rejilla de tarjetas iguales, ocho veces. Aquí hay
 * arquetipos de composición distintos, y cada sección elige el que le toca.
 *
 * Tipografía: Instrument Serif para lo que se declara, Archivo para lo que se
 * explica. Ese contraste hace la mitad del trabajo.
 */

export const T = {
  tinta: '#0A1C14',      // el negro de la marca, verde y profundo
  bosque: '#12362A',
  verde: '#2D6A4F',
  musgo: '#74C69D',
  ambar: '#FFB700',
  arcilla: '#E8823C',    // segundo acento, misma temperatura que el ámbar
  crema: '#F2EFE6',      // blanco cálido, no el blanco frío de antes
  cremaSuave: '#E4DFD2',
  texto: '#14231C',
  atenuado: '#5E6E66',
  rojo: '#C1121F',
  azulCU: '#0F69C4',
};

export const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";
export const SANS = "'Archivo', 'Segoe UI', system-ui, sans-serif";

/** Carga las tipografías desde public/ para que el render no dependa de la red. */
export const Fuentes = () => (
  <style>{`
    @font-face{font-family:'Archivo';font-style:normal;font-weight:400;font-display:block;src:url('${staticFile('fuentes/Archivo-400-normal.woff2')}') format('woff2');}
    @font-face{font-family:'Archivo';font-style:normal;font-weight:500;font-display:block;src:url('${staticFile('fuentes/Archivo-500-normal.woff2')}') format('woff2');}
    @font-face{font-family:'Archivo';font-style:normal;font-weight:600;font-display:block;src:url('${staticFile('fuentes/Archivo-600-normal.woff2')}') format('woff2');}
    @font-face{font-family:'Archivo';font-style:normal;font-weight:700;font-display:block;src:url('${staticFile('fuentes/Archivo-700-normal.woff2')}') format('woff2');}
    @font-face{font-family:'Instrument Serif';font-style:normal;font-weight:400;font-display:block;src:url('${staticFile('fuentes/InstrumentSerif-400-normal.woff2')}') format('woff2');}
    @font-face{font-family:'Instrument Serif';font-style:italic;font-weight:400;font-display:block;src:url('${staticFile('fuentes/InstrumentSerif-400-italic.woff2')}') format('woff2');}
  `}</style>
);

/** Grano fino sobre todo: quita el aspecto de vector plano. */
export const Grano = ({ opacidad = 0.055 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', opacity: opacidad, mixBlendMode: 'overlay' }}>
    <svg width="100%" height="100%">
      <filter id="g">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#g)" />
    </svg>
  </AbsoluteFill>
);

/** Viñeta suave: centra la mirada sin oscurecer los bordes de golpe. */
export const Vineta = ({ fuerza = 0.5 }) => (
  <AbsoluteFill style={{
    pointerEvents: 'none',
    background: `radial-gradient(ellipse 78% 68% at 50% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,${fuerza}) 100%)`,
  }} />
);

/**
 * Metraje de fondo, teñido. El clip corre a su ritmo; no se le añade zoom.
 * `tinte` decide si la sección se siente bosque profundo o crema.
 */
export const Metraje = ({ clip, tinte = T.tinta, opacidad = 0.42, desat = 0.55 }) => (
  <AbsoluteFill>
    <Video
      src={staticFile(`clips/${clip}.mp4`)}
      startFrom={0}
      loop
      muted
      style={{
        width: '100%', height: '100%', objectFit: 'cover',
        filter: `saturate(${1 - desat}) contrast(1.06)`,
        opacity: opacidad,
      }}
    />
    <AbsoluteFill style={{ background: tinte, mixBlendMode: 'multiply', opacity: 0.55 }} />
    <AbsoluteFill style={{ background: tinte, opacity: 0.42 }} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ motion */

export const sube = (frame, retardo = 0, dist = 40, dur = 20) => {
  const p = interpolate(frame - retardo * 30, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const s = 1 - Math.pow(1 - p, 3);
  return { opacity: s, transform: `translateY(${(1 - s) * dist}px)` };
};

export const brota = (frame, fps, retardo = 0) => {
  const s = spring({ frame: frame - retardo * fps, fps, config: { damping: 200, mass: 0.55 } });
  return { opacity: s, transform: `translateY(${(1 - s) * 22}px)` };
};

/** Cortina que descubre el texto de izquierda a derecha. */
export const cortina = (frame, retardo = 0, dur = 0.75) => {
  const p = interpolate(frame - retardo * 30, [0, dur * 30], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const s = 1 - Math.pow(1 - p / 100, 3);
  return { clipPath: `inset(0 ${100 - s * 100}% 0 0)` };
};

export const numero = (frame, retardo, valor, dur = 1.5) => {
  const p = interpolate(frame - retardo * 30, [0, dur * 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return valor * (1 - Math.pow(1 - p, 4));
};

export const miles = (n) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/* ------------------------------------------------------------------ piezas */

/** Antetítulo en versales, con una regla que se dibuja. */
export const Rotulo = ({ texto, color = T.ambar, frame, retardo = 0 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...sube(frame, retardo, 18) }}>
    <div style={{ height: 2, width: 44, background: color,
                  transform: `scaleX(${interpolate(frame - retardo * 30, [0, 18], [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
                  transformOrigin: 'left' }} />
    <div style={{ fontFamily: SANS, color, fontSize: 19, letterSpacing: 3.6, fontWeight: 600 }}>
      {texto}
    </div>
  </div>
);

/** Titular serif, grande, con cortina. Acepta una palabra destacada. */
export const Declara = ({ children, frame, retardo = 0, tam = 96, color = T.crema, ancho = 1500 }) => (
  <h2 style={{
    fontFamily: SERIF, fontSize: tam, lineHeight: 1.03, fontWeight: 400,
    color, margin: 0, maxWidth: ancho, letterSpacing: -0.5,
    textWrap: 'pretty', ...cortina(frame, retardo),
  }}>
    {children}
  </h2>
);

export const Parrafo = ({ children, frame, retardo = 0, color = T.musgo, tam = 27, ancho = 900 }) => (
  <p style={{
    fontFamily: SANS, fontSize: tam, lineHeight: 1.5, color, margin: 0,
    maxWidth: ancho, fontWeight: 400, ...sube(frame, retardo, 24),
  }}>
    {children}
  </p>
);

export const marco = {
  width: 1920, height: 1080, boxSizing: 'border-box',
  position: 'relative', overflow: 'hidden',
};
