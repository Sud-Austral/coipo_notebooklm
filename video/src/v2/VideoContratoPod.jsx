import React from 'react';
import { Podcast, FPS } from './motor';
import { EscenaContrato } from './escenas';
import ficha from '../beats_contrato_pod.json';

export const DURACION_FRAMES = Math.round(ficha.total * FPS);

export const VideoContratoPod = () => (
  <Podcast
    ficha={ficha}
    audio="narracion_contrato_pod.mp3"
    titulo={'Sistema de Gestión\nde Contratos'}
    bajada="Del contrato firmado en papel a un expediente que se puede seguir."
    Escena={EscenaContrato}
  />
);
