import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { api } from '../../api';
import { Button, Input } from '../../components';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const [success, error] = await api.auth
      .signUp({ email, name, password })
      .then((res) => [res, null])
      .catch((error) => [null, error]);
    if (error) {
      console.log(error);
      return;
    }
    navigate('/login');
  };

  return (
    <div className="sign_up_page">
      <div className="panel">
        <h1>SIGN UP</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '2rem 0',
          }}
        >
          <Input label="name" value={name} onChange={setName} />
          <Input label="email" value={email} onChange={setEmail} />
          <Input
            label="password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>
        <Button size="lg" onClick={handleSignUp}>
          Sign Up
        </Button>
        <h3 style={{ margin: '12px', fontSize: '28px' }}>or</h3>
        <Link to="/login">
          <Button size="lg" type="hollow">
            Log In
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
