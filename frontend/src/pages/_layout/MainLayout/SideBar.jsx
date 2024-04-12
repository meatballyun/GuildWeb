import { Link, useLocation } from 'react-router-dom';
import { api } from '../../../api';
import { useEffect, useState } from 'react';
import {
  Button,
  CircleImage,
  ColumnBar,
  MaterialSymbol,
} from '../../../components';
import { classNames } from '../../../utils';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  {
    label: 'HOME',
    key: 'home',
    icon: 'home',
    route: '/',
    activeMatch: /^\/$/,
  },
  {
    label: 'FOOD',
    key: 'food',
    activeMatch: /\/food/,
    icon: 'restaurant',
    children: [
      {
        label: '• record',
        key: 'record',
        route: '/food/record',
        activeMatch: /\/food\/record/,
      },
      {
        label: '• recipe',
        key: 'recipe',
        route: '/food/recipe',
        activeMatch: /\/food\/recipe/,
      },
      {
        label: '• ingredient',
        key: 'ingredient',
        route: '/food/ingredient',
        activeMatch: /\/food\/ingredient/,
      },
    ],
  },
  {
    label: 'MISSION',
    key: 'mission',
    icon: 'point_scan',
    route: '/mission',
    activeMatch: /\/mission/,
    disabled: true,
  },
];

const UserItem = ({ userMe }) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <CircleImage size={48} url={userMe.imageUrl} />
        <div className="text-heading-h3">{userMe.name}</div>
      </div>
      <div className="text-right text-heading-h4">Lv. {userMe.rank}</div>
      <div className="flex justify-between">
        <span>Exp.</span>
        <span>
          <span className="text-base text-blue-100">{userMe.exp}</span>
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

const MenuLabel = ({
  label,
  icon,
  suffix,
  activeMatch,
  children,
  ...props
}) => {
  const location = useLocation();
  const { pathname } = location;
  const active = activeMatch.test(pathname);
  return (
    <Button
      size="md"
      type={'hollow'}
      className={classNames(
        'w-full !text-left',
        active
          ? '!bg-primary-100'
          : '!border-primary-200 !bg-primary-200/30 !text-primary-200'
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

const MenuItem = ({ children, route, icon, label, ...props }) => {
  const [showChildren, setShowChildren] = useState(false);

  if (children) {
    return (
      <div>
        <MenuLabel onClick={() => setShowChildren((show) => !show)} {...props}>
          <MaterialSymbol fill icon={icon} className="mr-1" />
          {label}
          <MaterialSymbol
            icon={showChildren ? 'remove' : 'add'}
            className="ml-auto"
          />
        </MenuLabel>
        {showChildren && (
          <div className="ml-4 flex flex-col gap-2 border-l-2 border-dotted border-primary-300 pl-2 pt-2">
            {children.map((childProp) => (
              <MenuItem {...childProp} />
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <Link to={route}>
      <MenuLabel {...props}>
        <MaterialSymbol fill icon={icon} className="mr-1" />
        {label}
      </MenuLabel>
    </Link>
  );
};

export const SideBar = () => {
  const [userMe, setUserMe] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    api.auth
      .getUserMe()
      .then((res) => res.json())
      .then((res) => setUserMe(res.data))
      .catch(() => navigate('/login'));
  }, []);

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {userMe && <UserItem userMe={userMe} />}
      <div className="sidebar-main flex flex-col gap-2 overflow-auto">
        {SIDEBAR_ITEMS.map((props) => (
          <MenuItem {...props} />
        ))}
      </div>
      <div>
        <Button
          size="lg"
          className="w-full justify-center"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
