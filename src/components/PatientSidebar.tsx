import { FC, useMemo, useState } from 'react';
import { PatientRecord } from '../types';

interface PatientSidebarProps {
  patients: PatientRecord[];
  activePatientId: string;
  onSelect: (patientId: string) => void;
  isOpen: boolean;
  onAddNew: () => void;
}

const PatientSidebar: FC<PatientSidebarProps> = ({ patients, activePatientId, onSelect, isOpen, onAddNew }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return patients.filter((patient) => {
      const haystack = `${patient.name} ${patient.conditions.join(' ')} ${patient.specialty}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [patients, search]);

  return (
    <aside
      className={`gradient-surface rounded-4 shadow-sm p-3 p-lg-4 h-100 d-flex flex-column gap-3 transition ${
        isOpen ? 'd-block' : 'd-none d-lg-flex'
      }`}
      style={{ minWidth: 200, maxWidth: 240 }}
    >
      <button
        type="button"
        className="btn btn-gradient w-100 rounded-pill fw-semibold"
        onClick={onAddNew}
      >
        <i className="bi bi-person-plus me-2" /> add patient
      </button>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="h6 text-muted mb-0">patients</h2>
        <span className="badge text-black">{patients.length} total</span>
      </div>
      <div className="input-group rounded-pill gradient-panel border-0">
        <span className="input-group-text border-0 bg-transparent">
          <i className="bi bi-search text-brand-secondary" />
        </span>
        <input
          type="search"
          className="form-control border-0 bg-transparent text-secondary"
          placeholder="search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="overflow-auto pe-1" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {filtered.map((patient) => {
          const isActive = patient.id === activePatientId;
          return (
            <button
              key={patient.id}
              type="button"
              onClick={() => onSelect(patient.id)}
              className={`w-100 text-start btn rounded-4 mb-3 p-3 border-0 fw-semibold ${
                isActive ? 'gradient-panel shadow-sm' : 'gradient-ghost'
              }`}
            >
              <span className="text-truncate d-block">{patient.name}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center text-muted py-5">
            <i className="bi bi-person-exclamation fs-2 d-block mb-2 text-brand-secondary" />
            <p className="mb-0">no patients match your search yet.</p>
          </div>
        )}
      </div>
      <div className="mt-auto" />
    </aside>
  );
};

export default PatientSidebar;
