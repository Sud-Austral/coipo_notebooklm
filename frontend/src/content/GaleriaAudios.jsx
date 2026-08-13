import { useMemo } from 'react'
import { GALERIA } from '../data/galeria.js'
import Callout from '../components/Callout.jsx'

const DESCRIPCION = {
  brief: 'Resumen corto y directo.',
  deep_dive: 'Conversación larga entre dos voces.',
  critique: 'Revisión crítica de las fuentes.',
  debate: 'Dos posturas enfrentadas sobre el material.',
}

export default function GaleriaAudios() {
  const todos = useMemo(() => GALERIA.filter((a) => a.tipo === 'audio'), [])

  return (
    <>
      <p className="lead">
        {todos.length} Audio Overviews en español sobre bosques y áreas
        protegidas de Chile, uno por cada formato conversacional que ofrece
        NotebookLM.
      </p>

      <Callout type="warning" title="Voces sintéticas">
        <p>
          La conversación completa —guion y voces— la genera NotebookLM. No
          intervienen locutores reales ni son declaraciones de nadie.
        </p>
      </Callout>

      {todos.length === 0 ? (
        <p className="galeria-vacia">
          Todavía no hay audios descargados. Genera la galería con{' '}
          <code>python scripts/gen_galeria.py --ciclo</code>.
        </p>
      ) : (
        <ul className="medios medios--audio">
          {todos.map((item) => (
            <li className="medio" key={item.id}>
              <div className="medio__pie">
                <span className="tarjeta__tema">{item.tema}</span>
                <span className="tarjeta__meta">
                  {item.estilo} · {DESCRIPCION[item.estilo] ?? ''}
                </span>
              </div>
              <audio controls preload="none" src={item.src} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
