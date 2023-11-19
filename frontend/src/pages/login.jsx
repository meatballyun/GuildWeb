import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    console.log('account: ', account, '\npassword: ', password);
    let url = 'http://localhost:3010/login';
    let data = { account: account, password: password };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <>
      <div className="login_page">
        <div className="panel">
          <h1 className="title">WANTED</h1>
          <div className="container">
            <div className="input_container">
              account
              <input
                className="input"
                type="text"
                value={account}
                onChange={(e) => {
                  setAccount(e.target.value);
                }}
              />
            </div>
            <div
              className="input_container"
              style={{ marginTop: '24px', marginBottom: '8px' }}
            >
              passward
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="text_link">forget password ?</div>
          </div>
          <button className="button" onClick={handleLogin}>
            Log In
          </button>
          <h3 style={{ margin: '12px', fontSize: '28px' }}>or</h3>
          <Link to="/signup">
            <button className="button_hollow button">Sign Up</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
