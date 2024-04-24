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

const guildContext = createContext({
  guildList: [{ id: 3, imageUrl: '', name: 'rex_guild_3' }],
  getGuildList: () => new Promise(),
});

export const useGuild = () => {
  const { guildList, getGuildList } = useContext(guildContext);
  return { guildList, getGuildList };
};

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

  const [guildList, setGuildList] = useState([]);

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

  const getGuildList = useCallback(async () => {
    try {
      const res = await api.guild.getGuild();
      if (res.status !== 200) throw Error(res);
      const json = await res.json();
      setGuildList(json.data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getUserMeData();
  }, [getUserMeData]);

  useEffect(() => {
    getGuildList();
  }, [getGuildList]);

  return (
    <guildContext.Provider value={{ guildList, getGuildList }}>
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
    </guildContext.Provider>
  );
};
