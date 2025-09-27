import { FC, useState } from 'react';
import type { AppointmentDraft } from '../types';

interface AppointmentFormProps {
  onDraftChange?: (draft: AppointmentDraft) => void;
}

const defaultDraft: AppointmentDraft = {
  appointmentType: 'Comprehensive consult',
  symptomSummary: '',
  duration: '45 minutes',
  weightKg: undefined,
  heightCm: undefined,
  notes: '',
  diagnosticFocus: []
};

const AppointmentForm: FC<AppointmentFormProps> = ({ onDraftChange }) => {
  const [draft, setDraft] = useState<AppointmentDraft>(defaultDraft);
  const [newFocus, setNewFocus] = useState('');

  const updateDraft = (patch: Partial<AppointmentDraft>) => {
    const updated = { ...draft, ...patch };
    setDraft(updated);
    onDraftChange?.(updated);
  };

  const addFocus = () => {
    const trimmed = newFocus.trim();
    if (!trimmed || draft.diagnosticFocus.includes(trimmed)) {
      return;
    }
    const updated = { ...draft, diagnosticFocus: [...draft.diagnosticFocus, trimmed] };
    setDraft(updated);
    setNewFocus('');
    onDraftChange?.(updated);
  };

  const removeFocus = (focus: string) => {
    const updated = {
      ...draft,
      diagnosticFocus: draft.diagnosticFocus.filter((item) => item !== focus)
    };
    setDraft(updated);
    onDraftChange?.(updated);
  };

  return (
    <section className="bg-white rounded-4 shadow-sm p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="h5 mb-0">Start new appointment</h3>
        <span className="badge bg-brand-primary text-white">Draft</span>
      </div>
      <p className="text-muted small">
        Capture patient-reported symptoms, connect hardware inputs, and prep ML-driven diagnostics.
        Backend integrations are marked as TODO for the next iteration.
      </p>
      <form className="d-grid gap-3">
        <div>
          <label className="form-label">Appointment type</label>
          <select
            className="form-select rounded-3"
            value={draft.appointmentType}
            onChange={(event) => updateDraft({ appointmentType: event.target.value })}
          >
            <option>Comprehensive consult</option>
            <option>Cycle-aligned follow-up</option>
            <option>Medication review</option>
            <option>Telehealth check-in</option>
          </select>
        </div>
        <div>
          <label className="form-label">Symptom overview</label>
          <textarea
            className="form-control rounded-3"
            rows={3}
            placeholder="Document phase of cycle, onset, severity, triggers, and context."
            value={draft.symptomSummary}
            onChange={(event) => updateDraft({ symptomSummary: event.target.value })}
          />
        </div>
        <div className="row g-3">
          <div className="col-6">
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              className="form-control rounded-3"
              placeholder="e.g. 68"
              value={draft.weightKg ?? ''}
              onChange={(event) => updateDraft({ weightKg: Number(event.target.value) || undefined })}
            />
          </div>
          <div className="col-6">
            <label className="form-label">Height (cm)</label>
            <input
              type="number"
              className="form-control rounded-3"
              placeholder="e.g. 172"
              value={draft.heightCm ?? ''}
              onChange={(event) => updateDraft({ heightCm: Number(event.target.value) || undefined })}
            />
          </div>
        </div>
        <div className="alert gradient-panel rounded-4">
          <div className="d-flex gap-3">
            <i className="bi bi-heart-pulse fs-4 text-brand-secondary" />
            <div>
              <strong>TODO:</strong> Stream Arduino heartbeat telemetry and auto-attach to this appointment.
              <div className="text-muted small">
                Reserve endpoint for serial ingestion + anomaly detection inference.
              </div>
            </div>
          </div>
        </div>
        <div className="alert gradient-panel rounded-4">
          <div className="d-flex gap-3">
            <i className="bi bi-camera-video fs-4 text-brand-secondary" />
            <div>
              <strong>TODO:</strong> Launch computer vision intake to capture skin tone, edema, and posture cues.
              <div className="text-muted small">
                Reserve secure upload bucket + call CV microservice for multi-angle assessments.
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="form-label">Add diagnostic focus areas</label>
          <div className="input-group rounded-3 overflow-hidden">
            <input
              className="form-control border-0"
              placeholder="e.g. Cardiomyopathy recovery, Luteal phase metabolic shift"
              value={newFocus}
              onChange={(event) => setNewFocus(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addFocus();
                }
              }}
            />
            <button type="button" className="btn bg-brand-secondary text-white" onClick={addFocus}>
              <i className="bi bi-plus-circle me-1" /> Add
            </button>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {draft.diagnosticFocus.map((focus) => (
              <span key={focus} className="badge bg-brand-secondary text-white d-flex align-items-center gap-2">
                {focus}
                <button
                  type="button"
                  className="btn-close btn-close-white btn-sm"
                  aria-label={`Remove ${focus}`}
                  onClick={() => removeFocus(focus)}
                />
              </span>
            ))}
            {draft.diagnosticFocus.length === 0 && (
              <span className="text-muted small">No focus areas added yet.</span>
            )}
          </div>
        </div>
        <div>
          <label className="form-label">Clinician notes</label>
          <textarea
            className="form-control rounded-3"
            rows={3}
            placeholder="Outline recommended labs, imaging, or consultations."
            value={draft.notes}
            onChange={(event) => updateDraft({ notes: event.target.value })}
          />
        </div>
        <div className="alert alert-info rounded-4 border-0">
          <div className="d-flex gap-3 align-items-start">
            <i className="bi bi-journal-text text-brand-secondary fs-4" />
            <div>
              <strong>TODO:</strong> Persist this draft to the care plan service and notify collaborating clinicians.
              <div className="text-muted small">
                Requires auth token exchange + role-based routing rules.
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3">
          <button type="button" className="btn bg-brand-secondary text-white rounded-pill px-4">
            Save draft
          </button>
          <button type="button" className="btn btn-outline-secondary rounded-pill px-4">
            Share with team
          </button>
        </div>
      </form>
    </section>
  );
};

export default AppointmentForm;
