import { H2 } from '../components/Heading.jsx'
import Callout from '../components/Callout.jsx'
import DataTable from '../components/DataTable.jsx'

export default function QueEs() {
  return (
    <>
      <p className="lead">
        Esta guía explica cómo conectar un proyecto con NotebookLM para crear
        notebooks, generar audio, vídeo, infografías o reportes, y traerse esos
        archivos al repositorio — todo desde la terminal o desde un agente por MCP.
      </p>

      <Callout type="danger" title="No existe una API pública oficial de NotebookLM">
        <p>
          Google no ofrece API self-service para el producto de consumo. Lo que
          usa esta guía es un <strong>cliente no oficial</strong> que habla con
          las interfaces internas del producto (Boq RPC) y se autentica con las
          cookies de una sesión de navegador.
        </p>
        <p>
          Consecuencia práctica: Google puede cambiar esas interfaces o invalidar
          la sesión sin previo aviso, y no hay compromiso de estabilidad ninguno.
          No lo trates como un conector listo para producción sin una revisión de
          seguridad propia.
        </p>
      </Callout>

      <H2 id="alternativas">Qué opciones hay realmente</H2>
      <DataTable
        caption="Vías de acceso programático a NotebookLM"
        columns={[
          { key: 'via', header: 'Vía' },
          { key: 'estado', header: 'Estado' },
          { key: 'cuando', header: 'Cuándo usarla' },
        ]}
        rows={[
          {
            via: 'Cliente no oficial (esta guía)',
            estado: 'Funciona, sin garantías',
            cuando: 'Trabajo personal o de equipo pequeño, prototipos, automatizaciones internas.',
          },
          {
            via: 'Gemini Notebook Enterprise (Google Cloud)',
            estado: 'Oficial; creación de audio en preview Pre-GA',
            cuando: 'Producción, cuando tienes licencia enterprise y proyecto en GCP.',
          },
          {
            via: 'Podcast API independiente',
            estado: 'Deprecada, sin altas nuevas',
            cuando: 'Ninguno. Está cerrada.',
          },
        ]}
      />

      <H2 id="que-hace">Qué te deja hacer</H2>
      <ul>
        <li>Crear notebooks y cargarles fuentes: URLs, PDFs, vídeos de YouTube, texto o documentos de Drive.</li>
        <li>Generar artefactos del Studio: audio, vídeo, reportes, infografías, presentaciones, mapas mentales, cuestionarios y tarjetas.</li>
        <li>Descargar esos artefactos como archivos y versionar su metadata en el repositorio.</li>
        <li>Consultar el contenido de un notebook, o de varios a la vez, desde un agente conectado por MCP.</li>
      </ul>

      <H2 id="dos-formas">Dos formas de usarlo</H2>
      <p>
        <strong>Desde la terminal</strong>, con el comando <code>nlm</code>: es lo
        que verás en casi todos los ejemplos, y es lo que conviene para scripts y
        automatización.
      </p>
      <p>
        <strong>Desde un agente</strong>, con el servidor MCP: Claude Code, Cursor,
        Copilot y compañía pueden llamar a las mismas operaciones en lenguaje
        natural. Es más cómodo para trabajo exploratorio.
      </p>
    </>
  )
}
