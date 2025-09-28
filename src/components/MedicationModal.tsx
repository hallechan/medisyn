import { FC, useEffect, useState } from 'react';
import { Medication } from '../types';
import { resolveMedicationIcon } from '../utils/resolveMedicationIcon';

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  onSave: (medications: Medication[]) => void;
}

const adherenceOptions: Medication['adherence'][] = ['on track', 'needs review', 'paused'];
const typeOptions: NonNullable<Medication['type']>[] = ['pill', 'bottle', 'spray', 'cream', 'injection'];

const MedicationModal: FC<MedicationModalProps> = ({ isOpen, onClose, medications, onSave }) => {
  const [draft, setDraft] = useState<Medication[]>(medications);

  useEffect(() => {
    if (isOpen) {
      setDraft(medications);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, medications]);

  if (!isOpen) {
    return null;
  }

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    setDraft((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === 'adherence'
          ? (value as Medication['adherence'])
          : field === 'type'
          ? (value as Medication['type'])
          : value
      };
      return next;
    });
  };

  const addMedication = () => {
    setDraft((prev) => [
      ...prev,
      { name: '', dosage: '', schedule: '', adherence: 'on track', type: 'pill' }
    ]);
  };

  const removeMedication = (index: number) => {
    setDraft((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    const cleaned = draft.filter((med) => med.name.trim());
    onSave(cleaned);
    onClose();
  };

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal-backdrop" onClick={onClose} />
      <div className="appointment-modal-dialog gradient-surface border-0 shadow-lg p-4 p-lg-5 rounded-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="h4 mb-0">manage medications</h3>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-pill d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close medications"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="d-grid gap-3">
          {draft.map((med, index) => (
            <div key={index} className="gradient-panel rounded-4 p-3">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-2 text-center">
                  <img src={resolveMedicationIcon(med)} alt="preview" className="med-icon" />
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label">medication</label>
                  <input
                    className="form-control token-input"
                    value={med.name}
                    onChange={(event) => updateMedication(index, 'name', event.target.value)}
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label">dosage</label>
                  <input
                    className="form-control token-input"
                    value={med.dosage}
                    onChange={(event) => updateMedication(index, 'dosage', event.target.value)}
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label">schedule</label>
                  <input
                    className="form-control token-input"
                    value={med.schedule}
                    onChange={(event) => updateMedication(index, 'schedule', event.target.value)}
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label">type</label>
                  <select
                    className="form-select token-input"
                    value={med.type ?? 'pill'}
                    onChange={(event) => updateMedication(index, 'type', event.target.value)}
                  >
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label">adherence</label>
                  <select
                    className="form-select token-input"
                    value={med.adherence}
                    onChange={(event) => updateMedication(index, 'adherence', event.target.value)}
                  >
                    {adherenceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 text-end">
                  <button
                    type="button"
                    className="btn btn-gradient btn-sm rounded-circle text-white d-inline-flex align-items-center justify-content-center"
                    style={{ width: 32, height: 32 }}
                    onClick={() => removeMedication(index)}
                    aria-label={`Remove ${med.name || 'medication'}`}
                  >
                    <i className="bi bi-x" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-gradient" onClick={addMedication}>
            <i className="bi bi-plus-circle me-2" /> add medication
          </button>
          <div className="d-flex justify-content-end gap-3">
            <button type="button" className="btn gradient-ghost text-brand-secondary border-0" onClick={onClose}>
              cancel
            </button>
            <button type="button" className="btn btn-gradient" onClick={handleSave}>
              save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationModal;
