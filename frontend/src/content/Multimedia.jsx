import { H2 } from '../components/Heading.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import DataTable from '../components/DataTable.jsx'
import { ARTIFACT_TYPES, AUDIO_FORMATS } from '../data/artifacts.js'

export default function Multimedia() {
  return (
    <>
      <p className="lead">
        Con las fuentes cargadas, la generación es un comando. Devuelve enseguida
        con un identificador de artefacto: el trabajo sigue en los servidores de
        Google durante varios minutos.
      </p>

      <H2 id="audio">Audio Overview</H2>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe audio create <notebook-id> \`\n  --format brief --length short --language es --confirm --json`,
          posix: `./.venv/bin/nlm audio create <notebook-id> \\\n  --format brief --length short --language es --confirm --json`,
        }}
      />
      <CodeBlock
        showCopy={false}
        lang="json"
        title="salida"
        code={`{
  "artifact_type": "audio",
  "artifact_id": "<artifact-id>",
  "status": "unknown",
  "message": "Audio generation started."
}`}
        caption="Guarda el artifact_id: lo necesitas para descargar."
      />

      <DataTable
        caption="Formatos de audio (--format)"
        columns={[
          { key: 'name', header: 'Valor' },
          { key: 'desc', header: 'Qué produce' },
        ]}
        rows={AUDIO_FORMATS.map((format) => ({
          id: format.id,
          name: <code>{format.name}</code>,
          desc: format.desc,
        }))}
      />

      <p>
        Otras opciones: <code>--length</code> acepta <code>short</code>,{' '}
        <code>default</code> o <code>long</code>; <code>--language</code> toma un
        código BCP-47 (<code>es</code>, <code>en</code>, <code>pt-BR</code>…);{' '}
        <code>--focus</code> orienta el guion hacia un tema concreto; y{' '}
        <code>--source-ids</code> restringe la generación a unas fuentes concretas
        en lugar de usar todas.
      </p>

      <Callout type="warning" title="El idioma no se hereda">
        <p>
          Sin <code>--language</code> el audio sale en inglés aunque las fuentes
          estén en español. Si no quieres repetirlo en cada comando, define{' '}
          <code>NOTEBOOKLM_HL=es</code> en el entorno.
        </p>
      </Callout>

      <H2 id="otros">Los demás artefactos</H2>
      <DataTable
        caption="Tipos de artefacto y sus comandos"
        dense
        columns={[
          { key: 'type', header: 'Artefacto' },
          { key: 'create', header: 'Crear' },
          { key: 'download', header: 'Descargar' },
          { key: 'ext', header: 'Formato' },
        ]}
        rows={ARTIFACT_TYPES.map((artifact) => ({
          id: artifact.type,
          type: artifact.type,
          create: <code>{artifact.create}</code>,
          download: <code>{artifact.download}</code>,
          ext: artifact.ext,
        }))}
      />

      <p>
        Todos siguen el mismo patrón: <code>&lt;tipo&gt; create &lt;notebook-id&gt;</code>{' '}
        para lanzar y <code>download &lt;tipo&gt;</code> para traerse el archivo.{' '}
        <code>nlm studio rename</code> y <code>nlm studio delete</code> gestionan
        los artefactos ya creados.
      </p>

      <Callout type="tip" title="Cuánto tarda">
        <p>
          Un audio corto en formato <code>brief</code> puede estar en cerca de un
          minuto; un <code>deep_dive</code> largo tarda bastante más. No hay
          notificación: hay que consultar el estado, que es justo lo que viene en
          la siguiente sección.
        </p>
      </Callout>
    </>
  )
}
