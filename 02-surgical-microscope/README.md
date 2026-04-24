# 02 — Surgical Microscope

Simulação 3D do segmento anterior do olho sob microscópio cirúrgico, com "facectomia" lúdica.

## Como funciona

- **Three.js** renderiza o olho: esclera, íris, pupila, córnea translúcida (`MeshPhysicalMaterial` com transmission) e cristalino dividido em 12 fragmentos.
- Controles órbita caseiros (pointer drag + wheel zoom).
- Raycaster detecta clique em fragmento → anima remoção (emular facoemulsificação).
- Ponteira de faco segue o cursor em 3D.

## Controles

| Ação | Controle |
|---|---|
| Orbitar | arrastar com mouse |
| Zoom | scroll |
| Fragmentar cristalino | clique em fragmento |
| Resetar | tecla `R` |

## Rodando

```bash
npm install
npm run dev
```

## Extensões sugeridas

- Substituir órbita custom por `OrbitControls` do `three/examples`.
- Adicionar capsulorrexe (corte circular na cápsula anterior).
- Integrar pedal virtual para controle de potência de faco.
- Timer e métricas (tempo total, fragmentos/minuto) para gamificação.
