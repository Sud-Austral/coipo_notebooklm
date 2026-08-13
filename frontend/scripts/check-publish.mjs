/**
 * Gate de publicación: falla si en dist/ hay credenciales o datos personales.
 *
 * Este sitio se publica, y el repositorio del que sale contiene una sesión real
 * de NotebookLM. La comprobación busca VALORES, no menciones: la guía habla de
 * las cookies por su nombre y muestra placeholders, y eso es correcto.
 *
 *   npm run check:publish
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

const REGLAS = [
  {
    nombre: 'valor de cookie de sesión',
    // Un placeholder es `SID=...`; un valor real son 20+ caracteres de token.
    re: /\b(?:SID|HSID|SSID|APISID|SAPISID|OSID|SIDCC|__Secure-[\w-]+)=[A-Za-z0-9_\-.]{20,}/g,
  },
  { nombre: 'token CSRF (SNlM0e)', re: /SNlM0e"?\s*[:=]\s*"[^"]{10,}/g },
  { nombre: 'correo personal', re: /[\w.+-]+@(?:conaf\.cl|gmail\.com)/g },
  { nombre: 'ruta local de usuario', re: /[Cc]:\\{1,2}Users\\{1,2}(?!<)[\w.-]+/g },
  {
    nombre: 'UUID real (usa 00000000-... si necesitas un ejemplo)',
    re: /\b(?!0{8}-)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/g,
  },
]

async function archivos(dir) {
  const salida = []
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name)
    if (entrada.isDirectory()) salida.push(...(await archivos(ruta)))
    else if (/\.(html|js|css|json|svg)$/.test(entrada.name)) salida.push(ruta)
  }
  return salida
}

const hallazgos = []
for (const ruta of await archivos(DIST)) {
  const contenido = await readFile(ruta, 'utf8')
  for (const regla of REGLAS) {
    for (const m of contenido.matchAll(regla.re)) {
      hallazgos.push({ ruta, regla: regla.nombre, muestra: m[0].slice(0, 48) })
    }
  }
}

if (hallazgos.length === 0) {
  console.log('Gate de publicación OK: ni credenciales ni datos personales en dist/')
  process.exit(0)
}

console.error(`Gate de publicación FALLA (${hallazgos.length} hallazgo(s)). NO publicar:\n`)
for (const h of hallazgos) {
  console.error(`  ${h.regla}\n    ${h.ruta}\n    ${h.muestra}\n`)
}
process.exit(1)
