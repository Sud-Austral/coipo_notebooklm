import { H2 } from '../components/Heading.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import DataTable from '../components/DataTable.jsx'

export default function Requisitos() {
  return (
    <>
      <p className="lead">
        Poco: Python, un navegador basado en Chromium y una cuenta de Google con
        acceso a NotebookLM. Todo lo demás es opcional.
      </p>

      <DataTable
        caption="Requisitos"
        columns={[
          { key: 'que', header: 'Qué' },
          { key: 'version', header: 'Versión' },
          { key: 'para', header: 'Para qué' },
        ]}
        rows={[
          { que: 'Python', version: '3.10 o superior', para: 'Ejecutar el cliente y los scripts auxiliares.' },
          { que: 'Chrome, Brave o Edge', version: 'Cualquiera reciente', para: 'El login abre una ventana real del navegador.' },
          { que: 'Cuenta de Google', version: '—', para: 'Con acceso a NotebookLM. Puede ser corporativa.' },
          { que: 'ffmpeg', version: 'Opcional', para: 'Leer duración, códec y bitrate de los archivos descargados.' },
          { que: 'Node', version: 'Opcional, 20.19+ o 22.12+', para: 'Solo si vas a levantar este sitio de documentación.' },
        ]}
      />

      <Callout type="warning" title="Cuentas corporativas">
        <p>
          Si tu cuenta es de Google Workspace, el acceso a NotebookLM depende de
          lo que haya habilitado el administrador del dominio. Si la sesión se
          autentica pero luego no aparece ningún notebook, el problema suele ser
          ese, no el cliente.
        </p>
      </Callout>

      <H2 id="comprobar">Comprobar lo que tienes</H2>
      <CodeBlock
        code={{
          windows: `python --version\nffmpeg -version`,
          posix: `python3 --version\nffmpeg -version`,
        }}
      />

      <H2 id="version-anclada">Versión anclada</H2>
      <p>
        Todo lo que hay aquí está verificado contra <code>notebooklm-mcp-cli 0.9.10</code>.
        Es un paquete no oficial que cambia rápido: si usas otra versión, contrasta
        los nombres de comando antes de fiarte de esta guía.
      </p>
    </>
  )
}
