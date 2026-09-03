# -*- coding: utf-8 -*-
"""Clasificación de los repositorios coipo_ en familias.

Se comprueba contra el disco: si aparece un repositorio nuevo o desaparece uno,
el script lo dice en vez de dejar el vídeo desactualizado en silencio.
"""
import io, json, os, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
GITHUB = r'c:\Users\luis.monsalve\Documents\GitHub'

FAMILIAS = [
    ('Incendios forestales', '#c1121f', [
        ('COIPO_INCENDIO_DASHBOARD', 'Tablero de incendios'),
        ('COIPO_INCENDIO_PRESUPUESTO', 'Presupuesto de la temporada'),
        ('coipo_prevencion_incendio', 'Visor de prevención'),
        ('coipo_canciones', 'Cancionero de prevención'),
        ('coipo_notebooklm', 'Meteorología aplicada'),
    ]),
    ('Fiscalización y normativa', '#e36414', [
        ('COIPO_DASHBOARDSAFF', 'Tablero de fiscalización SAFF'),
        ('COIPO_SAFF_PHP', 'SAFF heredado'),
        ('COIPO_CHATBOTNORMATIVA', 'Chatbot normativo'),
        ('COIPO_LEY_ANALISIS', 'Análisis de ley'),
        ('coipo_criterio_fiscalia', 'Criterios de fiscalía'),
        ('COIPO_EXCEL_PLANMANEJO', 'Plan de manejo forestal'),
    ]),
    ('Territorio y catastro', '#2d6a4f', [
        ('COIPO_BID_LOSRIOS', 'Geoportal de decisiones territoriales'),
        ('coipo_vista_catastro', 'Vista de catastro'),
        ('coipo_seguimiento_madera', 'Seguimiento de madera'),
        ('COIPO_DENDROENERGIA', 'Dendroenergía'),
    ]),
    ('Arborización y viveros', '#40916c', [
        ('COIPO_ENTREGA_PLANTA', 'Entrega de plantas'),
        ('coipo_entrega_planta_test', 'Entrega de plantas · pruebas'),
        ('COIPO_INVENTARIO_PLANTA', 'Inventario de viveros'),
        ('coipo_web_arbolizacion', 'Web de arborización'),
    ]),
    ('Personas y administración', '#0F69C4', [
        ('coipo_contrato2', 'Gestión de contratos'),
        ('coipo_cabania', 'Reservas de bienestar'),
        ('COIPO_USUARIOS', 'Identidad institucional'),
        ('coipo_academia', 'Academia CONAF'),
        ('coipo_moodle', 'Moodle'),
        ('COIPO_DIRECTORIO', 'Directorio'),
        ('COIPO_PDF_EXCEL', 'Consolidador Previred'),
        ('coipo_oficina_virtual', 'Oficina virtual'),
    ]),
    ('Plataforma y datos', '#5a6b67', [
        ('COIPO_APPTEST', 'Plantilla base de aplicaciones'),
        ('COIPO_BYPASS', 'Proxy de base de datos'),
        ('COIPO_DESPLIEGUE', 'Despliegue'),
        ('COIPO_NEXE', 'Nexe'),
        ('coipo_etl', 'ETL'),
        ('coipo_monitoreo', 'Monitoreo'),
        ('coipo_n8n', 'Automatización n8n'),
        ('coipo_correo', 'Servicio de correo'),
        ('coipo_repositorio', 'Repositorio'),
    ]),
    ('Gestión y evaluación', '#7048e8', [
        ('COIPO_SEGUIMIENTO', 'Seguimiento de proyectos'),
        ('COIPO_SEGUIMIENTOPROYECTO', 'Seguimiento · variante'),
        ('COIPO_SISTEMA_UIA', 'Sistema de la UIA'),
        ('COIPO_TRANSFORMACION_DIGITAL', 'Transformación digital'),
        ('COIPO_EVALUACION_PRIORITARIA', 'Evaluación prioritaria'),
        ('COIPO_SKILL_LICITACION', 'Evaluación de licitaciones'),
    ]),
    ('Conocimiento y comunicación', '#b98600', [
        ('COIPO_DOCUMENTO', 'Documentos'),
        ('COIPO_WIKI_APP', 'Wiki'),
        ('COIPO_ERRORES', 'Bitácora de errores'),
        ('COIPO_PRESENTACION_UIA', 'Presentaciones de la UIA'),
        ('COIPO_PRENSA2', 'Monitor de prensa'),
        ('coipo_tv', 'Señal interna'),
        ('coipo_archivo', 'Archivo'),
    ]),
]


def main():
    en_disco = {d for d in os.listdir(GITHUB)
                if d.lower().startswith('coipo') and os.path.isdir(os.path.join(GITHUB, d))}
    clasificados = {r for _, _, rs in FAMILIAS for r, _ in rs}

    faltan = sorted(en_disco - clasificados)
    sobran = sorted(clasificados - en_disco)

    print('en disco      : %d' % len(en_disco))
    print('clasificados  : %d' % len(clasificados))
    print('sin clasificar: %s' % (faltan or 'ninguno'))
    print('no existen    : %s' % (sobran or 'ninguno'))
    print()
    for nombre, color, repos in FAMILIAS:
        print('%-30s %d' % (nombre, len(repos)))

    json.dump(
        {'familias': [{'nombre': n, 'color': c,
                       'repos': [{'repo': r, 'titulo': t} for r, t in rs]}
                      for n, c, rs in FAMILIAS],
         'total': len(clasificados)},
        open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'catalogo.json'),
             'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
