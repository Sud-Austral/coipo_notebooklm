import React from 'react';
import { useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
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

/** Fotografía de fondo, quieta, bajo un velo del color de la sección.
 *  No lleva zoom: el movimiento va en los elementos, no en el fondo. */
const Fondo = ({ archivo, velo, opacidad = 0.28 }) => (
  <>
    <Img
      src={staticFile(archivo)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: opacidad,
      }}
    />
    <div style={{ position: 'absolute', inset: 0, background: velo }} />
  </>
);

/* ------------------------------------------------------------------ 1. Portada */
export const Portada = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cifras = [
    { v: 1800, txt: 'SOLICITUDES AL AÑO', fmt: miles },
    { v: 38, txt: 'VIVEROS' },
    { v: 18, txt: 'UNIDADES ADMINISTRATIVAS' },
  ];
  return (
    <div style={{ ...base, background: C.verdeProfundo }}>
      <Fondo archivo="foto4.png" velo="rgba(27,67,50,0.86)" opacidad={0.5} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '92px 110px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={entrar(frame, 0.2)}>
          <Antetitulo
            texto="CORPORACIÓN NACIONAL FORESTAL · PROGRAMA DE ARBORIZACIÓN"
            color={C.verdeSuave}
          />
        </div>

        <div>
          <h1
            style={{
              margin: 0,
              color: C.blanco,
              fontSize: 104,
              lineHeight: 1.04,
              fontWeight: 700,
              letterSpacing: -2,
              ...entrar(frame, 0.8, 46),
            }}
          >
            Sistema de Entrega
            <br />
            de Plantas
          </h1>
          <div
            style={{
              height: 5,
              width: `${trazar(frame, 1.6) * 1.48}px`,
              background: C.ambar,
              margin: '42px 0 34px 0',
            }}
          />
          <p
            style={{
              margin: 0,
              color: C.verdeClaro,
              fontSize: 34,
              lineHeight: 1.42,
              maxWidth: 900,
              ...entrar(frame, 2.0),
            }}
          >
            De un formulario distinto en cada región a un solo proceso nacional:
            solicitar, validar, retirar y consolidar.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 84, alignItems: 'flex-end' }}>
          {cifras.map((c, i) => (
            <div key={c.txt} style={{ ...aparecer(frame, fps, 8.5 + i * 0.5) }}>
              <div
                style={{
                  color: C.ambar,
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: -1,
                }}
              >
                {c.fmt
                  ? c.fmt(contar(frame, 8.5 + i * 0.5, c.v))
                  : Math.round(contar(frame, 8.5 + i * 0.5, c.v))}
              </div>
              <div style={{ color: C.verdeSuave, fontSize: 20, letterSpacing: 1.4 }}>
                {c.txt}
              </div>
            </div>
          ))}
          <div
            style={{
              marginLeft: 'auto',
              color: '#6f9c85',
              fontSize: 20,
              textAlign: 'right',
              lineHeight: 1.6,
              ...entrar(frame, 11),
            }}
          >
            Autenticación con Clave Única
            <br />
            Infraestructura on-premise CONAF
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ 2. Problema */
const Icono = ({ d, color = '#e36414', tam = 46 }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={color}
       strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

export const Problema = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tarjetas = [
    {
      t: 'Formularios regionales',
      c: 'Un Google Form por región, con campos y criterios propios. Sin catálogo común de especies.',
      i: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    },
    {
      t: 'Planillas dispersas',
      c: 'El stock y los retiros vivían en Excel descentralizados. La consolidación nacional era manual.',
      i: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 4v16" /></>,
    },
    {
      t: 'Sin trazabilidad',
      c: 'Sin identidad verificada del solicitante, sin auditoría de acciones y sin control de duplicados.',
      i: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    },
  ];
  return (
    <div style={{ ...base, background: C.fondo, padding: '86px 110px', display: 'flex', flexDirection: 'column' }}>
      <div style={entrar(frame, 0.1)}>
        <Antetitulo texto="EL PUNTO DE PARTIDA" color="#e36414" />
      </div>
      <h2 style={{ margin: '26px 0 20px 0', color: C.texto, fontSize: 68, lineHeight: 1.1, fontWeight: 700, letterSpacing: -1.4, ...entrar(frame, 0.5, 40) }}>
        Dieciocho procesos distintos
        <br />
        para un mismo programa
      </h2>
      <p style={{ margin: '0 0 58px 0', color: C.atenuado, fontSize: 30, lineHeight: 1.45, ...entrar(frame, 1.1) }}>
        Cada región resolvía la entrega por su cuenta. Nada se consolidaba solo.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 34 }}>
        {tarjetas.map((x, i) => (
          <div key={x.t}
               style={{ background: C.blanco, border: `1px solid ${C.borde}`, borderRadius: 10,
                        padding: '42px 38px', display: 'flex', flexDirection: 'column', gap: 20,
                        ...aparecer(frame, fps, 4.5 + i * 2.6) }}>
            <Icono d={x.i} />
            <div style={{ color: C.texto, fontSize: 32, fontWeight: 600, lineHeight: 1.25 }}>{x.t}</div>
            <div style={{ color: C.atenuado, fontSize: 24, lineHeight: 1.5 }}>{x.c}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 26,
                    background: C.verdeClaro, borderLeft: `5px solid ${C.verde}`,
                    borderRadius: '0 10px 10px 0', padding: '34px 40px',
                    ...aparecer(frame, fps, 27) }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.verdeProfundo}
             strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <div style={{ color: C.verdeProfundo, fontSize: 30, lineHeight: 1.4, fontWeight: 600 }}>
          Un sistema web único, con identidad verificada y stock que se descuenta solo.
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ 3. Flujo */
export const Flujo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pasos = [
    { n: '01', t: 'Identidad', c: 'El solicitante entra con Clave Única. El sistema no guarda contraseñas.', col: C.azulCU, en: 2.5 },
    { n: '02', t: 'Región y vivero', c: 'Elige el vivero él mismo. El catálogo se filtra al stock real de ese vivero.', col: C.verde, en: 8 },
    { n: '03', t: 'La solicitud', c: 'Hasta 3 especies y 100 unidades. Una por persona al año.', col: C.verde, en: 14 },
    { n: '04', t: 'Validación', c: 'El encargado del vivero acepta o rechaza, por orden de llegada.', col: C.verde, en: 19 },
    { n: '05', t: 'Aviso automático', c: 'Correo al quedar lista para retirar. Recordatorios al día 20 y 28.', col: C.ambar, en: 23 },
    { n: '06', t: 'Retiro', c: 'Se registra la entrega, se descuenta el stock y se emite el comprobante en PDF.', col: C.verde, en: 29 },
  ];
  return (
    <div style={{ ...base, background: C.blanco, padding: '80px 92px 70px 92px', display: 'flex', flexDirection: 'column' }}>
      <div style={entrar(frame, 0.1)}>
        <Antetitulo texto="EL RECORRIDO DE UNA SOLICITUD" />
      </div>
      <h2 style={{ margin: '22px 0 40px 0', color: C.texto, fontSize: 64, lineHeight: 1.1, fontWeight: 700, letterSpacing: -1.3, ...entrar(frame, 0.5, 40) }}>
        De la Clave Única al árbol plantado
      </h2>

      <div style={{ height: 3, background: C.borde, marginBottom: 26, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: 3,
                      width: `${trazar(frame, 2.2, 30)}%`, background: C.verde }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0,1fr))', gap: 22 }}>
        {pasos.map((p) => (
          <div key={p.n}
               style={{ display: 'flex', flexDirection: 'column', gap: 16, background: C.fondo,
                        border: `1px solid ${C.borde}`, borderTop: `5px solid ${p.col}`,
                        borderRadius: 10, padding: '30px 24px', ...aparecer(frame, fps, p.en) }}>
            <div style={{ color: p.col === C.ambar ? C.ambarTexto : p.col, fontSize: 20, fontWeight: 700, letterSpacing: 1.6 }}>{p.n}</div>
            <div style={{ color: C.texto, fontSize: 27, fontWeight: 600, lineHeight: 1.22 }}>{p.t}</div>
            <div style={{ color: C.atenuado, fontSize: 21, lineHeight: 1.45 }}>{p.c}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 26, marginTop: 46 }}>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 26, background: '#fff8e6',
                      border: '1px solid #f0dfae', borderRadius: 10, padding: '32px 38px',
                      ...aparecer(frame, fps, 37) }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={C.ambarTexto} strokeWidth="1.7"
               strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
          </svg>
          <div>
            <div style={{ color: C.texto, fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>Si nadie retira, el día 30 vence sola</div>
            <div style={{ color: C.atenuado, fontSize: 22, lineHeight: 1.45, marginTop: 6 }}>El stock comprometido vuelve al vivero automáticamente.</div>
          </div>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 26, background: C.verdeClaro,
                      border: '1px solid #b7e4c7', borderRadius: 10, padding: '32px 38px',
                      ...aparecer(frame, fps, 43) }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={C.verdeProfundo} strokeWidth="1.7"
               strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v5h-5" />
          </svg>
          <div>
            <div style={{ color: C.texto, fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>El consolidador ve el país entero</div>
            <div style={{ color: C.atenuado, fontSize: 22, lineHeight: 1.45, marginTop: 6 }}>Filtros por región, vivero, especie y estado.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
