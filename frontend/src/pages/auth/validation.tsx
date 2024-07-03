import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Paper } from '../_layout/components';
import { Button } from '../../components';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../api';

export const ValidationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [validation, setValidation] = useState(false);
  const called = useRef(false);

  useEffect(() => {
    const uid = searchParams.get('uid');
    const code = searchParams.get('code');
    if (!uid || !code) return;

    if (called.current) return;

    called.current = !!searchParams;
    (async () => {
      const [success, error] = await api.auth
        .signUpValidation({
          params: { uid, code },
        })
        .then((data) => [data])
        .catch((err) => [null, err]);

      if (success && !error) {
        setValidation(true);
        return;
      }
      setValidation(false);
    })();
  }, [searchParams]);

  useEffect(() => {
    if (!validation) return;
    const timeout = setTimeout(() => {
      navigate('/login');
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [validation, navigate]);

  return (
    <Paper
      row
      className="flex h-[600px] w-[720px] flex-col items-center justify-center gap-2 text-heading-h2"
    >
      {(() => {
        switch (validation) {
          case true:
            return (
              <>
                <div>Verification successful.</div>
                <div>Automatically redirecting in 5 seconds.</div>
                <div>If not redirected, please click the button below.</div>
                <Link to="/login">
                  <Button type="hollow">go to Login page</Button>
                </Link>
              </>
            );
          case false:
            return (
              <>
                The provided confirmation code does not exist or has expired.
                <Link to="/login">
                  <Button type="hollow">go to Login page</Button>
                </Link>
              </>
            );
          default:
            return 'Verification in progress....';
        }
      })()}
    </Paper>
  );
};
