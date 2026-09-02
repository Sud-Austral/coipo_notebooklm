// Utilidades de movimiento. Todo el movimiento del vídeo entra por aquí, para
// que sea deliberado: un elemento aparece porque la narración lo nombra, no
// porque el fondo se mueva sin motivo.
import { interpolate, spring } from 'remotion';

export const FPS = 30;

/** Entrada suave desde abajo. `retardo` en segundos desde el inicio de la sección. */
export const entrar = (frame, retardo = 0, dist = 34) => {
  const f = frame - retardo * FPS;
  const p = interpolate(f, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * dist}px)`,
  };
};

/** Entrada con rebote contenido, para tarjetas y cifras. */
export const aparecer = (frame, fps, retardo = 0) => {
  const s = spring({
    frame: frame - retardo * fps,
    fps,
    config: { damping: 200, mass: 0.6 },
  });
  return {
    opacity: s,
    transform: `translateY(${(1 - s) * 26}px) scale(${0.97 + s * 0.03})`,
  };
};

/** Cuenta ascendente hacia `valor`, con frenada al final. */
export const contar = (frame, retardo, valor, dur = 1.4) => {
  const f = frame - retardo * FPS;
  const p = interpolate(f, [0, dur * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const suave = 1 - Math.pow(1 - p, 3);
  return valor * suave;
};

/** Miles con punto, como se escribe en Chile. */
export const miles = (n) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Trazo que se dibuja de izquierda a derecha. */
export const trazar = (frame, retardo, dur = 1.2) =>
  interpolate(frame - retardo * FPS, [0, dur * FPS], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Fundido de entrada y salida de una sección completa. */
export const fundido = (frame, duracionFrames, entrada = 14, salida = 14) =>
  interpolate(
    frame,
    [0, entrada, duracionFrames - salida, duracionFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
