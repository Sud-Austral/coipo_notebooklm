import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
  T, SERIF, SANS, Metraje, Grano, Vineta, Rotulo, Declara, Parrafo,
  sube, brota, cortina, numero, miles, marco,
} from './base';

/* Seis maneras distintas de ocupar el cuadro. Ninguna sección repite la de al
 * lado: esa alternancia es lo que quita la sensación de pase de diapositivas. */

/* --- 1. DECLARACIÓN: una frase enorme sobre metraje. Para los remates. --- */
export const Declaracion = ({ rotulo, frase, apoyo, clip = 'bosque_aereo', acento = T.ambar }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ ...marco, background: T.tinta }}>
      <Metraje clip={clip} opacidad={0.5} />
      <Vineta fuerza={0.55} />
      <AbsoluteFill style={{ padding: '0 130px', display: 'flex', flexDirection: 'column',
                             justifyContent: 'center', gap: 40 }}>
        {rotulo ? <Rotulo texto={rotulo} color={acento} frame={frame} retardo={0.1} /> : null}
        <Declara frame={frame} retardo={0.5} tam={94} ancho={1620}>{frase}</Declara>
        {apoyo ? <Parrafo frame={frame} retardo={1.6} tam={30} ancho={1050}>{apoyo}</Parrafo> : null}
      </AbsoluteFill>
      <Grano />
    </AbsoluteFill>
  );
};

/* --- 2. NUMERAL: una cifra gigante que sangra, contexto pequeño al lado. --- */
export const Numeral = ({ rotulo, valor, sufijo, unidad, texto, clip = 'montana', formato }) => {
  const frame = useCurrentFrame();
  const v = formato ? formato(numero(frame, 0.5, valor)) : Math.round(numero(frame, 0.5, valor));
  return (
    <AbsoluteFill style={{ ...marco, background: T.tinta }}>
      <Metraje clip={clip} opacidad={0.34} />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 130, top: '50%',
                      transform: 'translateY(-50%)', ...sube(frame, 0.3, 50, 26) }}>
          <div style={{ fontFamily: SERIF, fontSize: 430, lineHeight: 0.82, color: T.ambar,
                        letterSpacing: -14 }}>
            {v}{sufijo || ''}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 660, top: '50%', transform: 'translateY(-50%)',
                      width: 1060, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <Rotulo texto={rotulo} frame={frame} retardo={0.1} />
          <div style={{ fontFamily: SERIF, fontSize: 76, lineHeight: 1.06, color: T.crema,
                        ...cortina(frame, 0.8) }}>
            {unidad}
          </div>
          <Parrafo frame={frame} retardo={1.5} tam={27} ancho={880}>{texto}</Parrafo>
        </div>
      </AbsoluteFill>
      <Vineta fuerza={0.45} />
      <Grano />
    </AbsoluteFill>
  );
};

/* --- 3. PARTIDO: dos tercios de texto, un tercio de metraje a sangre. --- */
export const Partido = ({ rotulo, titulo, puntos, clip = 'dosel', invertido }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const media = (
    <div style={{ width: 700, position: 'relative', overflow: 'hidden' }}>
      <Metraje clip={clip} opacidad={0.85} tinte={T.bosque} desat={0.25} />
      <AbsoluteFill style={{ background: `linear-gradient(${invertido ? 90 : 270}deg, ${T.crema} 0%, rgba(242,239,230,0) 26%)` }} />
    </div>
  );
  const texto = (
    <div style={{ flexGrow: 1, padding: '96px 92px', display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', gap: 30 }}>
      <Rotulo texto={rotulo} color={T.arcilla} frame={frame} retardo={0.1} />
      <Declara frame={frame} retardo={0.5} tam={76} color={T.texto} ancho={880}>{titulo}</Declara>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 14 }}>
        {puntos.map((p, i) => (
          <div key={p.t} style={{ display: 'flex', gap: 22, alignItems: 'flex-start',
                                  ...brota(frame, fps, 2.2 + i * 1.7) }}>
            <div style={{ fontFamily: SERIF, fontSize: 38, color: T.arcilla, lineHeight: 1, width: 46 }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 600, color: T.texto, lineHeight: 1.25 }}>{p.t}</div>
              <div style={{ fontFamily: SANS, fontSize: 23, color: T.atenuado, lineHeight: 1.5, marginTop: 5 }}>{p.c}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ ...marco, background: T.crema, display: 'flex',
                           flexDirection: invertido ? 'row-reverse' : 'row' }}>
      {media}
      {texto}
      <Grano opacidad={0.04} />
    </AbsoluteFill>
  );
};

/* --- 4. RECORRIDO: pasos encadenados que se encienden uno a uno. --- */
export const Recorrido = ({ rotulo, titulo, pasos, nota, clip = 'nubes' }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ ...marco, background: T.tinta }}>
      <Metraje clip={clip} opacidad={0.22} />
      <AbsoluteFill style={{ padding: '84px 88px', display: 'flex', flexDirection: 'column' }}>
        <Rotulo texto={rotulo} frame={frame} retardo={0.1} />
        <div style={{ marginTop: 20, marginBottom: 56 }}>
          <Declara frame={frame} retardo={0.45} tam={72} ancho={1500}>{titulo}</Declara>
        </div>

        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
          {pasos.map((p, i) => {
            const on = interpolate(frame - p.en * 30, [0, 16], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const ultimo = i === pasos.length - 1;
            const col = p.destacado ? T.ambar : T.musgo;
            return (
              <React.Fragment key={p.t}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: on > 0.4 ? col : 'transparent',
                      border: `2px solid ${on > 0.4 ? col : '#2a5442'}`,
                      boxShadow: on > 0.6 ? `0 0 26px ${col}88` : 'none',
                      transform: `scale(${0.7 + on * 0.3})`,
                    }} />
                    <div style={{ fontFamily: SANS, fontSize: 17, letterSpacing: 2.4, fontWeight: 700,
                                  color: on > 0.4 ? col : '#3c6a56' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div style={{ paddingRight: 28, opacity: 0.25 + on * 0.75,
                                transform: `translateY(${(1 - on) * 14}px)` }}>
                    <div style={{ fontFamily: SERIF, fontSize: 50, color: T.crema, lineHeight: 1.08 }}>{p.t}</div>
                    <div style={{ fontFamily: SANS, fontSize: 23, color: T.musgo, lineHeight: 1.45, marginTop: 14 }}>{p.c}</div>
                  </div>
                </div>
                {!ultimo ? (
                  <div style={{ width: 60, height: 2, background: '#25503f', marginTop: 9, position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: T.ambar,
                                  transform: `scaleX(${interpolate(frame - (p.en + 0.9) * 30, [0, 14], [0, 1],
                                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
                                  transformOrigin: 'left' }} />
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        </div>

        {nota ? (
          <div style={{ borderTop: '1px solid #24503e', paddingTop: 26,
                        display: 'flex', alignItems: 'center', gap: 18, ...sube(frame, nota.en, 18) }}>
            <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, letterSpacing: 1.4,
                           background: '#5a2410', color: '#ffc4a8', padding: '8px 15px', borderRadius: 4 }}>
              {nota.chip}
            </span>
            <span style={{ fontFamily: SANS, fontSize: 24, color: T.musgo }}>{nota.texto}</span>
          </div>
        ) : null}
      </AbsoluteFill>
      <Grano />
    </AbsoluteFill>
  );
};

/* --- 5. CONSTELACIÓN: una pieza mayor y el resto orbitando. Sin rejilla. --- */
export const Constelacion = ({ rotulo, titulo, hero, resto, clip = 'rio' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ ...marco, background: T.crema }}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 620, overflow: 'hidden' }}>
        <Metraje clip={clip} opacidad={0.5} tinte={T.bosque} desat={0.4} />
        <AbsoluteFill style={{ background: `linear-gradient(90deg, ${T.crema} 0%, rgba(242,239,230,0) 40%)` }} />
      </div>

      <AbsoluteFill style={{ padding: '84px 92px', display: 'flex', flexDirection: 'column' }}>
        <Rotulo texto={rotulo} color={T.arcilla} frame={frame} retardo={0.1} />
        <div style={{ marginTop: 18, marginBottom: 44 }}>
          <Declara frame={frame} retardo={0.45} tam={70} color={T.texto} ancho={1180}>{titulo}</Declara>
        </div>

        <div style={{ display: 'flex', gap: 30, flexGrow: 1, alignItems: 'center' }}>
          <div style={{ width: 560, minHeight: 430, background: T.tinta, borderRadius: 4, padding: '44px 42px',
                        display: 'flex', flexDirection: 'column', gap: 18, ...brota(frame, fps, 1.6) }}>
            <div style={{ fontFamily: SANS, fontSize: 17, letterSpacing: 2.6, color: T.ambar, fontWeight: 700 }}>
              {hero.etiqueta}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 54, color: T.crema, lineHeight: 1.1 }}>{hero.t}</div>
            <div style={{ fontFamily: SANS, fontSize: 23, color: T.musgo, lineHeight: 1.55 }}>{hero.c}</div>
            {hero.pie ? (
              <div style={{ marginTop: 'auto', fontFamily: SANS, fontSize: 21, color: T.ambar, fontWeight: 600 }}>
                {hero.pie}
              </div>
            ) : null}
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', gap: 30 }}>
            {resto.map((r, i) => (
              <div key={r.t}
                   style={{ borderLeft: `3px solid ${T.verde}`, paddingLeft: 22, paddingTop: 4, paddingBottom: 4,
                            ...brota(frame, fps, 3.2 + i * 1.5) }}>
                <div style={{ fontFamily: SANS, fontSize: 27, fontWeight: 600, color: T.texto, lineHeight: 1.2 }}>{r.t}</div>
                <div style={{ fontFamily: SANS, fontSize: 21, color: T.atenuado, lineHeight: 1.45, marginTop: 4 }}>{r.c}</div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Grano opacidad={0.04} />
    </AbsoluteFill>
  );
};

/* --- 6. ÍNDICE: muchos elementos, jerarquía por color y tamaño. --- */
export const Indice = ({ rotulo, titulo, grupos, pie, clip = 'bosque_aereo' }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ ...marco, background: T.tinta }}>
      <Metraje clip={clip} opacidad={0.2} />
      <AbsoluteFill style={{ padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <Declara frame={frame} retardo={0.2} tam={62} ancho={900}>{titulo}</Declara>
          <div style={{ fontFamily: SANS, fontSize: 24, color: T.ambar, fontWeight: 600,
                        letterSpacing: 1.4, ...sube(frame, 0.9, 16) }}>
            {rotulo}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
                      gap: 18, marginTop: 34, flexGrow: 1, alignContent: 'start' }}>
          {grupos.map((g, gi) => (
            <div key={g.nombre} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
                            ...sube(frame, 0.5 + gi * 0.16, 12) }}>
                <div style={{ width: 22, height: 3, background: g.color }} />
                <div style={{ fontFamily: SANS, fontSize: 17, fontWeight: 700, color: T.crema,
                              letterSpacing: 0.4, lineHeight: 1.2 }}>
                  {g.nombre}
                </div>
              </div>
              {g.items.map((it, i) => (
                <div key={it}
                     style={{ fontFamily: SANS, fontSize: 15, color: '#a9c9b8',
                              padding: '7px 11px', borderLeft: `2px solid ${g.color}`,
                              background: 'rgba(18,54,42,0.6)',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              opacity: interpolate(frame - (2 + gi * 0.45 + i * 0.11) * 30, [0, 11], [0, 1],
                                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
                  {it}
                </div>
              ))}
            </div>
          ))}
        </div>

        {pie ? (
          <div style={{ borderTop: '1px solid #24503e', paddingTop: 22, marginTop: 20,
                        fontFamily: SERIF, fontSize: 34, color: T.ambar, ...sube(frame, 10, 18) }}>
            {pie}
          </div>
        ) : null}
      </AbsoluteFill>
      <Grano />
    </AbsoluteFill>
  );
};

/* --- 7. FAMILIA: capítulo de una familia de repositorios.
 * Ocho secciones seguidas con la misma estructura serían monotonía otra vez,
 * así que el ancla cambia de lado y el color viene de la familia: el ojo
 * reconoce el patrón pero nunca ve dos cuadros iguales. --- */
export const Familia = ({ indice, nombre, color, repos, clip = 'dosel', lado = 'izq', total = 8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const der = lado === 'der';
  const dos = repos.length > 4;

  return (
    <AbsoluteFill style={{ ...marco, background: T.tinta }}>
      <Metraje clip={clip} opacidad={0.26} />
      {/* halo del color de la familia, del lado del metraje */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 52% 78% at ${der ? '16%' : '84%'} 50%, ${color}2e 0%, rgba(0,0,0,0) 68%)`,
      }} />

      <AbsoluteFill style={{ padding: '0 96px', display: 'flex', flexDirection: 'column',
                             justifyContent: 'center' }}>
        <div style={{ width: 1180, marginLeft: der ? 'auto' : 0, textAlign: der ? 'right' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 34,
                        flexDirection: der ? 'row-reverse' : 'row',
                        justifyContent: der ? 'flex-start' : 'flex-start' }}>
            <div style={{ fontFamily: SERIF, fontSize: 186, lineHeight: 0.78, color,
                          letterSpacing: -8, ...sube(frame, 0.15, 34, 22) }}>
              {String(indice).padStart(2, '0')}
            </div>
            <div style={{ paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14,
                            flexDirection: der ? 'row-reverse' : 'row', ...sube(frame, 0.4, 16) }}>
                <div style={{ height: 2, width: 36, background: color }} />
                <div style={{ fontFamily: SANS, fontSize: 18, letterSpacing: 3.2, fontWeight: 700, color }}>
                  {repos.length} PROYECTOS · FAMILIA {indice} DE {total}
                </div>
              </div>
              <Declara frame={frame} retardo={0.65} tam={80} ancho={860}>{nombre}</Declara>
            </div>
          </div>

          <div style={{ marginTop: 52, display: 'grid', columnGap: 46, rowGap: 15,
                        gridTemplateColumns: dos ? '1fr 1fr' : '1fr',
                        gridAutoFlow: 'column',
                        gridTemplateRows: `repeat(${Math.ceil(repos.length / (dos ? 2 : 1))}, auto)` }}>
            {repos.map((r, i) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 16,
                                    flexDirection: der ? 'row-reverse' : 'row',
                                    ...brota(frame, fps, 1.5 + i * 0.28) }}>
                <div style={{ width: 9, height: 9, background: color, flexShrink: 0 }} />
                <div style={{ fontFamily: SANS, fontSize: 27, color: T.crema, lineHeight: 1.25 }}>{r}</div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Vineta fuerza={0.5} />
      {/* filo vertical: la firma de la familia */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, [der ? 'right' : 'left']: 0, width: 7,
        background: color,
        transform: `scaleY(${interpolate(frame, [0, 26], [0, 1], { extrapolateRight: 'clamp' })})`,
        transformOrigin: 'top',
      }} />
      <Grano />
    </AbsoluteFill>
  );
};
