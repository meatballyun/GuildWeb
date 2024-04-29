import { Link } from 'react-router-dom';
import './styles.css';
import { Outlet, useLocation } from 'react-router';
import { Paper } from '../components';
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
            row
            className="absolute -bottom-4 -right-4 h-[150px] w-[250px] text-lg"
          >
            <div className="whitespace-pre">{hintContent.text}</div>
            <MaterialSymbol className="float-right" icon="arrow_forward" />
          </Paper>
        </Link>
      )}
    </div>
  );
};
