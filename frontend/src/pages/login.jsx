import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import {
  Button,
  Form,
  Input,
  Loading,
  MaterialSymbol,
  useFormInstance,
} from '../components';
import { Paper } from './_layout/components';
import { useState } from 'react';
import { EmailModal } from './modal';
import { validation } from '../utils';

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="border-b border-b-currentColor pb-1">
      <div className="flex rounded-sm bg-primary-100 pr-2">
        <Input
          {...props}
          inputClassName="bg-transparent"
          className="w-full"
          inputType={showPassword ? 'text' : 'password'}
        />
        <MaterialSymbol
          icon={showPassword ? 'visibility_off' : 'visibility'}
          onClick={() => setShowPassword((show) => !show)}
        />
      </div>
    </div>
  );
};

const validateObject = {
  email: (value) => {
    if (!value) return 'email is required';
    if (!validation.isEmail(value)) return 'email format not current';
    return false;
  },
  password: (value) => {
    if (!value) return 'password is required';
  },
};

function Login() {
  const navigate = useNavigate();
  const [modalStatus, setModalStatus] = useState({ isOpen: false });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleLogin = async (formData, { isFormDataValid }) => {
    setStatus({ loading: true });
    if (!isFormDataValid) return;

    const res = await api.auth.login({ body: formData });
    if (res.status === 200) {
      const json = await res.json();
      localStorage.setItem('token', json.data.token);
      navigate('/');
      return;
    }
    if (res.status === 403) {
      setModalStatus({ isOpen: true });
      return;
    }
    setStatus({ error: 'email or password error' });
  };

  const form = useFormInstance({
    validateMode: 'onSubmit',
    validateObject,
    onSubmit: handleLogin,
  });

  return (
    <>
      <Paper className="flex h-[720px] w-[600px] flex-col items-center justify-center">
        <div className="mb-8 text-center text-heading-h1">
          Welcome back, Adventurer!
        </div>
        <Form form={form}>
          <div className="flex w-[240px] flex-col gap-4">
            <Form.Item valueKey="email" label="E-MAIL">
              <Input type="underline" />
            </Form.Item>
            <Form.Item valueKey="password" label="PASSWORD">
              <PasswordInput />
            </Form.Item>
          </div>
        </Form>
        {status.loading && (
          <div className="w-[240px] text-primary-300">
            <Loading />
          </div>
        )}
        {status.error && (
          <div className="w-[240px] text-red">{status.error}</div>
        )}
        <Button size="lg mt-12" onClick={form.submit}>
          Enter the Realm
        </Button>
      </Paper>
      <EmailModal
        header="This Email is registered but not verified yet"
        email={form.formData.email}
        onClose={() => setModalStatus({ isOpen: false })}
        {...modalStatus}
      />
    </>
  );
}

export default Login;
