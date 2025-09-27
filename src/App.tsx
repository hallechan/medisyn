import { useMemo, useState } from 'react';
import Header from './components/Header';
import PatientSidebar from './components/PatientSidebar';
import PatientSummary from './components/PatientSummary';
import DiagnosticsPanel from './components/DiagnosticsPanel';
import AppointmentForm from './components/AppointmentForm';
import { patients } from './data/patients';

function App() {
  const [activePatientId, setActivePatientId] = useState(patients[0]?.id ?? '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activePatient = useMemo(
    () => patients.find((patient) => patient.id === activePatientId) ?? patients[0],
    [activePatientId]
  );

  return (
    <div className="container-fluid py-4 px-3 px-lg-4" style={{ maxWidth: 1440 }}>
      <Header onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div className="d-flex flex-column flex-lg-row gap-4">
        <PatientSidebar
          patients={patients}
          activePatientId={activePatient?.id ?? ''}
          onSelect={(id) => {
            setActivePatientId(id);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
        />
        <main className="flex-grow-1 d-flex flex-column gap-4">
          {activePatient ? (
            <>
              <PatientSummary patient={activePatient} />
              <div className="row g-4">
                <div className="col-12 col-xxl-7 d-flex flex-column gap-4">
                  <DiagnosticsPanel patient={activePatient} />
                </div>
                <div className="col-12 col-xxl-5">
                  <AppointmentForm />
                </div>
              </div>
            </>
          ) : (
            <div className="alert alert-light border rounded-4">
              Select a patient to view personalised diagnostics.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
