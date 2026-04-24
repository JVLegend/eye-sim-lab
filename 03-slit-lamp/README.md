# 03 — Slit Lamp Exam

Treino interativo de biomicroscopia: ajuste feixe de luz e identifique o achado.

## Como funciona

- `<canvas>` 2D desenha segmento anterior com íris texturizada, córnea e pupila.
- Feixe de luz é um retângulo com gradiente + `globalCompositeOperation = "lighter"` (simula luz aditiva).
- Cada caso tem `finding` e `options`; aluno escolhe e recebe feedback.

## Casos inclusos

1. Tyndall (+) — uveíte anterior
2. Sinéquia posterior
3. Edema corneano pós-catarata
4. Exame normal

## Controles

| Controle | Efeito |
|---|---|
| Caso | troca paciente virtual |
| Largura do feixe | fino = corte óptico; largo = iluminação difusa |
| Ângulo | incidência do feixe |
| Intensidade | opacidade/brilho do feixe |
| Magnificação | zoom da visão |

## Rodando

```bash
npm install
npm run dev
```

## Extensões sugeridas

- Adicionar filtros (cobalto azul para fluoresceína, red-free).
- Banco de 20+ casos com imagens reais (sob licença).
- Timer e pontuação com dificuldade progressiva.
