// Paleta y tipografía tomadas de frontend/src/index.css del propio sistema
// (repositorio COIPO_ENTREGA_PLANTA). No inventar colores nuevos aquí.

export const C = {
  verdeProfundo: '#1b4332',
  verde: '#2d6a4f',
  verdeMedio: '#22543d',
  verdeClaro: '#d8f3dc',
  verdeSuave: '#95c9ad',
  ambar: '#ffb700',
  ambarTexto: '#b98600',
  azulCU: '#0F69C4',
  azulCUSuave: '#e3f0fb',
  fondo: '#f8faf8',
  blanco: '#ffffff',
  texto: '#1b2926',
  atenuado: '#5a6b67',
  borde: '#d8e2dc',
  peligro: '#991b1b',
  peligroSuave: '#fee2e2',
};

export const FUENTE =
  'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const FPS = 30;

// Un antetítulo con su regla corta: abre todas las secciones.
export const Antetitulo = ({ texto, color = C.verde, opacidad = 1, dx = 0 }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      opacity: opacidad,
      transform: `translateX(${dx}px)`,
    }}
  >
    <div style={{ width: 46, height: 4, background: color }} />
    <div
      style={{
        color,
        fontSize: 21,
        letterSpacing: 3.2,
        fontWeight: 600,
      }}
    >
      {texto}
    </div>
  </div>
);
