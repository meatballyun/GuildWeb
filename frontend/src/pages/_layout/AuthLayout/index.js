import { Link } from 'react-router-dom';
import './styles.css';
import { Outlet, useLocation } from 'react-router';

const HINT = {
  signup: { to: '/login', text: 'Already an adventurer?\nLog in now !' },
  login: { to: '/signup', text: 'Not an adventurer yet?\nJoin now!' },
};

export const AuthLayout = () => {
  const location = useLocation();
  const hintContent =
    location.pathname === '/signup' ? HINT.signup : HINT.login;

  return (
    <div className="auth-layout-container">
      <div className="panel">
        <Outlet />
      </div>
      <Link to={hintContent.to}>
        <div className="absolute right-0 bottom-0 p-4 bg-primary-100 text-lg">
          <div className="whitespace-pre">{hintContent.text}</div>
          <div className="text-right">→</div>
        </div>
      </Link>
    </div>
  );
};
