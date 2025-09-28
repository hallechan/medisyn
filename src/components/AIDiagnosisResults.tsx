import { FC } from 'react';

interface DiagnosisEntry {
  condition: string;
  certainty_score?: number;
  confidence_level?: string;
  supporting_evidence?: string[];
  research_articles_count?: number;
  key_findings?: string[];
  medication_recommendations?: string[];
}

interface DiagnosisPayload {
  success?: boolean;
  symptom_analysis?: string;
  diagnoses?: DiagnosisEntry[];
  generated_at?: string;
  ai_model?: string;
}

interface AIDiagnosisResultsProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosisData: DiagnosisPayload | null;
  isLoading: boolean;
  error: string | null;
}

const AIDiagnosisResults: FC<AIDiagnosisResultsProps> = ({ isOpen, onClose, diagnosisData, isLoading, error }) => {
  if (!isOpen) return null;

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal-backdrop" onClick={onClose} />
      <div className="appointment-modal-dialog gradient-surface border-0 shadow-lg p-4 p-lg-5 rounded-4" style={{ maxWidth: 700 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="h4 mb-1">AI diagnosis results</h3>
            {diagnosisData?.ai_model && (
              <p className="text-muted small mb-0">model: {diagnosisData.ai_model}</p>
            )}
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-pill d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close AI diagnosis"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="spinner-border text-brand-secondary" role="status" />
            <p className="mt-3 mb-0">Generating differential diagnoses...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!isLoading && !error && diagnosisData && (
          <div className="d-grid gap-3">
            {diagnosisData.symptom_analysis && (
              <div className="gradient-panel rounded-4 p-3">
                <h5 className="h6 mb-2">Symptom summary</h5>
                <p className="mb-0 text-muted">{diagnosisData.symptom_analysis}</p>
              </div>
            )}

            {(diagnosisData.diagnoses ?? []).map((item, index) => (
              <div key={index} className="gradient-panel rounded-4 p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="h6 mb-1">{item.condition}</h5>
                    {item.confidence_level && (
                      <span className="badge bg-brand-secondary">{item.confidence_level} confidence</span>
                    )}
                  </div>
                  {typeof item.certainty_score === 'number' && (
                    <span className="badge bg-brand-primary">Score: {(item.certainty_score * 100).toFixed(0)}%</span>
                  )}
                </div>

                {item.supporting_evidence && item.supporting_evidence.length > 0 && (
                  <div className="mt-2">
                    <strong className="small d-block text-uppercase text-muted">supporting evidence</strong>
                    <ul className="mb-0 small">
                      {item.supporting_evidence.map((evidence, idx) => (
                        <li key={idx}>{evidence}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.key_findings && item.key_findings.length > 0 && (
                  <div className="mt-2">
                    <strong className="small d-block text-uppercase text-muted">key findings</strong>
                    <ul className="mb-0 small">
                      {item.key_findings.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.medication_recommendations && item.medication_recommendations.length > 0 && (
                  <div className="mt-2">
                    <strong className="small d-block text-uppercase text-muted">medication suggestions</strong>
                    <ul className="mb-0 small">
                      {item.medication_recommendations.map((med, idx) => (
                        <li key={idx}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {typeof item.research_articles_count === 'number' && (
                  <p className="small text-muted mt-2 mb-0">
                    referenced research articles: {item.research_articles_count}
                  </p>
                )}
              </div>
            ))}

            {(!diagnosisData.diagnoses || diagnosisData.diagnoses.length === 0) && (
              <div className="alert alert-light border" role="alert">
                No diagnoses returned. Try refining the symptom summary or retry later.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDiagnosisResults;
