import React from 'react';
import { Composition } from 'remotion';
import { Explicativo, DURACION_FRAMES, FPS } from './Explicativo';
import { VideoContrato, DURACION_FRAMES as DUR_CONTRATO } from './VideoContrato';
import { VideoEcosistema, DURACION_FRAMES as DUR_ECO } from './VideoEcosistema';
import { VideoContrato2, DURACION_FRAMES as DUR_C2 } from './v2/VideoContrato2';
import { VideoEcosistema2, DURACION_FRAMES as DUR_E2 } from './v2/VideoEcosistema2';
import { VideoCatastro, DURACION_FRAMES as DUR_CAT } from './v2/VideoCatastro';

export const RemotionRoot = () => (
  <>
    <Composition
      id="Explicativo"
      component={Explicativo}
      durationInFrames={DURACION_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Contratos"
      component={VideoContrato}
      durationInFrames={DUR_CONTRATO}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Ecosistema"
      component={VideoEcosistema}
      durationInFrames={DUR_ECO}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Contratos2"
      component={VideoContrato2}
      durationInFrames={DUR_C2}
      fps={30}
      width={1920}
      height={1080}
    />
      <Composition
      id="Ecosistema2"
      component={VideoEcosistema2}
      durationInFrames={DUR_E2}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Catastro"
      component={VideoCatastro}
      durationInFrames={DUR_CAT}
      fps={30}
      width={1920}
      height={1080}
    />
</>
);
