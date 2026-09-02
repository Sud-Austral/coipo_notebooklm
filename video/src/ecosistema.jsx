import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, FUENTE, Antetitulo } from './estilo';
import { entrar, aparecer, contar } from './animacion';
import catalogo from './catalogo.json';

const base = {
  width: 1920,
  height: 1080,
  fontFamily: FUENTE,
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const FAM = catalogo.familias;

/* --------------------------------------------------- Apertura: el mapa entero */
export const Apertura = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...base, background: C.verdeProfundo, padding: '80px 90px' }}>
      <div style={entrar(frame, 0.1)}>
        <Antetitulo texto="UNIDAD DE INFORMACIÓN Y ANÁLISIS · CONAF" color={C.verdeSuave} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, margin: '22px 0 6px 0' }}>
        <div style={{ color: C.ambar, fontSize: 132, fontWeight: 700, letterSpacing: -4, lineHeight: 1,
                      ...entrar(frame, 0.5, 40) }}>
          {Math.round(contar(frame, 0.7, catalogo.total, 1.8))}
        </div>
        <div style={{ color: C.blanco, fontSize: 62, fontWeight: 700, letterSpacing: -1.2, ...entrar(frame, 0.9, 30) }}>
          repositorios
        </div>
      </div>
      <p style={{ margin: '0 0 40px 0', color: C.verdeClaro, fontSize: 30, lineHeight: 1.45, maxWidth: 1250,
                  ...entrar(frame, 1.6) }}>
        Agrupados en ocho familias. Cada una responde a una parte del trabajo de la institución.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 22, flexGrow: 1 }}>
        {FAM.map((f, i) => (
          <div key={f.nombre}
               style={{ background: 'rgba(34,84,61,0.85)', border: '1px solid #2f6b4f', borderTop: `5px solid ${f.color}`,
                        borderRadius: 10, padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 10,
                        ...aparecer(frame, fps, 5 + i * 0.7) }}>
            <div style={{ color: C.blanco, fontSize: 38, fontWeight: 700, lineHeight: 1 }}>{f.repos.length}</div>
            <div style={{ color: C.verdeSuave, fontSize: 21, fontWeight: 600, lineHeight: 1.3 }}>{f.nombre}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --------------------------------------------------- Una familia por sección */
export const Familia = ({ indice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = FAM[indice];
  const cols = f.repos.length <= 4 ? 2 : 3;
  return (
    <div style={{ ...base, background: C.fondo, padding: '84px 96px' }}>
      <div style={entrar(frame, 0.1)}>
        <Antetitulo texto={`FAMILIA ${indice + 1} DE 8`} color={f.color} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, margin: '22px 0 40px 0' }}>
        <h2 style={{ margin: 0, color: C.texto, fontSize: 62, lineHeight: 1.1, fontWeight: 700,
                     letterSpacing: -1.3, ...entrar(frame, 0.4, 40) }}>
          {f.nombre}
        </h2>
        <div style={{ color: f.color, fontSize: 34, fontWeight: 700, ...entrar(frame, 0.9) }}>
          {f.repos.length} proyectos
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
                    gap: 22, flexGrow: 1, alignContent: 'start' }}>
        {f.repos.map((r, i) => (
          <div key={r.repo}
               style={{ background: C.blanco, border: `1px solid ${C.borde}`, borderLeft: `5px solid ${f.color}`,
                        borderRadius: '0 10px 10px 0', padding: '26px 28px',
                        display: 'flex', flexDirection: 'column', gap: 8,
                        ...aparecer(frame, fps, 1.8 + i * 1.05) }}>
            <div style={{ color: C.texto, fontSize: 28, fontWeight: 600, lineHeight: 1.25 }}>{r.titulo}</div>
            <div style={{ color: C.atenuado, fontSize: 19, fontFamily: 'Consolas, monospace', letterSpacing: 0.2 }}>
              {r.repo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --------------------------------------------------- Cierre: todo junto */
export const CierreEco = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...base, background: C.verdeProfundo, padding: '70px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, ...entrar(frame, 0.2) }}>
        <h2 style={{ margin: 0, color: C.blanco, fontSize: 54, fontWeight: 700, letterSpacing: -1.1 }}>
          El mapa completo
        </h2>
        <div style={{ color: C.ambar, fontSize: 30, fontWeight: 700 }}>
          8 familias · {catalogo.total} repositorios
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16,
                    marginTop: 34, flexGrow: 1, alignContent: 'start' }}>
        {FAM.map((f, fi) => (
          <div key={f.nombre} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
                          ...entrar(frame, 0.6 + fi * 0.18) }}>
              <div style={{ width: 26, height: 4, background: f.color }} />
              <div style={{ color: C.blanco, fontSize: 19, fontWeight: 700, letterSpacing: 0.6, lineHeight: 1.2 }}>
                {f.nombre}
              </div>
            </div>
            {f.repos.map((r, i) => (
              <div key={r.repo}
                   style={{ background: 'rgba(34,84,61,0.8)', borderLeft: `3px solid ${f.color}`,
                            borderRadius: '0 5px 5px 0', padding: '9px 12px',
                            color: '#c6e3d2', fontSize: 15.5, fontFamily: 'Consolas, monospace',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            opacity: interpolate(frame - (2.4 + fi * 0.5 + i * 0.12) * fps, [0, 12], [0, 1],
                                                 { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
                {r.repo}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 26, borderTop: '1px solid #2f6b4f', paddingTop: 24,
                    color: C.ambar, fontSize: 30, fontWeight: 600, ...entrar(frame, 11) }}>
        Del fuego a los contratos, del catastro a la sala de clases.
      </div>
    </div>
  );
};
