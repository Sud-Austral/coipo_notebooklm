/** Formatos de Audio Overview. */
export const AUDIO_FORMATS = [
  { id: 'deep_dive', name: 'deep_dive', desc: 'Conversacion larga entre dos voces. Es el valor por defecto.' },
  { id: 'brief', name: 'brief', desc: 'Resumen corto y directo. El mas rapido de generar.' },
  { id: 'critique', name: 'critique', desc: 'Revision critica de las fuentes, senalando huecos y sesgos.' },
  { id: 'debate', name: 'debate', desc: 'Dos posturas enfrentadas sobre el material.' },
]

/** Tipos de artefacto del Studio y su comando. */
export const ARTIFACT_TYPES = [
  { type: 'Audio Overview', create: 'nlm audio create', download: 'nlm download audio', ext: '.m4a' },
  { type: 'Video Overview', create: 'nlm video create', download: 'nlm download video', ext: '.mp4' },
  { type: 'Reporte', create: 'nlm report create', download: 'nlm download report', ext: '.md' },
  { type: 'Infografia', create: 'nlm infographic create', download: 'nlm download infographic', ext: '.png' },
  { type: 'Presentacion', create: 'nlm slides create', download: 'nlm download slide-deck', ext: '.pdf / .pptx' },
  { type: 'Mapa mental', create: 'nlm mindmap create', download: 'nlm download mind-map', ext: '.json' },
  { type: 'Cuestionario', create: 'nlm quiz create', download: 'nlm download quiz', ext: '.json' },
  { type: 'Tarjetas', create: 'nlm flashcards create', download: 'nlm download flashcards', ext: '.json' },
  { type: 'Tabla de datos', create: 'nlm data-table create', download: 'nlm download data-table', ext: '.csv' },
]
