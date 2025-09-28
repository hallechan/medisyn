import { FC, useEffect } from 'react';
import { TimelineEntry } from '../types';

interface TimelineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: TimelineEntry;
}

const TimelineDetailModal: FC<TimelineDetailModalProps> = ({ isOpen, onClose, entry }) => {
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

  if (!isOpen || !entry) {
    return null;
  }

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal-backdrop" onClick={onClose} />
      <div className="appointment-modal-dialog gradient-surface border-0 shadow-lg p-4 p-lg-5 rounded-4" style={{ maxWidth: 520 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="h5 mb-1 text-capitalize">{entry.category}</h3>
            <p className="text-muted small mb-0">{entry.date}</p>
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-pill d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close timeline entry"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="gradient-panel rounded-4 p-3 d-grid gap-2">
          <div>
            <span className="section-title d-block mb-1">title</span>
            <p className="mb-0 fw-semibold">{entry.title}</p>
          </div>
          <div>
            <span className="section-title d-block mb-1">details</span>
            <p className="mb-0 text-muted">{entry.description}</p>
          </div>
          {entry.metadata && Object.keys(entry.metadata).length > 0 && (
            <div className="d-flex flex-wrap gap-3">
              {Object.entries(entry.metadata).map(([key, value]) => (
                <div key={key}>
                  <span className="text-muted small text-capitalize">{key}</span>
                  <div className="fw-semibold">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineDetailModal;
