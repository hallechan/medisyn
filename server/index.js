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
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
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
app.use(cors());
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
