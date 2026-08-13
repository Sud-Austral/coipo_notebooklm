import { useMemo, useState } from 'react'
import { GALERIA } from '../data/galeria.js'
import Callout from '../components/Callout.jsx'
import FiltroTemas from '../components/FiltroTemas.jsx'

export default function GaleriaVideos() {
  const todos = useMemo(() => GALERIA.filter((a) => a.tipo === 'video'), [])
  const temas = useMemo(() => [...new Set(todos.map((a) => a.tema))], [todos])
  const [tema, setTema] = useState('')

  const visibles = tema ? todos.filter((a) => a.tema === tema) : todos

  return (
    <>
      <p className="lead">
        {todos.length} Video Overviews sobre bosques y áreas protegidas de Chile,
        cada uno con un estilo visual distinto de los que ofrece NotebookLM.
      </p>

      <Callout type="warning" title="Material generado por IA">
        <p>
          Las imágenes y la narración las genera NotebookLM a partir de las
          fuentes. No son grabaciones reales de los lugares que describen.
        </p>
      </Callout>

      {todos.length === 0 ? (
        <p className="galeria-vacia">
          Todavía no hay vídeos descargados. Genera la galería con{' '}
          <code>python scripts/gen_galeria.py --ciclo</code>.
        </p>
      ) : (
        <>
          <FiltroTemas temas={temas} activo={tema} onChange={setTema} />

          <ul className="medios">
            {visibles.map((item) => (
              <li className="medio" key={item.id}>
                {/* preload="none": con diez videos en una pagina, precargar
                    metadatos dispara diez peticiones antes de que nadie pulse
                    play. */}
                <video
                  controls
                  preload="none"
                  playsInline
                  poster={item.poster ?? undefined}
                  src={item.src}
                />
                <div className="medio__pie">
                  <span className="tarjeta__tema">{item.tema}</span>
                  <span className="tarjeta__meta">
                    estilo {item.estilo} · {(item.bytes / 1048576).toFixed(1)} MB
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
