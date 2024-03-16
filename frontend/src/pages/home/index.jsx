
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { api } from '../../api';
import { Button, Input } from '../../components';

function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.token;

  function log () {
    setTimeout(()=> console.log('a'), 2);
    for( let i=1;i<99999999; i=i+0.1) {var b = i};
    setTimeout(()=> console.log('b'), 1);
    console.log('c');
}

  const handleLogin = async () => {
    const [succ, err] = await api.auth
      .checkAuth(token)
      .then((res) => [res, null])
      .catch((err) => [null, err]);

    if (err) {
      console.log('err: ', err);
      return;
    }
    if (succ.status === 200) {
      const json = await succ.json();
      console.log('json ', json);
      log();
    }

    
  };

  return (
    <>
      <div>HELLO WORLD!!!</div>
      <Button size="lg" onClick={handleLogin}>
            Log In
      </Button>
    </>
  );
}

export default HomePage;
