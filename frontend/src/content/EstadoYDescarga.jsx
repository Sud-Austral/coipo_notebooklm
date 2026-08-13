import { H2 } from '../components/Heading.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import { to } from '../router/useHashRoute.js'

export default function EstadoYDescarga() {
  return (
    <>
      <p className="lead">
        Un artefacto solo se puede descargar cuando su URL de medios existe.
        Intentarlo antes da un error que parece de permisos y no lo es.
      </p>

      <H2 id="estado">Consultar el estado</H2>
      <Callout type="danger" title="El comando de estado está roto en 0.9.10">
        <p>
          <code>nlm status artifacts</code> y <code>nlm list artifacts</code>{' '}
          revientan con{' '}
          <code>
            TypeError: &apos;&lt;=&apos; not supported between instances of
            &apos;int&apos; and &apos;OptionInfo&apos;
          </code>
          : el valor por defecto de <code>limit</code> se filtra desde la capa de
          Typer hasta la de servicio. No hay opción de línea de comandos que lo
          esquive.
        </p>
        <p>
          El rodeo es llamar a la librería directamente.{' '}
          <a href={to('troubleshooting', 'status-artifacts')}>
            Hay un script de reemplazo en Troubleshooting
          </a>
          .
        </p>
      </Callout>

      <p>Lo que interesa de la respuesta es el campo de la URL:</p>
      <CodeBlock
        showCopy={false}
        lang="json"
        title="artefacto listo"
        code={`{
  "type": "audio",
  "status": "completed",
  "audio_url": "https://lh3.googleusercontent.com/notebooklm/...",
  "artifact_id": "<artifact-id>"
}`}
        caption="Mientras audio_url sea null, el artefacto no está listo — aunque status diga otra cosa."
      />

      <H2 id="descargar">Descargar</H2>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe download audio <notebook-id> \`\n  --id <artifact-id> -o "media\\audio\\salida.m4a" --no-progress`,
          posix: `./.venv/bin/nlm download audio <notebook-id> \\\n  --id <artifact-id> -o "media/audio/salida.m4a" --no-progress`,
        }}
      />

      <p>
        Sin <code>--id</code> toma el último artefacto de ese tipo. Sin{' '}
        <code>-o</code> escribe en{' '}
        <code>./&lt;notebook-id&gt;_audio.m4a</code>. Para bajarlo todo de una vez:
      </p>
      <CodeBlock
        code={{
          windows: `.\\.venv\\Scripts\\nlm.exe download all <notebook-id>`,
          posix: `./.venv/bin/nlm download all <notebook-id>`,
        }}
        caption="Crea un directorio por notebook con todos los artefactos completados."
      />

      <Callout type="info" title="Los 404 durante la descarga son normales">
        <p>
          Es habitual ver <code>Audio media URL returned 404 while propagating;
          retrying in 5s...</code> un par de veces antes de que empiece la
          descarga. El cliente reintenta solo mientras la URL se propaga; no hay
          nada que arreglar.
        </p>
      </Callout>

      <H2 id="verificar">Verificar lo descargado</H2>
      <p>
        Que el archivo exista y pese no significa que tenga contenido. Si tienes
        ffmpeg, la comprobación honesta es decodificarlo entero y mirar el nivel de
        audio:
      </p>
      <CodeBlock
        code={`ffprobe -v error -show_format -show_streams -of json media/audio/salida.m4a\nffmpeg -i media/audio/salida.m4a -af volumedetect -f null -`}
        caption="Un mean_volume razonable (por ejemplo -27 dB) confirma que hay voz; silencio daría valores muy por debajo."
      />
    </>
  )
}
