export type VitalStatus = 'stable' | 'elevated' | 'critical' | 'unknown';

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
  category: 'appointment' | 'lab' | 'imaging' | 'note' | 'medication';
  appointmentId?: string;
  metadata?: Record<string, string>;
}

export interface Medication {
  name: string;
  dosage: string;
  schedule: string;
  adherence: 'on track' | 'needs review' | 'paused';
  type?: 'pill' | 'bottle' | 'spray' | 'cream' | 'injection';
}

export interface ResearchHighlight {
  title: string;
  source: string;
  summary: string;
  url: string;
}

export interface AppointmentRecord {
  id: string;
  date: string;
  summary: string;
  notes: string;
  draft: AppointmentDraft;
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface MetricSeries {
  id: string;
  name: string;
  unit?: string;
  points: MetricPoint[];
}

export interface PatientRecord extends PatientOverview {
  vitals: VitalSign[];
  timeline: TimelineEntry[];
  medications: Medication[];
  research: ResearchHighlight[];
  riskScore: number;
  metrics: MetricSeries[];
  appointmentHistory: AppointmentRecord[];
}

export interface AppointmentDraft {
  appointmentType: string;
  symptomSummary: string;
  duration: string;
  weightKg?: number;
  heightCm?: number;
  notes: string;
  diagnosticFocus: string[];
  heartbeatBpm?: number;
}
