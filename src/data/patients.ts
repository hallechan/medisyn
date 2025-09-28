import { PatientRecord } from '../types';

export const patients: PatientRecord[] = [
  {
    id: 'patient-001',
    name: 'Karina Ji-Min',
    age: 24,
    pronouns: 'she/her',
    avatar: '/karina.jpg',
    conditions: ['hypertension', 'autonomic imbalance'],
    lastVisit: 'Apr 08, 2025',
    specialty: 'cardiology',
    notes: '',
    vitals: [
      { label: 'heart rate', value: '92', unit: 'bpm', status: 'elevated', trend: 'up' },
      { label: 'blood pressure', value: '128/82', status: 'stable', trend: 'steady' },
      { label: 'spo₂', value: '97', unit: '%', status: 'stable', trend: 'steady' },
  { label: 'temperature', value: '', unit: '°c', status: 'measured' } // To be filled with measured value
    ],
    timeline: [
      {
        date: 'Mar 12, 2025',
        title: 'cardiology follow-up',
        description: 'echo shows rising ejection fraction; keep telemetry running.',
        category: 'appointment',
        appointmentId: 'appt-001',
        metadata: { focus: 'cardiomyopathy recovery plan' }
      },
      {
        date: 'Feb 22, 2025',
        title: 'nt-probnp labs',
        description: 'peptide falling; consider beta-blocker adjustment.',
        category: 'lab'
      },
      {
        date: 'Feb 09, 2025',
        title: 'home wearable sync',
        description: 'telemetry flagged irregular nocturnal rhythm.',
        category: 'note'
      }
    ],
    medications: [
      { name: 'carvedilol', dosage: '12.5 mg', schedule: '2x daily', adherence: 'on track', type: 'pill' },
      { name: 'lisinopril', dosage: '10 mg', schedule: 'daily', adherence: 'needs review', type: 'pill' }
    ],
    research: [
      {
        title: 'postpartum cardiac rehab outcomes',
        source: 'Journal of Women\'s Cardiology',
        summary: 'rehab with hormonal metrics improves postpartum recovery.',
        url: '#'
      },
      {
        title: 'wearable telemetry accuracy in women',
        source: 'Digital Health Equity Consortium',
        summary: 'benchmarks photoplethysmography across diverse skin tones.',
        url: '#'
      }
    ],
    riskScore: 68,
    metrics: [
      {
        id: 'heart-rate',
        name: 'heart rate',
        unit: 'bpm',
        points: [
          { time: 'jan', value: 98 },
          { time: 'feb', value: 96 },
          { time: 'mar', value: 94 },
          { time: 'apr', value: 92 },
          { time: 'may', value: 90 },
          { time: 'jun', value: 89 },
          { time: 'jul', value: 88 },
          { time: 'aug', value: 87 },
          { time: 'sep', value: 86 },
          { time: 'oct', value: 86 },
          { time: 'nov', value: 87 },
          { time: 'dec', value: 88 }
        ]
      }
    ],
    appointmentHistory: [
      {
        id: 'appt-001',
        date: '2025-03-12',
        summary: 'postpartum cardio follow up',
        notes: 'echo trending positive; continue telemetry and beta-blocker taper discussion.',
        draft: {
          appointmentType: 'postpartum cardio follow up',
          symptomSummary: 'ongoing postpartum cardio monitoring with wearable correlations.',
          duration: '45 minutes',
          weightKg: 58,
          heightCm: 167,
          notes: 'echo trending positive; continue telemetry and beta-blocker taper discussion.',
          diagnosticFocus: ['cardiomyopathy recovery plan', 'arrhythmia watch'],
          heartbeatBpm: 92
        }
      },
      {
        id: 'appt-002',
        date: '2025-02-09',
        summary: 'wearable review',
        notes: 'flagged nocturnal arrhythmia episodes; scheduled in-clinic capture.',
        draft: {
          appointmentType: 'wearable review',
          symptomSummary: 'nighttime arrhythmia alerts with variability spikes.',
          duration: '30 minutes',
          weightKg: 58,
          heightCm: 167,
          notes: 'flagged nocturnal arrhythmia episodes; scheduled in-clinic capture.',
          diagnosticFocus: ['autonomic reset protocol'],
          heartbeatBpm: 95
        }
      }
    ]
  },
  {
    id: 'patient-002',
    name: 'Ningning Yizhuo',
    age: 22,
    pronouns: 'she/her',
    avatar: '/ningning.jpg',
    conditions: ['metabolic dysregulation', 'insulin resistance'],
    lastVisit: 'Mar 01, 2025',
    specialty: 'endocrinology',
    notes: '',
    vitals: [
      { label: 'blood pressure', value: '122/80', status: 'stable', trend: 'steady' },
      { label: 'heart rate', value: '76', unit: 'bpm', status: 'stable' },
      { label: 'spo₂', value: '98', unit: '%', status: 'stable' },
  { label: 'temperature', value: '', unit: '°c', status: 'measured' } // To be filled with measured value
    ],
    timeline: [
      {
        date: 'Mar 01, 2025',
        title: 'cycle-synced endocrine review',
        description: 'reviewed ovulatory metrics and metabolic impact.',
        category: 'appointment',
        appointmentId: 'appt-101'
      },
      {
        date: 'Feb 18, 2025',
        title: 'continuous glucose monitor upload',
        description: 'night glucose spikes track with luteal phase. todo: add luteal analytics.',
        category: 'note'
      }
    ],
    medications: [
      { name: 'metformin', dosage: '500 mg', schedule: '2x daily', adherence: 'on track', type: 'pill' }
    ],
    research: [
      {
        title: 'metabolic markers across menstrual phases',
        source: 'Women\'s Health Metabolism Review',
        summary: 'maps phase-specific insulin targets to treatment plans.',
        url: '#'
      }
    ],
    riskScore: 45,
    metrics: [
      {
        id: 'heart-rate',
        name: 'heart rate',
        unit: 'bpm',
        points: [
          { time: 'jan', value: 84 },
          { time: 'feb', value: 80 },
          { time: 'mar', value: 78 },
          { time: 'apr', value: 76 },
          { time: 'may', value: 74 },
          { time: 'jun', value: 73 },
          { time: 'jul', value: 72 },
          { time: 'aug', value: 72 },
          { time: 'sep', value: 73 },
          { time: 'oct', value: 74 },
          { time: 'nov', value: 76 },
          { time: 'dec', value: 78 }
        ]
      }
    ],
    appointmentHistory: [
      {
        id: 'appt-101',
        date: '2025-03-01',
        summary: 'cycle-synced endocrine review',
        notes: 'aligned nutrition plan with ovulatory phase metrics; reinforced CGM schedule.',
        draft: {
          appointmentType: 'cycle-synced endocrine review',
          symptomSummary: 'reviewed luteal phase insulin sensitivity shifts.',
          duration: '45 minutes',
          weightKg: 52,
          heightCm: 165,
          notes: 'aligned nutrition plan with ovulatory phase metrics; reinforced CGM schedule.',
          diagnosticFocus: ['cycle sync adjustment'],
          heartbeatBpm: 78
        }
      },
      {
        id: 'appt-102',
        date: '2025-02-11',
        summary: 'metabolic coaching',
        notes: 'introduced resistance training blocks and stress-modulation routine.',
        draft: {
          appointmentType: 'metabolic coaching',
          symptomSummary: 'metabolic fatigue with luteal cravings and fasting variability.',
          duration: '30 minutes',
          weightKg: 52,
          heightCm: 165,
          notes: 'introduced resistance training blocks and stress-modulation routine.',
          diagnosticFocus: ['metabolic stabilization'],
          heartbeatBpm: 76
        }
      }
    ]
  },
  {
    id: 'patient-003',
    name: 'Winter Min-Jeong',
    age: 23,
    pronouns: 'she/her',
    avatar: '/winter.jpg',
    conditions: ['postural tachycardia', 'bone density risk'],
    lastVisit: 'Mar 18, 2025',
    specialty: 'integrative medicine',
    notes: '',
    vitals: [
      { label: 'blood pressure', value: '134/86', status: 'elevated', trend: 'up' },
      { label: 'heart rate', value: '82', unit: 'bpm', status: 'elevated' },
      { label: 'spo₂', value: '96', unit: '%', status: 'stable' },
  { label: 'temperature', value: '', unit: '°c', status: 'measured' } // To be filled with measured value
    ],
    timeline: [
      {
        date: 'Feb 26, 2025',
        title: 'hormone therapy adjustment',
        description: 'adjusted estradiol dose per symptoms and labs.',
        category: 'appointment',
        appointmentId: 'appt-201'
      },
      {
        date: 'Feb 05, 2025',
        title: 'dexa scan import',
        description: 'cv annotation requested for lumbar spine. todo: add imaging pipeline.',
        category: 'imaging'
      }
    ],
    medications: [
      { name: 'estradiol patch', dosage: '0.05 mg', schedule: 'weekly', adherence: 'on track', type: 'cream' },
      { name: 'calcium citrate', dosage: '600 mg', schedule: 'daily', adherence: 'on track', type: 'pill' }
    ],
    research: [
      {
        title: 'bone density outcomes in hormone therapy',
        source: 'North American Menopause Society',
        summary: 'details bone density gains when therapy matches menopausal stage.',
        url: '#'
      },
      {
        title: 'ai-assisted imaging for osteoporosis in women',
        source: 'Radiology Innovations Quarterly',
        summary: 'ai spots trabecular change earlier in female cohorts.',
        url: '#'
      }
    ],
    riskScore: 52,
    metrics: [
      {
        id: 'heart-rate',
        name: 'heart rate',
        unit: 'bpm',
        points: [
          { time: 'jan', value: 88 },
          { time: 'feb', value: 86 },
          { time: 'mar', value: 84 },
          { time: 'apr', value: 83 },
          { time: 'may', value: 82 },
          { time: 'jun', value: 82 },
          { time: 'jul', value: 81 },
          { time: 'aug', value: 81 },
          { time: 'sep', value: 82 },
          { time: 'oct', value: 83 },
          { time: 'nov', value: 84 },
          { time: 'dec', value: 85 }
        ]
      }
    ],
    appointmentHistory: [
      {
        id: 'appt-201',
        date: '2025-02-26',
        summary: 'hormone therapy adjustment',
        notes: 'titrated estradiol patch; plan repeat labs in six weeks.',
        draft: {
          appointmentType: 'hormone therapy adjustment',
          symptomSummary: 'perimenopausal symptom review with bone health emphasis.',
          duration: '60 minutes',
          weightKg: 55,
          heightCm: 166,
          notes: 'titrated estradiol patch; plan repeat labs in six weeks.',
          diagnosticFocus: ['bone-density support'],
          heartbeatBpm: 82
        }
      }
    ]
  },
  {
    id: 'patient-004',
    name: 'Giselle Uchinaga',
    age: 24,
    pronouns: 'she/her',
    avatar: '/giselle.jpg',
    conditions: ['autoimmune thyroiditis', 'chronic fatigue'],
    lastVisit: 'Jan 30, 2025',
    specialty: 'immunology',
    notes: '',
    vitals: [
      { label: 'blood pressure', value: '126/84', status: 'elevated', trend: 'up' },
      { label: 'heart rate', value: '88', unit: 'bpm', status: 'elevated', trend: 'up' },
      { label: 'spo₂', value: '95', unit: '%', status: 'stable' },
  { label: 'temperature', value: '', unit: '°c', status: 'measured' } // To be filled with measured value
    ],
    timeline: [
      {
        date: 'Jan 30, 2025',
        title: 'immunology consult',
        description: 'assessed flare and adjusted low-dose naltrexone.',
        category: 'appointment',
        appointmentId: 'appt-301'
      },
      {
        date: 'Jan 10, 2025',
        title: 'wearable fatigue index',
        description: 'imported hrv metrics; flagged need for recovery plan.',
        category: 'note'
      }
    ],
    medications: [
      { name: 'levothyroxine', dosage: '75 mcg', schedule: 'daily', adherence: 'on track', type: 'pill' },
      { name: 'low-dose naltrexone', dosage: '4.5 mg', schedule: 'daily', adherence: 'paused', type: 'pill' }
    ],
    research: [
      {
        title: 'immune modulation in afab patients',
        source: 'Immunology & Gender Review',
        summary: 'outlines cytokine shifts tied to hormonal cycles.',
        url: '#'
      }
    ],
    riskScore: 61,
    metrics: [
      {
        id: 'heart-rate',
        name: 'heart rate',
        unit: 'bpm',
        points: [
          { time: 'jan', value: 94 },
          { time: 'feb', value: 92 },
          { time: 'mar', value: 90 },
          { time: 'apr', value: 89 },
          { time: 'may', value: 88 },
          { time: 'jun', value: 87 },
          { time: 'jul', value: 86 },
          { time: 'aug', value: 86 },
          { time: 'sep', value: 87 },
          { time: 'oct', value: 88 },
          { time: 'nov', value: 89 },
          { time: 'dec', value: 91 }
        ]
      }
    ],
    appointmentHistory: [
      {
        id: 'appt-301',
        date: '2025-01-30',
        summary: 'immunology consult',
        notes: 'flare management with low-dose naltrexone; sleep hygiene focus.',
        draft: {
          appointmentType: 'immunology consult',
          symptomSummary: 'fatigue spikes with thyroid antibody elevations.',
          duration: '45 minutes',
          weightKg: 57,
          heightCm: 164,
          notes: 'flare management with low-dose naltrexone; sleep hygiene focus.',
          diagnosticFocus: ['thyroid modulation review'],
          heartbeatBpm: 88
        }
      }
    ]
  }
];
