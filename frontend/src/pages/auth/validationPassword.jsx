import { Link, useSearchParams } from 'react-router-dom';
import { Paper } from '../_layout/components';
import {
  Button,
  Form,
  Loading,
  useFormInstance,
  useNotification,
  validate,
} from '../../components';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../api';
import { PasswordInput } from './component';

const validateObject = {
  password: [validate.required, validate.maxLimit(30), validate.minLimit(6)],
  confirmPassword: [validate.required, validate.isEqual('password')],
};

export const ValidationPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [validation, setValidation] = useState();
  const called = useRef(false);
  const {
    Dom: Notification,
    value: notification,
    promptNotification,
  } = useNotification();

  const handleSubmit = async ({ password }) => {
    promptNotification({ type: 'loading' });
    const res = await api.auth.resetPassword({
      body: {
        password,
        code: searchParams.get('code'),
        uid: +searchParams.get('uid'),
      },
    });
    if (res.status === 200) {
      promptNotification({
        type: 'success',
        message: 'reset password successfully',
      });
      return;
    }
    promptNotification({
      type: 'error',
      message: 'unknown error',
    });
  };

  const form = useFormInstance({ validateObject, onSubmit: handleSubmit });

  useEffect(() => {
    if (called.current) return;
    called.current = searchParams;
    (async () => {
      const res = await api.auth.resetPasswordValidation({
        pathParams: searchParams.toString(),
      });
      if (res.status === 200) {
        setValidation(true);
        return;
      }
      setValidation(false);
    })();
  }, [searchParams]);

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
                <div className="text-heading-h1">Reset Password</div>
                <div className="w-[240px]">
                  <Notification className="my-2" />
                </div>
                <Form form={form}>
                  <Form.Item valueKey="password" label="Password">
                    <PasswordInput />
                  </Form.Item>
                  <Form.Item
                    valueKey="confirmPassword"
                    label="Confirm Password"
                  >
                    <PasswordInput />
                  </Form.Item>
                </Form>
                {notification.type !== 'success' ? (
                  <Button
                    onClick={form.submit}
                    type="hollow"
                    disabled={notification.type === 'loading'}
                  >
                    Submit
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button type="hollow">go to Login page</Button>
                  </Link>
                )}
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
            return (
              <Loading
                className="text-heading-h3 text-primary-300"
                text="Verification in progress...."
              />
            );
        }
      })()}
    </Paper>
  );
};
