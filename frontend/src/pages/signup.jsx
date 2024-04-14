import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Button, Form, Input, useFormInstance } from '../components';
import { useState } from 'react';
import { Paper } from './_layout/components';

const SignUp = () => {
  const navigate = useNavigate();
  const form = useFormInstance();
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    const { confirmPassword, password, email, name } = form.formData;
    if (!confirmPassword || !password || !email || !name) {
      setError('All field are required.');
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setError('email format not current');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and confirmPassword not equal.');
      return;
    }
    setError('');
    const res = await api.auth.signUp({ body: { email, name, password } });
    if (res.status === 409) {
      setError('This email address is already in use');
      return;
    }
    if (res.status === 200) {
      navigate('/login');
      return;
    }
  };

  return (
    <Paper className="flex h-[720px] w-[600px] flex-col items-center justify-center">
      <div className="mb-8 text-center text-heading-h1">
        Become an adventurer!
      </div>
      <div className="flex w-[240px] flex-col gap-4">
        <Form form={form}>
          <Form.Item valueKey="name" label="Name">
            <Input type="underline" />
          </Form.Item>
          <Form.Item valueKey="email" label="Email">
            <Input type="underline" />
          </Form.Item>
          <Form.Item valueKey="password" label="Password">
            <Input type="underline" inputType="password" />
          </Form.Item>
          <Form.Item valueKey="confirmPassword" label="Confirm Password">
            <Input type="underline" inputType="password" />
          </Form.Item>
        </Form>
        <div className="text-red">{error}</div>
      </div>
      <Button size="lg mt-12" onClick={handleSignUp}>
        Start your journey
      </Button>
    </Paper>
  );
};

export default SignUp;
