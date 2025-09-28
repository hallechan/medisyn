import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Patient from './models/patient.js';
import aespaPatients from './seed/aespaPatients.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable. Please define it in a .env file.');
  process.exit(1);
}

const normalizePatient = (doc) => {
  if (!doc) return null;
  const { _id, __v, ...rest } = doc;
  return { ...rest, id: typeof _id === 'object' && _id !== null && 'toString' in _id ? _id.toString() : _id };
};

const ensureSeedData = async () => {
  const operations = aespaPatients.map((patient) => ({
    updateOne: {
      filter: { name: patient.name },
      update: { $setOnInsert: patient },
      upsert: true
    }
  }));

  if (operations.length > 0) {
    const result = await Patient.bulkWrite(operations);
    const inserted = (result.upsertedCount ?? 0) > 0;
    if (inserted) {
      console.log('🌱 Ensured AESPA patients exist in MongoDB');
    }
  }
};

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await ensureSeedData();
  })
  .catch((error) => {
    console.warn('⚠️ MongoDB connection failed, continuing without database:', error.message);
  });

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/api/patients', async (_req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 }).lean({ virtuals: true });
    res.json(patients.map(normalizePatient));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patients', error });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).lean({ virtuals: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(normalizePatient(patient));
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch patient', error });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { id: _ignoredId, ...payload } = req.body;
    const patient = await Patient.create(payload);
    res.status(201).json(normalizePatient(patient.toObject({ virtuals: true })));
  } catch (error) {
    console.error('Failed to create patient', error);
    res.status(400).json({ message: 'Failed to create patient', error });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).lean({ virtuals: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(normalizePatient(patient));
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
    const savedEntry = patient.timeline[patient.timeline.length - 1];
    res.status(201).json(savedEntry.toJSON ? savedEntry.toJSON() : savedEntry);
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
      bloodPressureSystolic,
      bloodPressureDiastolic,
      temperatureC,
      spo2Percent,
      rednessScore,
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
      const heartRateStatus = heartbeatBpm < 60 ? 'bradycardia (low)' :
                             heartbeatBpm > 100 ? 'tachycardia (elevated)' : 'normal range';
      fullSymptomDescription += ` Heart rate: ${heartbeatBpm} bpm (${heartRateStatus}).`;
    }

    if (bloodPressureSystolic && bloodPressureDiastolic) {
      const bpStatus = bloodPressureSystolic >= 140 || bloodPressureDiastolic >= 90 ? 'hypertensive' :
                       bloodPressureSystolic < 90 || bloodPressureDiastolic < 60 ? 'hypotensive' :
                       bloodPressureSystolic >= 120 ? 'elevated' : 'normal';
      fullSymptomDescription += ` Blood pressure: ${bloodPressureSystolic}/${bloodPressureDiastolic} mmHg (${bpStatus}).`;
    }

    if (temperatureC) {
      const tempStatus = temperatureC >= 38.0 ? 'fever' :
                        temperatureC < 36.1 ? 'hypothermic' : 'normal';
      const tempF = (temperatureC * 9/5 + 32).toFixed(1);
      fullSymptomDescription += ` Body temperature: ${temperatureC}°C (${tempF}°F) - ${tempStatus}.`;
    }

    if (spo2Percent) {
      const oxygenStatus = spo2Percent < 95 ? 'low (hypoxemia)' :
                          spo2Percent < 98 ? 'slightly low' : 'normal';
      fullSymptomDescription += ` Blood oxygen saturation: ${spo2Percent}% (${oxygenStatus}).`;
    }

    if (rednessScore !== undefined && rednessScore !== null) {
      const rednessStatus = rednessScore < 130 ? 'low (possible circulation issues)' :
                           rednessScore > 180 ? 'high (possible inflammation/irritation)' :
                           'normal range (healthy circulation)';
      fullSymptomDescription += ` Facial redness score: ${rednessScore} (${rednessStatus}, target range: 130-180).`;
    }

    if (patientAge) {
      fullSymptomDescription += ` Patient age: ${patientAge} years.`;
    }

    if (diagnosticFocus && diagnosticFocus.length > 0) {
      fullSymptomDescription += ` Diagnostic focus areas for specialized analysis: ${diagnosticFocus.join(', ')}. Please prioritize diagnoses and recommendations related to these specific areas.`;
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
