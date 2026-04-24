# 04 — OCT & Visual Field

Gerador de exames sintéticos parametrizáveis: OCT macular (B-scan) e campo visual 24-2 (Humphrey).

## Como funciona

**OCT macular** (Canvas 2D)
- 9 camadas retinianas desenhadas como faixas onduladas com ruído senoidal.
- Depressão foveal calculada com cosseno.
- Patologias sobrepostas: cistos (edema), descontinuidade (buraco), elevação dome (descolamento seroso).

**Campo Visual 24-2** (SVG)
- 54 pontos em grid -27°..+27° (pattern 24-2 clássico).
- Mancha cega fixa em 15° temporal.
- Defeito calculado por função geométrica por tipo (arqueado = feixe de Bjerrum, altitudinal = metade, bitemporal = x > 0).
- Valor em dB exibido em cada ponto (0–30 dB), com cor proporcional.

## Tipos de defeito

| OCT | Campo visual |
|---|---|
| Normal | Normal |
| Edema macular cistoide | Arqueado (glaucoma) |
| Buraco macular | Altitudinal |
| Descolamento seroso | Depressão generalizada |
|  | Bitemporal (chiasma) |

## Rodando

```bash
npm install
npm run dev
```

## Exportação

Botão **"Baixar PNGs"** salva os dois exames em PNG — útil para gerar datasets sintéticos pequenos ou material didático.

## Extensões sugeridas

- Adicionar mapa de desvio (pattern deviation) e índices globais (MD, PSD).
- Suporte a 30-2 e 10-2.
- Export JSON estruturado dos thresholds para treinamento de modelos.
- Corte B-scan animado (varredura de diferentes meridianos).

## Aviso

Dados sintéticos servem para ensino e prototipagem. **Não** use para treinar modelos diagnósticos de produção sem validação em dados clínicos reais.
