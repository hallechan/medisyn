#!/usr/bin/env node

// Medication Terminal Commands Generator
// Helps convert AI diagnosis medication recommendations to MongoDB commands

const sampleMedications = [
  {
    condition: "Peripartum Cardiomyopathy",
    medications: [
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
  },
  {
    condition: "Pulmonary Embolism",
    medications: [
      {
        medication: "Rivaroxaban",
        dosage: "15 mg",
        frequency: "twice daily for 21 days, then 20 mg once daily",
        route: "oral",
        duration: "3-6 months minimum",
        indication: "anticoagulation for pulmonary embolism",
        monitoring: "bleeding symptoms, kidney function",
        contraindications: "active bleeding, severe kidney disease"
      }
    ]
  }
];

function generateMongoCommands(patientId, condition, medications) {
  console.log(`\n=== MongoDB Commands for ${condition} ===\n`);

  medications.forEach((med, index) => {
    const medicationDoc = {
      name: med.medication,
      dosage: med.dosage,
      schedule: med.frequency,
      adherence: 'on track',
      type: med.route === 'oral' ? 'pill' :
            med.route === 'injection' ? 'injection' :
            med.route === 'topical' ? 'cream' : 'pill',
      indication: med.indication,
      monitoring: med.monitoring,
      contraindications: med.contraindications,
      duration: med.duration,
      prescribed_date: new Date().toISOString(),
      prescribed_for_condition: condition
    };

    console.log(`# Medication ${index + 1}: ${med.medication}`);
    console.log(`db.patients.updateOne(`);
    console.log(`  { "_id": ObjectId("${patientId}") },`);
    console.log(`  { "$push": { "medications": ${JSON.stringify(medicationDoc, null, 4)} } }`);
    console.log(`)\n`);
  });

  // Command to add to timeline
  const timelineEntry = {
    date: new Date().toISOString().split('T')[0],
    title: `AI-Recommended Medications for ${condition}`,
    description: `Added ${medications.length} medication(s): ${medications.map(m => m.medication).join(', ')}`,
    category: 'medication',
    metadata: {
      ai_generated: true,
      condition: condition,
      medication_count: medications.length
    }
  };

  console.log(`# Add to timeline:`);
  console.log(`db.patients.updateOne(`);
  console.log(`  { "_id": ObjectId("${patientId}") },`);
  console.log(`  { "$push": { "timeline": ${JSON.stringify(timelineEntry, null, 4)} } }`);
  console.log(`)\n`);
}

function generateSampleCommands() {
  const samplePatientId = "507f1f77bcf86cd799439011"; // Example ObjectId

  console.log("🏥 MEDICATION TERMINAL COMMANDS GENERATOR");
  console.log("=========================================");
  console.log("Use these MongoDB commands to add AI-recommended medications to patient records\n");

  console.log(`📋 Sample Patient ID: ${samplePatientId}`);
  console.log("(Replace with actual patient ObjectId from your database)\n");

  sampleMedications.forEach(({ condition, medications }) => {
    generateMongoCommands(samplePatientId, condition, medications);
  });

  console.log("🔧 USAGE INSTRUCTIONS:");
  console.log("1. Connect to your MongoDB instance: mongosh");
  console.log("2. Switch to medisyn database: use medisyn");
  console.log("3. Get patient ID: db.patients.find({name: \"Patient Name\"}, {_id: 1})");
  console.log("4. Copy and paste the commands above (replace the ObjectId)");
  console.log("5. Verify: db.patients.findOne({_id: ObjectId(\"patient_id\")}, {medications: 1, timeline: 1})\n");

  console.log("💡 INTEGRATION TIP:");
  console.log("The 'Add to Patient' button in the AI Diagnosis Results will show an alert");
  console.log("with the medication details formatted for easy copying to terminal commands.\n");
}

// Run the generator
generateSampleCommands();