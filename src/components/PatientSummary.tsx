import { FC } from 'react';
import { PatientRecord } from '../types';

interface PatientSummaryProps {
  patient: PatientRecord;
}

const statusVariant: Record<string, string> = {
  Stable: 'success',
  Elevated: 'warning',
  Critical: 'danger',
  Unknown: 'secondary'
};

const PatientSummary: FC<PatientSummaryProps> = ({ patient }) => {
  return (
    <section className="bg-white rounded-4 shadow-sm p-4 card-shadow">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4 mb-4">
        <div className="position-relative">
          <img src={patient.avatar} alt={patient.name} className="rounded-4" width={120} height={120} />
          <span className="badge bg-brand-primary position-absolute top-0 start-0 translate-middle badge-pill px-3 py-2">
            Risk {patient.riskScore}%
          </span>
        </div>
        <div className="flex-grow-1">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <h2 className="h3 mb-0">{patient.name}</h2>
            <span className="badge bg-brand-secondary text-white">{patient.specialty}</span>
            <span className="badge badge-soft">{patient.pronouns}</span>
          </div>
          <p className="text-muted mb-3">{patient.notes}</p>
          <div className="d-flex flex-wrap gap-3">
            <div>
              <span className="section-title d-block">Age</span>
              <span className="fw-semibold">{patient.age}</span>
            </div>
            <div>
              <span className="section-title d-block">Last visit</span>
              <span className="fw-semibold">{patient.lastVisit}</span>
            </div>
            <div>
              <span className="section-title d-block">Conditions</span>
              <span className="fw-semibold">{patient.conditions.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3">
        {patient.vitals.map((vital) => (
          <div key={vital.label} className="col-12 col-md-6 col-lg-3">
            <div className="border rounded-4 p-3 h-100">
              <span className="section-title d-block mb-2">{vital.label}</span>
              <div className="d-flex align-items-baseline gap-2">
                <span className="display-6 fw-bold text-brand-primary">{vital.value}</span>
                {vital.unit && <span className="text-muted">{vital.unit}</span>}
              </div>
              <span
                className={`badge rounded-pill bg-${statusVariant[vital.status]}-subtle text-${statusVariant[vital.status]}-emphasis`}
              >
                {vital.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PatientSummary;
