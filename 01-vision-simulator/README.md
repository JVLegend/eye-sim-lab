# 01 — Vision Simulator

Como um paciente enxerga com **catarata**, **glaucoma**, **DMRI** ou **retinopatia diabética**.

## Como funciona

- `<canvas>` 2D renderiza imagem ou webcam.
- Filtros CSS (`blur`, `sepia`, `contrast`, `brightness`) simulam degradação óptica.
- Overlays radiais simulam perda de campo (glaucoma, DMRI).
- Padrão determinístico de manchas simula retinopatia diabética.

## Patologias

| Patologia | Técnica |
|---|---|
| Catarata | Blur + sepia + contraste reduzido |
| Glaucoma | Vinheta radial externa → estreitamento de campo periférico |
| DMRI | Escotoma central (gradiente radial escuro no centro) |
| Retinopatia Diabética | Manchas pseudo-aleatórias (hemorragias + exsudatos) |

## Rodando

```bash
npm install
npm run dev
```

## Extensões sugeridas

- Migrar overlays para shaders WebGL para efeitos mais realistas (p.ex. metamorfopsia na DMRI com displacement mapping).
- Adicionar modo "comparar lado-a-lado" (normal vs patológico).
- Exportar screenshot com legenda para material didático.
