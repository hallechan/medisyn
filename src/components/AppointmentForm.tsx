import { FC, useEffect, useState } from 'react';
import type { AppointmentDraft } from '../types';
import AIDiagnosisResults from './AIDiagnosisResults';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientAge?: number;
  draft?: AppointmentDraft;
  onSaveDraft: (draft: AppointmentDraft) => void;
  onPublish: (draft: AppointmentDraft) => void;
  onManageMedications?: () => void;
}

const defaultDraft: AppointmentDraft = {
  appointmentType: 'comprehensive consult',
  symptomSummary: '',
  duration: '45 minutes',
  weightKg: undefined,
  heightCm: undefined,
  notes: '',
  diagnosticFocus: [],
  heartbeatBpm: undefined
};

const FOCUS_SUGGESTIONS = [
  'cardiomyopathy recovery plan',
  'cycle sync adjustment',
  'bone-density support',
  'thyroid modulation review',
  'autonomic reset protocol'
];

const AppointmentForm: FC<AppointmentFormProps> = ({
  isOpen,
  onClose,
  patientName,
  patientAge,
  draft,
  onSaveDraft,
  onPublish,
  onManageMedications
}) => {
  const [form, setForm] = useState<AppointmentDraft>(draft ?? defaultDraft);
  const [focusInput, setFocusInput] = useState('');

  // AI Diagnosis states
  const [showAIDiagnosis, setShowAIDiagnosis] = useState(false);
  const [aiDiagnosisData, setAiDiagnosisData] = useState<any>(null);
  const [aiDiagnosisLoading, setAiDiagnosisLoading] = useState(false);
  const [aiDiagnosisError, setAiDiagnosisError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(draft ?? defaultDraft);
      setFocusInput('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, draft]);

  if (!isOpen) {
    return null;
  }

  const updateForm = (patch: Partial<AppointmentDraft>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const addFocus = () => {
    const trimmed = focusInput.trim();
    if (!trimmed || form.diagnosticFocus.includes(trimmed)) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      diagnosticFocus: [...prev.diagnosticFocus, trimmed]
    }));
    setFocusInput('');
  };

  const removeFocus = (focus: string) => {
    setForm((prev) => ({
      ...prev,
      diagnosticFocus: prev.diagnosticFocus.filter((item) => item !== focus)
    }));
  };

  const handleSaveDraft = () => {
    onSaveDraft(form);
    onClose();
  };

  const handlePublish = () => {
    onPublish(form);
    onClose();
  };

  const handleAIDiagnosis = async () => {
    // Validate that we have symptom summary
    if (!form.symptomSummary || form.symptomSummary.trim() === '') {
      alert('Please enter a symptom summary before requesting AI diagnosis.');
      return;
    }

    setAiDiagnosisLoading(true);
    setAiDiagnosisError(null);
    setShowAIDiagnosis(true);

    try {
      const response = await fetch('http://localhost:4000/api/ai-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptomSummary: form.symptomSummary,
          appointmentType: form.appointmentType,
          weightKg: form.weightKg,
          heightCm: form.heightCm,
          heartbeatBpm: form.heartbeatBpm,
          diagnosticFocus: form.diagnosticFocus,
          notes: form.notes,
          patientAge: patientAge
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get AI diagnosis');
      }

      const data = await response.json();
      setAiDiagnosisData(data);
    } catch (error) {
      console.error('AI diagnosis error:', error);
      setAiDiagnosisError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setAiDiagnosisLoading(false);
    }
  };

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal-backdrop" onClick={onClose} />
      <div className="appointment-modal-dialog gradient-surface border-0 shadow-lg p-4 p-lg-5 rounded-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="h4 mb-1">new appointment</h3>
            {patientName && <p className="text-muted small mb-0">for {patientName}</p>}
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-pill d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close appointment form"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <form
          className="d-grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            handlePublish();
          }}
        >
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <label className="form-label">appointment type</label>
              <select
                className="form-select rounded-3 token-input"
                value={form.appointmentType}
                onChange={(event) => updateForm({ appointmentType: event.target.value })}
              >
                <option>comprehensive consult</option>
                <option>cycle-aligned follow-up</option>
                <option>medication review</option>
                <option>telehealth check-in</option>
              </select>
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label">duration</label>
              <select
                className="form-select rounded-3 token-input"
                value={form.duration}
                onChange={(event) => updateForm({ duration: event.target.value })}
              >
                <option>45 minutes</option>
                <option>30 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label">heartbeat (bpm)</label>
              <input
                type="number"
                className="form-control rounded-3 token-input"
                placeholder="e.g. 82"
                value={form.heartbeatBpm ?? ''}
                onChange={(event) =>
                  updateForm({ heartbeatBpm: Number(event.target.value) || undefined })
                }
              />
            </div>
          </div>
          <div>
            <label className="form-label">symptom overview</label>
            <textarea
              className="form-control rounded-3 token-input"
              rows={3}
              placeholder="note cycle phase, onset, severity, and triggers."
              value={form.symptomSummary}
              onChange={(event) => updateForm({ symptomSummary: event.target.value })}
            />
          </div>
          <div className="row g-4">
            <div className="col-6">
              <label className="form-label">weight (kg)</label>
              <input
                type="number"
                className="form-control rounded-3 token-input"
                placeholder="e.g. 68"
                value={form.weightKg ?? ''}
                onChange={(event) => updateForm({ weightKg: Number(event.target.value) || undefined })}
              />
            </div>
            <div className="col-6">
              <label className="form-label">height (cm)</label>
              <input
                type="number"
                className="form-control rounded-3 token-input"
                placeholder="e.g. 172"
                value={form.heightCm ?? ''}
                onChange={(event) => updateForm({ heightCm: Number(event.target.value) || undefined })}
              />
            </div>
          </div>
          <div className="gradient-panel rounded-4 p-4">
            <div className="d-flex gap-3 gap-lg-4">
              <i className="bi bi-heart-pulse fs-4 text-brand-secondary" />
              <div>
                <strong>todo:</strong> stream device heartbeat feed and auto-update charts.
                <div className="text-muted small">placeholder for Arduino integration + arrhythmia inference.</div>
              </div>
            </div>
          </div>
          <div className="gradient-panel rounded-4 p-4">
            <div className="d-flex gap-3 gap-lg-4 align-items-start">
              <i className="bi bi-capsule fs-4 text-brand-secondary" />
              <div className="d-flex flex-column flex-grow-1 gap-2">
                <div>
                  <strong>manage medications</strong>
                  <div className="text-muted small">add prescriptions, refills, or discontinue therapy directly from this appointment.</div>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-gradient btn-sm" onClick={onManageMedications}>
                    <i className="bi bi-plus-circle me-1" /> add
                  </button>
                  <button type="button" className="btn btn-gradient btn-sm" onClick={onManageMedications}>
                    <i className="bi bi-arrow-repeat me-1" /> refill
                  </button>
                  <button type="button" className="btn btn-gradient btn-sm" onClick={onManageMedications}>
                    <i className="bi bi-x-circle me-1" /> discontinue
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="gradient-panel rounded-4 p-4">
            <div className="d-flex gap-3 gap-lg-4">
              <i className="bi bi-camera-video fs-4 text-brand-secondary" />
              <div>
                <strong>todo:</strong> launch cv intake for skin, edema, and posture checks.
                <div className="text-muted small">route uploads to the cv microservice for multi-angle review.</div>
              </div>
            </div>
          </div>
          <div className="gradient-panel rounded-4 p-4">
            <div className="d-flex gap-3 gap-lg-4 align-items-start">
              <i className="bi bi-robot fs-4 text-brand-secondary" />
              <div className="d-flex flex-column flex-grow-1 gap-2">
                <div>
                  <strong>AI-assisted diagnosis</strong>
                  <div className="text-muted small">
                    get evidence-based diagnostic suggestions powered by Gemini AI and PubMed research.
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-gradient btn-sm"
                    onClick={handleAIDiagnosis}
                    disabled={!form.symptomSummary || form.symptomSummary.trim() === '' || aiDiagnosisLoading}
                  >
                    {aiDiagnosisLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                        analyzing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-brain me-1" /> get AI diagnosis
                      </>
                    )}
                  </button>
                  {form.symptomSummary && form.symptomSummary.trim() === '' && (
                    <span className="text-muted small align-self-center">
                      enter symptoms first
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="form-label">add diagnostic focus areas</label>
            <div className="input-group rounded-3 overflow-hidden gradient-panel">
              <input
                className="form-control border-0 bg-transparent text-secondary"
                placeholder="e.g. cardiomyopathy recovery, luteal shift"
                list="focus-suggestions"
                value={focusInput}
                onChange={(event) => setFocusInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addFocus();
                  }
                }}
              />
              <button type="button" className="btn btn-gradient" onClick={addFocus}>
                <i className="bi bi-plus-circle me-1" /> add
              </button>
            </div>
            <datalist id="focus-suggestions">
              {FOCUS_SUGGESTIONS.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
            <div className="d-flex flex-wrap gap-3 mt-3">
              {form.diagnosticFocus.map((focus) => (
                <span key={focus} className="badge bg-brand-secondary text-white d-flex align-items-center gap-2">
                  {focus}
                  <button
                    type="button"
                    className="btn-close btn-close-white btn-sm"
                    aria-label={`remove ${focus}`}
                    onClick={() => removeFocus(focus)}
                  />
                </span>
              ))}
              {form.diagnosticFocus.length === 0 && (
                <span className="text-muted small">no focus areas added yet.</span>
              )}
            </div>
          </div>
          <div>
            <label className="form-label">clinician notes</label>
            <textarea
              className="form-control rounded-3 token-input"
              rows={3}
              placeholder="outline labs, imaging, or consults."
              value={form.notes}
              onChange={(event) => updateForm({ notes: event.target.value })}
            />
          </div>
          <div className="d-flex gap-3 justify-content-end">
            <button type="button" className="btn gradient-ghost text-brand-secondary border-0" onClick={handleSaveDraft}>
              save draft
            </button>
            <button type="submit" className="btn btn-gradient">
              publish
            </button>
          </div>
        </form>
      </div>

      {/* AI Diagnosis Results Modal */}
      <AIDiagnosisResults
        isOpen={showAIDiagnosis}
        onClose={() => {
          setShowAIDiagnosis(false);
          setAiDiagnosisData(null);
          setAiDiagnosisError(null);
        }}
        diagnosisData={aiDiagnosisData}
        isLoading={aiDiagnosisLoading}
        error={aiDiagnosisError}
      />
    </div>
  );
};

export default AppointmentForm;
