import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Button, Form, Input, useFormInstance } from '../components';
import { Paper } from './_layout/components';

function Login() {
  const form = useFormInstance();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await api.auth.login({ body: form.formData });
    if (res.status === 200) {
      const json = await res.json();
      localStorage.setItem('token', json.data.token);
      navigate('/');
    }
  };

  return (
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
            <Input type="underline" inputType="password" />
          </Form.Item>
        </div>
      </Form>
      <Button size="lg mt-12" onClick={handleLogin}>
        Enter the Realm
      </Button>
    </Paper>
  );
}

export default Login;
