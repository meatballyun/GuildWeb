import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Button, Input } from '../components';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const res = await api.auth.signUp({ email, name, password });
    if (res.status === 200) {
      navigate('/login');
      return;
    }
    console.log(res);
  };

  return (
    <>
      <div className="text-h1 text-center mb-8">Become an adventurer!</div>
      <div className="flex flex-col gap-4 w-[240px]">
        <Input label="name" value={name} onChange={setName} />
        <Input label="email" value={email} onChange={setEmail} />
        <Input
          label="password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <Input
          label="confirm password"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>
      <Button size="lg mt-12" onClick={handleSignUp}>
        Start your journey
      </Button>
    </>
  );
};

export default SignUp;
