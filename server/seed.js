import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Patient from './models/patient.js';
import aespaPatients from './seed/aespaPatients.js';

dotenv.config();

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Aborting seed.');
  process.exit(1);
}

const log = (message, payload) => {
  console.log(message, payload ?? '');
};

async function seed() {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  const shouldReset = process.argv.includes('--reset');
  const names = aespaPatients.map((patient) => patient.name);

  log('Connected to MongoDB, seeding AESPA patients...');

  if (shouldReset) {
    log('Reset flag detected, removing existing AESPA patients before seeding.');
    await Patient.deleteMany({ name: { $in: names } });
  }

  const bulkOperations = aespaPatients.map((patient) => ({
    updateOne: {
      filter: { name: patient.name },
      update: { $set: patient },
      upsert: true
    }
  }));

  const result = await Patient.bulkWrite(bulkOperations);

  log('Seed result:', result);
  log('All done.');

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  mongoose.disconnect().finally(() => process.exit(1));
});
