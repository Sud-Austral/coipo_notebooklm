import { H2 } from '../components/Heading.jsx'
import { Steps, Step } from '../components/Steps.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import DataTable from '../components/DataTable.jsx'

export default function NotebookYFuentes() {
  return (
    <>
      <p className="lead">
        Un notebook sin fuentes no sirve para nada: todo lo que genera NotebookLM
        sale del material que le cargues. El orden es siempre crear, cargar,
        y solo entonces generar.
      </p>

      <H2 id="crear">Crear el notebook</H2>
      <Steps>
        <Step title="Crear y quedarse con el id">
          <CodeBlock
            code={{
              windows: `.\\.venv\\Scripts\\nlm.exe notebook create "Mi notebook" --json`,
              posix: `./.venv/bin/nlm notebook create "Mi notebook" --json`,
            }}
          />
          <CodeBlock
            showCopy={false}
            lang="json"
            title="salida"
            code={`{
  "notebook_id": "<notebook-id>",
  "title": "Mi notebook",
  "url": "https://notebooklm.google.com/notebook/<notebook-id>"
}`}
          />
        </Step>
        <Step title="Añadir una fuente y esperar a que se procese">
          <CodeBlock
            code={{
              windows: `.\\.venv\\Scripts\\nlm.exe source add <notebook-id> --url "https://ejemplo.cl/documento" --wait --json`,
              posix: `./.venv/bin/nlm source add <notebook-id> --url "https://ejemplo.cl/documento" --wait --json`,
            }}
          />
        </Step>
      </Steps>

      <Callout type="tip" title="Usa --wait">
        <p>
          Sin <code>--wait</code> el comando vuelve enseguida y la fuente puede
          seguir procesándose. Si lanzas la generación en ese momento, el artefacto
          sale con material incompleto. El límite por defecto son 600 s, ajustable
          con <code>--wait-timeout</code>.
        </p>
      </Callout>

      <H2 id="tipos-de-fuente">Tipos de fuente</H2>
      <DataTable
        caption="Opciones de nlm source add"
        columns={[
          { key: 'flag', header: 'Opción' },
          { key: 'que', header: 'Qué acepta' },
        ]}
        rows={[
          { flag: <code>--url</code>, que: 'Una página web. Repetible para cargar varias de golpe.' },
          { flag: <code>--file</code>, que: 'Archivo local: PDF y otros formatos de documento.' },
          { flag: <code>--youtube</code>, que: 'URL de YouTube; usa la transcripción. Repetible.' },
          { flag: <code>--text</code>, que: 'Texto suelto pasado directamente por línea de comandos.' },
          { flag: <code>--drive</code>, que: 'Id de documento de Google Drive; con --type doc, slides, sheets o pdf.' },
          { flag: <code>--title</code>, que: 'Nombre con el que quieres que aparezca la fuente.' },
        ]}
      />

      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe source add <notebook-id> \`\n  --url "https://ejemplo.cl/a" \`\n  --url "https://ejemplo.cl/b" \`\n  --file ".\\informe.pdf" --wait --json`,
          posix: `./.venv/bin/nlm source add <notebook-id> \\\n  --url "https://ejemplo.cl/a" \\\n  --url "https://ejemplo.cl/b" \\\n  --file "./informe.pdf" --wait --json`,
        }}
        caption="Varias fuentes en una sola llamada."
      />

      <H2 id="revisar">Revisar lo que hay</H2>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe notebook list\n.\\.venv\\Scripts\\nlm.exe list sources <notebook-id>\n.\\.venv\\Scripts\\nlm.exe query <notebook-id> "¿De qué tratan estas fuentes?"`,
          posix: `./.venv/bin/nlm notebook list\n./.venv/bin/nlm list sources <notebook-id>\n./.venv/bin/nlm query <notebook-id> "¿De qué tratan estas fuentes?"`,
        }}
      />

      <Callout type="info" title="Alias para no pelear con los UUID">
        <p>
          Los identificadores son UUID largos. <code>nlm alias</code> permite darles
          un nombre corto y usarlo en lugar del id en cualquier comando.
        </p>
      </Callout>
    </>
  )
}
