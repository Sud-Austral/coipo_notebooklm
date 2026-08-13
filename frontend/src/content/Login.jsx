import { H2 } from '../components/Heading.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import DataTable from '../components/DataTable.jsx'

export default function Login() {
  return (
    <>
      <p className="lead">
        No hay clave de API que pedir. La autenticación consiste en abrir una
        ventana de Chrome, iniciar sesión como lo harías normalmente, y dejar que
        el cliente se quede con las cookies resultantes.
      </p>

      <H2 id="entrar">Entrar</H2>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe login`,
          posix: `./.venv/bin/nlm login`,
        }}
        caption="Abre el navegador, espera a que inicies sesión (hasta 300 s) y guarda la sesión."
      />
      <p>Al terminar verás algo así:</p>
      <CodeBlock
        showCopy={false}
        title="salida"
        code={`✓ Successfully authenticated!\n  Profile: default\n  Provider: builtin\n  Cookies: 47 extracted\n  CSRF Token: Yes\n  Account: tu-cuenta@dominio`}
      />

      <Callout type="info" title="La contraseña nunca pasa por la herramienta">
        <p>
          El inicio de sesión ocurre entero dentro del navegador, incluido el
          segundo factor. El cliente solo recibe las cookies del final. Por eso no
          hay ningún sitio donde configurar usuario y contraseña.
        </p>
      </Callout>

      <H2 id="donde-queda">Dónde queda la sesión</H2>
      <p>
        En <code>~/.notebooklm-mcp-cli/profiles/&lt;perfil&gt;/</code>, en dos
        archivos JSON sin cifrar:
      </p>
      <DataTable
        caption="Archivos de un perfil"
        columns={[
          { key: 'archivo', header: 'Archivo' },
          { key: 'contenido', header: 'Contenido' },
        ]}
        rows={[
          {
            archivo: <code>cookies.json</code>,
            contenido: 'Volcado crudo de las cookies del navegador. No está filtrado a Google: trae las de todos los dominios que tuvieras abiertos.',
          },
          {
            archivo: <code>metadata.json</code>,
            contenido: 'Token CSRF, id de sesión, correo detectado, build label y el host base donde se firmó.',
          },
        ]}
      />

      <Callout type="danger" title="Ese directorio es la cuenta entera">
        <p>
          Quien tenga esos archivos entra a la cuenta de Google sin contraseña y
          sin segundo factor. No los subas a ningún repositorio, no los pegues en
          tickets y no los copies a máquinas que no controles.
        </p>
      </Callout>

      <H2 id="comprobar">Comprobar y renovar</H2>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe login --check`,
          posix: `./.venv/bin/nlm login --check`,
        }}
        caption="Valida contra el servidor y, de paso, refresca el token CSRF. Sale con código 2 si la sesión caducó."
      />
      <p>
        Si caducó, vuelve a correr <code>nlm login</code>. Las cookies además{' '}
        <strong>rotan solas</strong> durante el uso normal: el cliente reescribe
        los dos archivos del perfil cada vez que valida la sesión.
      </p>

      <H2 id="perfiles">Varias cuentas</H2>
      <p>
        Cada perfil tiene su propio directorio y su propia sesión de navegador, así
        que puedes tener varias cuentas de Google en paralelo.
      </p>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe login --profile trabajo\n.\\.venv\\Scripts\\nlm.exe login profile list\n.\\.venv\\Scripts\\nlm.exe login switch trabajo`,
          posix: `./.venv/bin/nlm login --profile trabajo\n./.venv/bin/nlm login profile list\n./.venv/bin/nlm login switch trabajo`,
        }}
      />
      <p>
        El perfil activo queda en <code>~/.notebooklm-mcp-cli/config.toml</code>, y
        se puede sobrescribir por entorno con <code>NLM_PROFILE</code>. Si nunca has
        cambiado nada, el perfil es <code>default</code>.
      </p>
    </>
  )
}
