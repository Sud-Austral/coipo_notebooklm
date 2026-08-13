import { H2 } from '../components/Heading.jsx'
import Callout from '../components/Callout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'

export default function Ingesta() {
  return (
    <>
      <p className="lead">
        Descargar el archivo es la mitad del trabajo. La otra mitad es dejar
        constancia en el repositorio de qué es, de dónde salió y que no ha
        cambiado — sin versionar binarios pesados.
      </p>

      <H2 id="criterio">Qué versionar y qué no</H2>
      <p>
        Los binarios de audio y vídeo no van a git: engordan el historial para
        siempre y se pueden regenerar. Lo que sí conviene versionar es un
        manifiesto con la huella de cada archivo.
      </p>
      <CodeBlock
        title=".gitignore"
        showCopy={false}
        code={`media/**/*.m4a\nmedia/**/*.mp3\nmedia/**/*.wav\nmedia/**/*.mp4\nmedia/**/*.webm\nmedia/**/*.png`}
        caption="media/manifest.json queda fuera de estos patrones y sí se versiona."
      />

      <H2 id="manifiesto">El manifiesto</H2>
      <p>
        Un script de ingesta copia el archivo a <code>media/&lt;tipo&gt;/</code>, le
        saca la metadata real con ffprobe y añade una entrada al manifiesto:
      </p>
      <CodeBlock
        lang="json"
        showCopy={false}
        title="media/manifest.json"
        code={`{
  "archivo": "media/audio/salida.m4a",
  "tipo": "audio",
  "bytes": 3204485,
  "sha256": "caa0287a...",
  "notebook": "Mi notebook",
  "artifact_id": "<artifact-id>",
  "ingestado_utc": "2026-01-01T00:00:00+00:00",
  "metadata": {
    "formato": "QuickTime / MOV",
    "duracion_s": 99.54,
    "bitrate_kbps": 258,
    "audio": { "codec": "aac", "sample_rate": "44100", "canales": 2 }
  }
}`}
      />

      <p>
        Con eso, cualquiera que clone el repositorio sabe qué archivos debería
        haber, de qué notebook salieron y si el que tiene delante es el mismo — sin
        descargar nada.
      </p>

      <H2 id="uso">Ejecutarlo</H2>
      <CodeBlock
        code={{
          windows: `$env:PYTHONUTF8 = "1"\n.\\.venv\\Scripts\\python.exe scripts\\ingest_media.py media\\audio\\salida.m4a \`\n  --notebook "Mi notebook" --artifact-id <artifact-id>`,
          posix: `PYTHONUTF8=1 ./.venv/bin/python scripts/ingest_media.py media/audio/salida.m4a \\\n  --notebook "Mi notebook" --artifact-id <artifact-id>`,
        }}
      />

      <Callout type="warning" title="PYTHONUTF8 no es opcional en Windows">
        <p>
          Si el título del notebook lleva tildes o guiones largos, sin{' '}
          <code>PYTHONUTF8=1</code> los argumentos llegan mal codificados y el
          manifiesto acaba con caracteres corruptos.
        </p>
      </Callout>
    </>
  )
}
