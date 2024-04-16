import { Link } from 'react-router-dom';
import { api } from '../../../api';
import { useContext, useEffect, useState } from 'react';
import { Button, Avatar, ColumnBar, MaterialSymbol } from '../../../components';
import { classNames } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import { sideBarContext } from './context';

const SIDEBAR_ITEMS = (guild) => [
  {
    label: 'HOME',
    key: 'home',
    icon: 'home',
    route: '/',
    activeMatch: 'home',
  },
  {
    label: 'FOOD',
    key: 'food',
    activeMatch: 'food',
    icon: 'restaurant',
    children: [
      {
        label: '• record',
        key: 'record',
        route: '/food/record',
        activeMatch: 'record',
      },
      {
        label: '• recipe',
        key: 'recipe',
        route: '/food/recipe',
        activeMatch: 'recipe',
      },
      {
        label: '• ingredient',
        key: 'ingredient',
        route: '/food/ingredient',
        activeMatch: 'ingredient',
      },
    ],
  },
  {
    label: 'FRIENDS',
    key: 'friends',
    icon: 'group',
    route: '/friends',
    activeMatch: 'friends',
  },
  {
    label: 'GUILD',
    key: 'mission',
    icon: 'bath_public_large',
    activeMatch: 'guild',
    children: [
      {
        label: '• overview',
        key: 'guild',
        route: '/guild',
        activeMatch: 'guild',
      },
      ...(guild?.map(({ id, name, imageUrl }) => ({
        label: (
          <div className="flex items-start gap-1">
            <Avatar size={20} text={name} className="mt-[2px]" url={imageUrl} />
            {name}
          </div>
        ),
        key: `guild.${id}`,
        activeMatch: `guild.${id}`,
        route: `guild/${id}`,
      })) ?? []),
    ],
  },
];

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

const UserItem = ({ userMe }) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <Avatar size={48} url={userMe.imageUrl} text={userMe.name} />
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
  key,
  ...props
}) => {
  const { activeKey } = useContext(sideBarContext);
  const active = Array.isArray(activeKey)
    ? activeKey.includes(activeMatch)
    : activeMatch === activeKey;

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
        {icon && <MaterialSymbol fill icon={icon} className="mr-1" />}
        {label}
      </MenuLabel>
    </Link>
  );
};

export const SideBar = () => {
  const [userMe, setUserMe] = useState();
  const navigate = useNavigate();
  const [guildList, setGuildList] = useState([]);

  useEffect(() => {
    (async () => {
      const [userMeData, guildData] = await Promise.all([
        api.auth
          .getUserMe()
          .then((res) => res.json().catch(() => navigate('/login'))),
        api.guild.getGuild().then((res) => res.json()),
      ]);
      console.log(userMeData, guildData);
      setUserMe(userMeData.data);
      setGuildList(Array.isArray(guildData.data) ? guildData.data : []);
    })();
  }, []);

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {userMe && (
        <Link to="/settings">
          <UserItem userMe={userMe} />
        </Link>
      )}
      <div className="sidebar-main flex flex-col gap-2 overflow-auto">
        {SIDEBAR_ITEMS(guildList).map((props) => (
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
