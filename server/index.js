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
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

const app = express();
app.use(cors());
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
    const patient = await Patient.create(req.body);
    res.status(201).json(normalizePatient(patient.toObject({ virtuals: true })));
  } catch (error) {
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
