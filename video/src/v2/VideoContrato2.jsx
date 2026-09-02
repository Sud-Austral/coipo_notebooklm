import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Portadilla, DUR_PORTADILLA } from '../Portadilla';
import { Declaracion, Numeral, Partido, Recorrido, Constelacion } from './arquetipos';
import { T, Fuentes, SERIF } from './base';

export const FPS = 30;

const Gancho = () => (
  <Declaracion
    rotulo="GESTIÓN DE CONTRATOS"
    frase={<>Un contrato sale a firma. <em style={{ fontStyle: 'italic', color: T.ambar }}>¿Cuánto lleva fuera?</em></>}
    clip="dosel"
  />
);

const QueEs = () => (
  <Constelacion
    rotulo="UNIDAD DE INFORMACIÓN Y ANÁLISIS"
    titulo="El ciclo de vida completo del contrato físico"
    hero={{
      etiqueta: 'QUÉ ADMINISTRA',
      t: 'Desde que se genera hasta que vuelve firmado',
      c: 'Cada contrato de cada funcionario, con su estado, su documento y su historia de transiciones.',
      pie: 'CONAF · UIA',
    }}
    resto={[
      { t: 'React 18 y Vite', c: 'Una sola página, sin recargas entre pestañas.' },
      { t: 'FastAPI en Python', c: 'Guarda el estado y genera los documentos.' },
      { t: 'PostgreSQL', c: 'El expediente y su histórico completo.' },
    ]}
    clip="rio"
  />
);

const Problema = () => (
  <Partido
    rotulo="EL PROBLEMA DEL PAPEL"
    titulo="El papel circula"
    puntos={[
      { t: 'Se imprime', c: 'El documento sale del sistema y entra en el mundo físico.' },
      { t: 'Cambia de manos', c: 'Va a firma, espera en un escritorio, vuelve a moverse.' },
      { t: 'Y nadie lleva la cuenta', c: 'Hasta que alguien pregunta, no hay respuesta.' },
    ]}
    clip="dosel"
  />
);

const Remate1 = () => (
  <Declaracion
    frase={<>El sistema no elimina el papel.<br /><em style={{ fontStyle: 'italic', color: T.ambar }}>Le pone seguimiento.</em></>}
    clip="montana"
  />
);

const PASOS = [
  { t: 'Pendiente', c: 'Aún no se revisa.', en: 2.5 },
  { t: 'Revisado', c: 'Alguien lo validó.', en: 6 },
  { t: 'Impreso', c: 'Ya existe en papel.', en: 9 },
  { t: 'Esperando firma', c: 'Está fuera de la oficina.', en: 12 },
  { t: 'Completado', c: 'Volvió firmado.', en: 15.5, destacado: true },
];

const Estados = () => (
  <Recorrido
    rotulo="LA MÁQUINA DE ESTADOS"
    titulo="Cinco estados, y solo cinco"
    pasos={PASOS}
    clip="nubes"
  />
);

const Remate2 = () => (
  <Declaracion
    rotulo="NINGUNO SE SALTA"
    frase={<>Si alguien lo intenta, el servidor <em style={{ fontStyle: 'italic', color: T.arcilla }}>rechaza la transición.</em></>}
    apoyo="Es el backend quien decide si un cambio de estado es legal, no la interfaz."
    clip="bosque_aereo"
    acento={T.arcilla}
  />
);

const Plantillas = () => (
  <Constelacion
    rotulo="DOCUMENTOS"
    titulo="Plantillas registradas, campos que se adaptan"
    hero={{
      etiqueta: 'EL VISOR',
      t: 'El PDF se abre dentro de la aplicación',
      c: 'No hay carpeta pública de documentos: todo pasa por la API autenticada.',
      pie: 'JSON dinámico, no columnas fijas',
    }}
    resto={[
      { t: 'Indefinido', c: 'Con los campos propios de la modalidad.' },
      { t: 'Honorarios', c: 'Otro formulario, la misma máquina de estados.' },
      { t: 'Otras modalidades', c: 'Se registran en el servidor, no en el código.' },
    ]}
    clip="dosel"
  />
);

const Bandeja = () => (
  <Partido
    rotulo="LA BANDEJA"
    titulo="El trabajo, ordenado por estado"
    puntos={[
      { t: 'Cuatro pestañas', c: 'Funcionarios, con PDF, completados y pendientes.' },
      { t: 'Un panel por persona', c: 'Su ficha y su flujo, sin salir de la lista.' },
      { t: 'El punto exacto', c: 'El encargado ve dónde está cada caso de un vistazo.' },
    ]}
    clip="rio"
    invertido
  />
);

const Seguridad = () => (
  <Declaracion
    rotulo="SEGURIDAD"
    frase={<>Tener la dirección de un documento <em style={{ fontStyle: 'italic', color: T.ambar }}>no basta para abrirlo.</em></>}
    apoyo="Ningún dato sensible se sirve estático. Hace falta un token válido, y de vida corta."
    clip="montana"
  />
);

const Infra = () => (
  <Numeral
    rotulo="INFRAESTRUCTURA"
    valor={32}
    unidad="procesadores, repartidos en cuatro máquinas"
    texto="Con noventa y seis gigas de memoria y dos teras de disco: la base de datos, el backend, los trabajos que generan los documentos y la puerta de entrada."
    clip="bosque_aereo"
  />
);

const Cierre = () => (
  <Declaracion
    frase={<>Un contrato en papel seguirá siendo papel.<br /><em style={{ fontStyle: 'italic', color: T.ambar }}>Pero ya se sabe dónde está.</em></>}
    clip="montana"
  />
);

const LISTA = [
  { r: Gancho, inicio: 10.0, dur: 6.408 },
  { r: QueEs, inicio: 16.408, dur: 17.904 },
  { r: Problema, inicio: 34.312, dur: 9.576 },
  { r: Remate1, inicio: 43.888, dur: 5.832 },
  { r: Estados, inicio: 49.72, dur: 19.968 },
  { r: Remate2, inicio: 69.688, dur: 9.792 },
  { r: Plantillas, inicio: 79.48, dur: 14.496 },
  { r: Bandeja, inicio: 93.976, dur: 12.144 },
  { r: Seguridad, inicio: 106.12, dur: 14.28 },
  { r: Infra, inicio: 120.4, dur: 14.352 },
  { r: Cierre, inicio: 134.752, dur: 11.832 },
];

export const DURACION_FRAMES = Math.round(146.584 * FPS);

const Corte = ({ dur }) => {
  const frame = useCurrentFrame();
  const f = Math.round(dur * FPS);
  const o = interpolate(frame, [0, 7, f - 7, f], [1, 0, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: T.tinta, opacity: o, pointerEvents: 'none' }} />;
};

export const VideoContrato2 = () => (
  <AbsoluteFill style={{ background: T.tinta }}>
    <Fuentes />
    <Sequence from={0} durationInFrames={Math.round(DUR_PORTADILLA * FPS)}>
      <Portadilla
        titulo={'Sistema de Gestión\nde Contratos'}
        bajada="Del contrato firmado en papel a un expediente que se puede seguir."
      />
    </Sequence>
    {LISTA.map((s, i) => (
      <Sequence key={i} from={Math.round(s.inicio * FPS)} durationInFrames={Math.round(s.dur * FPS)}>
        <s.r />
        <Corte dur={s.dur} />
      </Sequence>
    ))}
    <Audio src={staticFile('intro.mp3')} />
    <Audio src={staticFile('narracion_contrato2.mp3')} />
  </AbsoluteFill>
);
