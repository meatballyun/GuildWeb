import { Link } from 'react-router-dom';
import './styles.css';
import { Outlet, useLocation } from 'react-router';
import { Footer, Paper } from '../components';
import { MaterialSymbol } from '../../../components';

const HINT = {
  signup: { to: '/login', text: 'Already an adventurer?\nLog in now !' },
  login: { to: '/signup', text: 'Not an adventurer yet?\nJoin now!' },
};

export const AuthLayout = () => {
  const location = useLocation();
  const hintContent =
    location.pathname === '/signup' ? HINT.signup : HINT.login;

  return (
    <div className="auth-layout-container overflow-hidden">
      <Outlet />
      {['/signup', '/login'].includes(location.pathname) && (
        <Link to={hintContent.to}>
          <Paper
            style={{
              backgroundSize: '600px 720px',
              backgroundPosition: '0 0',
            }}
            className="absolute bottom-0 right-0 h-[140px] w-[240px] text-lg"
          >
            <div className="whitespace-pre">{hintContent.text}</div>
            <MaterialSymbol
              className="absolute bottom-4 right-4"
              icon="arrow_forward"
            />
          </Paper>
        </Link>
      )}
      <Footer />
    </div>
  );
};
