import { FC } from 'react';

interface DiagnosisResult {
  condition: string;
  certainty_score?: number;
  confidence_level?: 'High' | 'Moderate' | 'Low' | string;
  supporting_evidence?: string[];
  research_articles_count?: number;
  key_findings?: string | string[];
  medication_recommendations?: string[];
}

interface AIDiagnosisData {
  success?: boolean;
  symptom_analysis?: string;
  diagnoses?: DiagnosisResult[];
  generated_at?: string;
  ai_model?: string;
}

interface AIDiagnosisResultsProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosisData: AIDiagnosisData | null;
  isLoading: boolean;
  error: string | null;
}

const getConfidenceColor = (level?: string) => {
  switch (level) {
    case 'High':
      return 'text-success';
    case 'Moderate':
      return 'text-warning';
    case 'Low':
      return 'text-secondary';
    default:
      return 'text-muted';
  }
};

const getConfidenceIcon = (level?: string) => {
  switch (level) {
    case 'High':
      return 'bi-check-circle-fill';
    case 'Moderate':
      return 'bi-exclamation-triangle-fill';
    case 'Low':
      return 'bi-info-circle-fill';
    default:
      return 'bi-question-circle';
  }
};

const asArray = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const AIDiagnosisResults: FC<AIDiagnosisResultsProps> = ({
  isOpen,
  onClose,
  diagnosisData,
  isLoading,
  error
}) => {
  if (!isOpen) {
    return null;
  }

  const diagnoses = diagnosisData?.diagnoses ?? [];

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal-backdrop" onClick={onClose} />
      <div className="appointment-modal-dialog gradient-surface border-0 shadow-lg p-4 p-lg-5 rounded-4" style={{ maxWidth: '800px' }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="h4 mb-1">AI-Assisted Diagnosis</h3>
            <p className="text-muted small mb-0">
              {diagnosisData?.ai_model ?? 'powered by Gemini AI + PubMed research'}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-pill d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close AI diagnosis results"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-brand-secondary mb-3" role="status">
              <span className="visually-hidden">Analyzing symptoms...</span>
            </div>
            <p className="text-muted mb-0">
              Analyzing symptoms with AI
              <br />
              Searching medical research
              <br />
              Calculating certainty scores...
            </p>
          </div>
        )}

        {error && !isLoading && (
          <div className="alert alert-danger rounded-3">
            <div className="d-flex gap-3">
              <i className="bi bi-exclamation-triangle-fill fs-5" />
              <div>
                <strong>AI Analysis Failed</strong>
                <div className="small mt-1">{error}</div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && diagnosisData?.success && (
          <div className="d-grid gap-4">
            {diagnosisData.symptom_analysis && (
              <div className="gradient-panel rounded-4 p-4">
                <div className="d-flex gap-3 align-items-start">
                  <i className="bi bi-clipboard-pulse fs-4 text-brand-secondary" />
                  <div>
                    <strong>Analyzed Symptoms</strong>
                    <div className="text-muted small mt-2">{diagnosisData.symptom_analysis}</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h5 className="mb-3">
                <i className="bi bi-search me-2" />
                Probable Diagnoses ({diagnoses.length})
              </h5>

              {diagnoses.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-info-circle fs-1 mb-3" />
                  <p className="mb-0">
                    No specific diagnoses found. Consider refining the symptom summary
                    or consulting with a healthcare professional for further evaluation.
                  </p>
                </div>
              ) : (
                <div className="d-grid gap-3">
                  {diagnoses.map((diagnosis, index) => (
                    <div key={`${diagnosis.condition}-${index}`} className="gradient-panel rounded-4 p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="mb-1">{diagnosis.condition}</h6>
                          {diagnosis.confidence_level && (
                            <div className={`small fw-semibold ${getConfidenceColor(diagnosis.confidence_level)}`}>
                              <i className={`bi ${getConfidenceIcon(diagnosis.confidence_level)} me-1`} />
                              {diagnosis.confidence_level} Confidence
                              {typeof diagnosis.certainty_score === 'number' && ` (${Math.round(diagnosis.certainty_score * 100)}%)`}
                            </div>
                          )}
                        </div>
                        {typeof diagnosis.research_articles_count === 'number' && (
                          <div className="text-end">
                            <div className="badge bg-brand-secondary text-white">
                              {diagnosis.research_articles_count} studies
                            </div>
                          </div>
                        )}
                      </div>

                      {typeof diagnosis.certainty_score === 'number' && (
                        <div className="mb-3">
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className={`progress-bar ${
                                diagnosis.certainty_score >= 0.7
                                  ? 'bg-success'
                                  : diagnosis.certainty_score >= 0.4
                                    ? 'bg-warning'
                                    : 'bg-secondary'
                              }`}
                              role="progressbar"
                              style={{ width: `${Math.max(2, diagnosis.certainty_score * 100)}%` }}
                              aria-valuenow={diagnosis.certainty_score * 100}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>
                      )}

                      {asArray(diagnosis.key_findings).length > 0 && (
                        <div className="mb-3">
                          <strong className="small text-muted">Research Findings:</strong>
                          <ul className="small mt-1 mb-0">
                            {asArray(diagnosis.key_findings).map((finding, findingIndex) => (
                              <li key={`finding-${findingIndex}`} className="text-muted">{finding}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {diagnosis.supporting_evidence && diagnosis.supporting_evidence.length > 0 && (
                        <div className="mb-3">
                          <strong className="small text-muted">Supporting Evidence:</strong>
                          <ul className="small mt-1 mb-0">
                            {diagnosis.supporting_evidence.slice(0, 3).map((evidence, evidenceIndex) => (
                              <li key={`evidence-${evidenceIndex}`} className="text-muted">{evidence}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {diagnosis.medication_recommendations && diagnosis.medication_recommendations.length > 0 && (
                        <div>
                          <strong className="small text-muted">Medication Suggestions:</strong>
                          <ul className="small mt-1 mb-0">
                            {diagnosis.medication_recommendations.map((medication, medIndex) => (
                              <li key={`medication-${medIndex}`} className="text-muted">{medication}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="alert alert-info rounded-3">
              <div className="d-flex gap-3">
                <i className="bi bi-info-circle-fill fs-5" />
                <div className="small">
                  <strong>Medical Disclaimer:</strong> This AI analysis is for informational
                  purposes only and should not replace professional medical advice. Always consult with
                  qualified healthcare professionals for proper diagnosis and treatment.
                </div>
              </div>
            </div>

            {diagnosisData.generated_at && (
              <div className="text-center text-muted small">
                <div>Generated on {new Date(diagnosisData.generated_at).toLocaleString()}</div>
              </div>
            )}
          </div>
        )}

        <div className="d-flex justify-content-end mt-4">
          <button type="button" className="btn btn-gradient" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosisResults;
