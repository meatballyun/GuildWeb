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
      <Outlet />
      {['/signup', '/login'].includes(location.pathname) && (
        <Link to={hintContent.to}>
          <div className="absolute bottom-0 right-0 bg-primary-100 p-4 text-lg">
            <div className="whitespace-pre">{hintContent.text}</div>
            <div className="text-right">→</div>
          </div>
        </Link>
      )}
    </div>
  );
};
