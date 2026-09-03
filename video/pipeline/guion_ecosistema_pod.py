# -*- coding: utf-8 -*-
"""Guion del vídeo del ecosistema COIPO, en formato podcast a dos voces.

Catalina lleva el hilo; Lorenzo pregunta y objeta. La broma interna es que
Lorenzo va llevando la cuenta en voz alta y se equivoca, y ella lo corrige sin
piedad. Vuelve en el cierre.

`foto` nombra una ESCENA de escenas_ecosistema.jsx, no una captura: este vídeo
no tiene interfaz que enseñar. Las cifras salen de src/catalogo.json.

Énfasis con *asteriscos*: sirve igual para edge-tts que para Qwen.
"""

GUION = [
    # ------------------------------------------------------------- apertura
    dict(v='c', tono='vivo', foto='gancho', p=0.20,
         t="*Cuarenta y nueve repositorios.* Todos empiezan por la misma palabra."),
    dict(v='l', tono='vivo', foto='gancho', p=0.15,
         t="¿Cuarenta y nueve? ¿De una sola unidad?"),
    dict(v='c', tono='normal', foto='gancho', p=0.15,
         t="De una sola unidad. La de Información y Análisis de CONAF."),
    dict(v='l', tono='normal', foto='gancho', p=0.45,
         t="Vale, voy a ir llevando la cuenta."),
    dict(v='c', tono='suave', foto='gancho', p=0.25,
         t="Me va a encantar verte fallar."),
    dict(v='c', tono='normal', foto='coipo', p=0.20,
         rot="Coipo: el roedor que da nombre a todo",
         t="Coipo es el roedor que da nombre a cada proyecto."),
    dict(v='l', tono='vivo', foto='coipo', p=0.15,
         t="¿Y son cuarenta y nueve ideas sueltas?"),
    dict(v='c', tono='lento', foto='coipo', p=0.20,
         rot="Ocho familias",
         t="No. Se agrupan en *ocho familias*, y cada una responde a una parte del trabajo."),
    dict(v='l', tono='normal', foto='coipo', p=0.60,
         t="Eso ya suena a que alguien lo pensó, y no a que fue creciendo solo."),

    # ------------------------------------------------------------- familias
    dict(v='c', tono='normal', foto='incendios', p=0.15,
         rot="01 · Incendios forestales · 5",
         t="Primera familia: incendios forestales. *Cinco* proyectos."),
    dict(v='c', tono='normal', foto='incendios', p=0.20,
         t="El tablero de incendios, el presupuesto de la temporada, el visor de prevención…"),
    dict(v='c', tono='normal', foto='incendios', p=0.15,
         t="…el cancionero de prevención y la meteorología aplicada al comportamiento del fuego."),
    dict(v='l', tono='vivo', foto='incendios', p=0.15,
         t="Espera. ¿*Un cancionero*?"),
    dict(v='c', tono='vivo', foto='incendios', p=0.20,
         t="Un cancionero. Prevención cantada, para escuelas."),
    dict(v='l', tono='suave', foto='incendios', p=0.55,
         t="Retiro la burla. Eso llega donde no llega un tríptico."),

    dict(v='c', tono='normal', foto='fiscalizacion', p=0.15,
         rot="02 · Fiscalización y normativa · 6",
         t="Segunda: fiscalización y normativa. *Seis*."),
    dict(v='c', tono='normal', foto='fiscalizacion', p=0.20,
         t="El tablero del sistema de fiscalización forestal y su versión heredada, "
           "el chatbot normativo, el análisis de ley, los criterios de fiscalía y los planes de manejo."),
    dict(v='l', tono='normal', foto='fiscalizacion', p=0.15,
         t="Once. Voy once."),
    dict(v='c', tono='vivo', foto='fiscalizacion', p=0.55,
         t="Once. De momento bien."),

    dict(v='c', tono='normal', foto='territorio', p=0.15,
         rot="03 · Territorio y catastro · 4",
         t="Tercera: territorio y catastro. *Cuatro*."),
    dict(v='c', tono='normal', foto='territorio', p=0.20,
         t="El geoportal de decisiones territoriales, la vista de catastro, "
           "el seguimiento de madera y la dendroenergía."),
    dict(v='l', tono='vivo', foto='territorio', p=0.15,
         t="La vista de catastro es la del vídeo anterior, ¿no?"),
    dict(v='c', tono='normal', foto='territorio', p=0.55,
         t="La misma. Un millón ochocientos mil polígonos en el navegador."),

    dict(v='c', tono='normal', foto='arborizacion', p=0.15,
         rot="04 · Arborización y viveros · 4",
         t="Cuarta: arborización y viveros, otros *cuatro*."),
    dict(v='c', tono='normal', foto='arborizacion', p=0.20,
         t="La entrega de plantas con su entorno de pruebas, el inventario de viveros "
           "y la web de arborización."),
    dict(v='l', tono='normal', foto='arborizacion', p=0.15,
         t="Diecinueve."),
    dict(v='c', tono='vivo', foto='arborizacion', p=0.55,
         t="Diecinueve. Sigues vivo."),

    dict(v='c', tono='normal', foto='personas', p=0.15,
         rot="05 · Personas y administración · 8",
         t="Quinta: personas y administración. *Ocho*."),
    dict(v='c', tono='normal', foto='personas', p=0.20,
         t="La gestión de contratos, las reservas de bienestar, la identidad institucional, "
           "la academia y el Moodle, el directorio, el consolidador de Previred y la oficina virtual."),
    dict(v='l', tono='normal', foto='personas', p=0.60,
         t="Veintisiete. Y aún nos faltan tres familias."),

    dict(v='c', tono='normal', foto='plataforma', p=0.15,
         rot="06 · Plataforma y datos · 9",
         t="Sexta: plataforma y datos. *Nueve*, la familia más grande."),
    dict(v='c', tono='normal', foto='plataforma', p=0.20,
         t="La plantilla base, el proxy de base de datos, el despliegue, los procesos de carga, "
           "el monitoreo, la automatización, el correo y el repositorio."),
    dict(v='l', tono='vivo', foto='plataforma', p=0.15,
         t="Ésos no los usa nadie de la unidad, imagino."),
    dict(v='c', tono='lento', foto='remate', p=0.20,
         rot="Nadie los abre nunca",
         t="*Nadie los abre nunca.* Y si fallan, no funciona ninguno de los demás."),
    dict(v='l', tono='normal', foto='remate', p=0.15,
         t="O sea que la familia más invisible es la que sostiene el resto."),
    dict(v='c', tono='suave', foto='remate', p=0.60,
         t="Lo dijiste mejor que yo. Otra vez."),

    dict(v='c', tono='normal', foto='gestion', p=0.15,
         rot="07 · Gestión y evaluación · 6",
         t="Séptima: gestión y evaluación. *Seis*."),
    dict(v='c', tono='normal', foto='gestion', p=0.20,
         t="El seguimiento de proyectos, el sistema de la propia unidad, la transformación digital, "
           "la evaluación prioritaria y la de licitaciones."),
    dict(v='l', tono='normal', foto='gestion', p=0.55,
         t="Cuarenta y dos."),

    dict(v='c', tono='normal', foto='conocimiento', p=0.15,
         rot="08 · Conocimiento y comunicación · 7",
         t="Y la octava: conocimiento y comunicación, con *siete*."),
    dict(v='c', tono='normal', foto='conocimiento', p=0.20,
         t="Documentos, la wiki, la bitácora de errores, las presentaciones, el monitor de prensa, "
           "la señal interna y el archivo."),
    dict(v='l', tono='vivo', foto='conocimiento', p=0.15,
         t="Cuarenta y ocho. Me falta uno."),
    dict(v='c', tono='vivo', foto='conocimiento', p=0.20,
         t="Te falta uno."),
    dict(v='l', tono='normal', foto='conocimiento', p=0.15,
         t="No pienso volver a contar."),
    dict(v='c', tono='suave', foto='conocimiento', p=0.55,
         t="Tranquilo. Te lo enseño entero."),

    # ------------------------------------------------------------ una bitácora
    dict(v='l', tono='vivo', foto='conocimiento', p=0.15,
         t="Antes de eso: ¿*una bitácora de errores*? ¿En serio?"),
    dict(v='c', tono='normal', foto='conocimiento', p=0.20,
         t="Un repositorio entero dedicado a anotar los errores que se cometieron."),
    dict(v='l', tono='normal', foto='conocimiento', p=0.15,
         t="Eso es más raro de lo que parece. Casi nadie documenta lo que hizo mal."),
    dict(v='c', tono='lento', foto='conocimiento', p=0.60,
         t="Por eso casi todos *los repiten*."),

    # ----------------------------------------------------------------- mapa
    dict(v='c', tono='normal', foto='mapa', p=0.20,
         rot="49 repositorios · 8 familias",
         t="Aquí está entero. Ocho familias, cuarenta y nueve repositorios."),
    dict(v='l', tono='normal', foto='mapa', p=0.15,
         t="Visto junto impresiona más que contado."),
    dict(v='c', tono='normal', foto='mapa', p=0.20,
         t="Del fuego a los contratos. Del catastro a la sala de clases."),
    dict(v='l', tono='vivo', foto='mapa', p=0.15,
         t="¿Y esto lo hizo un equipo grande?"),
    dict(v='c', tono='lento', foto='mapa', p=0.60,
         t="Una unidad. *Una sola unidad*."),

    # --------------------------------------------------------------- cierre
    dict(v='c', tono='normal', foto='cierre', p=0.20,
         t="Resumiendo: no son cuarenta y nueve proyectos sueltos, son ocho respuestas "
           "a ocho partes del trabajo de la institución."),
    dict(v='l', tono='normal', foto='cierre', p=0.15,
         t="Y una novena que no se ve y que sostiene todo lo demás."),
    dict(v='c', tono='vivo', foto='cierre', p=0.20,
         t="Sexta. La sexta familia."),
    dict(v='l', tono='vivo', foto='cierre', p=0.25,
         t="Sabía que ibas a corregirme."),
    dict(v='c', tono='suave', foto='cierre', p=0.20,
         t="Es que se te nota que te gusta."),
    dict(v='c', tono='normal', foto='cierre', p=0.20,
         t="Y la pregunta que dejo abierta: si mañana llegara el número cincuenta…"),
    dict(v='c', tono='lento', foto='cierre', p=0.35,
         rot="¿A qué familia pertenecería?",
         t="…¿a *cuál* de las ocho familias pertenecería? Y si no cabe en ninguna, ¿qué nos dice eso?"),
    dict(v='l', tono='suave', foto='cierre', p=0.20,
         t="Ahí sí que voy a tener que pensar."),
    dict(v='c', tono='suave', foto='cierre', p=1.60,
         t="Piénsalo. Y me cuentas."),
]
