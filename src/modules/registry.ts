import React from "react";

export interface RegisteredModule {
  id: string;
  name: string;
  badge: string;
  isLocked: boolean;
  summary: string;
  detailedNotice: {
    heading: string;
    paragraphs: string[];
    complianceTitle: string;
    compliancePoints: string[];
    actionLabel: string;
    actionNote: string;
  };
}

export const REGISTERED_MODULES: RegisteredModule[] = [
  {
    id: "adult_mode_18",
    name: "Adult Mode (18+)",
    badge: "Locked · 18+ Only",
    isLocked: true,
    summary:
      "An optional, strictly isolated module providing mature conversational range. Strictly segregated from core Kindred companions.",
    detailedNotice: {
      heading: "Architectural Isolation & Regulatory Safety",
      paragraphs: [
        "Kindred's modular architecture keeps sensitive experiences completely separate from the core companion engine. Adult Mode is an optional extension that requires deliberate, multi-factor user activation.",
        "Under the UK Online Safety Act (OSA) and age assurance standards, this module is strictly gated to protect young people and maintain transparent digital boundaries.",
      ],
      complianceTitle: "Safety & Compliance Protections",
      compliancePoints: [
        "Rigorous, independent age-assurance verification prior to activation (no self-declaration).",
        "Explicit opt-in with separate affirmative consent—never enabled by default.",
        "Zero data bleeding: Adult Mode sessions operate in an isolated sandbox and do not train shared models.",
        "Immediate off-switch: Can be toggled off at any moment, instantly wiping transient session keys.",
      ],
      actionLabel: "Verify age",
      actionNote: "Coming soon · Demonstrates module architecture readiness",
    },
  },
  {
    id: "mindful_journal",
    name: "Daily Reflection Digest",
    badge: "Core Included",
    isLocked: false,
    summary:
      "Automatically gathers your mood check-ins and insights into an optional calm evening journal page.",
    detailedNotice: {
      heading: "Mindful Reflection Digest",
      paragraphs: [
        "Synthesizes your moments of reflection from today's conversations into gentle, private bullet points.",
        "Always stored locally in your browser and entirely under your control.",
      ],
      complianceTitle: "Privacy First",
      compliancePoints: [
        "Private by default.",
        "Easily exported as JSON or cleared with one click.",
      ],
      actionLabel: "Active in core",
      actionNote: "Enabled as part of your Kindred companion",
    },
  },
];

export function getModule(id: string): RegisteredModule | undefined {
  return REGISTERED_MODULES.find((m) => m.id === id);
}
