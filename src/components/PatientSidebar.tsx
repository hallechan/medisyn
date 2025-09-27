import { FC, useMemo, useState } from 'react';
import { PatientRecord } from '../types';

interface PatientSidebarProps {
  patients: PatientRecord[];
  activePatientId: string;
  onSelect: (patientId: string) => void;
  isOpen: boolean;
}

const PatientSidebar: FC<PatientSidebarProps> = ({ patients, activePatientId, onSelect, isOpen }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return patients.filter((patient) => {
      const haystack = `${patient.name} ${patient.conditions.join(' ')} ${patient.specialty}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [patients, search]);

  return (
    <aside
      className={`bg-white rounded-4 shadow-sm p-3 p-lg-4 h-100 d-flex flex-column gap-3 transition ${
        isOpen ? 'd-block' : 'd-none d-lg-flex'
      }`}
      style={{ minWidth: 280, maxWidth: 340 }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="h6 text-uppercase text-muted mb-0">Patients</h2>
        <span className="badge bg-brand-primary text-white">{patients.length}</span>
      </div>
      <div className="input-group rounded-pill bg-light border-0">
        <span className="input-group-text border-0 bg-transparent">
          <i className="bi bi-search text-brand-secondary" />
        </span>
        <input
          type="search"
          className="form-control border-0 bg-transparent"
          placeholder="Search by name or condition"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {filtered.map((patient) => {
          const isActive = patient.id === activePatientId;
          return (
            <button
              key={patient.id}
              type="button"
              onClick={() => onSelect(patient.id)}
              className={`w-100 text-start btn rounded-4 mb-3 p-3 border-0 ${
                isActive ? 'gradient-panel shadow-sm' : 'btn-light'
              }`}
            >
              <div className="d-flex align-items-center gap-3">
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="rounded-circle"
                  width={48}
                  height={48}
                />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-semibold">{patient.name}</span>
                    <span className="badge bg-brand-secondary text-white">{patient.specialty}</span>
                  </div>
                  <small className="text-muted d-block">{patient.conditions.slice(0, 2).join(', ')}</small>
                  <small className="text-muted">Last visit: {patient.lastVisit}</small>
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center text-muted py-5">
            <i className="bi bi-person-exclamation fs-2 d-block mb-2 text-brand-secondary" />
            <p className="mb-0">No patients match your search yet.</p>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <button type="button" className="btn btn-outline-secondary w-100 rounded-pill">
          <i className="bi bi-person-plus me-2" /> Add new patient
        </button>
      </div>
    </aside>
  );
};

export default PatientSidebar;
