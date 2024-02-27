import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { api } from '../../api';
import { Button, Input } from '../../components';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('email: ', email, '\npassword: ', password);
    const [succ, err] = await api.auth
      .login({ email, password })
      .then((res) => [res, null])
      .catch((err) => [null, err]);

    if (err) {
      console.log('err: ', err);
      return;
    }
    if (succ.status === 200) {
      const json = await succ.json();
      console.log('token ', json.token);
      localStorage.setItem('token', json.token);
    }

    navigate('/');
  };

  return (
    <>
      <div className="login_page">
        <div className="panel">
          <h1 className="title">WANTED</h1>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '2rem 0',
            }}
          >
            <Input label="Email" value={email} onChange={setEmail} />
            <Input label="password" value={password} onChange={setPassword} />
            <div className="text_link">forget password ?</div>
          </div>
          <Button size="lg" onClick={handleLogin}>
            Log In
          </Button>
          <h3 style={{ margin: '12px', fontSize: '28px' }}>or</h3>
          <Link to="/signup">
            <Button size="lg" type="hollow">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
