import QueEs from './QueEs.jsx'
import Requisitos from './Requisitos.jsx'
import Instalacion from './Instalacion.jsx'
import Login from './Login.jsx'
import ClientesMcp from './ClientesMcp.jsx'
import NotebookYFuentes from './NotebookYFuentes.jsx'
import Multimedia from './Multimedia.jsx'
import EstadoYDescarga from './EstadoYDescarga.jsx'
import Ingesta from './Ingesta.jsx'
import OtrosProyectos from './OtrosProyectos.jsx'
import Troubleshooting from './Troubleshooting.jsx'
import VariablesEntorno from './VariablesEntorno.jsx'
import GaleriaInfografias from './GaleriaInfografias.jsx'
import GaleriaVideos from './GaleriaVideos.jsx'
import GaleriaAudios from './GaleriaAudios.jsx'

/**
 * Registro unico de secciones: alimenta el sidebar, el paginador, el titulo del
 * documento y el router. Los metadatos viven aqui y no en cada archivo de
 * seccion para que esos archivos exporten solo su componente (regla
 * react/only-export-components de oxlint).
 */
export const SECTIONS = [
  { slug: 'que-es', title: 'Qué es esto', group: 'Introducción', Component: QueEs },
  { slug: 'requisitos', title: 'Requisitos', group: 'Introducción', Component: Requisitos },

  { slug: 'infografias', title: 'Infografías', group: 'Galería', Component: GaleriaInfografias },
  { slug: 'videos', title: 'Vídeos', group: 'Galería', Component: GaleriaVideos },
  { slug: 'audios', title: 'Audios', group: 'Galería', Component: GaleriaAudios },

  { slug: 'instalacion', title: 'Instalación', group: 'Puesta en marcha', Component: Instalacion },
  { slug: 'login', title: 'Login y sesión', group: 'Puesta en marcha', Component: Login },
  { slug: 'clientes-mcp', title: 'Conectar agentes por MCP', group: 'Puesta en marcha', Component: ClientesMcp },

  { slug: 'notebook-y-fuentes', title: 'Notebook y fuentes', group: 'Flujo de trabajo', Component: NotebookYFuentes },
  { slug: 'multimedia', title: 'Generar multimedia', group: 'Flujo de trabajo', Component: Multimedia },
  { slug: 'estado-y-descarga', title: 'Estado y descarga', group: 'Flujo de trabajo', Component: EstadoYDescarga },
  { slug: 'ingesta', title: 'Ingerir al proyecto', group: 'Flujo de trabajo', Component: Ingesta },

  { slug: 'otros-proyectos', title: 'Conectar otros proyectos', group: 'Avanzado', Component: OtrosProyectos },

  { slug: 'troubleshooting', title: 'Troubleshooting', group: 'Referencia', Component: Troubleshooting },
  { slug: 'variables-entorno', title: 'Variables de entorno', group: 'Referencia', Component: VariablesEntorno },
]

export const SLUGS = SECTIONS.map((section) => section.slug)

export const GROUPS = [...new Set(SECTIONS.map((section) => section.group))]

if (new Set(SLUGS).size !== SLUGS.length) {
  throw new Error('Hay slugs de seccion duplicados en SECTIONS')
}

export const bySlug = (slug) => SECTIONS.find((section) => section.slug === slug)

export const neighbors = (slug) => {
  const index = SLUGS.indexOf(slug)
  if (index < 0) return { prev: null, next: null }
  return { prev: SECTIONS[index - 1] ?? null, next: SECTIONS[index + 1] ?? null }
}
