# eye-sim-lab

Quatro simuladores web em **TypeScript** para oftalmologia — educação de paciente, treinamento de residente e marketing clínico. Sem CAD, sem hardware: apenas browser.

Cada app é standalone (Vite + TS), independente, e faz deploy em qualquer host estático (Vercel, Netlify, GitHub Pages).

## Apps

| # | App | Stack | Caso de uso |
|---|---|---|---|
| 1 | [Vision Simulator](01-vision-simulator/) | Canvas 2D + filtros | Paciente vê como enxerga um portador de catarata / glaucoma / DMRI / retinopatia |
| 2 | [Surgical Microscope](02-surgical-microscope/) | Three.js + WebGL | Simulação 3D de microscópio cirúrgico (facectomia básica) |
| 3 | [Slit Lamp Exam](03-slit-lamp/) | Canvas 2D | Treino de biomicroscopia: ajuste fenda, identifique achados |
| 4 | [OCT & Visual Field](04-oct-field/) | SVG + Canvas | Gera exames sintéticos (OCT macular, Humphrey 24-2) com defeitos parametrizáveis |

## Rodando qualquer app

```bash
cd 01-vision-simulator   # ou 02, 03, 04
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Build para produção

```bash
npm run build
# dist/ pronto para deploy estático
```

## Contexto

Projeto educacional do ecossistema **IA para Médicos** — complementa iniciativas como AEO Doctors (marketing/visibilidade) e GeekVision (produtos oftalmológicos). Veja [docs/RATIONALE.md](docs/RATIONALE.md) para o racional clínico de cada simulador.

## Licença

MIT.
