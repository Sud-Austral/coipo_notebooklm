import { H2 } from '../components/Heading.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import DataTable from '../components/DataTable.jsx'

export default function Troubleshooting() {
  return (
    <>
      <p className="lead">
        Problemas reales encontrados usando la versión 0.9.10, con la causa y el
        rodeo que funciona.
      </p>

      <DataTable
        caption="Resumen"
        columns={[
          { key: 'sintoma', header: 'Síntoma' },
          { key: 'causa', header: 'Causa real' },
        ]}
        rows={[
          {
            sintoma: <code>TypeError ... OptionInfo</code>,
            causa: 'Bug del CLI al consultar artefactos. No es culpa de tu instalación.',
          },
          {
            sintoma: <code>RESOURCE_EXHAUSTED</code>,
            causa: 'Cuota de creación agotada. Es por cuenta, y en infografías dura horas.',
          },
          {
            sintoma: <code>Download failed for audio</code>,
            causa: 'El artefacto aún se está generando. No es un problema de permisos.',
          },
          {
            sintoma: <code>Authentication expired</code>,
            causa: 'La sesión caducó — o estás preguntando al host base equivocado.',
          },
          {
            sintoma: 'Caracteres corruptos en los textos',
            causa: 'Codificación de los argumentos en Windows.',
          },
        ]}
      />

      <H2 id="status-artifacts">TypeError al consultar el estado</H2>
      <CodeBlock
        showCopy={false}
        title="error"
        wrap
        code={`TypeError: '<=' not supported between instances of 'int' and 'OptionInfo'`}
      />
      <p>
        Afecta a <code>nlm status artifacts</code> y a{' '}
        <code>nlm list artifacts</code>: las dos rutas pasan por la misma función
        de servicio, donde el valor por defecto de <code>limit</code> llega como
        objeto de Typer en vez de como número. No hay ninguna combinación de
        opciones que lo evite.
      </p>
      <p>El rodeo es llamar a la librería directamente, pasando el límite a mano:</p>
      <CodeBlock
        lang="python"
        title="scripts/artifact_status.py"
        code={`from notebooklm_tools.cli.commands.studio import get_client
from notebooklm_tools.services import studio

with get_client(None) as client:
    result = studio.get_studio_status(client, "<notebook-id>", limit=20)
print(result)`}
      />

      <H2 id="cuota">Cuota de creación agotada</H2>
      <CodeBlock
        showCopy={false}
        title="error"
        wrap
        code={`RPC rate limit (RESOURCE_EXHAUSTED) on R7cb6c, attempt 3/4, retrying in 4.0s...
{
  "status": "error",
  "error": "Rate limited — ... Wait a few minutes before retrying infographic creation."
}`}
      />
      <p>
        NotebookLM limita cuántos artefactos se crean por periodo. El mensaje dice
        «espera 1-2 minutos», pero eso subestima bastante el bloqueo real.
      </p>

      <Callout type="warning" title="Lo que medimos generando esta galería">
        <ul>
          <li>
            Las infografías se cortaron a las <strong>15 creaciones</strong> y el
            bloqueo duró <strong>más de doce horas</strong>, cruzando la medianoche.
            No es una ventana de minutos ni un reset diario limpio.
          </li>
          <li>
            La cuota es <strong>por cuenta, no por notebook</strong>: probamos a
            crear en otro notebook distinto y falla igual.
          </li>
          <li>
            Cada tipo de artefacto lleva <strong>su propio contador</strong>. Con
            las infografías bloqueadas, los vídeos, los audios y las presentaciones
            seguían aceptándose sin problema.
          </li>
        </ul>
      </Callout>

      <p>
        El reintento agresivo no sirve de nada y sí gasta llamadas. Lo que funciona
        es un proceso reanudable que guarde en disco qué se creó ya, y vuelva a
        intentar los pendientes cada tanto sin repetir lo hecho.
      </p>

      <H2 id="download-failed">La descarga falla justo después de generar</H2>
      <CodeBlock showCopy={false} title="error" code={`Error: Download failed for audio.`} />
      <p>
        El artefacto todavía no está listo. Se distingue mirando el campo de la URL
        en el estado: mientras <code>audio_url</code> sea <code>null</code>, no hay
        nada que descargar. Conviene esperar en bucle en vez de reintentar a ciegas.
      </p>
      <Callout type="info" title="No lo confundas con los 404 de propagación">
        <p>
          <code>Audio media URL returned 404 while propagating; retrying in 5s...</code>{' '}
          aparece <em>durante</em> una descarga que sí va a funcionar. El cliente
          reintenta solo y termina bien.
        </p>
      </Callout>

      <H2 id="auth-expired">Authentication expired</H2>
      <p>Dos causas distintas con el mismo mensaje:</p>
      <ol>
        <li>
          <strong>La sesión caducó de verdad.</strong> Compruébalo con{' '}
          <code>nlm login --check</code>; si sale con código 2, vuelve a correr{' '}
          <code>nlm login</code>.
        </li>
        <li>
          <strong>Host base equivocado.</strong> Si estás usando{' '}
          <code>NOTEBOOKLM_COOKIES</code> sin <code>NOTEBOOKLM_BASE_URL</code>, el
          cliente pregunta al host por defecto, la petición rebota a{' '}
          <code>accounts.google.com</code> y el error es idéntico — con cookies
          perfectamente válidas.
        </li>
      </ol>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe login --check\n.\\.venv\\Scripts\\nlm.exe doctor`,
          posix: `./.venv/bin/nlm login --check\n./.venv/bin/nlm doctor`,
        }}
      />

      <H2 id="import-rechazado">Las cookies importadas son rechazadas</H2>
      <CodeBlock
        showCopy={false}
        title="error"
        wrap
        code={`Error: Imported cookies were rejected by Gemini Notebook`}
      />
      <p>
        Pasar el <code>cookies.json</code> del perfil tal cual a{' '}
        <code>nlm login --manual --file</code> no funciona: ese archivo es el
        volcado crudo del navegador, con cookies de todos los dominios, y la
        verificación previa lo rechaza. Para mover una sesión a otra máquina es más
        fiable la vía de <code>NOTEBOOKLM_COOKIES</code>.
      </p>

      <H2 id="mojibake">Caracteres corruptos en Windows</H2>
      <p>
        Un título con tildes o guion largo que llega como{' '}
        <code>COIPO ? Demo</code> es un problema de codificación de los argumentos,
        no del contenido:
      </p>
      <CodeBlock
        code={{
          windows: `$env:PYTHONUTF8 = "1"`,
          posix: `export PYTHONUTF8=1`,
        }}
      />

      <H2 id="sin-notebooks">La sesión funciona pero no aparece ningún notebook</H2>
      <p>
        Suele ser una cuenta de Workspace en la que el administrador no ha
        habilitado NotebookLM, o una cuenta distinta de la que crees. El correo
        detectado se ve con <code>nlm login --check</code>.
      </p>
    </>
  )
}
