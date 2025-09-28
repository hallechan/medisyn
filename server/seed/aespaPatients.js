const aespaPatients = [
  {
    name: 'Karina Ji-Min',
    pronouns: 'she/her',
    age: 24,
    avatar: '/karina.jpg',
    conditions: ['hypertension', 'autonomic imbalance'],
    lastVisit: 'Apr 08, 2025',
    specialty: 'cardiology',
    notes: '',
    vitals: [
      { label: 'heart rate', value: '92', unit: 'bpm', status: 'elevated', trend: 'up' },
      { label: 'blood pressure', value: '128/82', status: 'stable', trend: 'steady' },
      { label: 'spo₂', value: '97', unit: '%', status: 'stable', trend: 'steady' },
      { label: 'temperature', value: '36.9', unit: '°c', status: 'stable' }
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
        title: "postpartum cardiac rehab outcomes",
        source: "Journal of Women's Cardiology",
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
    name: 'Ningning Yizhuo',
    pronouns: 'she/her',
    age: 22,
    avatar: '/ningning.jpg',
    conditions: ['insulin resistance', 'chronic fatigue'],
    lastVisit: 'Apr 02, 2025',
    specialty: 'endocrinology',
    notes: 'monitor adjusting metformin with nutritionist oversight.',
    vitals: [
      { label: 'a1c', value: '5.6', unit: '%', status: 'stable', trend: 'down' },
      { label: 'fasting glucose', value: '94', unit: 'mg/dL', status: 'stable', trend: 'steady' },
      { label: 'blood pressure', value: '114/70', status: 'stable', trend: 'steady' },
      { label: 'spo₂', value: '98', unit: '%', status: 'stable', trend: 'steady' }
    ],
    timeline: [
      {
        date: 'Mar 28, 2025',
        title: 'nutrition follow-up',
        description: 'added low-glycemic snacks; improved afternoon energy.',
        category: 'appointment',
        appointmentId: 'appt-005',
        metadata: { dietitian: 'ms. han' }
      },
      {
        date: 'Mar 10, 2025',
        title: 'glucose monitor calibration',
        description: 'continuous monitor recalibrated; new baseline established.',
        category: 'lab'
      }
    ],
    medications: [
      { name: 'metformin', dosage: '500 mg', schedule: '2x daily', adherence: 'on track', type: 'pill' }
    ],
    research: [
      {
        title: 'metformin titration in young adults',
        source: 'Endocrine Today',
        summary: 'gradual dosage adjustments improve tolerance and outcomes.',
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
          { time: 'jan', value: 86 },
          { time: 'feb', value: 84 },
          { time: 'mar', value: 83 },
          { time: 'apr', value: 82 }
        ]
      }
    ],
    appointmentHistory: [
      {
        id: 'appt-005',
        date: '2025-03-28',
        summary: 'nutrition follow-up',
        notes: 'energy improved after adjusting macros; maintain hydration plan.',
        draft: {
          appointmentType: 'nutrition follow-up',
          symptomSummary: 'afternoon fatigue is easing with new snack schedule.',
          duration: '30 minutes',
          weightKg: 54,
          heightCm: 164,
          notes: 'energy improved after adjusting macros; maintain hydration plan.',
          diagnosticFocus: ['insulin resistance', 'fatigue management'],
          heartbeatBpm: 84
        }
      }
    ]
  },
  {
    name: 'Winter Min-Jeong',
    pronouns: 'she/her',
    age: 23,
    avatar: '/winter.jpg',
    conditions: ['autoimmune thyroiditis'],
    lastVisit: 'Mar 30, 2025',
    specialty: 'immunology',
    notes: 'de-escalate steroid taper while monitoring bone density.',
    vitals: [
      { label: 'heart rate', value: '78', unit: 'bpm', status: 'stable', trend: 'steady' },
      { label: 'blood pressure', value: '110/68', status: 'stable', trend: 'steady' },
      { label: 'spo₂', value: '97', unit: '%', status: 'stable', trend: 'steady' },
      { label: 'temperature', value: '36.7', unit: '°c', status: 'stable' }
    ],
    timeline: [
      {
        date: 'Mar 18, 2025',
        title: 'bone density scan',
        description: 'hip density at 92% expected; continue supplements.',
        category: 'imaging'
      },
      {
        date: 'Feb 14, 2025',
        title: 'steroid taper consult',
        description: 'reduced prednisone to 5 mg alternating days.',
        category: 'appointment',
        appointmentId: 'appt-007'
      }
    ],
    medications: [
      { name: 'estradiol patch', dosage: '0.05 mg', schedule: 'weekly', adherence: 'on track', type: 'cream' },
      { name: 'calcium citrate', dosage: '600 mg', schedule: 'daily', adherence: 'on track', type: 'pill' }
    ],
    research: [
      {
        title: 'immune modulation in thyroiditis',
        source: 'Autoimmune Review',
        summary: 'vitamin d optimization improves patient-reported energy.',
        url: '#'
      }
    ],
    riskScore: 58,
    metrics: [
      {
        id: 'heart-rate',
        name: 'heart rate',
        unit: 'bpm',
        points: [
          { time: 'jan', value: 82 },
          { time: 'feb', value: 80 },
          { time: 'mar', value: 79 },
          { time: 'apr', value: 78 }
        ]
      }
    ],
    appointmentHistory: [
      {
        id: 'appt-007',
        date: '2025-02-14',
        summary: 'steroid taper consult',
        notes: 'maintain alternating schedule; monitor muscle aches.',
        draft: {
          appointmentType: 'steroid taper consult',
          symptomSummary: 'autoimmune symptoms stabilizing with slower taper.',
          duration: '40 minutes',
          weightKg: 50,
          heightCm: 163,
          notes: 'maintain alternating schedule; monitor muscle aches.',
          diagnosticFocus: ['immune modulation', 'bone density protection'],
          heartbeatBpm: 82
        }
      }
    ]
  },
  {
    name: 'Giselle Uchinaga',
    pronouns: 'she/her',
    age: 24,
    avatar: '/giselle.jpg',
    conditions: ['hashimoto syndrome', 'migraine'],
    lastVisit: 'Mar 26, 2025',
    specialty: 'neurology',
    notes: 'tracking migraine triggers alongside thyroid hormone stabilization.',
    vitals: [
      { label: 'heart rate', value: '80', unit: 'bpm', status: 'stable', trend: 'steady' },
      { label: 'blood pressure', value: '116/74', status: 'stable', trend: 'steady' },
      { label: 'spo₂', value: '98', unit: '%', status: 'stable', trend: 'steady' }
    ],
    timeline: [
      {
        date: 'Mar 21, 2025',
        title: 'migraine infusion clinic',
        description: 'dihydroergotamine infusion reduced episode length.',
        category: 'appointment',
        appointmentId: 'appt-010',
        metadata: { location: 'seoul neuro center' }
      },
      {
        date: 'Feb 27, 2025',
        title: 'thyroid panel labs',
        description: 'tsh normalized at 1.8; continue dosage.',
        category: 'lab'
      }
    ],
    medications: [
      { name: 'levothyroxine', dosage: '75 mcg', schedule: 'daily', adherence: 'on track', type: 'pill' },
      { name: 'low-dose naltrexone', dosage: '4.5 mg', schedule: 'daily', adherence: 'paused', type: 'pill' }
    ],
    research: [
      {
        title: 'thyroid disease and migraine correlation',
        source: 'Neurology Insight',
        summary: 'stabilized tsh reduces migraine frequency in most cases.',
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
          { time: 'jan', value: 88 },
          { time: 'feb', value: 86 },
          { time: 'mar', value: 84 },
          { time: 'apr', value: 80 }
        ]
      }
    ],
    appointmentHistory: [
      {
        id: 'appt-010',
        date: '2025-03-21',
        summary: 'migraine infusion clinic',
        notes: 'significant relief for 10 days post-infusion; re-evaluate quarterly.',
        draft: {
          appointmentType: 'migraine infusion clinic',
          symptomSummary: 'cluster of migraines relieved by dhe therapy.',
          duration: '2 hours',
          weightKg: 55,
          heightCm: 166,
          notes: 'significant relief for 10 days post-infusion; re-evaluate quarterly.',
          diagnosticFocus: ['migraine prevention', 'thyroid stability'],
          heartbeatBpm: 82
        }
      }
    ]
  }
];

export default aespaPatients;
