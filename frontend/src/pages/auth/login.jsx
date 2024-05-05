import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import {
  Button,
  Form,
  Input,
  useFormInstance,
  useNotification,
  validate,
} from '../../components';
import { Paper } from '../_layout/components';
import { useState } from 'react';
import { EmailModal, ForgotPasswordModal } from './modal';
import { PasswordInput } from './component';

const validateObject = {
  email: [validate.required, validate.maxLimit(100), validate.isEmail],
  password: [validate.required, validate.maxLimit(30)],
};

export const Login = () => {
  const navigate = useNavigate();
  const [modalStatus, setModalStatus] = useState({ isOpen: false });
  const {
    Dom: Notification,
    value: notification,
    promptNotification,
  } = useNotification();

  const handleLogin = async (formData, { isFormDataValid }) => {
    promptNotification({ type: 'loading' });
    if (!isFormDataValid) return;

    const res = await api.auth.login({ body: formData });
    const json = await res.json();
    switch (res.status) {
      case 200:
        localStorage.setItem('token', json.data.token);
        navigate('/');
        return;
      case 403:
        setModalStatus({ isOpen: 'email' });
        return;
      case 401:
      case 400:
        promptNotification({
          type: 'error',
          message: 'email or password error',
        });
        return;
      default:
        promptNotification({
          type: 'error',
          message: 'unknown server error',
        });
    }
  };

  const form = useFormInstance({
    validateObject,
    onSubmit: handleLogin,
  });

  return (
    <>
      <Paper className="flex h-[720px] w-[600px] flex-col items-center justify-center">
        <div className="mb-8 text-center text-heading-h1">
          Welcome back, Adventurer!
        </div>
        <div className="flex w-[240px] flex-col gap-2">
          {<Notification />}
          <Form form={form}>
            <div className="flex w-[240px] flex-col gap-4">
              <Form.Item
                normalize={(v) => v.replaceAll(' ', '')}
                valueKey="email"
                label="E-MAIL"
              >
                <Input type="underline" />
              </Form.Item>
              <Form.Item valueKey="password" label="PASSWORD">
                <PasswordInput />
              </Form.Item>
            </div>
          </Form>
          <Button
            className="self-end"
            type="text"
            onClick={() => setModalStatus({ isOpen: 'forgotPassword' })}
          >
            forget password?
          </Button>
        </div>
        <Button
          size="lg mt-12"
          onClick={form.submit}
          disabled={notification.type === 'loading'}
        >
          Enter the Realm
        </Button>
      </Paper>
      <EmailModal
        key={modalStatus.isOpen ? 'email' : 'emailClose'}
        header="This Email is registered but not verified yet"
        description="Didn’t receive it? Click the button below to resend the verification email"
        email={form.formData.email}
        onClose={() => setModalStatus({ isOpen: false })}
        isOpen={modalStatus.isOpen === 'email'}
      />
      <ForgotPasswordModal
        key={modalStatus.isOpen ? 'forgotPassword' : 'forgotPasswordClose'}
        onClose={() => setModalStatus({ isOpen: false })}
        isOpen={modalStatus.isOpen === 'forgotPassword'}
      />
    </>
  );
};
