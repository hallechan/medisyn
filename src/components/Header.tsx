import { FC } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="d-flex align-items-center justify-content-between flex-wrap gap-3 py-3 px-3 px-lg-4 gradient-surface shadow-sm rounded-4 mb-3">
      <div className="d-flex align-items-center gap-3 gap-lg-3">
        <button
          className="btn gradient-panel d-lg-none border-0 shadow-sm"
          type="button"
          onClick={onToggleSidebar}
        >
          <span className="bi bi-list fs-3 text-brand-secondary" />
        </button>
        <img
          src="/msyn.png"
          alt="medisyn"
          style={{ width: 60, height: 60, objectFit: 'contain' }}
        />
      </div>
      <div className="d-flex align-items-center gap-3 gap-lg-3">
        <div className="text-end">
          <p className="mb-0 fw-semibold">Dr. Madison Jen</p>
          <small className="text-muted">MD, General Practitioner</small>
        </div>
        <div className="rounded-circle bg-brand-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
          <span className="fw-bold">MJ</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
