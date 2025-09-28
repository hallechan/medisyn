import { FC } from 'react';
import { PatientRecord, type Medication } from '../types';
import { resolveMedicationIcon } from '../utils/resolveMedicationIcon';

interface DiagnosticsPanelProps {
  patient: PatientRecord;
  onManageMedications: () => void;
  onAddTimeline: (category: PatientRecord['timeline'][number]['category']) => void;
  onViewTimelineItem?: (entry: PatientRecord['timeline'][number]) => void;
}

const categoryIcon: Record<PatientRecord['timeline'][number]['category'], string> = {
  appointment: 'bi-calendar-heart',
  lab: 'bi-droplet-half',
  imaging: 'bi-activity',
  note: 'bi-chat-left-text',
  medication: 'bi-capsule'
};

const adherenceClass: Record<string, string> = {
  'on track': 'status-chip status-chip--on-track',
  'needs review': 'status-chip status-chip--needs-review',
  paused: 'status-chip status-chip--paused'
};

const DiagnosticsPanel: FC<DiagnosticsPanelProps> = ({ patient, onManageMedications, onAddTimeline, onViewTimelineItem }) => {
  const timeline = patient.timeline;
  const research = patient.research.slice(0, 2);
  const medications = patient.medications.slice(0, 3);

  return (
    <section className="gradient-surface rounded-4 shadow-sm p-4 card-shadow h-100">
      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h3 className="h6 text-muted mb-0">timeline</h3>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-gradient rounded-pill btn-sm" onClick={() => onAddTimeline('lab')}>
                <i className="bi bi-flask me-1" /> lab
              </button>
              <button type="button" className="btn btn-gradient rounded-pill btn-sm" onClick={() => onAddTimeline('note')}>
                <i className="bi bi-stickies me-1" /> note
              </button>
            </div>
          </div>
          <div className="timeline-wrapper">
            {timeline.map((event, index) => (
              <button
                key={`${event.date}-${event.title}-${index}`}
                type="button"
                className="timeline-item bg-transparent border-0 text-start p-0"
                onClick={() => onViewTimelineItem?.(event)}
              >
                <div className="timeline-icon">
                  <i className={`bi ${categoryIcon[event.category]} fs-5`} />
                </div>
                <div className="timeline-content gradient-ghost">
                  <div className="d-flex flex-wrap justify-content-between gap-2 mb-1">
                    <div>
                      <h4 className="h6 mb-1">{event.title}</h4>
                      <small className="text-muted">{event.date}</small>
                    </div>
                    <span className="badge bg-brand-primary text-white align-self-start">{event.category}</span>
                  </div>
                  <p className="mb-0 text-muted">{event.description}</p>
                </div>
                {index < timeline.length - 1 && <div className="timeline-line" />}
              </button>
            ))}
          </div>
        </div>
        <div className="col-12 col-xl-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h6 text-muted mb-0">medications</h3>
            <button type="button" className="btn btn-gradient btn-sm rounded-pill" onClick={onManageMedications}>
              <i className="bi bi-clipboard-plus me-1" /> manage
            </button>
          </div>
          <div className="d-grid gap-2">
            {medications.map((med) => {
              const iconSrc = resolveMedicationIcon(med);
              return (
                <div key={med.name} className="rounded-4 p-3 gradient-ghost">
                  <div className="d-flex align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={iconSrc} alt="medication" className="med-icon" />
                      <div>
                        <h4 className="h6 mb-1">{med.name}</h4>
                        <small className="text-muted">{med.dosage} · {med.schedule}</small>
                      </div>
                    </div>
                    <span className={adherenceClass[med.adherence] ?? 'status-chip status-chip--needs-review'}>
                      {med.adherence}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="pt-1">
        <h3 className="h6 text-muted mb-3">research feed</h3>
        <div className="row g-3">
          {research.map((study) => (
            <div key={study.title} className="col-12 col-lg-6">
              <article className="border rounded-4 p-3 h-100 gradient-panel">
                <div className="mb-2">
                  <h4 className="h6 mb-1 text-brand-secondary">{study.title}</h4>
                  <small className="text-muted d-block text-break">{study.source}</small>
                </div>
                <p className="text-muted small">{study.summary}</p>
                <a className="text-brand-primary small" href={study.url}>
                  view article <i className="bi bi-arrow-up-right" />
                </a>
              </article>
            </div>
          ))}
        </div>
        <div className="gradient-panel rounded-4 p-3 mt-3">
          <strong>todo:</strong> hook the women-focused scraper and mcp/ml ranker to refresh this feed.
        </div>
      </div>
    </section>
  );
};

export default DiagnosticsPanel;
