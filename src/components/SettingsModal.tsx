import { FC, ChangeEvent } from 'react';

export interface AccessibilityPreferences {
  colorblindSafePalette: boolean;
  highContrastMode: boolean;
  dyslexiaFriendlyFont: boolean;
  reducedMotion: boolean;
  largeText: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AccessibilityPreferences;
  onChange: (next: AccessibilityPreferences) => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose, preferences, onChange }) => {
  if (!isOpen) {
    return null;
  }

  const updatePreference = (key: keyof AccessibilityPreferences) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    onChange({ ...preferences, [key]: value });
  };

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal-backdrop" onClick={onClose} />
      <div className="appointment-modal-dialog gradient-surface border-0 shadow-lg p-4 p-lg-5 rounded-4" style={{ maxWidth: 640 }}>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h3 className="h4 mb-1">interface settings</h3>
            <p className="text-muted small mb-0">tune the ui for colour-blind, dyslexia, or sensory-friendly experiences.</p>
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-pill d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close settings"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="d-grid gap-3">
          <section className="gradient-panel rounded-4 p-3">
            <h4 className="h6 mb-3">colour accessibility</h4>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="colorblind-safe"
                checked={preferences.colorblindSafePalette}
                onChange={updatePreference('colorblindSafePalette')}
              />
              <label className="form-check-label" htmlFor="colorblind-safe">
                colour-blind friendly palette
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="high-contrast"
                checked={preferences.highContrastMode}
                onChange={updatePreference('highContrastMode')}
              />
              <label className="form-check-label" htmlFor="high-contrast">
                increase contrast on key surfaces
              </label>
            </div>
          </section>

          <section className="gradient-panel rounded-4 p-3">
            <h4 className="h6 mb-3">readability</h4>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="dyslexia-font"
                checked={preferences.dyslexiaFriendlyFont}
                onChange={updatePreference('dyslexiaFriendlyFont')}
              />
              <label className="form-check-label" htmlFor="dyslexia-font">
                dyslexia-friendly typeface & letter spacing
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="large-text"
                checked={preferences.largeText}
                onChange={updatePreference('largeText')}
              />
              <label className="form-check-label" htmlFor="large-text">
                larger base text size
              </label>
            </div>
          </section>

          <section className="gradient-panel rounded-4 p-3">
            <h4 className="h6 mb-3">motion & focus</h4>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="reduced-motion"
                checked={preferences.reducedMotion}
                onChange={updatePreference('reducedMotion')}
              />
              <label className="form-check-label" htmlFor="reduced-motion">
                reduce animated transitions
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
