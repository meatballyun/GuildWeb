import { Link } from 'react-router-dom';
import { api } from '../../../api';
import { useContext, useEffect, useState } from 'react';
import { Button, Avatar, ColumnBar, MaterialSymbol } from '../../../components';
import { classNames } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import { sideBarContext } from './context';
import { useGuild, useUserMe } from './MainLayout';

const BASIC_SIDEBAR_LIST = [
  {
    label: 'HOME',
    key: 'home',
    icon: 'home',
    route: '/',
    name: 'home',
  },
  {
    label: 'ADVENTURE REPORTS',
    key: 'notifications',
    icon: 'notifications',
    route: '/notifications',
    name: 'notifications',
  },
  {
    label: 'FOOD',
    key: 'foods',
    name: 'foods',
    icon: 'restaurant',
    children: [
      {
        label: '• records',
        key: 'records',
        route: '/foods/records',
        name: 'records',
      },
      {
        label: '• recipes',
        key: 'recipes',
        route: '/foods/recipes',
        name: 'recipes',
      },
      {
        label: '• ingredients',
        key: 'ingredients',
        route: '/foods/ingredients',
        name: 'ingredients',
      },
    ],
  },
  {
    label: 'FRIENDS',
    key: 'friends',
    icon: 'group',
    route: '/friends',
    name: 'friends',
  },
];

const getGuildSidebarItem = (guilds = []) => ({
  label: 'GUILD',
  key: 'missions',
  icon: 'demography',
  name: 'guilds',
  children: [
    {
      label: '• overview',
      key: 'guilds',
      route: '/guilds',
      name: 'overview',
    },
    ...guilds.map(({ id, name, imageUrl }) => ({
      label: (
        <div className="flex items-start gap-1">
          <Avatar size={20} name={name} className="mt-[2px]" url={imageUrl} />
          {name}
        </div>
      ),
      key: `guilds.${id}`,
      route: `/guilds/${id}`,
      name: String(id),
    })),
  ],
});

export const SideBarProvider = ({ children }) => {
  const [activeKey, setActiveKey] = useState([]);
  return (
    <sideBarContext.Provider value={{ activeKey, setActiveKey }}>
      {children}
    </sideBarContext.Provider>
  );
};

export const useSideBar = ({ activeKey: activeKeyProp }) => {
  const { setActiveKey } = useContext(sideBarContext);
  const activeKeyChangeCheck = Array.isArray(activeKeyProp)
    ? activeKeyProp.join('')
    : activeKeyProp;
  useEffect(() => {
    setActiveKey(activeKeyProp);
  }, [activeKeyChangeCheck]);
};

const UserItem = () => {
  const { userMe } = useUserMe();
  if (!userMe) return null;
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <Avatar size={48} url={userMe.imageUrl} name={userMe.name} />
        <div className="text-heading-h3">{userMe.name}</div>
      </div>
      <div className="text-right text-heading-h4">LV. {userMe.rank}</div>
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

const MenuLabel = ({ label, icon, suffix, name, children, key, ...props }) => {
  const { activeKey } = useContext(sideBarContext);
  const activeList = Array.isArray(activeKey) ? activeKey : [activeKey];
  const active = name && !name.some((v, i) => v !== activeList[i]);

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

const MenuItem = ({ children, route, icon, label, name, ...props }) => {
  const [showChildren, setShowChildren] = useState(false);
  const currentName = Array.isArray(name) ? name : [name];

  if (children) {
    return (
      <div>
        <MenuLabel
          name={currentName}
          onClick={() => setShowChildren((show) => !show)}
          {...props}
        >
          <MaterialSymbol fill icon={icon} className="mr-1" />
          {label}
          <MaterialSymbol
            icon={showChildren ? 'remove' : 'add'}
            className="ml-auto"
          />
        </MenuLabel>
        {showChildren && (
          <div className="ml-4 grid gap-2 border-l-2 border-dotted border-primary-300 pl-2 pt-2">
            {children.map(({ name: childName, ...childProp }) => (
              <MenuItem
                name={[...currentName, childName]}
                key={childName}
                {...childProp}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <Link to={route}>
      <MenuLabel name={currentName} {...props}>
        {icon && <MaterialSymbol fill icon={icon} className="mr-1" />}
        {label}
      </MenuLabel>
    </Link>
  );
};

export const SideBar = () => {
  const navigate = useNavigate();
  const { guildList } = useGuild();

  const handleLogout = async () => {
    await api.auth.logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sidebarList = [...BASIC_SIDEBAR_LIST, getGuildSidebarItem(guildList)];

  return (
    <div className="sidebar">
      <Link to="/settings">
        <UserItem />
      </Link>
      <div className="sidebar-main flex flex-col gap-2 overflow-auto">
        {sidebarList.map(({ key, ...props }) => (
          <MenuItem {...props} key={key} />
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
