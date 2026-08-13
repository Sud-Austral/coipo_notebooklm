import { useMemo, useState } from 'react'
import { GALERIA } from '../data/galeria.js'
import Callout from '../components/Callout.jsx'
import FiltroTemas from '../components/FiltroTemas.jsx'
import Lightbox from '../components/Lightbox.jsx'

export default function GaleriaInfografias() {
  const todas = useMemo(() => GALERIA.filter((a) => a.tipo === 'infographic'), [])
  const temas = useMemo(() => [...new Set(todas.map((a) => a.tema))], [todas])

  const [tema, setTema] = useState('')
  const [abierta, setAbierta] = useState(-1)

  const visibles = tema ? todas.filter((a) => a.tema === tema) : todas

  const mover = (paso) =>
    setAbierta((i) => (i < 0 ? i : (i + paso + visibles.length) % visibles.length))

  return (
    <>
      <p className="lead">
        {todas.length} infografías generadas con NotebookLM a partir de fuentes
        públicas sobre bosques nativos y áreas silvestres protegidas de Chile.
      </p>

      <Callout type="warning" title="Material generado por IA">
        <p>
          Estas piezas las compone NotebookLM interpretando las fuentes; no son
          material oficial de ninguna institución ni fotografías reales. Sirven
          como ejemplo de lo que produce la herramienta, no como referencia
          cartográfica ni científica.
        </p>
      </Callout>

      {todas.length === 0 ? (
        <p className="galeria-vacia">
          Todavía no hay infografías descargadas. Genera la galería con{' '}
          <code>python scripts/gen_galeria.py --ciclo</code>.
        </p>
      ) : (
        <>
          <FiltroTemas temas={temas} activo={tema} onChange={(t) => { setTema(t); setAbierta(-1) }} />

          <ul className="rejilla">
            {visibles.map((item, i) => (
              <li className="tarjeta" key={item.id}>
                <button
                  type="button"
                  className="tarjeta__boton"
                  onClick={() => setAbierta(i)}
                  aria-label={`Ampliar: ${item.tema}, estilo ${item.estilo}`}
                >
                  {/* La rejilla usa la miniatura de 640 px; el visor carga la
                      version grande solo cuando se abre. */}
                  <img
                    className="tarjeta__img"
                    src={item.thumb ?? item.src}
                    alt={`Infografía sobre ${item.tema}, estilo ${item.estilo}`}
                    loading="lazy"
                    decoding="async"
                    width="640"
                    height="360"
                  />
                </button>
                <div className="tarjeta__pie">
                  <span className="tarjeta__tema">{item.tema}</span>
                  <span className="tarjeta__meta">
                    {item.estilo} · {item.orientacion}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {abierta >= 0 && (
            <Lightbox
              item={visibles[abierta]}
              onClose={() => setAbierta(-1)}
              onPrev={() => mover(-1)}
              onNext={() => mover(1)}
            />
          )}
        </>
      )}
    </>
  )
}
