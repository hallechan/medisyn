import { PatientRecord } from '../types';

export const patients: PatientRecord[] = [
  {
    id: 'patient-001',
    name: 'Amara Brooks',
    age: 38,
    pronouns: 'she/her',
    avatar: 'https://i.pravatar.cc/160?img=47',
    conditions: ['Peripartum cardiomyopathy', 'Hypertension'],
    lastVisit: 'Mar 12, 2025',
    specialty: 'Cardiology',
    notes: 'Monitoring heart function postpartum with emphasis on female-specific markers.',
    vitals: [
      { label: 'Heart Rate', value: '92', unit: 'bpm', status: 'Elevated', trend: 'up' },
      { label: 'Blood Pressure', value: '128/82', status: 'Stable', trend: 'steady' },
      { label: 'SpO₂', value: '97', unit: '%', status: 'Stable', trend: 'steady' },
      { label: 'Temperature', value: '36.9', unit: '°C', status: 'Stable' }
    ],
    timeline: [
      {
        date: 'Mar 12, 2025',
        title: 'Cardiology follow-up',
        description: 'Echocardiogram shows improving ejection fraction; continue telemetry monitoring.',
        category: 'Appointment'
      },
      {
        date: 'Feb 22, 2025',
        title: 'NT-proBNP labs',
        description: 'Peptide trending downward; consider adjusting beta blockers.',
        category: 'Lab'
      },
      {
        date: 'Feb 09, 2025',
        title: 'Home wearable sync',
        description: 'Telemetry flags irregular nocturnal heart rhythm.',
        category: 'Note'
      }
    ],
    medications: [
      { name: 'Carvedilol', dosage: '12.5 mg', schedule: '2x daily', adherence: 'On Track' },
      { name: 'Lisinopril', dosage: '10 mg', schedule: 'Daily', adherence: 'Needs Review' }
    ],
    research: [
      {
        title: 'Sex-specific cardiac rehab outcomes postpartum',
        source: 'Journal of Women\'s Cardiology',
        summary: 'Highlights improved outcomes when rehab programs integrate hormonal recovery metrics.',
        url: '#'
      },
      {
        title: 'Wearable telemetry accuracy in female patients',
        source: 'Digital Health Equity Consortium',
        summary: 'Benchmarks accuracy of photoplethysmography for diverse skin tones and postpartum bodies.',
        url: '#'
      }
    ],
    riskScore: 68,
    nextSteps: [
      'Schedule in-clinic heartbeat capture via Arduino integration. TODO: Connect to hardware feed.',
      'Trigger ML-based arrhythmia analysis. TODO: Wire to analytics microservice.',
      'Queue cardio-focused physical therapy referral.'
    ],
    clinicalReminders: [
      'Reassess ACE inhibitor dosage based on labs.',
      'Confirm breastfeeding-safe medication list.'
    ]
  },
  {
    id: 'patient-002',
    name: 'Lina Cho',
    age: 29,
    pronouns: 'she/her',
    avatar: 'https://i.pravatar.cc/160?img=32',
    conditions: ['Polycystic ovary syndrome', 'Insulin resistance'],
    lastVisit: 'Mar 01, 2025',
    specialty: 'Endocrinology',
    notes: 'Focus on metabolic health with cycle-aware endocrine metrics.',
    vitals: [
      { label: 'Blood Glucose', value: '105', unit: 'mg/dL', status: 'Elevated', trend: 'down' },
      { label: 'Resting Heart Rate', value: '78', unit: 'bpm', status: 'Stable' },
      { label: 'BMI', value: '27.5', status: 'Elevated' }
    ],
    timeline: [
      {
        date: 'Mar 01, 2025',
        title: 'Cycle-synced endocrine review',
        description: 'Discussed ovulatory phase metrics and their metabolic impact.',
        category: 'Appointment'
      },
      {
        date: 'Feb 18, 2025',
        title: 'Continuous glucose monitor upload',
        description: 'Nighttime glucose spikes correlate with luteal phase. TODO: Build luteal-phase analytics.',
        category: 'Note'
      }
    ],
    medications: [
      { name: 'Metformin', dosage: '500 mg', schedule: '2x daily', adherence: 'On Track' }
    ],
    research: [
      {
        title: 'Metabolic markers across menstrual phases',
        source: 'Women\'s Health Metabolism Review',
        summary: 'Identifies phase-specific insulin sensitivity targets for improved treatment.',
        url: '#'
      }
    ],
    riskScore: 45,
    nextSteps: [
      'Collect computer vision body composition scan. TODO: Integrate CV pipeline.',
      'Sync nutrition plan with cycle tracking app.',
      'Review lab panel focusing on female reference ranges.'
    ],
    clinicalReminders: [
      'Order fasting insulin labs next visit.',
      'Confirm sleep hygiene interventions are effective.'
    ]
  },
  {
    id: 'patient-003',
    name: 'Draya Patel',
    age: 52,
    pronouns: 'she/her',
    avatar: 'https://i.pravatar.cc/160?img=49',
    conditions: ['Perimenopause symptoms', 'Osteopenia'],
    lastVisit: 'Feb 26, 2025',
    specialty: 'Integrative Medicine',
    notes: 'Balancing hormone therapy with bone-density preservation.',
    vitals: [
      { label: 'Blood Pressure', value: '134/86', status: 'Elevated', trend: 'up' },
      { label: 'DEXA T-score', value: '-1.8', status: 'Elevated' },
      { label: 'Vitamin D', value: '28', unit: 'ng/mL', status: 'Critical' }
    ],
    timeline: [
      {
        date: 'Feb 26, 2025',
        title: 'Hormone therapy adjustment',
        description: 'Tweaked estradiol dosage to align with symptom tracking and lab results.',
        category: 'Appointment'
      },
      {
        date: 'Feb 05, 2025',
        title: 'DEXA scan import',
        description: 'Computer vision annotation requested for lumbar spine analysis. TODO: Add imaging pipeline.',
        category: 'Imaging'
      }
    ],
    medications: [
      { name: 'Estradiol patch', dosage: '0.05 mg', schedule: 'Weekly', adherence: 'On Track' },
      { name: 'Calcium citrate', dosage: '600 mg', schedule: 'Daily', adherence: 'On Track' }
    ],
    research: [
      {
        title: 'Bone density outcomes in hormone therapy',
        source: 'North American Menopause Society',
        summary: 'Quantifies bone density preservation when therapy is tailored to menopausal stages.',
        url: '#'
      },
      {
        title: 'AI-assisted imaging for osteoporosis in women',
        source: 'Radiology Innovations Quarterly',
        summary: 'AI models detect trabecular changes earlier in female cohorts.',
        url: '#'
      }
    ],
    riskScore: 52,
    nextSteps: [
      'Process most recent DEXA scan via CV model. TODO: Connect imaging service.',
      'Schedule weight-bearing PT evaluation.',
      'Review dietary calcium intake log.'
    ],
    clinicalReminders: [
      'Repeat Vitamin D lab in 8 weeks.',
      'Confirm bone turnover markers ordered.'
    ]
  },
  {
    id: 'patient-004',
    name: 'Sasha Mendes',
    age: 45,
    pronouns: 'she/they',
    avatar: 'https://i.pravatar.cc/160?img=56',
    conditions: ['Autoimmune thyroiditis', 'Chronic fatigue'],
    lastVisit: 'Jan 30, 2025',
    specialty: 'Immunology',
    notes: 'Interdisciplinary approach combining endocrine, immune, and sleep medicine.',
    vitals: [
      { label: 'TSH', value: '3.8', unit: 'mIU/L', status: 'Elevated', trend: 'up' },
      { label: 'Resting Heart Rate', value: '88', unit: 'bpm', status: 'Elevated', trend: 'up' },
      { label: 'Temperature', value: '36.2', unit: '°C', status: 'Stable' }
    ],
    timeline: [
      {
        date: 'Jan 30, 2025',
        title: 'Immunology consult',
        description: 'Assessed flare-up and adjusted low-dose naltrexone.',
        category: 'Appointment'
      },
      {
        date: 'Jan 10, 2025',
        title: 'Wearable fatigue index',
        description: 'Imported HRV metrics; flagged need for recovery protocol.',
        category: 'Note'
      }
    ],
    medications: [
      { name: 'Levothyroxine', dosage: '75 mcg', schedule: 'Daily', adherence: 'On Track' },
      { name: 'Low-dose naltrexone', dosage: '4.5 mg', schedule: 'Daily', adherence: 'Paused' }
    ],
    research: [
      {
        title: 'Immune modulation in AFAB patients',
        source: 'Immunology & Gender Review',
        summary: 'Explores unique cytokine expression profiles linked to hormonal cycles.',
        url: '#'
      }
    ],
    riskScore: 61,
    nextSteps: [
      'Launch fatigue ML classifier once wearable sync is restored. TODO: Connect data ingestion API.',
      'Coordinate telehealth follow-up focused on sleep quality.',
      'Review thyroid antibody panel next lab cycle.'
    ],
    clinicalReminders: [
      'Confirm medication refill compliance.',
      'Assess depression screening at next visit.'
    ]
  }
];
