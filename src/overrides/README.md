# Port overrides (layer 3)

One JSON file per port: `kitty.json`, `ghostty.json`, `vscode.json`, `firefox.json`.
Each entry replaces one key in that port's output:

```json
{ "overrides": [
  { "key": "editor.selectionBackground", "value": "{mix(surface1,plum,0.3)}80", "why": "Reason in one line." }
] }
```

Rules, enforced by the build:
- `value` may reference palette colours, roles, or `mix(a,b,t)` of them, plus an optional two-digit alpha. Never a literal hex.
- `why` is required.
- Keep this list short. If an override keeps coming back, it belongs in `src/roles.json`.
