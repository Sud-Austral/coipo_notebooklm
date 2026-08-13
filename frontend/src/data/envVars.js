/** Variables leidas realmente por notebooklm-mcp-cli 0.9.10. */
export const ENV_VARS = [
  {
    name: 'NOTEBOOKLM_MCP_CLI_PATH',
    scope: 'CLI + MCP',
    sensitive: false,
    desc: 'Reemplaza el directorio de estado completo (por defecto ~/.notebooklm-mcp-cli). Apuntando varios proyectos al mismo directorio comparten la sesion ya autenticada, incluidas las rotaciones de cookies.',
  },
  {
    name: 'NLM_PROFILE',
    scope: 'CLI',
    sensitive: false,
    desc: 'Perfil por defecto dentro de <estado>/profiles/. Equivale a --profile. Ojo al prefijo: es NLM_, no NOTEBOOKLM_.',
  },
  {
    name: 'NOTEBOOKLM_COOKIES',
    scope: 'CLI + MCP',
    sensitive: true,
    desc: 'Cookie header completo (SID=...; HSID=...). Override total: si esta definida, el cliente ignora cualquier login guardado, incluido el base_host del perfil. Nunca la escribas en un archivo versionado.',
  },
  {
    name: 'NOTEBOOKLM_BASE_URL',
    scope: 'CLI + MCP',
    sensitive: false,
    desc: 'Host base del servicio. Validado contra una lista blanca y obligatoriamente https. Imprescindible junto a NOTEBOOKLM_COOKIES si tu cuenta no esta en el host por defecto.',
  },
  {
    name: 'NOTEBOOKLM_HL',
    scope: 'CLI + MCP',
    sensitive: false,
    desc: 'Idioma por defecto de los artefactos generados (codigo BCP-47). Sin ella, en.',
  },
  {
    name: 'NOTEBOOKLM_DOWNLOAD_DIR',
    scope: 'CLI + MCP',
    sensitive: false,
    desc: 'Directorio por defecto de las descargas.',
  },
  {
    name: 'NOTEBOOKLM_QUERY_TIMEOUT',
    scope: 'MCP',
    sensitive: false,
    desc: 'Timeout de las consultas al notebook, en segundos. Por defecto 120.',
  },
  {
    name: 'NOTEBOOKLM_DISABLE_ROTATE_COOKIES',
    scope: 'CLI + MCP',
    sensitive: false,
    desc: 'Con valor 1 desactiva el refresco preventivo de las cookies cortas contra accounts.google.com.',
  },
  {
    name: 'NOTEBOOKLM_ENABLED_TOOLS / _DISABLED_TOOLS / _DISABLED_GROUPS',
    scope: 'MCP',
    sensitive: false,
    desc: 'Filtran que herramientas expone el servidor MCP. Utiles para reducir la superficie que ve el agente.',
  },
  {
    name: 'NOTEBOOKLM_MCP_TRANSPORT / _HOST / _PORT / _PATH / _STATELESS / _DEBUG',
    scope: 'MCP',
    sensitive: false,
    desc: 'Configuracion del servidor MCP: transporte (stdio, http, sse), enlace de red y depuracion.',
  },
  {
    name: 'NLM_OUTPUT_FORMAT / NLM_NO_COLOR / NLM_BROWSER',
    scope: 'CLI',
    sensitive: false,
    desc: 'Formato de salida, color de la terminal y navegador que se usa para el login.',
  },
  {
    name: 'NOTEBOOKLM_CSRF_TOKEN / NOTEBOOKLM_SESSION_ID',
    scope: 'Deprecadas',
    sensitive: true,
    desc: 'Ya no se leen. Pasar valores viejos impedia el auto-refresco de la sesion, asi que se retiraron.',
  },
]
