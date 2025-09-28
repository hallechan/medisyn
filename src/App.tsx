import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import PatientSidebar from './components/PatientSidebar';
import PatientSummary from './components/PatientSummary';
import DiagnosticsPanel from './components/DiagnosticsPanel';
import AppointmentForm from './components/AppointmentForm';
import AddPatientModal from './components/AddPatientModal';
import MedicationModal from './components/MedicationModal';
import AppointmentHistoryModal from './components/AppointmentHistoryModal';
import TimelineEventModal from './components/TimelineEventModal';
import TimelineDetailModal from './components/TimelineDetailModal';
import { patients as seedPatients } from './data/patients';
import type { AppointmentDraft, Medication, TimelineEntry } from './types';

function App() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
  const [patientList, setPatientList] = useState(seedPatients);
  const [activePatientId, setActivePatientId] = useState(seedPatients[0]?.id ?? '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [medicationPatientId, setMedicationPatientId] = useState<string | null>(null);
  const [returnToAppointment, setReturnToAppointment] = useState(false);
  const [draftAppointments, setDraftAppointments] = useState<Record<string, AppointmentDraft>>({});
  const [viewAppointment, setViewAppointment] = useState<{ patientId: string; appointmentId: string } | null>(null);
  const [timelineModalState, setTimelineModalState] = useState<
    { patientId: string; category: TimelineEntry['category'] } | null
  >(null);
  const [viewTimelineEntry, setViewTimelineEntry] = useState<TimelineEntry | null>(null);

  const activePatient = useMemo(
    () => patientList.find((patient) => patient.id === activePatientId) ?? patientList[0],
    [activePatientId, patientList]
  );

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/patients`);
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setPatientList(data);
          setActivePatientId(data[0]?.id ?? '');
        }
      } catch (error) {
        console.warn('Falling back to local seed patients:', error);
        setPatientList(seedPatients);
        setActivePatientId(seedPatients[0]?.id ?? '');
      }
    };

    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (returnToAppointment && !medicationPatientId) {
      setIsAppointmentOpen(true);
      setReturnToAppointment(false);
    }
  }, [returnToAppointment, medicationPatientId]);

  const handleAddPatient = async (newPatient: (typeof seedPatients)[number]) => {
    try {
      const response = await fetch(`${API_BASE}/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient)
      });
      const created = response.ok ? await response.json() : newPatient;
      setPatientList((prev) => [...prev, created]);
      setActivePatientId(created.id);
    } catch (error) {
      console.error('Failed to create patient via API, storing locally', error);
      setPatientList((prev) => [...prev, newPatient]);
      setActivePatientId(newPatient.id);
    } finally {
      setIsAddPatientOpen(false);
      setIsSidebarOpen(false);
    }
  };

  const handleSaveDraftAppointment = (patientId: string, draft: AppointmentDraft) => {
    setDraftAppointments((prev) => ({ ...prev, [patientId]: draft }));
  };

  const handlePublishAppointment = (patientId: string, draft: AppointmentDraft) => {
    const timestamp = Date.now();
    const recordDraft: AppointmentDraft = {
      ...draft,
      diagnosticFocus: [...draft.diagnosticFocus]
    };

    const newHistoryEntry = {
      id: `appt-${timestamp}`,
      date: new Date().toISOString().slice(0, 10),
      summary: draft.appointmentType,
      notes: draft.notes || draft.symptomSummary || 'No additional notes provided.',
      draft: recordDraft
    };

    const monthLabel = new Date().toLocaleString('default', { month: 'short' }).toLowerCase();
    const metadata: Record<string, string> = {};
    if (draft.duration) metadata.duration = draft.duration;
    if (draft.heartbeatBpm != null) metadata.heartbeat = `${draft.heartbeatBpm} bpm`;
    if (draft.weightKg != null) metadata.weight = `${draft.weightKg} kg`;
    if (draft.heightCm != null) metadata.height = `${draft.heightCm} cm`;

    const timelineEntry: TimelineEntry = {
      date: newHistoryEntry.date,
      title: newHistoryEntry.summary,
      description: draft.symptomSummary || newHistoryEntry.notes,
      category: 'appointment',
      appointmentId: newHistoryEntry.id,
      metadata
    };

    const existingPatient = patientList.find((patient) => patient.id === patientId);
    let updatedPatientRecord: typeof existingPatient | undefined;

    if (existingPatient) {
      const updatedMetrics = existingPatient.metrics.map((series) => {
        if (series.id !== 'heart-rate' || draft.heartbeatBpm == null) {
          return series;
        }
        const cappedPoints = [...series.points, { time: monthLabel, value: draft.heartbeatBpm }].slice(-12);
        return { ...series, points: cappedPoints };
      });

      const updatedVitals = draft.heartbeatBpm
        ? existingPatient.vitals.map((vital) =>
            vital.label === 'heart rate'
              ? { ...vital, value: String(draft.heartbeatBpm), status: 'stable' as const }
              : vital
          )
        : existingPatient.vitals;

      const updatedTimeline = [timelineEntry, ...existingPatient.timeline].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      updatedPatientRecord = {
        ...existingPatient,
        metrics: updatedMetrics,
        vitals: updatedVitals,
        appointmentHistory: [newHistoryEntry, ...existingPatient.appointmentHistory],
        timeline: updatedTimeline
      };

      setPatientList((prev) =>
        prev.map((patient) => (patient.id === patientId ? updatedPatientRecord! : patient))
      );

      try {
        await fetch(`${API_BASE}/api/patients/${patientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPatientRecord)
        });
      } catch (error) {
        console.error('Failed to persist appointment publish to API', error);
      }
    }

    setDraftAppointments((prev) => {
      const next = { ...prev };
      delete next[patientId];
      return next;
    });
    setIsAppointmentOpen(false);
  };

  const handleUpdateMedications = (patientId: string, meds: Medication[]) => {
    setPatientList((prev) =>
      prev.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              medications: meds
            }
          : patient
      )
    );
  };

  const handleAddTimelineEntry = (patientId: string, entry: TimelineEntry) => {
    setPatientList((prev) =>
      prev.map((patient) => {
        if (patient.id !== patientId) return patient;
        const timeline = [entry, ...patient.timeline].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return { ...patient, timeline };
      })
    );
    try {
      const patient = patientList.find((p) => p.id === patientId);
      if (patient) {
        await fetch(`${API_BASE}/api/patients/${patientId}/timeline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
      }
    } catch (error) {
      console.error('Failed to persist timeline entry', error);
    }
    setTimelineModalState(null);
  };

  const currentDraft = activePatient ? draftAppointments[activePatient.id] : undefined;

  return (
    <div className="container-xxl py-4 px-3 px-lg-4" style={{ maxWidth: 1440 }}>
      <Header onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div className="d-flex flex-column flex-lg-row gap-4 align-items-start">
        <PatientSidebar
          patients={patientList}
          activePatientId={activePatient?.id ?? ''}
          onSelect={(id) => {
            setActivePatientId(id);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onAddNew={() => setIsAddPatientOpen(true)}
        />
        <main className="flex-grow-1 d-flex flex-column gap-4">
          {activePatient ? (
            <>
              <PatientSummary
                patient={activePatient}
                onStartAppointment={() => setIsAppointmentOpen(true)}
                onViewAppointment={(appointmentId) =>
                  setViewAppointment({ patientId: activePatient.id, appointmentId })
                }
              />
              <DiagnosticsPanel
                patient={activePatient}
                onManageMedications={() => setMedicationPatientId(activePatient.id)}
                onAddTimeline={(category) =>
                  setTimelineModalState({ patientId: activePatient.id, category })
                }
                onViewTimelineItem={(entry) => {
                  if (entry.category === 'appointment' && entry.appointmentId) {
                    setViewAppointment({ patientId: activePatient.id, appointmentId: entry.appointmentId });
                  } else {
                    setViewTimelineEntry(entry);
                  }
                }}
              />
            </>
          ) : (
            <div className="alert alert-light border rounded-4">
              select a patient to view personalised diagnostics.
            </div>
          )}
        </main>
      </div>
      <AppointmentForm
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        patientName={activePatient?.name}
        draft={currentDraft}
        onSaveDraft={(appointmentDraft) => {
          if (!activePatient) return;
          handleSaveDraftAppointment(activePatient.id, appointmentDraft);
        }}
        onPublish={(appointmentDraft) => {
          if (!activePatient) return;
          handlePublishAppointment(activePatient.id, appointmentDraft);
        }}
        onManageMedications={() => {
          if (activePatient) {
            setReturnToAppointment(true);
            setMedicationPatientId(activePatient.id);
          }
        }}
      />
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onAdd={handleAddPatient}
      />
      <MedicationModal
        isOpen={Boolean(medicationPatientId)}
        onClose={() => setMedicationPatientId(null)}
        medications={
          medicationPatientId
            ? patientList.find((patient) => patient.id === medicationPatientId)?.medications ?? []
            : []
        }
        onSave={(meds) => {
          if (medicationPatientId) {
            handleUpdateMedications(medicationPatientId, meds);
            setMedicationPatientId(null);
          }
        }}
      />
      {/* reopen appointment modal after managing meds */}
      <TimelineEventModal
        isOpen={Boolean(timelineModalState)}
        defaultCategory={timelineModalState?.category ?? 'note'}
        onClose={() => setTimelineModalState(null)}
        onAdd={(entry) => {
          if (timelineModalState) {
            handleAddTimelineEntry(timelineModalState.patientId, entry);
          }
        }}
      />
      <AppointmentHistoryModal
        isOpen={Boolean(viewAppointment)}
        onClose={() => setViewAppointment(null)}
        appointment={
          viewAppointment
            ? patientList
                .find((patient) => patient.id === viewAppointment.patientId)
                ?.appointmentHistory.find((appt) => appt.id === viewAppointment.appointmentId)
            : undefined
        }
      />
      <TimelineDetailModal
        isOpen={Boolean(viewTimelineEntry)}
        onClose={() => setViewTimelineEntry(null)}
        entry={viewTimelineEntry ?? undefined}
      />
    </div>
  );
}

export default App;
