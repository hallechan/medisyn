import { FC, useEffect, useState } from 'react';
import { TimelineEntry } from '../types';

interface TimelineEventModalProps {
  isOpen: boolean;
  defaultCategory: TimelineEntry['category'];
  onClose: () => void;
  onAdd: (entry: TimelineEntry) => void;
}

const TimelineEventModal: FC<TimelineEventModalProps> = ({ isOpen, onClose, onAdd, defaultCategory }) => {
  const [form, setForm] = useState<{ date: string; title: string; description: string; category: TimelineEntry['category'] }>(
    { date: '', title: '', description: '', category: defaultCategory }
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm({ date: '', title: '', description: '', category: defaultCategory });
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, defaultCategory]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.date || !form.title.trim()) {
      setError('date and title are required');
      return;
    }
    const newEntry: TimelineEntry = {
      date: form.date,
      title: form.title.trim(),
      description: form.description.trim() || 'No additional details provided.',
      category: form.category
    };
    onAdd(newEntry);
    onClose();
  };

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal-backdrop" onClick={onClose} />
      <div className="appointment-modal-dialog gradient-surface border-0 shadow-lg p-4 p-lg-5 rounded-4" style={{ maxWidth: 520 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="h4 mb-0">add timeline entry</h3>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-pill d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close timeline modal"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <form className="d-grid gap-3" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label">date</label>
              <input
                type="date"
                className="form-control token-input"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              />
            </div>
            <div className="col-12 col-md-8">
              <label className="form-label">title</label>
              <input
                className="form-control token-input"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="form-label">category</label>
            <select
              className="form-select token-input"
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category: event.target.value as TimelineEntry['category'] }))
              }
            >
              <option value="appointment">appointment</option>
              <option value="lab">lab</option>
              <option value="imaging">imaging</option>
              <option value="medication">medication</option>
              <option value="note">note</option>
            </select>
          </div>
          <div>
            <label className="form-label">details</label>
            <textarea
              className="form-control token-input"
              rows={3}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>
          {error && <div className="text-danger small">{error}</div>}
          <div className="d-flex justify-content-end gap-3">
            <button type="button" className="btn gradient-ghost text-brand-secondary border-0" onClick={onClose}>
              cancel
            </button>
            <button type="submit" className="btn btn-gradient">
              add entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimelineEventModal;
