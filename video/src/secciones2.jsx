import React from 'react';
import { useCurrentFrame, useVideoConfig, Img, staticFile, interpolate } from 'remotion';
import { C, FUENTE, Antetitulo } from './estilo';
import { entrar, aparecer, contar, miles, trazar } from './animacion';

const base = {
  width: 1920,
  height: 1080,
  fontFamily: FUENTE,
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
};

const Fondo = ({ archivo, velo, opacidad = 0.28 }) => (
  <>
    <Img src={staticFile(archivo)}
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', opacity: opacidad }} />
    <div style={{ position: 'absolute', inset: 0, background: velo }} />
  </>
);

/* ------------------------------------------------------------------ 4. Roles */
export const Roles = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const roles = [
    {
      t: 'Solicitante', ent: 'CLAVE ÚNICA', col: C.azulCU, fondoEt: C.azulCUSuave,
      c: 'Crea una solicitud al año, sigue su estado y la cancela antes del retiro. Autoriza expresamente el uso de sus datos.',
      pie: '~1.800 al año', en: 3,
      i: <><circle cx="12" cy="8" r="4" /><path d="M5 21v-1a7 7 0 0 1 14 0v1" /></>,
    },
    {
      t: 'Encargado de vivero', ent: 'COIPO IAM', col: C.verde, fondoEt: C.verdeClaro,
      c: 'Valida su bandeja, marca lista para retirar, registra el retiro y gestiona el stock de su vivero.',
      rut: true, en: 11,
      i: <><path d="M3 21V9l9-6 9 6v12" /><path d="M9 21v-6h6v6" /></>,
    },
    {
      t: 'Consolidador', ent: 'COIPO IAM', col: C.verde, fondoEt: C.verdeClaro,
      c: 'Visión nacional con filtros, tableros, auditoría de acciones y la exportación oficial a Excel.',
      pie: '1 a nivel nacional', en: 22,
      i: <><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></>,
    },
    {
      t: 'Administrador', ent: 'COIPO IAM', col: C.verde, fondoEt: C.verdeClaro,
      c: 'Catálogo de especies, viveros, altas y suplencias, y los parámetros del sistema.',
      pie: 'Plazos y máximos', en: 29,
      i: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></>,
    },
  ];
  return (
    <div style={{ ...base, background: C.fondo, padding: '84px 96px 74px 96px', display: 'flex', flexDirection: 'column' }}>
      <div style={entrar(frame, 0.1)}>
        <Antetitulo texto="QUIÉN VE QUÉ" />
      </div>
      <h2 style={{ margin: '22px 0 16px 0', color: C.texto, fontSize: 64, lineHeight: 1.1, fontWeight: 700, letterSpacing: -1.3, ...entrar(frame, 0.5, 40) }}>
        Cuatro roles, cuatro alcances
      </h2>
      <p style={{ margin: '0 0 48px 0', color: C.atenuado, fontSize: 29, lineHeight: 1.45, ...entrar(frame, 1.1) }}>
        El acceso a los datos personales se acota al rol, no a la confianza.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 26, flexGrow: 1 }}>
        {roles.map((r) => (
          <div key={r.t}
               style={{ background: C.blanco, border: `1px solid ${C.borde}`, borderRadius: 10,
                        padding: '38px 32px', display: 'flex', flexDirection: 'column', gap: 18,
                        ...aparecer(frame, fps, r.en) }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={r.col}
                 strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{r.i}</svg>
            <div style={{ color: C.texto, fontSize: 31, fontWeight: 700, lineHeight: 1.2 }}>{r.t}</div>
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: r.fondoEt,
                          color: r.col === C.azulCU ? C.azulCU : C.verdeProfundo, fontSize: 18,
                          fontWeight: 600, padding: '7px 14px', borderRadius: 5, letterSpacing: 0.6 }}>
              {r.ent}
            </div>
            <div style={{ color: C.atenuado, fontSize: 21, lineHeight: 1.5 }}>{r.c}</div>
            {r.rut ? (
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10,
                            background: C.peligroSuave, borderRadius: 6, padding: '12px 14px',
                            ...aparecer(frame, fps, r.en + 4) }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.peligro}
                     strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                <span style={{ color: C.peligro, fontSize: 19, fontWeight: 600 }}>No ve el RUT</span>
              </div>
            ) : (
              <div style={{ marginTop: 'auto', color: C.verdeProfundo, fontSize: 20, fontWeight: 600 }}>{r.pie}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ 5. Datos */
export const Datos = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    { t: 'Cifrado en reposo', c: 'Los datos personales del solicitante se guardan cifrados en la base de datos.', en: 2.5,
      i: <><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></> },
    { t: 'El RUT no circula', c: 'El encargado de vivero ve nombre, contacto y coordenadas, pero nunca el RUT.', en: 8,
      i: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" /><circle cx="12" cy="12" r="2.6" /><path d="M4 20 20 4" /></> },
    { t: 'Autorización expresa', c: 'El solicitante autoriza el tratamiento de sus datos al crear la solicitud, no antes.', en: 14,
      i: <><path d="M9 12l2 2 4-4" /><path d="M12 3l7 3v6c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6z" /></> },
    { t: 'Sin contraseñas propias', c: 'Los funcionarios entran por el COIPO IAM. Este sistema ya no almacena contraseñas.', en: 19,
      i: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h4" /></> },
  ];
  return (
    <div style={{ ...base, background: C.verdeProfundo }}>
      <Fondo archivo="foto2.jpg" velo="rgba(27,67,50,0.90)" opacidad={0.45} />
      <div style={{ position: 'absolute', inset: 0, padding: '86px 100px 76px 100px', display: 'flex', flexDirection: 'column' }}>
        <div style={entrar(frame, 0.1)}>
          <Antetitulo texto="DATOS PERSONALES" color={C.verdeSuave} />
        </div>
        <h2 style={{ margin: '22px 0 16px 0', color: C.blanco, fontSize: 64, lineHeight: 1.1, fontWeight: 700, letterSpacing: -1.3, ...entrar(frame, 0.5, 40) }}>
          Menos datos, menos custodia
        </h2>
        <p style={{ margin: '0 0 52px 0', color: C.verdeClaro, fontSize: 29, lineHeight: 1.45, maxWidth: 1300, ...entrar(frame, 1.1) }}>
          El sistema pide lo mínimo, lo guarda cifrado y deja registro de quién hizo qué.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 30, flexGrow: 1 }}>
          {items.map((x) => (
            <div key={x.t}
                 style={{ background: 'rgba(34,84,61,0.92)', border: '1px solid #2f6b4f', borderRadius: 10,
                          padding: 40, display: 'flex', gap: 26, alignItems: 'flex-start',
                          ...aparecer(frame, fps, x.en) }}>
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke={C.ambar}
                   strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{x.i}</svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ color: C.blanco, fontSize: 31, fontWeight: 600, lineHeight: 1.25 }}>{x.t}</div>
                <div style={{ color: '#b7dcc6', fontSize: 22, lineHeight: 1.5 }}>{x.c}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 22,
                      borderTop: '1px solid #2f6b4f', paddingTop: 30, ...entrar(frame, 26) }}>
          <div style={{ color: C.ambar, fontSize: 22, fontWeight: 700, letterSpacing: 1.6 }}>EL COMPROBANTE DE ENTREGA</div>
          <div style={{ color: C.verdeSuave, fontSize: 22, lineHeight: 1.5 }}>
            se genera en PDF sin RUT y sin firma, con referencia a la guía de despacho oficial.
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ 6. Cifras */
export const Cifras = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arriba = [
    { v: 1800, fmt: miles, t: 'solicitudes al año', c: 'Unas 100 por región, en 18 unidades administrativas.', borde: C.verde, en: 2 },
    { v: 38, t: 'viveros conectados', c: 'Cada uno con su catálogo y su stock propio, cargado por Excel.', borde: C.verde, en: 4.5 },
    { v: 30, t: 'días de plazo de retiro', c: 'Con avisos al día 20 y 28. Al 30 vence y devuelve el stock.', borde: C.ambar, en: 7 },
  ];
  const abajo = [
    { txt: '3', t: 'meses de construcción', c: 'Un desarrollador, sobre infraestructura on-premise de CONAF.', en: 12 },
    { txt: '$30M', t: 'de presupuesto', c: 'Pesos chilenos, para un horizonte de uso de 3 a 5 años.', en: 14 },
    { txt: '3 · 100', t: 'especies y unidades', c: 'El techo de cada solicitud. Una por persona y por año.', en: 16 },
  ];
  const chips = ['FastAPI', 'PostgreSQL', 'React', 'Docker', 'Clave Única', 'COIPO IAM'];
  return (
    <div style={{ ...base, background: C.blanco, padding: '90px 100px 80px 100px', display: 'flex', flexDirection: 'column' }}>
      <div style={entrar(frame, 0.1)}>
        <Antetitulo texto="LA DIMENSIÓN DEL ENCARGO" />
      </div>
      <h2 style={{ margin: '22px 0 54px 0', color: C.texto, fontSize: 64, lineHeight: 1.1, fontWeight: 700, letterSpacing: -1.3, ...entrar(frame, 0.5, 40) }}>
        Qué tamaño tiene esto
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 30 }}>
        {arriba.map((x) => (
          <div key={x.t} style={{ borderTop: `5px solid ${x.borde}`, background: C.fondo, borderRadius: '0 0 10px 10px',
                                  padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 10,
                                  ...aparecer(frame, fps, x.en) }}>
            <div style={{ color: C.verdeProfundo, fontSize: 88, fontWeight: 700, letterSpacing: -2.4, lineHeight: 1 }}>
              {x.fmt ? x.fmt(contar(frame, x.en, x.v)) : Math.round(contar(frame, x.en, x.v))}
            </div>
            <div style={{ color: C.texto, fontSize: 27, fontWeight: 600 }}>{x.t}</div>
            <div style={{ color: C.atenuado, fontSize: 21, lineHeight: 1.45 }}>{x.c}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 30, marginTop: 30 }}>
        {abajo.map((x) => (
          <div key={x.t} style={{ borderTop: `5px solid ${C.borde}`, background: C.fondo, borderRadius: '0 0 10px 10px',
                                  padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 10,
                                  ...aparecer(frame, fps, x.en) }}>
            <div style={{ color: C.verdeProfundo, fontSize: 88, fontWeight: 700, letterSpacing: -2.4, lineHeight: 1 }}>{x.txt}</div>
            <div style={{ color: C.texto, fontSize: 27, fontWeight: 600 }}>{x.t}</div>
            <div style={{ color: C.atenuado, fontSize: 21, lineHeight: 1.45 }}>{x.c}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 30,
                    borderTop: `1px solid ${C.borde}`, paddingTop: 34 }}>
        <div style={{ color: C.atenuado, fontSize: 22, letterSpacing: 1.4, fontWeight: 600, ...entrar(frame, 21) }}>STACK</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {chips.map((ch, i) => (
            <span key={ch}
                  style={{ background: ch === 'Clave Única' ? C.azulCUSuave : C.verdeClaro,
                           color: ch === 'Clave Única' ? C.azulCU : C.verdeProfundo,
                           fontSize: 21, fontWeight: 600, padding: '9px 18px', borderRadius: 6,
                           ...aparecer(frame, fps, 21.5 + i * 0.3) }}>
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
