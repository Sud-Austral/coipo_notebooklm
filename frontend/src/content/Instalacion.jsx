import { H2 } from '../components/Heading.jsx'
import { Steps, Step } from '../components/Steps.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'

export default function Instalacion() {
  return (
    <>
      <p className="lead">
        El cliente se instala en un entorno virtual del propio proyecto. Así no
        contamina tu Python base ni tu entorno de conda, y la versión queda
        anclada al repositorio.
      </p>

      <H2 id="entorno">Entorno virtual e instalación</H2>
      <Steps>
        <Step title="Crear el entorno virtual">
          <CodeBlock
            code={{
              windows: `cd C:\\ruta\\a\\tu-proyecto\npython -m venv .venv`,
              posix: `cd /ruta/a/tu-proyecto\npython3 -m venv .venv`,
            }}
          />
        </Step>
        <Step title="Instalar el cliente">
          <CodeBlock
            code={{
              windows: `.\\.venv\\Scripts\\python.exe -m pip install notebooklm-mcp-cli==0.9.10`,
              posix: `./.venv/bin/python -m pip install notebooklm-mcp-cli==0.9.10`,
            }}
          />
        </Step>
        <Step title="Comprobar que quedó instalado">
          <CodeBlock
            code={{
              windows: `.\\.venv\\Scripts\\nlm.exe --version`,
              posix: `./.venv/bin/nlm --version`,
            }}
            caption="Un solo paquete instala las dos cosas: el CLI nlm y el servidor MCP notebooklm-mcp."
          />
        </Step>
      </Steps>

      <Callout type="tip" title="Fija la versión en requirements.txt">
        <p>
          Al ser un cliente no oficial, una versión distinta puede cambiar nombres
          de comandos o de artefactos sin aviso. Anclarla evita que el proyecto se
          rompa solo.
        </p>
        <CodeBlock code={`notebooklm-mcp-cli==0.9.10`} title="requirements.txt" showCopy={false} />
      </Callout>

      <H2 id="rutas">Sobre las rutas de los ejemplos</H2>
      <p>
        En el resto de la guía verás los comandos escritos contra el binario del
        entorno virtual. Si prefieres activar el entorno y escribir solo{' '}
        <code>nlm</code>, es exactamente equivalente:
      </p>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\Activate.ps1\nnlm --version`,
          posix: `source .venv/bin/activate\nnlm --version`,
        }}
      />
    </>
  )
}
