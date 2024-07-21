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
import { Footer } from '../components';
import type { Guild } from '../../../api/guild/interface';
import { UserMe } from '../../../api/user/interface';

const guildContext = createContext<{
  guildList: Guild[];
  getGuildList: () => Promise<void>;
}>({
  guildList: [],
  getGuildList: () => new Promise(() => {}),
});

export const useGuild = () => {
  const { guildList, getGuildList } = useContext(guildContext);
  const getMyMemberShipInGuild = (gid: number) =>
    guildList.find(({ id }) => id === gid)?.membership;
  return { guildList, getGuildList, getMyMemberShipInGuild };
};

const userMeContext = createContext<{
  userMe?: UserMe;
  getUserMeData: () => Promise<void>;
}>({
  getUserMeData: () => new Promise(() => {}),
});

export const useUserMe = () => {
  const { userMe, getUserMeData } = useContext(userMeContext);
  return { userMe, getUserMeData };
};

export const MainLayout = () => {
  const [userMe, setUserMe] = useState<UserMe>();
  const navigate = useNavigate();

  const [guildList, setGuildList] = useState<Guild[]>([]);

  const getUserMeData = useCallback(async () => {
    const [success] = await api.user
      .getUserMe()
      .then((data) => [data, null] as const)
      .catch((err) => [null, err] as const);
    if (success) {
      setUserMe(success);
      return;
    }
    navigate('/login');
  }, [navigate]);

  const getGuildList = useCallback(async () => {
    const [success] = await api.guild
      .getGuilds()
      .then((data) => [data, null] as const)
      .catch((err) => [null, err] as const);
    if (success) {
      setGuildList(success);
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
            <div className="flex h-full w-0 flex-1 flex-col">
              <div className="content">
                <Outlet />
                <Footer />
              </div>
            </div>
          </div>
        </SideBarProvider>
      </userMeContext.Provider>
    </guildContext.Provider>
  );
};
