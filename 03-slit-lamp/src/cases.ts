export type Finding = "normal" | "tyndall" | "synechia" | "corneal_edema";

export interface Case {
  id: string;
  name: string;
  finding: Finding;
  summary: string;
  options: { id: Finding; label: string }[];
}

export const CASES: Case[] = [
  {
    id: "c1",
    name: "Homem, 42 anos — dor ocular e fotofobia há 3 dias",
    finding: "tyndall",
    summary: "Tyndall positivo: partículas em suspensão na câmara anterior (uveíte anterior).",
    options: [
      { id: "normal", label: "Olho normal" },
      { id: "tyndall", label: "Tyndall (+) — uveíte anterior" },
      { id: "synechia", label: "Sinéquia posterior" },
      { id: "corneal_edema", label: "Edema corneano" },
    ],
  },
  {
    id: "c2",
    name: "Mulher, 58 anos — pós-uveíte crônica",
    finding: "synechia",
    summary: "Sinéquias posteriores: aderências entre íris e cristalino, pupila irregular.",
    options: [
      { id: "normal", label: "Olho normal" },
      { id: "tyndall", label: "Tyndall (+)" },
      { id: "synechia", label: "Sinéquia posterior" },
      { id: "corneal_edema", label: "Edema corneano" },
    ],
  },
  {
    id: "c3",
    name: "Homem, 67 anos — pós-operatório de catarata (D+1)",
    finding: "corneal_edema",
    summary: "Edema estromal corneano com microcistos epiteliais.",
    options: [
      { id: "normal", label: "Olho normal" },
      { id: "tyndall", label: "Tyndall (+)" },
      { id: "synechia", label: "Sinéquia posterior" },
      { id: "corneal_edema", label: "Edema corneano" },
    ],
  },
  {
    id: "c4",
    name: "Mulher, 30 anos — exame de rotina",
    finding: "normal",
    summary: "Segmento anterior sem alterações.",
    options: [
      { id: "normal", label: "Olho normal" },
      { id: "tyndall", label: "Tyndall (+)" },
      { id: "synechia", label: "Sinéquia posterior" },
      { id: "corneal_edema", label: "Edema corneano" },
    ],
  },
];
