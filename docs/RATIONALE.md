# Rationale clínico-educacional

Por que cada um dos 4 simuladores existe e quem é o público-alvo.

## 1. Vision Simulator

**Público:** pacientes, familiares, leigos.
**Pergunta que responde:** "como meu pai enxerga com catarata?" / "o que é glaucoma avançado?"
**Patologias simuladas:**
- **Catarata** — blur gaussiano progressivo + tom amarelado (esclerose nuclear).
- **Glaucoma** — vinheta periférica (perda de campo periférico).
- **DMRI** — escotoma central (mancha).
- **Retinopatia diabética** — manchas escuras dispersas (hemorragias/exsudatos).

**Limitações honestas:** é uma aproximação visual, não um modelo psicofísico validado.

## 2. Surgical Microscope

**Público:** estudantes de medicina, residentes R1 iniciando cirurgia.
**Objetivo:** familiarizar com a perspectiva do microscópio cirúrgico e a anatomia 3D do segmento anterior.
**Interações:**
- Zoom (scroll), pan (drag), foco.
- Ponteira de faco simulada (mouse) "fragmenta" o cristalino.

**Limitações:** não é haptic, não treina pedal, não valida técnica. Serve como **onboarding visual**, não wet lab.

## 3. Slit Lamp Exam

**Público:** residentes R1–R2, estudantes de oftalmo.
**Objetivo:** treinar raciocínio — ajustar feixe da fenda e identificar achados em pacientes virtuais.
**Casos inclusos:** Tyndall (uveíte anterior), sinéquia posterior, córnea normal (controle).

**Limitações:** achados são estilizados (não fotorrealistas).

## 4. OCT & Visual Field

**Público:** residentes, fellows, pesquisadores.
**Objetivo:** gerar exames sintéticos parametrizáveis para ensino e testes de algoritmo.
**Gera:**
- OCT macular (corte B-scan) com edema, buraco, descolamento.
- Humphrey 24-2 com defeito arqueado, altitudinal, generalizado.

**Limitações:** dados sintéticos — não use para treinar modelos diagnósticos sem validação em dados reais.

---

## Roadmap

- [ ] Exportar screenshots em alta-res para material didático.
- [ ] Modo multi-língua (PT/EN).
- [ ] PWA offline para uso em ambulatório.
