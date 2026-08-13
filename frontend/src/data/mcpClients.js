/** Identificadores aceptados por `nlm setup add <cliente>` en 0.9.10.
 *  Ojo: los CLI de Google y OpenAI son `gemini` y `codex`, sin sufijo. */
export const MCP_CLIENTS = [
  { id: 'claude-code', name: 'Claude Code', note: 'CLI y extension de Anthropic' },
  { id: 'claude-desktop', name: 'Claude Desktop', note: 'App de escritorio' },
  { id: 'gemini', name: 'Gemini CLI', note: 'Config en ~/.gemini/settings.json' },
  { id: 'cursor', name: 'Cursor', note: 'Editor con IA' },
  { id: 'github-copilot', name: 'GitHub Copilot', note: 'VS Code; alias: copilot. Config en .vscode/mcp.json' },
  { id: 'windsurf', name: 'Windsurf', note: 'Editor de Codeium' },
  { id: 'cline', name: 'Cline CLI', note: 'Agente de terminal' },
  { id: 'antigravity', name: 'Antigravity', note: 'IDE de Google' },
  { id: 'codex', name: 'Codex CLI', note: 'CLI de OpenAI' },
  { id: 'opencode', name: 'OpenCode', note: 'Asistente de terminal' },
]
