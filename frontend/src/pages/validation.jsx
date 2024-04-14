import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Paper } from './_layout/components';
import { Button } from '../components';
import { useEffect, useState } from 'react';
import { api } from '../api';

export const ValidationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [validation, setValidation] = useState();
  useEffect(() => {
    (async () => {
      const res = await api.auth.signUpValidation({
        pathParams: searchParams.toString(),
      });
      if (res.status === 200) {
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
                <div>Automatically redirecting in five seconds.</div>
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
