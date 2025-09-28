import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 4001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

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

// Quick medication test endpoint
app.post('/api/test-medications', (req, res) => {
  const mockDiagnosis = {
    success: true,
    symptom_analysis: "Test symptoms for medication display",
    diagnoses: [
      {
        condition: "Peripartum Cardiomyopathy",
        certainty_score: 0.75,
        confidence_level: "High",
        supporting_evidence: ["Test evidence 1", "Test evidence 2"],
        research_articles_count: 5,
        key_findings: "Test findings for cardiomyopathy",
        medication_recommendations: [
          {
            medication: "Lisinopril",
            dosage: "2.5-5 mg",
            frequency: "once daily",
            route: "oral",
            duration: "long-term",
            indication: "heart failure and cardioprotection",
            monitoring: "blood pressure, kidney function, potassium",
            contraindications: "pregnancy, angioedema history"
          },
          {
            medication: "Metoprolol",
            dosage: "12.5-25 mg",
            frequency: "twice daily",
            route: "oral",
            duration: "long-term",
            indication: "heart rate control and symptoms",
            monitoring: "heart rate, blood pressure, heart function",
            contraindications: "severe asthma, heart block"
          }
        ]
      }
    ],
    generated_at: new Date().toISOString(),
    ai_model: 'Test Mode - Mock Data'
  };

  console.log('📋 Returning mock diagnosis with medications');
  res.json(mockDiagnosis);
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📋 Test medications endpoint: POST /api/test-medications`);
});