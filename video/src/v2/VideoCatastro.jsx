import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, staticFile,
  useCurrentFrame, useVideoConfig, interpolate,
} from 'remotion';
import { Portadilla, DUR_PORTADILLA } from '../Portadilla';
import { T, SERIF, SANS, Fuentes, Grano } from './base';
import ficha from '../beats_catastro.json';

export const FPS = 30;
export const DURACION_FRAMES = Math.round(ficha.total * FPS);

const BEATS = ficha.beats;

/* Encuadres, en coordenadas lógicas de 1920×1080 sobre la captura.
 * Las capturas se tomaron a 3840×2160 justamente para poder acercarse a 2,7×
 * sin que el texto del panel se empaste. */
const BANDA = 234;                 // la tira de conversación, abajo
const ALTO_IMAGEN = 1080 - BANDA;  // 846: lo que se ve de la captura
const CENTRO_Y = ALTO_IMAGEN / 2;

const ZONAS = {
  completo:    { x: 960,  y: 470, k: 1.00 },
  mapa:        { x: 1075, y: 560, k: 1.25 },
  panel:       { x: 285,  y: 300, k: 2.10 },
  filtros:     { x: 285,  y: 470, k: 2.00 },
  // El panel de indicadores está pegado al borde derecho de la captura, así que
  // CUALQUIER acercamiento sobre él arrastra el océano que tiene al lado: medido,
  // dos tercios del cuadro en blanco. Por eso este encuadre es partido — el mapa
  // a la izquierda y el panel a la derecha, cada uno con su propia escala.
  // El sujeto llega centrado en el área de mapa (x 565–1585) porque la captura
  // se pide con el lat/lon/z calculado del bbox oficial. Ya no hay que buscarlo.
  indicadores: { partido: true, anchoIzq: 880,
                 izq: { x: 1075, y: 560, k: 0.85 },
                 der: { x: 1752, y: 268, k: 2.60 } },
  cifra:       { x: 1700, y: 230, k: 2.40 },
  cabecera:    { x: 690,  y: 140, k: 2.20 },
};

const VOZ = {
  c: { nombre: 'Catalina', color: T.ambar },
  l: { nombre: 'Lorenzo',  color: T.musgo },
};

/** Lleva el punto (x,y) de la captura al centro del cuadro, a escala k, sin
 *  dejar que se vea fuera de la imagen. */
const encuadre = ({ x, y, k }, ancho = 1920, alto = ALTO_IMAGEN) => {
  const tx = Math.min(0, Math.max(ancho - 1920 * k, ancho / 2 - x * k));
  const ty = Math.min(0, Math.max(alto - 1080 * k, alto / 2 - y * k));
  return { tx, ty, k };
};

const mezclar = (a, b, p) => ({
  tx: a.tx + (b.tx - a.tx) * p,
  ty: a.ty + (b.ty - a.ty) * p,
  k: a.k + (b.k - a.k) * p,
});

const suave = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

const Captura = ({ foto, e, opacidad = 1, izquierda = 0, ancho = 1920 }) => (
  <div style={{
    position: 'absolute', left: izquierda, top: 0, width: ancho, height: ALTO_IMAGEN,
    overflow: 'hidden', opacity: opacidad, background: T.tinta,
  }}>
    <Img
      src={staticFile(`catastro/${foto}.png`)}
      style={{
        position: 'absolute', top: 0, left: 0, width: 1920, height: 1080,
        transformOrigin: '0 0',
        transform: `translate(${e.tx}px, ${e.ty}px) scale(${e.k})`,
      }}
    />
  </div>
);

/** Un plano en su encuadre, sea entero o partido. */
const Plano = ({ foto, zona, deriva, opacidad = 1 }) => {
  if (!zona.partido) {
    const e = encuadre(zona);
    return <Captura foto={foto} e={{ ...e, k: e.k * deriva }} opacidad={opacidad} />;
  }
  const a = zona.anchoIzq, b = 1920 - a;
  const ei = encuadre(zona.izq, a);
  const ed = encuadre(zona.der, b);
  return (
    <>
      <Captura foto={foto} e={{ ...ei, k: ei.k * deriva }} opacidad={opacidad} ancho={a} />
      <Captura foto={foto} e={{ ...ed, k: ed.k * deriva }} opacidad={opacidad}
               izquierda={a} ancho={b} />
      <div style={{ position: 'absolute', left: a - 1, top: 0, width: 2,
                    height: ALTO_IMAGEN, background: T.ambar, opacity: 0.55 * opacidad }} />
    </>
  );
};

/**
 * La cámara. Un solo componente lee el frame global y decide qué latido manda:
 * así, cuando dos latidos seguidos comparten captura, el encuadre VIAJA de uno a
 * otro en vez de saltar, y cuando cambian de captura hay fundido. Con
 * <Sequence> por latido esto no se puede hacer, porque cada una empieza a ciegas.
 */
const Camara = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + ficha.portadilla;   // la secuencia arranca en la portadilla

  let i = 0;
  for (let j = 0; j < BEATS.length; j++) if (t >= BEATS[j].inicio) i = j;
  const b = BEATS[i];
  const anterior = i > 0 ? BEATS[i - 1] : null;

  const zona = ZONAS[b.z] || ZONAS.completo;
  const zonaPrev = anterior ? (ZONAS[anterior.z] || ZONAS.completo) : zona;
  const dentro = t - b.inicio;
  const mismaFoto = anterior && anterior.foto === b.foto;

  // Viaje de encuadre sólo entre planos enteros de la misma captura. Entre un
  // plano entero y uno partido no hay interpolación posible: se corta.
  const viajable = mismaFoto && !zona.partido && !zonaPrev.partido;
  const p = viajable ? suave(Math.min(1, dentro / 0.7)) : 1;

  // Deriva mínima mientras dura el latido: da vida sin marear.
  const deriva = 1 + Math.min(dentro / Math.max(b.dur, 0.1), 1) * 0.012;

  const fundido = !mismaFoto && anterior
    ? interpolate(dentro, [0, 0.30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  if (viajable && p < 1) {
    const a = encuadre(zonaPrev), c = encuadre(zona);
    const e = mezclar(a, c, p);
    return (
      <AbsoluteFill style={{ background: T.tinta }}>
        <Captura foto={b.foto} e={{ ...e, k: e.k * deriva }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: T.tinta }}>
      {!mismaFoto && anterior && fundido < 1 ? (
        <Plano foto={anterior.foto} zona={zonaPrev} deriva={1}
 />
      ) : null}
      <Plano foto={b.foto} zona={zona} deriva={deriva} opacidad={fundido}
 />
    </AbsoluteFill>
  );
};

/**
 * La tira de conversación. Es una banda SÓLIDA, no un degradado: el mapa base
 * del visor es casi blanco y sobre él ningún degradado garantiza leer el
 * subtítulo. Se ven los dos nombres siempre —quien habla, encendido— porque eso
 * es lo que dice de un vistazo que esto es una conversación y no una locución.
 *
 * El rótulo va ARRIBA, sobre la imagen: nombra lo que se está MIRANDO. El
 * subtítulo va abajo: es lo que se está OYENDO, palabra por palabra.
 */
const Pie = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + ficha.portadilla;   // la secuencia arranca en la portadilla

  let i = 0;
  for (let j = 0; j < BEATS.length; j++) if (t >= BEATS[j].inicio) i = j;
  const b = BEATS[i];
  const v = VOZ[b.v];
  const dentro = t - b.inicio;
  const entra = interpolate(dentro, [0, 0.12], [0, 1],
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

/** Barra de avance: 79 latidos son muchos, y ayuda saber por dónde va. */
const Avance = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame / fps + ficha.portadilla, [ficha.portadilla, ficha.total], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4,
                  background: 'rgba(255,255,255,0.10)' }}>
      <div style={{ height: '100%', width: `${p * 100}%`, background: T.ambar }} />
    </div>
  );
};

export const VideoCatastro = () => (
  <AbsoluteFill style={{ background: T.tinta }}>
    <Fuentes />
    <Sequence from={0} durationInFrames={Math.round(DUR_PORTADILLA * FPS)}>
      <Portadilla
        titulo={'Catastro de Usos\nde la Tierra'}
        bajada="Un millón ochocientos veintisiete mil polígonos, en el navegador."
      />
    </Sequence>
    <Sequence from={Math.round(DUR_PORTADILLA * FPS)}>
      <Camara />
      <Grano opacidad={0.035} />
      <Pie />
      <Avance />
    </Sequence>
    <Audio src={staticFile('intro.mp3')} />
    <Audio src={staticFile('narracion_catastro.mp3')} />
  </AbsoluteFill>
);
