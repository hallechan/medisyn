// import { getTemperature } from '../../read_temp';
import { FC, useEffect, useState } from 'react';
import type { AppointmentDraft } from '../types';
import AIDiagnosisResults from './AIDiagnosisResults';
import WebcamStream from './WebcamStream';


interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientAge?: number;
  draft?: AppointmentDraft;
  onSaveDraft: (draft: AppointmentDraft) => void;
  onPublish: (draft: AppointmentDraft) => void;
  onManageMedications?: () => void;
  onTemperatureMeasured?: (temperature: number) => void;
}

const defaultDraft: AppointmentDraft = {
  appointmentType: 'comprehensive consult',
  symptomSummary: '',
  duration: '45 minutes',
  weightKg: undefined,
  heightCm: undefined,
  bloodPressureSystolic: undefined,
  bloodPressureDiastolic: undefined,
  spo2Percent: undefined,
  temperatureC: undefined,
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
  onManageMedications,
  onTemperatureMeasured
}) => {
  const [form, setForm] = useState<AppointmentDraft>(draft ?? defaultDraft);
  const [focusInput, setFocusInput] = useState('');
  const [snapshots, setSnapshots] = useState<
    { emotion: string; redness: number; imageData: string }[]
  >([]);

  const getDurationParts = (value?: string) => {
    if (!value) {
      return { hours: '', minutes: '' };
    }
    const hoursMatch = value.match(/(\d+)\s*(?:h|hour|hours)/i);
    const minutesMatch = value.match(/(\d+)\s*(?:m|min|minute|minutes)/i);
    return {
      hours: hoursMatch ? hoursMatch[1] : '',
      minutes: minutesMatch ? minutesMatch[1] : ''
    };
  };

  const formatDuration = (hoursValue?: number, minutesValue?: number) => {
    const parts: string[] = [];
    if (hoursValue != null && !Number.isNaN(hoursValue)) {
      parts.push(`${hoursValue}h`);
    }
    if (minutesValue != null && !Number.isNaN(minutesValue)) {
      parts.push(`${minutesValue}m`);
    }
    return parts.join(' ');
  };


  // AI Diagnosis states
  const [showAIDiagnosis, setShowAIDiagnosis] = useState(false);
  const [aiDiagnosisData, setAiDiagnosisData] = useState<any>(null);
  const [aiDiagnosisLoading, setAiDiagnosisLoading] = useState(false);
  const [aiDiagnosisError, setAiDiagnosisError] = useState<string | null>(null);

  // Temperature states
  const [temperature, setTemperature] = useState<number | null>(null);
  const [tempLoading, setTempLoading] = useState(false);
  const [showTempWarning, setShowTempWarning] = useState(false);
  const [tempError, setTempError] = useState<string | null>(null);

  const handleTakeTemperature = async () => {
  setShowTempWarning(true);
  setTempLoading(true);
  setTempError(null);
  try {
    const response = await fetch('http://localhost:4002/api/temperature');
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get temperature');
    }
    setTemperature(data.temperature);
    if (onTemperatureMeasured) {
      onTemperatureMeasured(data.temperature);
    }
  } catch (err) {
    setTempError(err instanceof Error ? err.message : "Unknown error");
    setTemperature(null);
  } finally {
    setTempLoading(false);
  }
};

  useEffect(() => {
    if (isOpen) {
      setForm(draft ?? defaultDraft);
      setFocusInput('');
      document.body.style.overflow = 'hidden';
    } else {
      setTemperature(null); // Reset temperature when closing
      setTempError(null);   // Also clear any error
      setShowTempWarning(false); // Hide warning
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, draft]);

  if (!isOpen) return null;

  const updateForm = (patch: Partial<AppointmentDraft>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const addFocus = () => {
    const trimmed = focusInput.trim();
    if (!trimmed || form.diagnosticFocus.includes(trimmed)) return;
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

  const durationParts = getDurationParts(form.duration);

  // snapshot handler receives the **current values from the webcam** directly
  const handleSnapshot = (snapshot: { emotion: string; redness: number; imageData: string }) => {
    setSnapshots((prev) => [...prev, snapshot]);
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


    // setAiDiagnosisLoading(true);
    // setAiDiagnosisError(null);
    // setShowAIDiagnosis(true);

 

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
          {/* Appointment details */}
          <div className="row g-4">
            <div className="col-12 col-lg-9">
              <label className="form-label">appointment type</label>
              <select
                className="form-select rounded-3 token-input"
                value={form.appointmentType}
                onChange={(e) => updateForm({ appointmentType: e.target.value })}
              >
                <option>comprehensive consult</option>
                <option>cycle-aligned follow-up</option>
                <option>medication review</option>
                <option>telehealth check-in</option>
              </select>
            </div>
            <div className="col-12 col-lg-3">
              <label className="form-label">duration</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  min={0}
                  className="form-control rounded-3 token-input flex-grow-1"
                  placeholder="hours"
                  value={durationParts.hours}
                  onChange={(event) => {
                    const hoursValue = event.target.value;
                    const hours = hoursValue === '' ? undefined : Number(hoursValue);
                    if (hours != null && (Number.isNaN(hours) || hours < 0)) return;
                    const minutes = durationParts.minutes === '' ? undefined : Number(durationParts.minutes);
                    const duration = formatDuration(hours, minutes);
                    updateForm({ duration: duration || '' });
                  }}
                />
                <span className="text-muted fw-semibold">/</span>
                <input
                  type="number"
                  min={0}
                  className="form-control rounded-3 token-input flex-grow-1"
                  placeholder="minutes"
                  value={durationParts.minutes}
                  onChange={(event) => {
                    const minutesValue = event.target.value;
                    const minutes = minutesValue === '' ? undefined : Number(minutesValue);
                    if (minutes != null && (Number.isNaN(minutes) || minutes < 0)) return;
                    const hours = durationParts.hours === '' ? undefined : Number(durationParts.hours);
                    const duration = formatDuration(hours, minutes);
                    updateForm({ duration: duration || '' });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-6 col-lg-3">
              <label className="form-label">heartbeat (bpm)</label>
              <input
                type="number"
                className="form-control rounded-3 token-input"
                placeholder="e.g. 82"
                value={form.heartbeatBpm ?? ''}
                onChange={(e) =>
                  updateForm({ heartbeatBpm: Number(e.target.value) || undefined })
                }
              />
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label">blood pressure (mmHg)</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  className="form-control rounded-3 token-input flex-grow-1"
                  placeholder="systolic"
                  value={form.bloodPressureSystolic ?? ''}
                  onChange={(event) =>
                    updateForm({ bloodPressureSystolic: Number(event.target.value) || undefined })
                  }
                />
                <span className="text-muted fw-semibold">/</span>
                <input
                  type="number"
                  className="form-control rounded-3 token-input flex-grow-1"
                  placeholder="diastolic"
                  value={form.bloodPressureDiastolic ?? ''}
                  onChange={(event) =>
                    updateForm({ bloodPressureDiastolic: Number(event.target.value) || undefined })
                  }
                />
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label">spo₂ (%)</label>
              <input
                type="number"
                className="form-control rounded-3 token-input"
                placeholder="e.g. 98"
                value={form.spo2Percent ?? ''}
                onChange={(event) =>
                  updateForm({ spo2Percent: Number(event.target.value) || undefined })
                }
              />
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label">temperature (°c)</label>
              <input
                type="number"
                step="0.1"
                className="form-control rounded-3 token-input"
                placeholder="e.g. 36.8"
                value={form.temperatureC ?? ''}
                onChange={(event) =>
                  updateForm({ temperatureC: Number(event.target.value) || undefined })
                }
              />
            </div>
          </div>

          {/* Symptom overview */}
          <div>
            <label className="form-label">symptom overview</label>
            <textarea
              className="form-control rounded-3 token-input"
              rows={3}
              placeholder="note cycle phase, onset, severity, and triggers."
              value={form.symptomSummary}
              onChange={(e) => updateForm({ symptomSummary: e.target.value })}
            />
          </div>

          {/* Weight / Height */}
          <div className="row g-4">
            <div className="col-6">
              <label className="form-label">weight (kg)</label>
              <input
                type="number"
                className="form-control rounded-3 token-input"
                placeholder="e.g. 68"
                value={form.weightKg ?? ''}
                onChange={(e) =>
                  updateForm({ weightKg: Number(e.target.value) || undefined })
                }
              />
            </div>
            <div className="col-6">
              <label className="form-label">height (cm)</label>
              <input
                type="number"
                className="form-control rounded-3 token-input"
                placeholder="e.g. 172"
                value={form.heightCm ?? ''}
                onChange={(e) =>
                  updateForm({ heightCm: Number(e.target.value) || undefined })
                }
              />
            </div>
          </div>

          {/* Webcam */}
          <div className="gradient-panel rounded-4 p-4 mt-3 text-center">
            <h6>Live Webcam Feed</h6>
            <WebcamStream
              width={600}
              height={500}
              onSnapshot={handleSnapshot} // passes emotion/redness/frame at snapshot
            />
          </div>

          {/* Snapshots */}
          <div className="mt-3">
            <h6>Saved Snapshots</h6>
            {snapshots.length === 0 && <p className="text-muted small">No snapshots yet.</p>}
            <div className="d-flex flex-wrap gap-2">
              {snapshots.map((snap, i) => (
                <div key={i} className="snapshot-card border rounded p-1" style={{ width: 100, textAlign: 'center' }}>
                  <img
                    src={`data:image/jpeg;base64,${snap.imageData}`}
                    alt={`snapshot-${i}`}
                    style={{ width: '100%', borderRadius: 4 }}
                  />
                  <div className="small mt-1">
                    <div>Emotion: {snap.emotion}</div>
                    <div>Redness: {snap.redness.toFixed(1)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="gradient-panel rounded-4 p-4">
            <div className="d-flex gap-3 gap-lg-4 align-items-center">
              <i className="bi bi-heart-pulse fs-4 text-brand-secondary" />
              <div>
                <strong>take temperature</strong>
                <div className="text-muted small">
                  measure skin/body temperature with reliable Arduino integration. please place your finger on the temperature sensor before and while measuring.
                </div>
                <button
                  type="button"
                  className="btn btn-gradient btn-sm mt-2"
                  onClick={handleTakeTemperature}
                  disabled={tempLoading}
                >
                  <i className="bi bi-thermometer-half me-1" /> take temperature
                </button>
                {tempLoading && (
                  <div className="mt-2">
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                    <span>measuring...</span>
                  </div>
                )}
              </div>
                <div className="mt-2">
                  {temperature !== null && (
                    <>
                      <span className="fw-bold">temperature: {temperature.toFixed(2)} °C</span>
                      <br />
                      {(() => {
                        if (temperature >= 19 && temperature <= 36) {
                          return <span style={{ color: 'black' }}>body temperature is healthy.</span>;
                        } else if (temperature < 19) {
                          return <span style={{ color: 'black' }}>body temperature is below normal.</span>;
                        } else {
                          return <span style={{ color: 'black' }}>body temperature is above normal.</span>;
                        }
                      })()}
                    </>
                  )}
                  {tempError && (
                    <span className="text-danger">Error: {tempError}</span>
                  )}
                </div>
              </div>
            </div>

          {/* AI Diagnosis */}
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

          {/* Diagnostic Focus */}
          <div>
            <label className="form-label">add diagnostic focus areas</label>
            <div className="input-group rounded-3 overflow-hidden gradient-panel">
              <input
                className="form-control border-0 bg-transparent text-secondary"
                placeholder="e.g. cardiomyopathy recovery, luteal shift"
                list="focus-suggestions"
                value={focusInput}
                onChange={(e) => setFocusInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFocus();
                  }
                }}
              />
              <button type="button" className="btn btn-gradient" onClick={addFocus}>
                <i className="bi bi-plus-circle me-1" /> add
              </button>
            </div>
            <datalist id="focus-suggestions">
              {FOCUS_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
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
              {form.diagnosticFocus.length === 0 && <span className="text-muted small">no focus areas added yet.</span>}
            </div>
          </div>

          {/* Clinician Notes */}
          <div>
            <label className="form-label">clinician notes</label>
            <textarea
              className="form-control rounded-3 token-input"
              rows={3}
              placeholder="outline labs, imaging, or consults."
              value={form.notes}
              onChange={(e) => updateForm({ notes: e.target.value })}
            />
          </div>

          <div className="d-flex gap-3 justify-content-end mt-3">
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
