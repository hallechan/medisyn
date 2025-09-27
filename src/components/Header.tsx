import { FC } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="d-flex align-items-center justify-content-between py-3 px-4 bg-white shadow-sm rounded-4 mb-4">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light d-lg-none border-0 shadow-sm"
          type="button"
          onClick={onToggleSidebar}
        >
          <span className="bi bi-list fs-3 text-brand-secondary" />
        </button>
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-brand-secondary text-white fw-semibold">Medisyn</span>
            <span className="text-muted small">an m.d. for a ms.</span>
          </div>
          <h1 className="h4 mb-0 mt-1 text-brand-primary">Women's Health Intelligence Hub</h1>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="text-end">
          <p className="mb-0 fw-semibold">Dr. Halle Kamal</p>
          <small className="text-muted">Women's health specialist</small>
        </div>
        <div className="rounded-circle bg-brand-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
          <span className="fw-bold">HK</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
