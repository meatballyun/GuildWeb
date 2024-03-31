import { Link, useLocation } from 'react-router-dom';
import { api } from '../../../api';
import { useEffect, useState } from 'react';
import { Button, ColumnBar } from '../../../components';
import { classNames } from '../../../utils';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  {
    label: 'HOME',
    key: 'home',
    route: '/',
  },
  {
    label: 'RECORD',
    key: 'record',
    route: '/food/record',
  },
  {
    label: 'RECIPE',
    key: 'recipe',
    route: '/food/recipe',
  },
  {
    label: 'INGREDIENT',
    key: 'ingredient',
    route: '/food/ingredient',
  },
  {
    label: 'MISSION',
    key: 'mission',
    route: '/mission',
    disabled: true,
  },
];

const UserItem = ({ userMe }) => {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <div
          className="border border-solid border-primary-200 w-12 h-12 shrink-0 rounded-full"
          style={{
            background:
              'center / cover url("https://images.plurk.com/6FEWRrLpdbiTJUZ8Zpemak.png")',
          }}
        />
        <div className="text-heading-h3">{userMe.name}</div>
      </div>
      <div className="text-right text-heading-h4">Lv. {userMe.rank}</div>
      <div className="flex justify-between">
        <span>Exp.</span>
        <span>
          <span className="text-blue-100 text-base">{userMe.exp}</span>
          <span className="text-primary-200"> / {userMe.upgradeExp}</span>
        </span>
      </div>
      <ColumnBar
        total={userMe.upgradeExp}
        height={12}
        items={[{ value: userMe.exp, color: '#4C76C7' }]}
      />
    </div>
  );
};

export const SideBar = () => {
  const [userMe, setUserMe] = useState();
  useEffect(() => {
    api.auth
      .getUserMe()
      .then((res) => res.json())
      .then((res) => setUserMe(res));
  }, []);

  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const handleLogout = async () => {
    const data = await api.auth.logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {userMe && <UserItem userMe={userMe} />}
      <div className="sidebar-main flex flex-col gap-2">
        {SIDEBAR_ITEMS.map(({ key, label, route, ...props }) => (
          <Link to={route} key={key}>
            <Button
              size="md"
              type="hollow"
              className={classNames(
                'w-full',
                pathname === route ? '!bg-primary-100' : '!bg-primary-200'
              )}
              {...props}
            >
              {label}
            </Button>
          </Link>
        ))}
      </div>
      <div>
        <Button size="lg" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};
