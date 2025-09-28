import { FC, useEffect } from 'react';
import { AppointmentRecord } from '../types';

interface AppointmentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: AppointmentRecord;
}

const AppointmentHistoryModal: FC<AppointmentHistoryModalProps> = ({ isOpen, onClose, appointment }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !appointment) {
    return null;
  }

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal-backdrop" onClick={onClose} />
      <div className="appointment-modal-dialog gradient-surface border-0 shadow-lg p-4 p-lg-5 rounded-4" style={{ maxWidth: 640 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="h4 mb-1">{appointment.summary}</h3>
            <p className="text-muted small mb-0">{appointment.date}</p>
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-pill d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close appointment"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="gradient-panel rounded-4 p-3 d-grid gap-2">
          <div>
            <span className="section-title d-block mb-1">symptom overview</span>
            <p className="mb-0 text-muted">{appointment.draft.symptomSummary || 'not provided'}</p>
          </div>
          <div className="d-flex flex-wrap gap-3">
            <div>
              <span className="text-muted small">duration</span>
              <div className="fw-semibold">{appointment.draft.duration}</div>
            </div>
            <div>
              <span className="text-muted small">heartbeat</span>
              <div className="fw-semibold">{appointment.draft.heartbeatBpm ?? '--'} bpm</div>
            </div>
            <div>
              <span className="text-muted small">weight</span>
              <div className="fw-semibold">{appointment.draft.weightKg ?? '--'} kg</div>
            </div>
            <div>
              <span className="text-muted small">height</span>
              <div className="fw-semibold">{appointment.draft.heightCm ?? '--'} cm</div>
            </div>
          </div>
          {appointment.draft.diagnosticFocus.length > 0 && (
            <div>
              <span className="section-title d-block mb-1">focus areas</span>
              <div className="d-flex flex-wrap gap-2">
                {appointment.draft.diagnosticFocus.map((focus) => (
                  <span key={focus} className="status-chip status-chip--on-track text-capitalize">
                    {focus}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="section-title d-block mb-1">clinician notes</span>
            <p className="mb-0 text-muted">{appointment.draft.notes || appointment.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistoryModal;
