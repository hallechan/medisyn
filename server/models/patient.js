import mongoose from 'mongoose';

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

patientSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  }
});

export default mongoose.model('Patient', patientSchema);
