import { useNavigate } from 'react-router-dom';
import './styles.css';
import { api } from '../../api';
import { Button, Input } from '../../components';

function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.token;

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
