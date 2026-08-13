import { usePlatform } from '../hooks/platformContext.js'
import CopyButton from './CopyButton.jsx'

/**
 * `code` acepta un string, o `{ windows, posix }` para los comandos que
 * cambian entre PowerShell y bash. En ese caso se resuelve con el selector
 * global de la barra superior.
 */
export default function CodeBlock({
  code,
  lang = 'shell',
  title,
  caption,
  showCopy = true,
  wrap = false,
}) {
  const { platform } = usePlatform()
  const text = typeof code === 'string' ? code : (code[platform] ?? code.posix ?? '')
  const heading = title ?? (typeof code === 'string' ? lang : platformLabel(platform))

  return (
    <figure className="code" data-wrap={wrap}>
      <div className="code__head">
        <span className="code__title">{heading}</span>
        {showCopy && <CopyButton value={text} />}
      </div>
      <pre tabIndex={0} role="region" aria-label={`Código: ${heading}`}>
        <code>{text}</code>
      </pre>
      {caption && <figcaption className="code__caption">{caption}</figcaption>}
    </figure>
  )
}

const platformLabel = (platform) =>
  platform === 'windows' ? 'PowerShell (Windows)' : 'bash / zsh (macOS, Linux)'
