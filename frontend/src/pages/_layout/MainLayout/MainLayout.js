import './styles.css';
import { SideBar, SideBarProvider } from './SideBar';
import { Outlet, useNavigate } from 'react-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../../../api';

const userMeContext = createContext({
  userMe: {
    name: '',
    id: -1,
    imageUrl: '',
    email: '',
    rank: -1,
    exp: -1,
    upgradeExp: -1,
    carbs: -1,
    pro: -1,
    fats: -1,
    kcal: -1,
  },
  getUserMeData: () => new Promise(),
});

export const useUserMe = () => {
  const { userMe, getUserMeData } = useContext(userMeContext);
  return { userMe, getUserMeData };
};

export const MainLayout = () => {
  const [userMe, setUserMe] = useState();
  const navigate = useNavigate();

  const getUserMeData = useCallback(async () => {
    try {
      const res = await api.auth.getUserMe();
      if (res.status !== 200) throw Error();
      const json = await res.json();
      setUserMe(json.data);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    getUserMeData();
  }, [getUserMeData]);

  return (
    <userMeContext.Provider value={{ userMe, getUserMeData }}>
      <SideBarProvider>
        <div className="main-layout-container">
          <SideBar />
          <div className="content">
            <Outlet />
          </div>
        </div>
      </SideBarProvider>
    </userMeContext.Provider>
  );
};
