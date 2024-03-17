import { Link } from 'react-router-dom';
import { api } from '../../../api';
import { useEffect, useState } from 'react';
import { Button } from '../../../components';

const SIDEBAR_ITEMS = [
  {
    label: '公會首頁',
    key: 'home',
    route: '/',
  },
  {
    label: '飲食紀錄',
    key: 'food',
    route: '/food',
  },
  {
    label: '任務',
    key: 'mission',
    route: '/mission',
  },
];

export const SideBar = () => {
  const [userMe, setUserMe] = useState();
  useEffect(() => {
    api.auth
      .getUserMe()
      .then((res) => res.json())
      .then((res) => setUserMe(res));
  }, []);

  return (
    <div className="sidebar">
      {userMe && (
        <div>
          <div></div>
          <div>
            <div>{userMe.name}</div>
            <div>Lv. {userMe.rank}</div>
            <div>
              exp: {userMe.exp}/{userMe.upgradeExp}
            </div>
          </div>
        </div>
      )}
      <div className="sidebar-main">
        <ul>
          {SIDEBAR_ITEMS.map(({ key, label, route }) => (
            <Link to={route} key={key}>
              <li>{label}</li>
            </Link>
          ))}
        </ul>
      </div>
      <div>
        <Link to="/login">
          <Button size="lg" className="w-full">
            Logout
          </Button>
        </Link>
      </div>
    </div>
  );
};
