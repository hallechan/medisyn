export type VitalStatus = 'Stable' | 'Elevated' | 'Critical' | 'Unknown';

export interface VitalSign {
  label: string;
  value: string;
  unit?: string;
  status: VitalStatus;
  trend?: 'up' | 'down' | 'steady';
}

export interface PatientOverview {
  id: string;
  name: string;
  age: number;
  pronouns: string;
  avatar: string;
  conditions: string[];
  lastVisit: string;
  specialty: string;
  notes: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  category: 'Appointment' | 'Lab' | 'Imaging' | 'Note';
}

export interface Medication {
  name: string;
  dosage: string;
  schedule: string;
  adherence: 'On Track' | 'Needs Review' | 'Paused';
}

export interface ResearchHighlight {
  title: string;
  source: string;
  summary: string;
  url: string;
}

export interface PatientRecord extends PatientOverview {
  vitals: VitalSign[];
  timeline: TimelineEntry[];
  medications: Medication[];
  research: ResearchHighlight[];
  riskScore: number;
  nextSteps: string[];
  clinicalReminders: string[];
}

export interface AppointmentDraft {
  appointmentType: string;
  symptomSummary: string;
  duration: string;
  weightKg?: number;
  heightCm?: number;
  notes: string;
  diagnosticFocus: string[];
}
