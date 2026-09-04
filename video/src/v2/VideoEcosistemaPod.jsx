import React from 'react';
import { Podcast, FPS } from './motor';
import { EscenaEcosistema } from './escenas';
import ficha from '../beats_ecosistema_pod.json';

export const DURACION_FRAMES = Math.round(ficha.total * FPS);

export const VideoEcosistemaPod = () => (
  <Podcast
    ficha={ficha}
    audio="narracion_ecosistema_pod.mp3"
    titulo={'El ecosistema\nCOIPO'}
    bajada="Cuarenta y nueve repositorios, ocho familias, una sola unidad."
    Escena={EscenaEcosistema}
  />
);
