import { H2 } from '../components/Heading.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import DataTable from '../components/DataTable.jsx'
import { MCP_CLIENTS } from '../data/mcpClients.js'

export default function ClientesMcp() {
  return (
    <>
      <p className="lead">
        El mismo paquete trae un servidor MCP. Registrándolo, un agente como
        Claude Code puede listar notebooks, crear fuentes, generar multimedia y
        descargar artefactos por su cuenta.
      </p>

      <H2 id="registro-automatico">Registro automático</H2>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe setup list\n.\\.venv\\Scripts\\nlm.exe setup add claude-code`,
          posix: `./.venv/bin/nlm setup list\n./.venv/bin/nlm setup add claude-code`,
        }}
        caption="setup list muestra qué clientes detecta y dónde escribiría la configuración."
      />

      <DataTable
        caption="Identificadores aceptados por nlm setup add"
        dense
        columns={[
          { key: 'id', header: 'Identificador' },
          { key: 'name', header: 'Cliente' },
          { key: 'note', header: 'Nota' },
        ]}
        rows={MCP_CLIENTS.map((client) => ({
          id: <code>{client.id}</code>,
          name: client.name,
          note: client.note,
        }))}
      />

      <Callout type="warning" title="Los CLI no llevan sufijo">
        <p>
          Son <code>gemini</code> y <code>codex</code>, no <code>gemini-cli</code>{' '}
          ni <code>codex-cli</code>. Con el nombre equivocado el comando falla sin
          explicar mucho.
        </p>
      </Callout>

      <H2 id="registro-manual">Registro manual</H2>
      <p>
        Si prefieres versionar la configuración con el proyecto, o el registro
        automático no encuentra tu cliente, escribe el archivo a mano. Para Claude
        Code es un <code>.mcp.json</code> en la raíz del repositorio:
      </p>
      <CodeBlock
        lang="json"
        title=".mcp.json"
        code={`{
  "mcpServers": {
    "notebooklm": {
      "type": "stdio",
      "command": "C:\\\\ruta\\\\a\\\\tu-proyecto\\\\.venv\\\\Scripts\\\\notebooklm-mcp.exe",
      "args": [],
      "env": {
        "NOTEBOOKLM_HL": "es"
      }
    }
  }
}`}
        caption="En macOS o Linux el comando es .venv/bin/notebooklm-mcp. Usa ruta absoluta."
      />

      <Callout type="info" title="Hay que reiniciar el cliente">
        <p>
          Los agentes leen la configuración MCP al arrancar. Después de registrar
          el servidor, reinicia el cliente y aprueba el servidor cuando te lo pida;
          hasta entonces no verás ninguna herramienta nueva.
        </p>
      </Callout>

      <H2 id="que-expone">Qué expone</H2>
      <p>
        Alrededor de 43 herramientas. Las que más se usan:{' '}
        <code>notebook_list</code>, <code>notebook_create</code>,{' '}
        <code>source_add</code>, <code>studio_create</code>,{' '}
        <code>download_artifact</code>, <code>notebook_query</code> y{' '}
        <code>cross_notebook_query</code> para preguntar a varios notebooks a la vez.
      </p>
      <p>
        Si quieres reducir lo que ve el agente, las variables{' '}
        <code>NOTEBOOKLM_ENABLED_TOOLS</code>,{' '}
        <code>NOTEBOOKLM_DISABLED_TOOLS</code> y{' '}
        <code>NOTEBOOKLM_DISABLED_GROUPS</code> filtran el catálogo.
      </p>
    </>
  )
}
