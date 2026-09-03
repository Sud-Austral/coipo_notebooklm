import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { T, SERIF, SANS, Metraje, Grano, Vineta } from './base';
import { ALTO_ESCENA } from './motor';
import catalogo from '../catalogo.json';

/* --------------------------------------------------------------- escenas
 * Planos para los vídeos que no tienen interfaz que enseñar. Van dentro de los
 * 846 px que deja la tira de conversación, no en 1080: los arquetipos viejos
 * estaban hechos para el cuadro entero y encogerlos dejaba el texto pequeño.
 *
 * `dentro` son los segundos transcurridos desde que empezó LA ESCENA, no el
 * latido. Así una explicación de cuatro frases se ve como un plano que respira
 * y no como cuatro cortes.
 */

const marco = {
  width: 1920, height: ALTO_ESCENA, position: 'relative', overflow: 'hidden',
  boxSizing: 'border-box',
};

const sube = (d, retardo = 0, dist = 34, dur = 0.6) => {
  const p = interpolate(d - retardo, [0, dur], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s = 1 - Math.pow(1 - p, 3);
  return { opacity: s, transform: `translateY(${(1 - s) * dist}px)` };
};

const cortina = (d, retardo = 0, dur = 0.7) => {
  const p = interpolate(d - retardo, [0, dur], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s = 1 - Math.pow(1 - p, 3);
  return { clipPath: `inset(0 ${100 - s * 100}% 0 0)` };
};

const Rot = ({ texto, color = T.ambar, d, retardo = 0 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 15, ...sube(d, retardo, 16) }}>
    <div style={{ height: 2, width: 40, background: color }} />
    <div style={{ fontFamily: SANS, color, fontSize: 19, letterSpacing: 3.4, fontWeight: 700 }}>
      {texto}
    </div>
  </div>
);

/* --- Titular: una frase grande sobre metraje. Para ganchos y remates. --- */
export const Titular = ({ rotulo, frase, clip = 'bosque_aereo', acento = T.ambar, d }) => (
  <AbsoluteFill style={{ ...marco, background: T.tinta }}>
    <Metraje clip={clip} opacidad={0.48} />
    <Vineta fuerza={0.55} />
    <AbsoluteFill style={{ padding: '0 120px', display: 'flex', flexDirection: 'column',
                           justifyContent: 'center', gap: 34 }}>
      {rotulo ? <Rot texto={rotulo} color={acento} d={d} retardo={0.1} /> : null}
      <h2 style={{ fontFamily: SERIF, fontSize: 92, lineHeight: 1.04, fontWeight: 400,
                   color: T.crema, margin: 0, maxWidth: 1560, letterSpacing: -0.5,
                   ...cortina(d, 0.35) }}>
        {frase}
      </h2>
    </AbsoluteFill>
    <Grano />
  </AbsoluteFill>
);

/* --- Cifra: un número que manda, con su contexto al lado. --- */
export const Cifra = ({ rotulo, valor, unidad, texto, clip = 'montana', d }) => {
  const p = interpolate(d - 0.3, [0, 1.2], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const n = Math.round(valor * (1 - Math.pow(1 - p, 4)));
  return (
    <AbsoluteFill style={{ ...marco, background: T.tinta }}>
      <Metraje clip={clip} opacidad={0.3} />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', padding: '0 120px', gap: 70 }}>
        <div style={{ fontFamily: SERIF, fontSize: 340, lineHeight: 0.84, color: T.ambar,
                      letterSpacing: -12, ...sube(d, 0.2, 40) }}>
          {n}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 980 }}>
          {rotulo ? <Rot texto={rotulo} d={d} retardo={0.1} /> : null}
          <div style={{ fontFamily: SERIF, fontSize: 68, lineHeight: 1.08, color: T.crema,
                        ...cortina(d, 0.6) }}>
            {unidad}
          </div>
          {texto ? (
            <div style={{ fontFamily: SANS, fontSize: 27, lineHeight: 1.5, color: T.musgo,
                          ...sube(d, 1.1, 22) }}>
              {texto}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
      <Vineta fuerza={0.45} />
      <Grano />
    </AbsoluteFill>
  );
};

/* --- Lista: puntos que entran uno a uno, sobre fondo claro. --- */
export const Lista = ({ rotulo, titulo, items, clip = 'dosel', invertido, d }) => (
  <AbsoluteFill style={{ ...marco, background: T.crema, display: 'flex',
                         flexDirection: invertido ? 'row-reverse' : 'row' }}>
    <div style={{ width: 560, position: 'relative', overflow: 'hidden' }}>
      <Metraje clip={clip} opacidad={0.85} tinte={T.bosque} desat={0.25} />
      <AbsoluteFill style={{
        background: `linear-gradient(${invertido ? 90 : 270}deg, ${T.crema} 0%, rgba(242,239,230,0) 26%)`,
      }} />
    </div>
    <div style={{ flexGrow: 1, padding: '70px 84px', display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', gap: 26 }}>
      {rotulo ? <Rot texto={rotulo} color={T.arcilla} d={d} retardo={0.1} /> : null}
      <h2 style={{ fontFamily: SERIF, fontSize: 68, lineHeight: 1.06, fontWeight: 400,
                   color: T.texto, margin: 0, maxWidth: 940, ...cortina(d, 0.35) }}>
        {titulo}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 17, marginTop: 10 }}>
        {items.map((it, i) => (
          <div key={it} style={{ display: 'flex', gap: 20, alignItems: 'baseline',
                                 ...sube(d, 0.9 + i * 0.28, 18) }}>
            <div style={{ fontFamily: SERIF, fontSize: 34, color: T.arcilla, width: 44 }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 29, color: T.texto, lineHeight: 1.35 }}>
              {it}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Grano opacidad={0.04} />
  </AbsoluteFill>
);

/* --- Pasos: la máquina de estados, encendiéndose. --- */
export const Pasos = ({ rotulo, titulo, pasos, clip = 'nubes', d }) => (
  <AbsoluteFill style={{ ...marco, background: T.tinta }}>
    <Metraje clip={clip} opacidad={0.22} />
    <AbsoluteFill style={{ padding: '64px 84px', display: 'flex', flexDirection: 'column' }}>
      <Rot texto={rotulo} d={d} retardo={0.1} />
      <h2 style={{ fontFamily: SERIF, fontSize: 66, fontWeight: 400, color: T.crema,
                   margin: '18px 0 0', ...cortina(d, 0.35) }}>
        {titulo}
      </h2>
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
          {pasos.map((p, i) => {
            const on = interpolate(d - (1.0 + i * 0.9), [0, 0.5], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const col = i === pasos.length - 1 ? T.ambar : T.musgo;
            return (
              <React.Fragment key={p.t}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                    <div style={{
                      width: 19, height: 19, borderRadius: '50%',
                      background: on > 0.4 ? col : 'transparent',
                      border: `2px solid ${on > 0.4 ? col : '#2a5442'}`,
                      boxShadow: on > 0.6 ? `0 0 24px ${col}88` : 'none',
                    }} />
                    <div style={{ fontFamily: SANS, fontSize: 16, letterSpacing: 2.2,
                                  fontWeight: 700, color: on > 0.4 ? col : '#3c6a56' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div style={{ paddingRight: 26, opacity: 0.25 + on * 0.75,
                                transform: `translateY(${(1 - on) * 12}px)` }}>
                    <div style={{ fontFamily: SERIF, fontSize: 44, color: T.crema, lineHeight: 1.08 }}>
                      {p.t}
                    </div>
                    <div style={{ fontFamily: SANS, fontSize: 21, color: T.musgo,
                                  lineHeight: 1.4, marginTop: 11 }}>
                      {p.c}
                    </div>
                  </div>
                </div>
                {i < pasos.length - 1 ? (
                  <div style={{ width: 54, height: 2, background: '#25503f', marginTop: 9,
                                position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: T.ambar,
                                  transform: `scaleX(${interpolate(d - (1.5 + i * 0.9), [0, 0.45], [0, 1],
                                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
                                  transformOrigin: 'left' }} />
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
    <Grano />
  </AbsoluteFill>
);

/* --- Familia: capítulo de una familia de repositorios. --- */
export const Familia = ({ indice, nombre, color, repos, clip = 'dosel', lado = 'izq', d }) => {
  const der = lado === 'der';
  const dos = repos.length > 4;
  return (
    <AbsoluteFill style={{ ...marco, background: T.tinta }}>
      <Metraje clip={clip} opacidad={0.24} />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 52% 80% at ${der ? '16%' : '84%'} 50%, ${color}2e 0%, rgba(0,0,0,0) 68%)`,
      }} />
      <AbsoluteFill style={{ padding: '0 96px', display: 'flex', flexDirection: 'column',
                             justifyContent: 'center' }}>
        <div style={{ width: 1180, marginLeft: der ? 'auto' : 0, textAlign: der ? 'right' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32,
                        flexDirection: der ? 'row-reverse' : 'row' }}>
            <div style={{ fontFamily: SERIF, fontSize: 168, lineHeight: 0.78, color,
                          letterSpacing: -8, ...sube(d, 0.12, 30) }}>
              {String(indice).padStart(2, '0')}
            </div>
            <div style={{ paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 12,
                            flexDirection: der ? 'row-reverse' : 'row', ...sube(d, 0.3, 14) }}>
                <div style={{ height: 2, width: 34, background: color }} />
                <div style={{ fontFamily: SANS, fontSize: 17, letterSpacing: 3, fontWeight: 700, color }}>
                  {repos.length} PROYECTOS
                </div>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 74, fontWeight: 400, color: T.crema,
                           margin: 0, maxWidth: 860, ...cortina(d, 0.5) }}>
                {nombre}
              </h2>
            </div>
          </div>
          <div style={{ marginTop: 44, display: 'grid', columnGap: 44, rowGap: 13,
                        gridTemplateColumns: dos ? '1fr 1fr' : '1fr', gridAutoFlow: 'column',
                        gridTemplateRows: `repeat(${Math.ceil(repos.length / (dos ? 2 : 1))}, auto)` }}>
            {repos.map((r, i) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 15,
                                    flexDirection: der ? 'row-reverse' : 'row',
                                    ...sube(d, 1.0 + i * 0.16, 14) }}>
                <div style={{ width: 9, height: 9, background: color, flexShrink: 0 }} />
                <div style={{ fontFamily: SANS, fontSize: 26, color: T.crema, lineHeight: 1.25 }}>{r}</div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Vineta fuerza={0.5} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, [der ? 'right' : 'left']: 0,
                    width: 7, background: color }} />
      <Grano />
    </AbsoluteFill>
  );
};

/* --- Mapa: los 49 de una vez. --- */
export const Mapa = ({ grupos, pie, d }) => (
  <AbsoluteFill style={{ ...marco, background: T.tinta }}>
    <Metraje clip="bosque_aereo" opacidad={0.18} />
    <AbsoluteFill style={{ padding: '52px 74px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
                    gap: 16, flexGrow: 1, alignContent: 'start' }}>
        {grupos.map((g, gi) => (
          <div key={g.nombre} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5,
                          ...sube(d, 0.2 + gi * 0.12, 10) }}>
              <div style={{ width: 20, height: 3, background: g.color }} />
              <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: T.crema,
                            lineHeight: 1.2 }}>
                {g.nombre}
              </div>
            </div>
            {g.items.map((it, i) => (
              <div key={it} style={{
                fontFamily: SANS, fontSize: 14, color: '#a9c9b8', padding: '6px 10px',
                borderLeft: `2px solid ${g.color}`, background: 'rgba(18,54,42,0.6)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                opacity: interpolate(d - (1.2 + gi * 0.3 + i * 0.07), [0, 0.35], [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}>
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
      {pie ? (
        <div style={{ borderTop: '1px solid #24503e', paddingTop: 18, marginTop: 14,
                      fontFamily: SERIF, fontSize: 34, color: T.ambar, ...sube(d, 5.5, 16) }}>
          {pie}
        </div>
      ) : null}
    </AbsoluteFill>
    <Grano />
  </AbsoluteFill>
);

/* ------------------------------------------------------------ los mapas */

const PASOS = [
  { t: 'Pendiente', c: 'Aún no se revisa.' },
  { t: 'Revisado', c: 'Alguien lo validó.' },
  { t: 'Impreso', c: 'Ya existe en papel.' },
  { t: 'Esperando firma', c: 'Está fuera de la oficina.' },
  { t: 'Completado', c: 'Volvió firmado.' },
];

export const EscenaContrato = ({ id, dentro: d }) => {
  switch (id) {
    case 'gancho':
      return <Titular d={d} rotulo="GESTIÓN DE CONTRATOS · CONAF"
        frase={<>Un contrato sale a firma. <em style={{ fontStyle: 'italic', color: T.ambar }}>¿Cuánto lleva fuera?</em></>}
        clip="dosel" />;
    case 'quees':
      return <Lista d={d} rotulo="UNIDAD DE INFORMACIÓN Y ANÁLISIS"
        titulo="El ciclo de vida completo del contrato físico"
        items={['React 18 y Vite, en una sola página',
                'FastAPI en Python guarda el estado',
                'PostgreSQL: el expediente y su histórico']} clip="rio" />;
    case 'papel':
      return <Lista d={d} rotulo="EL PROBLEMA DEL PAPEL" titulo="El papel circula"
        items={['Se imprime y sale del sistema',
                'Cambia de manos, espera en un escritorio',
                'Y nadie lleva la cuenta']} clip="dosel" invertido />;
    case 'remate1':
      return <Titular d={d}
        frase={<>El sistema no elimina el papel.<br /><em style={{ fontStyle: 'italic', color: T.ambar }}>Le pone seguimiento.</em></>}
        clip="montana" />;
    case 'estados':
      return <Pasos d={d} rotulo="LA MÁQUINA DE ESTADOS" titulo="Cinco estados, y solo cinco"
        pasos={PASOS} clip="nubes" />;
    case 'salto':
      return <Titular d={d} rotulo="NINGUNO SE SALTA"
        frase={<>Si alguien lo intenta, el servidor <em style={{ fontStyle: 'italic', color: T.arcilla }}>rechaza la transición.</em></>}
        clip="bosque_aereo" acento={T.arcilla} />;
    case 'plantillas':
      return <Lista d={d} rotulo="DOCUMENTOS" titulo="Plantillas registradas, campos que se adaptan"
        items={['Indefinido, honorarios y las demás modalidades',
                'Los campos viven en JSON, no en columnas fijas',
                'El PDF se abre dentro de la aplicación']} clip="dosel" />;
    case 'bandeja':
      return <Lista d={d} rotulo="LA BANDEJA" titulo="El trabajo, ordenado por estado"
        items={['Cuatro pestañas por estado',
                'Un panel por persona, con su ficha y su flujo',
                'El punto exacto de cada caso, de un vistazo']} clip="rio" invertido />;
    case 'seguridad':
      return <Titular d={d} rotulo="SEGURIDAD"
        frase={<>Tener la dirección de un documento <em style={{ fontStyle: 'italic', color: T.ambar }}>no basta para abrirlo.</em></>}
        clip="montana" />;
    case 'infra':
      return <Cifra d={d} rotulo="INFRAESTRUCTURA" valor={32}
        unidad="procesadores, repartidos en cuatro máquinas"
        texto="Noventa y seis gigas de memoria y dos teras de disco: la base de datos, el backend, los trabajos que generan los documentos y la puerta de entrada."
        clip="bosque_aereo" />;
    default:
      return <Titular d={d}
        frase={<>Un contrato en papel seguirá siendo papel.<br /><em style={{ fontStyle: 'italic', color: T.ambar }}>Pero ya se sabe dónde está.</em></>}
        clip="montana" />;
  }
};

/* Paleta más luminosa que la del catálogo: la de allí se pensó para fondo
 * claro y sobre el verde tinta el territorio y la plataforma desaparecían. */
const COLOR = ['#E5383B', '#F4813F', '#52B788', '#95D5B2',
               '#4CA3F5', '#9DB3AC', '#A78BFA', '#FFC233'];
const F = catalogo.familias.map((f, i) => ({ ...f, color: COLOR[i] }));
const titulos = (i) => F[i].repos.map((r) => r.titulo);

const FAMILIAS = {
  incendios: [0, 'pirocumulo', 'izq'], fiscalizacion: [1, 'dosel', 'der'],
  territorio: [2, 'montana', 'izq'], arborizacion: [3, 'bosque_aereo', 'der'],
  personas: [4, 'rio', 'izq'], plataforma: [5, 'nubes', 'der'],
  gestion: [6, 'dosel', 'izq'], conocimiento: [7, 'rio', 'der'],
};

export const EscenaEcosistema = ({ id, dentro: d }) => {
  if (FAMILIAS[id]) {
    const [i, clip, lado] = FAMILIAS[id];
    return <Familia d={d} indice={i + 1} nombre={F[i].nombre} color={F[i].color}
      repos={titulos(i)} clip={clip} lado={lado} />;
  }
  switch (id) {
    case 'gancho':
      return <Titular d={d} rotulo="CONAF · UNIDAD DE INFORMACIÓN Y ANÁLISIS"
        frase={<>Cuarenta y nueve repositorios.<br /><em style={{ fontStyle: 'italic', color: T.ambar }}>Todos empiezan por la misma palabra.</em></>}
        clip="bosque_aereo" />;
    case 'coipo':
      return <Cifra d={d} rotulo="COIPO" valor={8}
        unidad="familias, no cuarenta y nueve ideas sueltas"
        texto="Coipo es el roedor que da nombre a cada proyecto de la unidad. Los repositorios se agrupan por el trabajo al que sirven."
        clip="rio" />;
    case 'remate':
      return <Titular d={d} rotulo="PLATAFORMA Y DATOS"
        frase={<>Nadie los abre nunca. Y si fallan, <em style={{ fontStyle: 'italic', color: T.arcilla }}>no funciona ninguno de los demás.</em></>}
        clip="nubes" acento={T.arcilla} />;
    case 'mapa':
      return <Mapa d={d} pie="Del fuego a los contratos, del catastro a la sala de clases."
        grupos={F.map((f) => ({ nombre: f.nombre, color: f.color,
                                items: f.repos.map((r) => r.titulo) }))} />;
    default:
      return <Titular d={d}
        frase={<>Ocho familias. Cuarenta y nueve repositorios.<br /><em style={{ fontStyle: 'italic', color: T.ambar }}>Una sola unidad.</em></>}
        clip="montana" />;
  }
};
