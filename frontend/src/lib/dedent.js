/**
 * Quita la indentacion comun de un template literal, para poder escribir
 * bloques de codigo indentados dentro del JSX sin que la indentacion acabe
 * en la pantalla.
 */
export function dedent(strings, ...values) {
  const raw = typeof strings === 'string'
    ? strings
    : strings.reduce((acc, part, i) => acc + values[i - 1] + part)

  const lines = raw.replace(/^\n/, '').replace(/\n[ \t]*$/, '').split('\n')
  const indents = lines
    .filter((l) => l.trim())
    .map((l) => l.match(/^[ \t]*/)[0].length)
  const pad = indents.length ? Math.min(...indents) : 0

  return lines.map((l) => l.slice(pad)).join('\n')
}
