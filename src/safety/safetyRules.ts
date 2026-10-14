export interface CrisisResource {
  name: string;
  contact: string;
  actionUri: string;
  availability: string;
  description: string;
}

export const UK_CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "Samaritans",
    contact: "116 123",
    actionUri: "tel:116123",
    availability: "Free, 24/7, 365 days a year",
    description: "Confidential emotional support for anyone in distress, struggling to cope, or at risk of suicide.",
  },
  {
    name: "NHS 111",
    contact: "Dial 111",
    actionUri: "tel:111",
    availability: "Free, 24 hours a day",
    description: "Urgent mental health services and compassionate guidance from trained clinicians.",
  },
  {
    name: "Shout Crisis Text Line",
    contact: "Text SHOUT to 85258",
    actionUri: "sms:85258?body=SHOUT",
    availability: "Free, 24/7 text support",
    description: "Quiet, discreet crisis support via SMS anytime you need someone to text.",
  },
  {
    name: "Emergency Services",
    contact: "Call 999",
    actionUri: "tel:999",
    availability: "Immediate emergency response",
    description: "For immediate danger to life or physical safety.",
  },
];

const CRISIS_PATTERNS = [
  /\b(suicide|suicidal|kill myself|want to die|end my life|take my own life)\b/i,
  /\b(self[-\s]?harm|cut myself|overdose|hurting myself)\b/i,
  /\b(no reason to live|don't want to wake up|better off without me|nobody cares if i disappear)\b/i,
  /\b(can't go on anymore|hopeless and want to end it)\b/i,
];

export function detectCrisisIntent(text: string): boolean {
  if (!text) return false;
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}
