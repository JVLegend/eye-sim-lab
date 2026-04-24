# Design System — Clinical Editorial

Direção estética compartilhada pelos 4 apps do eye-sim-lab.

## Conceito

**Clinical Editorial**: precisão de instrumento médico encontra editorial de revista científica. Escuridão cinemática, tipografia expressiva, ornamentos discretos que evocam papel milimetrado, marcações oftalmoscópicas e iluminação de sala de exame.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#0a0b0d` | Fundo principal (graphite) |
| `--ink-raised` | `#111317` | Painéis, cards |
| `--ink-line` | `#1f2126` | Bordas hairline |
| `--bone` | `#f4f0e6` | Texto primário |
| `--bone-muted` | `#8a867d` | Texto secundário |
| `--amber` | `#e6b566` | Acento primário (feixe cirúrgico) |
| `--amber-dim` | `#9a7a45` | Acento hover/pressed |
| `--cobalt` | `#7ba7d6` | Dado secundário (cobalto de fenda) |
| `--danger` | `#d47462` | Erro, defeito grave |
| `--mint` | `#9cc5a1` | Sucesso, normal |

## Tipografia

- **Display**: [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) (italic para manchetes, roman para títulos de seção)
- **Body/UI**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (pesos 300, 400, 500)
- **Letter-spacing** em labels: `0.12em` uppercase

## Ornamentos recorrentes

- Numeração grande **01 / 02 / 03 / 04** no topo-esquerda como marca editorial.
- "Cantos" (L-shape marks) nos quatro vértices do stage — lembram visor de câmera/microscópio.
- Linhas hairline 1px `--ink-line` separando tudo.
- Grid milimétrico sutil em backgrounds (linear-gradient 1px).
- Labels uppercase `11px` mono com `letter-spacing: 0.18em`.

## Layout

Sempre **grid 2 colunas** (280–320px controle / 1fr stage). Padding generoso (32–48px). Tudo alinhado a baseline de 8px.

## Motion

- Reveals escalonados no load (`animation-delay` incremental 60ms).
- Transições curtas (180ms) em hover/click.
- Sem parallax, sem bounce. Apenas ease-out.
