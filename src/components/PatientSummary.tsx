import { FC } from 'react';
import { PatientRecord } from '../types';
import MetricTrendChart from './MetricTrendChart';

interface PatientSummaryProps {
  patient: PatientRecord;
  onStartAppointment?: () => void;
  onViewAppointment?: (appointmentId: string) => void;
}

const PatientSummary: FC<PatientSummaryProps> = ({ patient, onStartAppointment, onViewAppointment }) => {
  const vitalStatusClass: Record<string, string> = {
    stable: 'status-tag status-tag--stable',
    elevated: 'status-tag status-tag--elevated',
    critical: 'status-tag status-tag--critical',
    unknown: 'status-tag status-tag--unknown'
  };

  return (
    <section className="gradient-surface rounded-4 shadow-sm p-5 card-shadow">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 gap-xl-4 mb-3">
        <div className="d-flex align-items-start gap-4">
          <div className="position-relative">
            <img src={patient.avatar} alt={patient.name} className="rounded-4 avatar-square" />
          </div>
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h2 className="h3 mb-0">{patient.name}</h2>
              <span className="badge bg-brand-secondary text-white">{patient.specialty}</span>
              <span className="badge badge-soft">{patient.pronouns}</span>
            </div>
            <div className="d-flex flex-wrap gap-4">
              <div>
                <span className="section-title d-block">age</span>
                <span className="fw-semibold">{patient.age}</span>
              </div>
              <div>
                <span className="section-title d-block">last visit</span>
                <span className="fw-semibold">{patient.lastVisit}</span>
              </div>
              <div>
                <span className="section-title d-block">conditions</span>
                <span className="fw-semibold">{patient.conditions.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
        {onStartAppointment && (
          <button
            type="button"
            className="btn btn-gradient rounded-pill px-4 d-flex align-items-center gap-2"
            onClick={onStartAppointment}
          >
            <i className="bi bi-calendar-plus" /> start appointment
          </button>
        )}
      </div>
      <div className="row g-3 mb-3">
        {patient.metrics.map((series) => (
          <div key={series.id} className="col-12">
            <MetricTrendChart series={series} />
          </div>
        ))}
      </div>
      <div className="row g-2">
        {patient.vitals.map((vital) => (
          <div key={vital.label} className="col-12 col-sm-6 col-lg-3">
            <div className="gradient-ghost rounded-4 p-3 vital-card">
              <div className="d-flex justify-content-between align-items-center">
                <span className="section-title mb-0">{vital.label}</span>
                <span className={vitalStatusClass[vital.status] ?? 'status-tag status-tag--unknown'}>
                  {vital.status}
                </span>
              </div>
              <div className="vital-card-value">
                <span className="display-6 fw-bold text-brand-primary">{vital.value}</span>
                {vital.unit && <span className="text-muted">{vital.unit}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PatientSummary;
