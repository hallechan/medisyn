import { FC } from 'react';
import { PatientRecord } from '../types';

interface DiagnosticsPanelProps {
  patient: PatientRecord;
}

const categoryIcon: Record<PatientRecord['timeline'][number]['category'], string> = {
  Appointment: 'bi-calendar-heart',
  Lab: 'bi-droplet-half',
  Imaging: 'bi-activity',
  Note: 'bi-chat-left-text'
};

const DiagnosticsPanel: FC<DiagnosticsPanelProps> = ({ patient }) => {
  return (
    <section className="bg-white rounded-4 shadow-sm p-4 card-shadow h-100">
      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <h3 className="h6 text-uppercase text-muted mb-3">Timeline</h3>
          <div className="d-flex flex-column gap-3">
            {patient.timeline.map((event) => (
              <div key={`${event.date}-${event.title}`} className="border rounded-4 p-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle bg-brand-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                    <i className={`bi ${categoryIcon[event.category]} fs-5`} />
                  </div>
                  <div>
                    <div className="d-flex flex-wrap justify-content-between gap-2">
                      <div>
                        <h4 className="h6 mb-1">{event.title}</h4>
                        <small className="text-muted">{event.date}</small>
                      </div>
                      <span className="badge bg-brand-primary text-white align-self-start">{event.category}</span>
                    </div>
                    <p className="mb-0 text-muted mt-2">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-xl-6 d-flex flex-column gap-4">
          <div>
            <h3 className="h6 text-uppercase text-muted mb-3">Next steps</h3>
            <ul className="list-unstyled d-grid gap-2 mb-0">
              {patient.nextSteps.map((step) => (
                <li key={step} className="d-flex gap-3 align-items-start">
                  <i className="bi bi-arrow-right-circle text-brand-secondary mt-1" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="h6 text-uppercase text-muted mb-3">Medications</h3>
            <div className="d-grid gap-3">
              {patient.medications.map((med) => (
                <div key={med.name} className="border rounded-4 p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4 className="h6 mb-1">{med.name}</h4>
                      <small className="text-muted">{med.dosage} · {med.schedule}</small>
                    </div>
                    <span className="badge bg-brand-secondary text-white">{med.adherence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="h6 text-uppercase text-muted mb-3">Clinical reminders</h3>
            <div className="d-flex flex-wrap gap-2">
              {patient.clinicalReminders.map((reminder) => (
                <span key={reminder} className="badge bg-light text-brand-secondary border border-brand-secondary rounded-pill">
                  {reminder}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div>
        <h3 className="h6 text-uppercase text-muted mb-3">Research feed</h3>
        <div className="row g-3">
          {patient.research.map((study) => (
            <div key={study.title} className="col-12 col-lg-6">
              <article className="border rounded-4 p-3 h-100 gradient-panel">
                <div className="d-flex justify-content-between gap-2 align-items-start mb-2">
                  <h4 className="h6 mb-0 text-brand-secondary">{study.title}</h4>
                  <span className="badge bg-white text-brand-secondary border">{study.source}</span>
                </div>
                <p className="text-muted small">{study.summary}</p>
                <a className="text-brand-primary small" href={study.url}>
                  View article <i className="bi bi-arrow-up-right" />
                </a>
              </article>
            </div>
          ))}
        </div>
        <div className="alert alert-warning rounded-4 border-0 mt-3">
          <strong>TODO:</strong> Connect women-centred research scraper + MCP/ML ranking pipeline to refresh this feed automatically.
        </div>
      </div>
    </section>
  );
};

export default DiagnosticsPanel;
