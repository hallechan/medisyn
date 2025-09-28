import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable. Please define it in a .env file.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => {
    console.warn('⚠️ MongoDB connection failed, continuing without database:', error.message);
  });

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pronouns: { type: String, default: 'she/her' },
    age: { type: Number, required: true },
    avatar: { type: String },
    conditions: { type: [String], default: [] },
    lastVisit: { type: String },
    specialty: { type: String },
    notes: { type: String, default: '' },
    vitals: {
      type: [
        {
          label: String,
          value: String,
          unit: String,
          status: {
            type: String,
            enum: ['stable', 'elevated', 'critical', 'unknown'],
            default: 'unknown'
          },
          trend: String
        }
      ],
      default: []
    },
    timeline: {
      type: [
        {
          date: String,
          title: String,
          description: String,
          category: {
            type: String,
            enum: ['appointment', 'lab', 'imaging', 'note', 'medication'],
            default: 'note'
          },
          appointmentId: String,
          metadata: mongoose.Schema.Types.Mixed
        }
      ],
      default: []
    },
    medications: {
      type: [
        {
          name: String,
          dosage: String,
          schedule: String,
          adherence: {
            type: String,
            enum: ['on track', 'needs review', 'paused'],
            default: 'on track'
          },
          type: {
            type: String,
            enum: ['pill', 'bottle', 'spray', 'cream', 'injection'],
            default: 'pill'
          }
        }
      ],
      default: []
    },
    research: {
      type: [
        {
          title: String,
          source: String,
          summary: String,
          url: String
        }
      ],
      default: []
    },
    riskScore: { type: Number, default: 0 },
    metrics: {
      type: [
        {
          id: String,
          name: String,
          unit: String,
          points: [
            {
              time: String,
              value: Number
            }
          ]
        }
      ],
      default: []
    },
    appointmentHistory: {
      type: [
        {
          id: String,
          date: String,
          summary: String,
          notes: String,
          draft: mongoose.Schema.Types.Mixed
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/api/patients', async (_req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  res.json(patients);
});

app.get('/api/patients/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.json(patient);
});

app.post('/api/patients', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create patient', error });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update patient', error });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    const result = await Patient.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete patient', error });
  }
});

app.post('/api/patients/:id/timeline', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    patient.timeline.push(req.body);
    await patient.save();
    res.status(201).json(patient.timeline[patient.timeline.length - 1]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add timeline entry', error });
  }
});

app.post('/api/patients/:id/appointments', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    patient.appointmentHistory.unshift(req.body);
    await patient.save();
    res.status(201).json(patient.appointmentHistory[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to store appointment', error });
  }
});

// AI-Powered Diagnostic Assistance Endpoint
app.post('/api/ai-diagnosis', async (req, res) => {
  try {
    const {
      symptomSummary,
      appointmentType,
      weightKg,
      heightCm,
      heartbeatBpm,
      diagnosticFocus,
      notes,
      patientAge
    } = req.body;

    // Validate required fields
    if (!symptomSummary || symptomSummary.trim() === '') {
      return res.status(400).json({
        message: 'Symptom summary is required for AI diagnosis'
      });
    }

    // Build comprehensive symptom description for AI analysis
    let fullSymptomDescription = symptomSummary;

    // Add context from other fields
    if (appointmentType) {
      fullSymptomDescription += ` Patient scheduled for ${appointmentType}.`;
    }

    if (weightKg || heightCm) {
      const bmi = weightKg && heightCm ? (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1) : null;
      fullSymptomDescription += ` Physical measurements: weight ${weightKg}kg, height ${heightCm}cm`;
      if (bmi) fullSymptomDescription += `, BMI ${bmi}`;
      fullSymptomDescription += '.';
    }

    if (heartbeatBpm) {
      fullSymptomDescription += ` Heart rate: ${heartbeatBpm} bpm.`;
    }

    if (patientAge) {
      fullSymptomDescription += ` Patient age: ${patientAge} years.`;
    }

    if (diagnosticFocus && diagnosticFocus.length > 0) {
      fullSymptomDescription += ` Areas of focus: ${diagnosticFocus.join(', ')}.`;
    }

    if (notes && notes.trim() !== '') {
      fullSymptomDescription += ` Additional notes: ${notes}`;
    }

    console.log('🧠 Processing AI diagnosis request...');
    console.log('📝 Full symptom description:', fullSymptomDescription);

    // Call Python diagnostic assistant using spawn
    const { spawn } = await import('child_process');

    const pythonProcess = spawn('./venv/bin/python', [
      './backend/scraper-agent/ai_diagnosis_api.py',
      JSON.stringify({
        symptom_description: fullSymptomDescription,
        gemini_api_key: process.env.GEMINI_API_KEY,
        max_results: 3
      })
    ]);

    let resultData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          // Extract JSON from the output by finding the last valid JSON array
          const lines = resultData.trim().split('\n');
          let jsonData = '';

          // Look for the last line that starts with '[' (JSON array)
          for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim().startsWith('[')) {
              // Collect all lines from this point to the end
              jsonData = lines.slice(i).join('\n');
              break;
            }
          }

          if (!jsonData) {
            throw new Error('No JSON data found in output');
          }

          const diagnoses = JSON.parse(jsonData);

          // Format response for frontend
          const response = {
            success: true,
            symptom_analysis: fullSymptomDescription,
            diagnoses: diagnoses.map(d => ({
              condition: d.diagnosis,
              certainty_score: d.certainty_score,
              confidence_level: d.certainty_score >= 0.7 ? 'High' :
                              d.certainty_score >= 0.4 ? 'Moderate' : 'Low',
              supporting_evidence: d.supporting_evidence,
              research_articles_count: d.research_articles,
              key_findings: d.key_findings,
              medication_recommendations: d.medication_recommendations || []
            })),
            generated_at: new Date().toISOString(),
            ai_model: 'Gemini 2.5 Flash + PubMed Research'
          };

          console.log('✅ AI diagnosis completed successfully');
          console.log(`📊 Found ${diagnoses.length} potential diagnoses`);

          res.json(response);
        } catch (parseError) {
          console.error('❌ Failed to parse AI response:', parseError);
          console.error('Raw output:', resultData);
          res.status(500).json({
            message: 'Failed to parse AI diagnosis results',
            error: parseError.message
          });
        }
      } else {
        console.error('❌ Python process failed:', errorData);
        res.status(500).json({
          message: 'AI diagnosis service failed',
          error: errorData
        });
      }
    });

  } catch (error) {
    console.error('❌ AI diagnosis endpoint error:', error);
    res.status(500).json({
      message: 'Internal server error during AI diagnosis',
      error: error.message
    });
  }
});

// Test endpoint for medications (alias for ai-diagnosis)
app.post('/api/test-medications', async (req, res) => {
  // Forward to the ai-diagnosis endpoint
  req.url = '/api/ai-diagnosis';
  return app._router.handle(req, res);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔬 AI Diagnosis API available at http://localhost:${PORT}/api/ai-diagnosis`);
  console.log(`🧪 Test endpoint available at http://localhost:${PORT}/api/test-medications`);
});
