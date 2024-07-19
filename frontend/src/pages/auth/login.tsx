import { useNavigate } from 'react-router-dom';
import { APIError, api } from '../../api';
import {
  Button,
  Form,
  FormOnSubmit,
  Input,
  useFormInstance,
  useNotification,
  validate,
} from '../../components';
import { Paper } from '../_layout/components';
import { useState } from 'react';
import { EmailModal, ForgotPasswordModal } from './modal';
import { PasswordInput } from './component';
import { baseInstance } from '../../api/instance';

const validateObject = {
  email: [validate.required, validate.maxLimit(100), validate.isEmail],
  password: [validate.required, validate.maxLimit(30)],
};

enum ModalStatus {
  EMAIL = 'email',
  FORGET_PASSWORD = 'forgotPassword',
}

export const Login = () => {
  const navigate = useNavigate();
  const [modalStatus, setModalStatus] = useState<{
    isOpen: false | ModalStatus;
  }>({
    isOpen: false,
  });

  const {
    Dom: Notification,
    value: notification,
    promptNotification,
  } = useNotification();

  const handleLogin: FormOnSubmit<{ email: string; password: string }> = async (
    formData,
    { isFormDataValid }
  ) => {
    promptNotification({ type: 'loading' });
    if (!isFormDataValid) return;

    const [success, error] = await api.auth
      .login({ data: formData })
      .then((data) => [data, null] as const)
      .catch((err: APIError) => [null, err] as const);

    if (success && !error) {
      localStorage.setItem('token', success.token);
      baseInstance.defaults.headers.common['Authorization'] =
        `Bearer ${success.token}`;
      navigate('/');
      return;
    }

    switch (error.response?.status) {
      case 403:
        setModalStatus({ isOpen: ModalStatus.EMAIL });
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
            onClick={() =>
              setModalStatus({ isOpen: ModalStatus.FORGET_PASSWORD })
            }
          >
            forget password?
          </Button>
        </div>
        <Button
          size="lg"
          className="mt-12"
          onClick={form.submit}
          disabled={notification?.type === 'loading'}
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
        isOpen={modalStatus.isOpen === ModalStatus.EMAIL}
      />
      <ForgotPasswordModal
        key={modalStatus.isOpen ? 'forgotPassword' : 'forgotPasswordClose'}
        onClose={() => setModalStatus({ isOpen: false })}
        isOpen={modalStatus.isOpen === ModalStatus.EMAIL}
      />
    </>
  );
};
