import { FC, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { PatientRecord } from '../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (patient: PatientRecord) => void;
}

interface FormState {
  name: string;
  specialty: string;
  conditions: string[];
  lastVisit: string;
  dob: string;
  pronouns: string;
  avatar: string;
}

const defaultForm: FormState = {
  name: '',
  specialty: '',
  conditions: [],
  lastVisit: '',
  dob: '',
  pronouns: 'she/her',
  avatar: ''
};

const CONDITION_OPTIONS = [
  'hypertension',
  'autonomic imbalance',
  'metabolic dysregulation',
  'insulin resistance',
  'postural tachycardia',
  'bone density risk',
  'autoimmune thyroiditis',
  'chronic fatigue'
];

const SPECIALTY_OPTIONS = [
  'cardiology',
  'endocrinology',
  'integrative medicine',
  'immunology',
  'neurology'
];

const AddPatientModal: FC<AddPatientModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConditions, setShowConditions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(defaultForm);
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const toggleCondition = (condition: string) => {
    setForm((prev) => {
      const exists = prev.conditions.includes(condition);
      const conditions = exists
        ? prev.conditions.filter((item) => item !== condition)
        : [...prev.conditions, condition];
      return { ...prev, conditions };
    });
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setForm((prev) => ({ ...prev, avatar: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Required';
    if (!form.specialty.trim()) nextErrors.specialty = 'Required';
    if (form.conditions.length === 0) nextErrors.conditions = 'Select at least one';
    if (!form.lastVisit.trim()) nextErrors.lastVisit = 'Required';
    if (!form.dob.trim()) nextErrors.dob = 'Required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const timestamp = Date.now().toString();
    const birthDate = new Date(form.dob);
    const today = new Date();
    const age = Number.isNaN(birthDate.getTime())
      ? 0
      : today.getFullYear() - birthDate.getFullYear() -
        (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

    const newPatient: PatientRecord = {
      id: `patient-${timestamp}`,
      name: form.name.trim(),
      age,
      pronouns: form.pronouns.trim() || 'she/her',
      avatar: form.avatar || '/medisyn-logo.svg',
      conditions: form.conditions,
      lastVisit: form.lastVisit.trim(),
      specialty: form.specialty.trim(),
      notes: '',
      vitals: [
        { label: 'blood pressure', value: '--/--', status: 'unknown' },
        { label: 'heart rate', value: '--', unit: 'bpm', status: 'unknown' },
        { label: 'spo₂', value: '--', unit: '%', status: 'unknown' },
        { label: 'temperature', value: '--', unit: '°c', status: 'unknown' }
      ],
      timeline: [],
      medications: [],
      research: [],
      riskScore: 0,
      metrics: [
        {
          id: 'heart-rate',
          name: 'heart rate',
          unit: 'bpm',
          points: Array.from({ length: 12 }, (_, index) => {
            const month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][index];
            return { time: month, value: 80 };
          })
        }
      ],
      appointmentHistory: []
    };

    onAdd(newPatient);
  };

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal-backdrop" onClick={onClose} />
      <div className="appointment-modal-dialog gradient-surface border-0 shadow-lg p-4 p-lg-5 rounded-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="h4 mb-0">add new patient</h3>
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-pill d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close add patient"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <form className="d-grid gap-3" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">full name</label>
              <input
                className="form-control token-input"
                value={form.name}
                onChange={handleChange('name')}
              />
              {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">date of birth</label>
              <input
                type="date"
                className="form-control token-input"
                value={form.dob}
                onChange={handleChange('dob')}
              />
              {errors.dob && <div className="text-danger small mt-1">{errors.dob}</div>}
            </div>
          </div>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">specialty</label>
              <select
                className="form-select token-input"
                value={form.specialty}
                onChange={handleChange('specialty')}
              >
                <option value="" disabled>
                  select specialty
                </option>
                {SPECIALTY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.specialty && <div className="text-danger small mt-1">{errors.specialty}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label d-flex justify-content-between align-items-center">
                <span>select conditions</span>
                <button
                  type="button"
                  className="btn btn-sm btn-light border-0"
                  onClick={() => setShowConditions((open) => !open)}
                >
                  {showConditions ? 'hide' : 'choose'}
                </button>
              </label>
              <div className="position-relative">
                <div
                  className="form-control token-input"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowConditions((open) => !open)}
                >
                  {form.conditions.length > 0 ? form.conditions.join(', ') : 'Select one or more conditions'}
                </div>
                {showConditions && (
                  <div className="gradient-panel rounded-4 p-3 mt-2" style={{ maxHeight: 180, overflowY: 'auto' }}>
                    {CONDITION_OPTIONS.map((condition) => (
                      <label key={condition} className="d-flex align-items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={form.conditions.includes(condition)}
                          onChange={() => toggleCondition(condition)}
                        />
                        <span className="small">{condition}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {errors.conditions && <div className="text-danger small mt-1">{errors.conditions}</div>}
            </div>
          </div>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">last visit</label>
              <input
                type="date"
                className="form-control token-input"
                value={form.lastVisit}
                onChange={handleChange('lastVisit')}
              />
              {errors.lastVisit && <div className="text-danger small mt-1">{errors.lastVisit}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">upload photo</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="form-control token-input"
                onChange={handleAvatarUpload}
              />
            </div>
          </div>
          <div className="d-flex gap-3 justify-content-end">
            <button type="button" className="btn gradient-ghost text-brand-secondary border-0" onClick={onClose}>
              cancel
            </button>
            <button type="submit" className="btn btn-gradient">
              add patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
