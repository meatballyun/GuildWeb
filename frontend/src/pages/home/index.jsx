import { api } from '../../api';
import { Button } from '../../components';
import { useSideBar } from '../_layout/MainLayout/SideBar';
import './styles.css';

function HomePage() {
  useSideBar({ activeKey: 'home' });
  const token = localStorage.token;

  const handleLogin = async () => {
    const [succ, err] = await api.auth
      .checkAuth(token)
      .then((res) => [res, null])
      .catch((err) => [null, err]);

    if (err) {
      // console.log('err: ', err);
      return;
    }
    if (succ.status === 200) {
      const json = await succ.json();
      console.log('json ', json);
    }
  };

  return (
    <>
      <div>This is a test_page!</div>
      <Button size="lg" onClick={handleLogin}>
        start
      </Button>
    </>
  );
}

export default HomePage;
