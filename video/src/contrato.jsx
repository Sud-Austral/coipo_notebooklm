import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, FUENTE, Antetitulo } from './estilo';
import { entrar, aparecer, contar, trazar } from './animacion';

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

const Titulo = ({ frame, ante, texto, bajada, claro, colorAnte }) => (
  <>
    <div style={entrar(frame, 0.1)}>
      <Antetitulo texto={ante} color={colorAnte || (claro ? C.verdeSuave : C.verde)} />
    </div>
    <h2 style={{ margin: '22px 0 14px 0', color: claro ? C.blanco : C.texto, fontSize: 62,
                 lineHeight: 1.1, fontWeight: 700, letterSpacing: -1.3, ...entrar(frame, 0.5, 40) }}>
      {texto}
    </h2>
    {bajada ? (
      <p style={{ margin: '0 0 46px 0', color: claro ? C.verdeClaro : C.atenuado, fontSize: 29,
                  lineHeight: 1.45, maxWidth: 1400, ...entrar(frame, 1.0) }}>{bajada}</p>
    ) : null}
  </>
);

/* --------------------------------------------------------------- 1. Qué es */
export const QueEs = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...base, background: C.fondo, padding: '86px 100px' }}>
      <Titulo frame={frame} ante="UNIDAD DE INFORMACIÓN Y ANÁLISIS"
              texto="Sistema de Gestión de Contratos"
              bajada="El ciclo de vida completo del contrato físico de un funcionario, desde que se genera hasta que vuelve firmado." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 30, marginTop: 20 }}>
        {[
          { t: 'React 18 · Vite', c: 'Aplicación de una sola página, sin recargas entre pestañas.', e: 5 },
          { t: 'FastAPI · Python', c: 'API REST que guarda el estado y genera los documentos.', e: 7.5 },
          { t: 'PostgreSQL', c: 'El expediente de cada funcionario y su histórico de transiciones.', e: 10 },
        ].map((x) => (
          <div key={x.t} style={{ background: C.blanco, border: `1px solid ${C.borde}`,
                                  borderTop: `5px solid ${C.verde}`, borderRadius: 10, padding: '38px 34px',
                                  ...aparecer(frame, fps, x.e) }}>
            <div style={{ color: C.texto, fontSize: 34, fontWeight: 700, marginBottom: 14 }}>{x.t}</div>
            <div style={{ color: C.atenuado, fontSize: 23, lineHeight: 1.5 }}>{x.c}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- 2. Problema */
export const Problema = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    { t: 'Se imprime', c: 'El documento sale del sistema y entra en el mundo físico.', e: 3 },
    { t: 'Circula', c: 'Va a firma, cambia de manos, espera en un escritorio.', e: 6 },
    { t: 'Vuelve, o no', c: 'Y hasta que alguien pregunta, nadie sabe cuánto lleva detenido.', e: 9, alerta: true },
  ];
  return (
    <div style={{ ...base, background: C.fondo, padding: '86px 100px' }}>
      <Titulo frame={frame} ante="EL PROBLEMA DEL PAPEL" colorAnte="#e36414"
              texto="Un contrato en papel circula" />
      <div style={{ display: 'flex', gap: 24, alignItems: 'stretch', marginTop: 30 }}>
        {items.map((x, i) => (
          <React.Fragment key={x.t}>
            <div style={{ flex: 1, background: x.alerta ? '#fff4ef' : C.blanco,
                          border: `1px solid ${x.alerta ? '#f3d3c4' : C.borde}`, borderRadius: 10,
                          padding: '40px 34px', ...aparecer(frame, fps, x.e) }}>
              <div style={{ color: x.alerta ? '#e36414' : C.texto, fontSize: 36, fontWeight: 700, marginBottom: 16 }}>{x.t}</div>
              <div style={{ color: C.atenuado, fontSize: 24, lineHeight: 1.5 }}>{x.c}</div>
            </div>
            {i < items.length - 1 ? (
              <div style={{ display: 'flex', alignItems: 'center', opacity: interpolate(frame - (x.e + 1.2) * 30, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={C.borde} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 26,
                    background: C.verdeClaro, borderLeft: `5px solid ${C.verde}`,
                    borderRadius: '0 10px 10px 0', padding: '34px 40px', ...aparecer(frame, fps, 12.5) }}>
        <div style={{ color: C.verdeProfundo, fontSize: 31, lineHeight: 1.4, fontWeight: 600 }}>
          El sistema no elimina el papel: le pone seguimiento.
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- 3. Estados */
const ESTADOS = [
  { k: 'PENDIENTE', d: 'Aún no se revisa', e: 4 },
  { k: 'REVISADO', d: 'Alguien lo validó', e: 8 },
  { k: 'IMPRESO', d: 'Ya existe en papel', e: 11.5 },
  { k: 'ESPERANDO FIRMA', d: 'Está fuera de la oficina', e: 15 },
  { k: 'COMPLETADO', d: 'Volvió firmado', e: 19 },
];

export const Estados = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...base, background: C.verdeProfundo, padding: '86px 90px' }}>
      <Titulo frame={frame} claro ante="LA MÁQUINA DE ESTADOS"
              texto="Cinco estados, y ninguno se salta"
              bajada="Cada contrato avanza en línea recta. El backend rechaza cualquier transición que se salte un paso." />

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 26 }}>
        {ESTADOS.map((s, i) => {
          const on = interpolate(frame - s.e * fps, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const ultimo = i === ESTADOS.length - 1;
          return (
            <React.Fragment key={s.k}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  margin: '0 auto 22px auto', width: 118, height: 118, borderRadius: '50%',
                  border: `3px solid ${ultimo ? C.ambar : C.verde}`,
                  background: `rgba(${ultimo ? '255,183,0' : '45,106,79'},${0.10 + on * 0.75})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.blanco, fontSize: 42, fontWeight: 700,
                  transform: `scale(${0.86 + on * 0.14})`,
                  boxShadow: on > 0.5 ? `0 0 42px rgba(${ultimo ? '255,183,0' : '45,106,79'},0.55)` : 'none',
                }}>
                  {i + 1}
                </div>
                <div style={{ color: on > 0.4 ? C.blanco : '#4d7a63', fontSize: 24, fontWeight: 700, letterSpacing: 1.1, lineHeight: 1.25 }}>{s.k}</div>
                <div style={{ color: on > 0.4 ? C.verdeSuave : '#3f6b56', fontSize: 21, marginTop: 8, lineHeight: 1.4 }}>{s.d}</div>
              </div>
              {!ultimo ? (
                <div style={{ width: 96, height: 3, background: '#2a5c46', position: 'relative', marginBottom: 64 }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${trazar(frame, s.e + 1.4, 0.7)}%`, background: C.ambar }} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 20,
                    borderTop: '1px solid #2f6b4f', paddingTop: 30, ...entrar(frame, 23) }}>
        <span style={{ background: '#5a2410', color: '#ffb59a', fontSize: 21, fontWeight: 700,
                       padding: '9px 16px', borderRadius: 6, letterSpacing: 1 }}>HTTP 409</span>
        <div style={{ color: C.verdeSuave, fontSize: 24 }}>
          es lo que devuelve el servidor si alguien intenta saltarse un estado.
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- 4. Plantillas */
export const Plantillas = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...base, background: C.blanco, padding: '86px 100px' }}>
      <Titulo frame={frame} ante="DOCUMENTOS" texto="Plantillas registradas, datos dinámicos"
              bajada="Cada modalidad de contrato pide sus propios campos, y el formulario se adapta." />
      <div style={{ display: 'flex', gap: 34, alignItems: 'stretch', marginTop: 10 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {['Indefinido', 'Honorarios', 'Otras modalidades registradas'].map((t, i) => (
            <div key={t} style={{ background: C.fondo, border: `1px solid ${C.borde}`, borderLeft: `5px solid ${C.verde}`,
                                  borderRadius: '0 10px 10px 0', padding: '30px 32px', display: 'flex',
                                  alignItems: 'center', gap: 20, ...aparecer(frame, fps, 3 + i * 1.6) }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.verde} strokeWidth="1.6"
                   strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" />
              </svg>
              <div style={{ color: C.texto, fontSize: 30, fontWeight: 600 }}>{t}</div>
            </div>
          ))}
          <div style={{ marginTop: 10, color: C.atenuado, fontSize: 23, lineHeight: 1.5, ...entrar(frame, 9) }}>
            Los datos del formulario viajan como JSON dinámico, no como columnas fijas.
          </div>
        </div>

        <div style={{ flex: 1, background: C.verdeProfundo, borderRadius: 12, padding: 40,
                      display: 'flex', flexDirection: 'column', gap: 20, ...aparecer(frame, fps, 11) }}>
          <div style={{ color: C.ambar, fontSize: 21, fontWeight: 700, letterSpacing: 2 }}>VISOR INTEGRADO</div>
          <div style={{ background: C.blanco, borderRadius: 8, flexGrow: 1, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[92, 78, 86, 60, 88, 45].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w}%`, background: i === 0 ? C.verde : '#dfe6e2', borderRadius: 3,
                                    opacity: interpolate(frame - (12 + i * 0.35) * 30, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
            ))}
          </div>
          <div style={{ color: C.verdeSuave, fontSize: 22, lineHeight: 1.45 }}>
            El PDF se abre dentro de la aplicación, no como archivo suelto.
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- 5. Bandeja */
export const Bandeja = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pes = ['Funcionarios', 'Con PDF', 'Completados', 'Pendientes'];
  return (
    <div style={{ ...base, background: C.fondo, padding: '86px 100px' }}>
      <Titulo frame={frame} ante="LA BANDEJA" texto="El trabajo, ordenado por estado" />
      <div style={{ display: 'flex', gap: 12, marginTop: 6, marginBottom: 30 }}>
        {pes.map((p, i) => (
          <div key={p} style={{ padding: '14px 30px', borderRadius: '8px 8px 0 0', fontSize: 25, fontWeight: 600,
                                background: i === 0 ? C.blanco : 'transparent',
                                color: i === 0 ? C.verde : C.atenuado,
                                borderBottom: i === 0 ? `3px solid ${C.verde}` : `1px solid ${C.borde}`,
                                ...aparecer(frame, fps, 2 + i * 0.7) }}>
            {p}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 30, flexGrow: 1 }}>
        <div style={{ flex: 1.35, background: C.blanco, border: `1px solid ${C.borde}`, borderRadius: 10, padding: 12 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 24px',
                                  borderBottom: i < 4 ? `1px solid ${C.borde}` : 'none',
                                  background: i === 1 ? C.verdeClaro : 'transparent', borderRadius: 6,
                                  ...aparecer(frame, fps, 5.5 + i * 0.6) }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: C.verdeClaro, flexShrink: 0 }} />
              <div style={{ height: 13, width: `${46 - i * 4}%`, background: '#dfe6e2', borderRadius: 3 }} />
              <div style={{ marginLeft: 'auto', fontSize: 19, fontWeight: 700, letterSpacing: 0.8, padding: '7px 14px', borderRadius: 5,
                            background: i === 1 ? C.verde : '#eef2f0', color: i === 1 ? C.blanco : C.atenuado }}>
                {['PENDIENTE', 'IMPRESO', 'REVISADO', 'COMPLETADO', 'PENDIENTE'][i]}
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: C.blanco, border: `1px solid ${C.borde}`, borderRadius: 10,
                      padding: 36, display: 'flex', flexDirection: 'column', gap: 18, ...aparecer(frame, fps, 10) }}>
          <div style={{ color: C.verde, fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>PANEL DEL FUNCIONARIO</div>
          <div style={{ color: C.texto, fontSize: 30, fontWeight: 600, lineHeight: 1.3 }}>Ficha y flujo en el mismo lugar</div>
          <div style={{ color: C.atenuado, fontSize: 23, lineHeight: 1.5 }}>
            El encargado ve en qué punto está cada caso sin salir de la lista.
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ESTADOS.map((s, i) => (
              <div key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: i <= 1 ? 1 : 0.35 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: i <= 1 ? C.verde : C.borde }} />
                <div style={{ color: i <= 1 ? C.texto : C.atenuado, fontSize: 21, fontWeight: i === 1 ? 700 : 400 }}>{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- 6. Seguridad */
export const Seguridad = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...base, background: C.verdeProfundo, padding: '86px 100px' }}>
      <Titulo frame={frame} claro ante="SEGURIDAD"
              texto="Ningún dato sensible se sirve estático"
              bajada="Tener la dirección de un documento no basta para abrirlo." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 30, flexGrow: 1 }}>
        {[
          { t: 'OAuth 2 con JWT', c: 'La sesión se sostiene en un token firmado, no en credenciales guardadas por la aplicación.', e: 3,
            i: <><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></> },
          { t: 'Token en cada vista', c: 'Abrir un PDF exige token válido, en la cabecera o en un parámetro de vida corta.', e: 7,
            i: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" /><circle cx="12" cy="12" r="2.6" /></> },
          { t: 'Nada servido en abierto', c: 'No hay carpeta pública de documentos: todo pasa por la API autenticada.', e: 11,
            i: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 12l2 2 4-4" /></> },
          { t: 'Transiciones validadas', c: 'El servidor es quien decide si un cambio de estado es legal, no la interfaz.', e: 15,
            i: <><path d="M12 3l7 3v6c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6z" /></> },
        ].map((x) => (
          <div key={x.t} style={{ background: 'rgba(34,84,61,0.92)', border: '1px solid #2f6b4f', borderRadius: 10,
                                  padding: 38, display: 'flex', gap: 24, alignItems: 'flex-start', ...aparecer(frame, fps, x.e) }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={C.ambar} strokeWidth="1.6"
                 strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{x.i}</svg>
            <div>
              <div style={{ color: C.blanco, fontSize: 30, fontWeight: 600, marginBottom: 10 }}>{x.t}</div>
              <div style={{ color: '#b7dcc6', fontSize: 22, lineHeight: 1.5 }}>{x.c}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- 7. Infraestructura */
export const Infraestructura = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vms = [
    { n: 'VM 1', t: 'PostgreSQL', cpu: 10, ram: 52, disco: 600, nota: 'Memoria alta para caché de datos', e: 3 },
    { n: 'VM 2', t: 'Backend API', cpu: 8, ram: 24, disco: 300, nota: 'La lógica y los logs de aplicación', e: 5.5 },
    { n: 'VM 3', t: 'Servicios y trabajos', cpu: 10, ram: 16, disco: 800, nota: 'Renderiza los PDF y guarda el histórico', e: 8 },
    { n: 'VM 4', t: 'Frontend y gateway', cpu: 4, ram: 4, disco: 300, nota: 'Nginx: ligero, con mucho log de acceso', e: 10.5 },
  ];
  return (
    <div style={{ ...base, background: C.fondo, padding: '86px 100px' }}>
      <Titulo frame={frame} ante="INFRAESTRUCTURA PROPUESTA" texto="Cuatro máquinas, un solo pool" />
      <div style={{ display: 'flex', gap: 60, marginBottom: 34, ...entrar(frame, 1.4) }}>
        {[
          { v: 32, u: 'vCPU' }, { v: 96, u: 'GB de RAM' }, { v: 2, u: 'TB de disco' },
        ].map((x) => (
          <div key={x.u}>
            <div style={{ color: C.verdeProfundo, fontSize: 68, fontWeight: 700, letterSpacing: -1.6, lineHeight: 1 }}>
              {Math.round(contar(frame, 1.6, x.v))}
            </div>
            <div style={{ color: C.atenuado, fontSize: 22, letterSpacing: 1.2 }}>{x.u}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 24, flexGrow: 1 }}>
        {vms.map((v) => (
          <div key={v.n} style={{ background: C.blanco, border: `1px solid ${C.borde}`, borderTop: `5px solid ${C.verde}`,
                                  borderRadius: 10, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14,
                                  ...aparecer(frame, fps, v.e) }}>
            <div style={{ color: C.verde, fontSize: 19, fontWeight: 700, letterSpacing: 1.6 }}>{v.n}</div>
            <div style={{ color: C.texto, fontSize: 27, fontWeight: 700, lineHeight: 1.2 }}>{v.t}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[`${v.cpu} vCPU`, `${v.ram} GB`, `${v.disco} GB`].map((s) => (
                <span key={s} style={{ background: C.verdeClaro, color: C.verdeProfundo, fontSize: 18,
                                       fontWeight: 600, padding: '6px 12px', borderRadius: 5 }}>{s}</span>
              ))}
            </div>
            <div style={{ color: C.atenuado, fontSize: 20, lineHeight: 1.45, marginTop: 'auto' }}>{v.nota}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- 8. Cierre */
export const Cierre = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...base, background: C.verdeProfundo, padding: '0 160px', justifyContent: 'center' }}>
      <div style={{ height: 5, width: `${trazar(frame, 0.4) * 1.6}px`, background: C.ambar, marginBottom: 44 }} />
      <h2 style={{ margin: 0, color: C.blanco, fontSize: 66, lineHeight: 1.24, fontWeight: 700,
                   letterSpacing: -1.2, maxWidth: 1450, ...entrar(frame, 0.8, 44) }}>
        Un contrato en papel seguirá siendo un contrato en papel.
      </h2>
      <p style={{ margin: '38px 0 0 0', color: C.ambar, fontSize: 40, lineHeight: 1.35,
                  fontWeight: 600, maxWidth: 1400, ...entrar(frame, 3.4, 34) }}>
        La diferencia es que ahora, en cualquier momento, se puede responder dónde está.
      </p>
    </div>
  );
};
