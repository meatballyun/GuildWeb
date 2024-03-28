import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Button, Input } from '../components';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('email: ', email, '\npassword: ', password);
    const res = await api.auth.login({ email, password });
    if (res.status === 200) {
      const json = await res.json();
      localStorage.setItem('token', json.token);
      navigate('/');
    }
  };

  return (
    <>
      <div className="text-heading-h1 text-center mb-8">
        Welcome back, Adventurer!
      </div>
      <div className="flex flex-col gap-4 w-[240px]">
        <Input label="email" value={email} onChange={setEmail} />
        <Input
          label="password"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>
      <Button size="lg mt-12" onClick={handleLogin}>
        Enter the Realm
      </Button>
    </>
  );
}

export default Login;
