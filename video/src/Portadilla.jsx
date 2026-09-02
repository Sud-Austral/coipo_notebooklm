import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, FUENTE } from './estilo';
import { entrar, trazar } from './animacion';

export const DUR_PORTADILLA = 10; // segundos, coincide con public/intro.mp3

/**
 * Diez segundos de cortesía antes de empezar: Forestín, el título y música.
 * Sirve para que la sala termine de sentarse y guarde silencio.
 * La imagen viene con fondo negro, así que se funde en modo `screen` sobre el
 * verde en vez de recortarla.
 */
export const Portadilla = ({ titulo, bajada }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = DUR_PORTADILLA * fps;

  // Forestín entra saludando: sube, y luego respira muy despacio.
  const subir = interpolate(frame, [8, 46], [70, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const respirar = Math.sin((frame / fps) * 1.1) * 6;
  const aparecerF = interpolate(frame, [8, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const salida = interpolate(frame, [f - 18, f], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: C.verdeProfundo, fontFamily: FUENTE, opacity: salida }}>
      {/* halo suave detrás de la mascota */}
      <div
        style={{
          position: 'absolute',
          right: 250,
          top: 90,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #2d6a4f 0%, rgba(45,106,79,0) 68%)',
          opacity: 0.75,
        }}
      />

      <Img
        src={staticFile('forestin.jpeg')}
        style={{
          position: 'absolute',
          right: 210,
          bottom: -40,
          height: 1020,
          mixBlendMode: 'screen',
          opacity: aparecerF,
          transform: `translateY(${subir + respirar}px)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 0,
          bottom: 0,
          width: 980,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <div style={entrar(frame, 0.3)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 46, height: 4, background: C.ambar }} />
            <div style={{ color: C.verdeSuave, fontSize: 22, letterSpacing: 3.4, fontWeight: 600 }}>
              CORPORACIÓN NACIONAL FORESTAL
            </div>
          </div>
        </div>

        <h1
          style={{
            margin: '26px 0 0 0',
            color: C.blanco,
            fontSize: 86,
            lineHeight: 1.06,
            fontWeight: 700,
            letterSpacing: -1.8,
            ...entrar(frame, 0.9, 44),
          }}
        >
          {titulo}
        </h1>

        <div
          style={{
            height: 5,
            width: `${trazar(frame, 1.9) * 1.6}px`,
            background: C.ambar,
            margin: '34px 0 30px 0',
          }}
        />

        <p style={{ margin: 0, color: C.verdeClaro, fontSize: 31, lineHeight: 1.42, ...entrar(frame, 2.3) }}>
          {bajada}
        </p>

        <div
          style={{
            marginTop: 54,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            ...entrar(frame, 4.2),
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.ambar}
               strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <div style={{ color: C.verdeSuave, fontSize: 25, letterSpacing: 1.2 }}>
            Comenzamos en unos segundos
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
