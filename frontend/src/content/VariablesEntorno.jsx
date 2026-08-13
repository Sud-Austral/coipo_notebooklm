import { H2 } from '../components/Heading.jsx'
import Badge from '../components/Badge.jsx'
import Callout from '../components/Callout.jsx'
import DataTable from '../components/DataTable.jsx'
import { ENV_VARS } from '../data/envVars.js'

export default function VariablesEntorno() {
  return (
    <>
      <p className="lead">
        Variables que el cliente lee de verdad en la versión 0.9.10. Las marcadas
        como secreto llevan credenciales: no deben aparecer en archivos
        versionados ni en configuración compartida.
      </p>

      <Callout type="danger" title="Esta guía nunca muestra valores reales">
        <p>
          Ni cookies, ni tokens CSRF, ni identificadores de sesión. Todo lo que
          veas aquí es el nombre de la variable y para qué sirve.
        </p>
      </Callout>

      <DataTable
        caption="Variables de entorno"
        columns={[
          { key: 'name', header: 'Variable' },
          { key: 'scope', header: 'Ámbito' },
          { key: 'desc', header: 'Qué hace' },
        ]}
        rows={ENV_VARS.map((variable) => ({
          id: variable.name,
          name: (
            <>
              <code>{variable.name}</code>
              {variable.sensitive && (
                <>
                  {' '}
                  <Badge tone="danger">Secreto</Badge>
                </>
              )}
            </>
          ),
          scope: variable.scope,
          desc: variable.desc,
        }))}
      />

      <H2 id="prefijos">Dos prefijos, no uno</H2>
      <p>
        La mayoría empiezan por <code>NOTEBOOKLM_</code>, pero las de comportamiento
        del CLI usan <code>NLM_</code>: <code>NLM_PROFILE</code>,{' '}
        <code>NLM_BROWSER</code>, <code>NLM_OUTPUT_FORMAT</code> y{' '}
        <code>NLM_NO_COLOR</code>. Es una fuente habitual de confusión, porque una
        variable con el prefijo equivocado no da error: simplemente se ignora.
      </p>

      <H2 id="precedencia">Precedencia</H2>
      <ol>
        <li>
          <code>NOTEBOOKLM_COOKIES</code> gana sobre todo lo demás. Si está
          definida, el login guardado se ignora por completo.
        </li>
        <li>
          <code>NOTEBOOKLM_MCP_CLI_PATH</code> decide dónde se buscan los perfiles.
        </li>
        <li>
          <code>NLM_PROFILE</code> o <code>--profile</code> eligen cuál de ellos.
        </li>
        <li>
          Sin nada de lo anterior, se usa el perfil <code>default</code>.
        </li>
      </ol>
    </>
  )
}
