# -*- coding: utf-8 -*-
"""Guion v2 de coipo_contrato2, a dos voces.

voz 'l' = Lorenzo, lleva el hilo y explica.
voz 'c' = Catalina, entra en los remates, las cifras y las advertencias.
El contraste entre las dos es lo que rompe la monotonía: no se alternan por
turnos, se alternan por FUNCIÓN.
"""

GUION = [
    dict(id='gancho', voz='c', texto=(
        "Un contrato sale de la oficina para ir a firma. "
        "¿Cuánto lleva fuera?"
    )),
    dict(id='que_es', voz='l', texto=(
        "Esa pregunta, hasta hace poco, no tenía respuesta. "
        "El Sistema de Gestión de Contratos de la Corporación Nacional Forestal, "
        "de la Unidad de Información y Análisis, existe para responderla. "
        "Administra el ciclo de vida completo del contrato físico de un funcionario."
    )),
    dict(id='problema', voz='l', texto=(
        "El papel tiene un problema propio: circula. "
        "Se imprime, se lleva a firmar, cambia de manos, espera en un escritorio."
    )),
    dict(id='remate1', voz='c', texto=(
        "El sistema no elimina el papel. Le pone seguimiento."
    )),
    dict(id='estados', voz='l', texto=(
        "El corazón es una máquina de estados, y solo tiene cinco. "
        "Pendiente, cuando aún no se revisa. "
        "Revisado, cuando alguien lo validó. "
        "Impreso, cuando ya existe en papel. "
        "Esperando firma, mientras está fuera. "
        "Y completado, cuando vuelve firmado."
    )),
    dict(id='remate2', voz='c', texto=(
        "Y no se puede saltar ninguno. "
        "Si alguien lo intenta, el servidor responde con un error de conflicto "
        "y la transición no ocurre."
    )),
    dict(id='plantillas', voz='l', texto=(
        "Los documentos salen de plantillas registradas: indefinido, honorarios "
        "y las demás modalidades. Cada una pide sus propios campos, así que el "
        "formulario se adapta, y el pe de efe se abre dentro de la misma aplicación."
    )),
    dict(id='bandeja', voz='l', texto=(
        "El trabajo se organiza en pestañas por estado. "
        "Cada funcionario abre un panel con su ficha y su flujo, "
        "de modo que el encargado ve el punto exacto de cada caso sin salir de la lista."
    )),
    dict(id='seguridad', voz='c', texto=(
        "Sobre seguridad, una sola regla: ningún dato sensible se sirve estático. "
        "Tener la dirección de un documento no basta para abrirlo. "
        "Hace falta un token válido, y de vida corta."
    )),
    dict(id='infraestructura', voz='l', texto=(
        "La infraestructura reparte treinta y dos procesadores, noventa y seis gigas "
        "de memoria y dos teras de disco entre cuatro máquinas: la base de datos, "
        "el backend, los trabajos pesados que generan los documentos, y la puerta de entrada."
    )),
    dict(id='cierre', voz='c', texto=(
        "Un contrato en papel seguirá siendo un contrato en papel. "
        "La diferencia es que ahora, en cualquier momento, se puede responder dónde está."
    )),
]
