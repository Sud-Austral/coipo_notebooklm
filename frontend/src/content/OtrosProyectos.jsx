import { H2 } from '../components/Heading.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import DataTable from '../components/DataTable.jsx'

export default function OtrosProyectos() {
  return (
    <>
      <p className="lead">
        Una vez tienes la sesión iniciada, no hace falta repetir el login en cada
        repositorio. Hay dos formas de reutilizarla, y la diferencia importante
        entre ellas es si el otro proyecto corre en la misma máquina o no.
      </p>

      <Callout type="danger" title="Esta página no contiene credenciales">
        <p>
          Aquí solo está el procedimiento. Los valores de cookies y tokens de una
          sesión concreta nunca deben acabar en un sitio publicado, ni en un
          repositorio, ni en la configuración compartida de un equipo.
        </p>
      </Callout>

      <H2 id="misma-maquina">Misma máquina: compartir el directorio de estado</H2>
      <p>
        La opción recomendada. El otro proyecto apunta al mismo directorio de
        credenciales; no se copia nada, y cuando las cookies roten, los dos
        proyectos ven la rotación a la vez.
      </p>
      <CodeBlock
        code={{
          windows: `$env:NOTEBOOKLM_MCP_CLI_PATH = "$HOME\\.notebooklm-mcp-cli"\nnlm notebook list`,
          posix: `export NOTEBOOKLM_MCP_CLI_PATH="$HOME/.notebooklm-mcp-cli"\nnlm notebook list`,
        }}
      />
      <p>Y en el <code>.mcp.json</code> del otro repositorio:</p>
      <CodeBlock
        lang="json"
        title=".mcp.json del otro proyecto"
        code={`{
  "mcpServers": {
    "notebooklm": {
      "type": "stdio",
      "command": "C:\\\\ruta\\\\a\\\\ese-proyecto\\\\.venv\\\\Scripts\\\\notebooklm-mcp.exe",
      "env": {
        "NOTEBOOKLM_MCP_CLI_PATH": "C:\\\\Users\\\\<usuario>\\\\.notebooklm-mcp-cli",
        "NOTEBOOKLM_HL": "es"
      }
    }
  }
}`}
      />
      <p>
        Como lee <code>metadata.json</code>, el host base y el token CSRF salen
        correctos solos. Es la única receta que no se rompe cuando la sesión se
        refresca.
      </p>

      <H2 id="otra-maquina">Otra máquina: cookies por variable de entorno</H2>
      <p>
        Para un contenedor, un servidor o CI, donde no existe ese directorio.{' '}
        <code>NOTEBOOKLM_COOKIES</code> recibe el header de cookies completo.
      </p>

      <Callout type="warning" title="Hacen falta dos variables, no una">
        <p>
          <code>NOTEBOOKLM_COOKIES</code> es un <em>override total</em>: descarta
          el perfil guardado entero, incluido el host base donde se firmó la
          sesión. Si tu cuenta no está en el host por defecto —y varias cuentas ya
          están migradas a <code>notebook.google.com</code>— la petición rebota a{' '}
          <code>accounts.google.com</code> y falla con{' '}
          <em>&quot;Authentication expired&quot;</em> aunque las cookies estén
          perfectas.
        </p>
        <p>
          El error engaña: no es que la sesión haya caducado, es que se está
          preguntando al host equivocado. Añade siempre{' '}
          <code>NOTEBOOKLM_BASE_URL</code>.
        </p>
      </Callout>

      <CodeBlock
        code={{
          windows: `$env:NOTEBOOKLM_COOKIES  = "SID=...; HSID=...; SSID=..."\n$env:NOTEBOOKLM_BASE_URL = "https://notebook.google.com"\nnlm notebook list`,
          posix: `export NOTEBOOKLM_COOKIES="SID=...; HSID=...; SSID=..."\nexport NOTEBOOKLM_BASE_URL="https://notebook.google.com"\nnlm notebook list`,
        }}
        caption="El host correcto es el que aparece como base_host en el metadata.json del perfil de origen."
      />

      <p>
        Bastan las cookies esenciales de Google (<code>SID</code>,{' '}
        <code>HSID</code>, <code>SSID</code>, <code>APISID</code>,{' '}
        <code>SAPISID</code> y sus variantes <code>__Secure-</code>); no hace falta
        —ni conviene— mandar el volcado completo del navegador.
      </p>

      <H2 id="comparacion">Cuál usar</H2>
      <DataTable
        caption="Diferencias entre las dos recetas"
        columns={[
          { key: 'criterio', header: 'Criterio' },
          { key: 'path', header: 'Directorio compartido' },
          { key: 'cookies', header: 'Cookies por entorno' },
        ]}
        rows={[
          { criterio: 'Funciona en otra máquina', path: 'No', cookies: 'Sí' },
          { criterio: 'Sobrevive a la rotación de cookies', path: 'Sí', cookies: 'No: hay que actualizarlas' },
          { criterio: 'Resuelve el host base solo', path: 'Sí', cookies: 'No: hay que pasarlo a mano' },
          { criterio: 'Expone secretos en la configuración', path: 'No, solo una ruta', cookies: 'Sí: el header es un secreto' },
        ]}
      />

      <H2 id="perfil">Elegir el perfil</H2>
      <CodeBlock
        code={{
          windows: `$env:NLM_PROFILE = "trabajo"`,
          posix: `export NLM_PROFILE=trabajo`,
        }}
        caption="Equivale a --profile. Ojo al prefijo: es NLM_, no NOTEBOOKLM_."
      />
    </>
  )
}
